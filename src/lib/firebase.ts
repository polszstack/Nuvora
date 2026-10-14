import { cert, getApps, initializeApp } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

export class AuthError extends Error {}

export function firebaseAuth() {
  const projectId = process.env.FIREBASE_PROJECT_ID;
  const clientEmail = process.env.FIREBASE_CLIENT_EMAIL;
  const privateKey = process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n");
  if (!projectId || !clientEmail || !privateKey) {
    throw new AuthError("Account services are not configured yet. Please try again later.");
  }
  const app = getApps().find((app) => app.name === "nuvora-auth") ??
    initializeApp({ credential: cert({ projectId, clientEmail, privateKey }) }, "nuvora-auth");
  return getAuth(app);
}

export async function firebaseRequest<T>(endpoint: string, body: object): Promise<T> {
  const key = process.env.FIREBASE_API_KEY;
  if (!key) throw new AuthError("Account services are not configured yet. Please try again later.");
  let response: Response;
  try {
    response = await fetch(`https://identitytoolkit.googleapis.com/v1/accounts:${endpoint}?key=${encodeURIComponent(key)}`, {
      method: "POST", headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body), cache: "no-store", signal: AbortSignal.timeout(15000),
    });
  } catch {
    throw new AuthError("Account services are unavailable. Please try again.");
  }
  const data = await response.json();
  if (!response.ok) {
    const code = String(data.error?.message ?? "").split(" : ")[0];
    if (endpoint === "sendOobCode" && code === "EMAIL_NOT_FOUND") return {} as T;
    const messages: Record<string, string> = {
      EMAIL_EXISTS: "An account already exists. Sign in or reset your password.",
      INVALID_EMAIL: "Enter a valid email address.",
      INVALID_LOGIN_CREDENTIALS: "Invalid email or password.",
      EMAIL_NOT_FOUND: "Invalid email or password.",
      INVALID_PASSWORD: "Invalid email or password.",
      USER_DISABLED: "This account is unavailable.",
      WEAK_PASSWORD: "Choose a stronger password with at least 8 characters.",
      PASSWORD_DOES_NOT_MEET_REQUIREMENTS: "Your password does not meet the password policy. Choose a stronger password.",
      TOO_MANY_ATTEMPTS_TRY_LATER: "Too many attempts. Please try again later.",
    };
    throw new AuthError(messages[code] ?? "Unable to complete this request. Please try again later.");
  }
  return data as T;
}

export type FirebaseLogin = { idToken: string; localId: string };
