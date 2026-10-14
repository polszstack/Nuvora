import { randomBytes } from "node:crypto";
import { cookies } from "next/headers";
import { prisma } from "@/lib/prisma";
import { firebaseAuth } from "@/lib/firebase";

export const SESSION_COOKIE = "nuvora-session";
const FIREBASE_COOKIE = "nuvora-firebase-session";

export async function createSession(userId: string, userType: "CUSTOMER" | "SELLER", idToken: string) {
  const duration = 1000 * 60 * 60 * 24 * 5;
  const firebaseSession = await firebaseAuth().createSessionCookie(idToken, { expiresIn: duration });
  await clearSession();
  const token = randomBytes(32).toString("hex");
  const expiresAt = new Date(Date.now() + duration);
  await prisma.authSession.create({ data: { token, userId, userType, expiresAt } });
  (await cookies()).set(SESSION_COOKIE, token, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", expires: expiresAt, path: "/" });
  (await cookies()).set(FIREBASE_COOKIE, firebaseSession, { httpOnly: true, sameSite: "lax", secure: process.env.NODE_ENV === "production", expires: expiresAt, path: "/" });
}

export async function clearSession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(SESSION_COOKIE)?.value;
  if (token) await prisma.authSession.deleteMany({ where: { token } });
  cookieStore.delete(SESSION_COOKIE);
  cookieStore.delete(FIREBASE_COOKIE);
}

export async function getSession() {
  const token = (await cookies()).get(SESSION_COOKIE)?.value;
  if (!token) return null;
  const session = await prisma.authSession.findUnique({ where: { token } });
  if (!session || session.expiresAt < new Date()) return null;
  const firebaseSession = (await cookies()).get(FIREBASE_COOKIE)?.value;
  if (!firebaseSession) return null;
  try {
    const identity = await firebaseAuth().verifySessionCookie(firebaseSession, true);
    const account = session.userType === "CUSTOMER"
      ? await prisma.customer.findUnique({ where: { id: session.userId } })
      : await prisma.seller.findUnique({ where: { id: session.userId } });
    if (!account || account.firebaseUid !== identity.uid || ("isActive" in account && !account.isActive)) return null;
  } catch { return null; }
  return session;
}
