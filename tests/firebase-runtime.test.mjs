import assert from "node:assert/strict";
import { generateKeyPairSync, sign, verify } from "node:crypto";
import { createRequire } from "node:module";
import { test } from "node:test";

const require = createRequire(import.meta.url);
const firebaseRequire = createRequire(require.resolve("firebase-admin/auth"));

// Vercel disables require(ESM) by default. Run with --no-experimental-require-module.
test("Firebase Admin auth loads without require(ESM)", async () => {
  assert.equal(process.features.require_module, false);
  const { getAuth } = await import("firebase-admin/auth");
  assert.equal(typeof getAuth, "function");
});

test("Firebase's JWKS dependency resolves RSA keys and preserves signature checks", async () => {
  const jwksClient = firebaseRequire("jwks-rsa");
  const { privateKey, publicKey } = generateKeyPairSync("rsa", { modulusLength: 2048 });
  const jwk = { ...publicKey.export({ format: "jwk" }), kid: "test-key", use: "sig", alg: "RS256" };
  const client = jwksClient({
    jwksUri: "https://example.invalid/jwks",
    cache: false,
    fetcher: async () => ({ keys: [jwk] }),
  });
  const key = await client.getSigningKey("test-key");
  const payload = Buffer.from("local signing-key compatibility check");
  const signature = sign("sha256", payload, privateKey);

  assert.equal(verify("sha256", payload, key.getPublicKey(), signature), true);
  assert.equal(verify("sha256", Buffer.from("changed payload"), key.getPublicKey(), signature), false);
  await assert.rejects(client.getSigningKey("unknown-key"), { name: "SigningKeyNotFoundError" });
});
