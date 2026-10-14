"use server";

import { redirect } from "next/navigation";
import bcrypt from "bcryptjs";
import { AuthError, firebaseAuth, firebaseRequest, type FirebaseLogin } from "@/lib/firebase";
import type { AuthState } from "@/components/auth-form";
import { prisma } from "@/lib/prisma";
import { clearSession, createSession, getSession } from "@/lib/auth";

function getRequiredValue(formData: FormData, field: string) {
  const value = formData.get(field);
  if (typeof value !== "string" || !value.trim()) {
    throw new AuthError(`${field} is required.`);
  }

  return value.trim();
}

function passwordValue(data: FormData, key = "password") {
  const value = data.get(key);
  if (typeof value !== "string" || !value) throw new AuthError("Password is required.");
  return value;
}

function authFailure(error: unknown): AuthState {
  return { error: error instanceof AuthError ? error.message : "Unable to complete this request. Please try again later." };
}

async function register(data: FormData, role: "CUSTOMER" | "SELLER"): Promise<AuthState> {
  try {
    const name = getRequiredValue(data, "name");
    const email = getRequiredValue(data, "email").toLowerCase();
    const password = passwordValue(data);
    if (password.length < 8) throw new AuthError("Password must be at least 8 characters.");
    if (password !== passwordValue(data, "passwordConfirmation")) throw new AuthError("Passwords do not match.");
    const shopName = role === "SELLER" ? getRequiredValue(data, "shopName") : "";
    const phone = typeof data.get("phone") === "string" ? String(data.get("phone")).trim() || null : null;
    const existing = role === "CUSTOMER" ? await prisma.customer.findUnique({ where: { email } }) : await prisma.seller.findUnique({ where: { email } });
    if (existing) throw new AuthError("An account already exists. Sign in or reset your password.");
    firebaseAuth(); // Validate server credentials before creating a Firebase user.
    // If a previous attempt created the Firebase identity but the database failed,
    // the same password safely resumes registration. This also permits both roles.
    let login: FirebaseLogin;
    try {
      login = await firebaseRequest<FirebaseLogin>("signUp", { email, password, returnSecureToken: true });
    } catch (error) {
      if (!(error instanceof AuthError) || error.message !== "An account already exists. Sign in or reset your password.") throw error;
      login = await firebaseRequest<FirebaseLogin>("signInWithPassword", { email, password, returnSecureToken: true });
    }
    const identity = await firebaseAuth().verifyIdToken(login.idToken, true);
    const account = role === "CUSTOMER"
      ? await prisma.customer.create({ data: { email, name, firebaseUid: identity.uid } })
      : await prisma.seller.create({ data: { email, name, shopName, phone, firebaseUid: identity.uid } });
    await createSession(account.id, role, login.idToken);
  } catch (error) { return authFailure(error); }
  redirect(role === "CUSTOMER" ? "/products" : "/admin");
}

async function signIn(data: FormData, role: "CUSTOMER" | "SELLER"): Promise<AuthState> {
  try {
    const email = getRequiredValue(data, "email").toLowerCase();
    const password = passwordValue(data);
    const legacy = role === "CUSTOMER"
      ? await prisma.customer.findUnique({ where: { email } })
      : await prisma.seller.findUnique({ where: { email } });
    const canMigrate = legacy && !legacy.firebaseUid && legacy.passwordHash &&
      (!("isActive" in legacy) || legacy.isActive) && await bcrypt.compare(password, legacy.passwordHash);
    if (canMigrate) {
      // Never change an existing Firebase password based on a legacy password.
      try { await firebaseAuth().getUserByEmail(email); }
      catch (error) {
        if ((error as { code?: string }).code !== "auth/user-not-found") throw error;
        try { await firebaseAuth().createUser({ email, password }); }
        catch (createError) {
          if ((createError as { code?: string }).code !== "auth/email-already-exists") throw createError;
        }
      }
    }
    const login = await firebaseRequest<FirebaseLogin>("signInWithPassword", { email, password, returnSecureToken: true });
    const identity = await firebaseAuth().verifyIdToken(login.idToken, true);
    if (canMigrate) {
      const where = { id: legacy.id, firebaseUid: null };
      const update = { firebaseUid: identity.uid, passwordHash: null };
      if (role === "CUSTOMER") await prisma.customer.updateMany({ where, data: update });
      else await prisma.seller.updateMany({ where, data: update });
    }
    const account = role === "CUSTOMER"
      ? await prisma.customer.findUnique({ where: { firebaseUid: identity.uid } })
      : await prisma.seller.findUnique({ where: { firebaseUid: identity.uid } });
    if (!account || ("isActive" in account && !account.isActive)) throw new AuthError("No active account for this role. Create an account or contact support.");
    await createSession(account.id, role, login.idToken);
  } catch (error) { return authFailure(error); }
  redirect(role === "CUSTOMER" ? "/products" : "/admin");
}

