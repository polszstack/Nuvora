import assert from "node:assert/strict";
import { afterEach, test } from "node:test";
import { AuthError, firebaseRequest } from "./firebase";

const originalFetch = globalThis.fetch;
const originalKey = process.env.FIREBASE_API_KEY;
afterEach(() => {
  globalThis.fetch = originalFetch;
  if (originalKey === undefined) delete process.env.FIREBASE_API_KEY;
  else process.env.FIREBASE_API_KEY = originalKey;
});

test("missing configuration fails before sending credentials", async () => {
  delete process.env.FIREBASE_API_KEY;
  globalThis.fetch = async () => { throw new Error("Should not fetch"); };
  await assert.rejects(firebaseRequest("signInWithPassword", {}), AuthError);
});

test("credentials use a noncached POST and preserve password whitespace", async () => {
  process.env.FIREBASE_API_KEY = "test-key";
  globalThis.fetch = async (url, options) => {
    assert.equal(String(url), "https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=test-key");
    assert.equal(options?.method, "POST");
    assert.equal(options?.cache, "no-store");
    assert.equal(JSON.parse(String(options?.body)).password, " secret ");
    return Response.json({ idToken: "token" });
  };
  assert.deepEqual(await firebaseRequest("signInWithPassword", { password: " secret " }), { idToken: "token" });
});

test("unknown reset emails produce the same result as known emails", async () => {
  process.env.FIREBASE_API_KEY = "test-key";
  globalThis.fetch = async () => Response.json({ error: { message: "EMAIL_NOT_FOUND" } }, { status: 400 });
  assert.deepEqual(await firebaseRequest("sendOobCode", { requestType: "PASSWORD_RESET" }), {});
  await assert.rejects(firebaseRequest("signInWithPassword", {}), { message: "Invalid email or password." });
});

test("provider internals are not exposed in form errors", async () => {
  process.env.FIREBASE_API_KEY = "test-key";
  globalThis.fetch = async () => Response.json({ error: { message: "INTERNAL_SECRET_DETAILS" } }, { status: 500 });
  await assert.rejects(firebaseRequest("signUp", {}), { message: "Unable to complete this request. Please try again later." });
});

test("network failures return an actionable safe error", async () => {
  process.env.FIREBASE_API_KEY = "test-key";
  globalThis.fetch = async () => { throw new Error("network details"); };
  await assert.rejects(firebaseRequest("signUp", {}), { message: "Account services are unavailable. Please try again." });
});