export async function createCustomerAccount(_state: AuthState, data: FormData) { return register(data, "CUSTOMER"); }
export async function createSellerAccount(_state: AuthState, data: FormData) { return register(data, "SELLER"); }
export async function signInCustomer(_state: AuthState, data: FormData) { return signIn(data, "CUSTOMER"); }
export async function signInSeller(_state: AuthState, data: FormData) { return signIn(data, "SELLER"); }

export async function resetPassword(_state: AuthState, data: FormData): Promise<AuthState> {
  try {
    const email = getRequiredValue(data, "email").toLowerCase();
    await firebaseRequest("sendOobCode", { requestType: "PASSWORD_RESET", email });
    return { message: "If an account exists for this email, a password reset link has been sent. Check your inbox and spam folder." };
  } catch (error) { return authFailure(error); }
}

export async function updateCustomerProfile(formData: FormData) {
  const session = await getSession();
  if (!session || session.userType !== "CUSTOMER") redirect("/account/customer/signin");
  const name = getRequiredValue(formData, "name");
  const phoneValue = formData.get("phone");
  const phone = typeof phoneValue === "string" && phoneValue.trim() ? phoneValue.trim() : null;
  const addressValue = formData.get("address");
  const address = typeof addressValue === "string" && addressValue.trim() ? addressValue.trim() : null;
  const photoValue = formData.get("profilePhoto");
  let profilePhoto: string | null | undefined;
  if (photoValue instanceof File && photoValue.size > 0) {
    if (!photoValue.type.startsWith("image/")) throw new Error("Profile photo must be an image.");
    if (photoValue.size > 2 * 1024 * 1024) throw new Error("Profile photo must be smaller than 2 MB.");
    const bytes = Buffer.from(await photoValue.arrayBuffer());
    profilePhoto = `data:${photoValue.type};base64,${bytes.toString("base64")}`;
  }
  await prisma.customer.update({ where: { id: session.userId }, data: { name, phone, address, ...(profilePhoto ? { profilePhoto } : {}) } });
  redirect("/account/customer/profile?saved=1");
}

export async function updateSellerProfile(formData: FormData) {
  const session = await getSession();
  if (!session || session.userType !== "SELLER") redirect("/account/seller/signin");
  const name = getRequiredValue(formData, "name");
  const shopName = getRequiredValue(formData, "shopName");
  const phoneValue = formData.get("phone");
  const phone = typeof phoneValue === "string" && phoneValue.trim() ? phoneValue.trim() : null;
  const photoValue = formData.get("profilePhoto");
  let profilePhoto: string | undefined;
  if (photoValue instanceof File && photoValue.size > 0) {
    if (!photoValue.type.startsWith("image/")) throw new Error("Profile photo must be an image.");
    if (photoValue.size > 2 * 1024 * 1024) throw new Error("Profile photo must be smaller than 2 MB.");
    profilePhoto = `data:${photoValue.type};base64,${Buffer.from(await photoValue.arrayBuffer()).toString("base64")}`;
  }
  await prisma.seller.update({ where: { id: session.userId }, data: { name, shopName, phone, ...(profilePhoto ? { profilePhoto } : {}) } });
  redirect("/account/seller/profile?saved=1");
}

export async function signOut() {
  await clearSession();
  redirect("/");
}
