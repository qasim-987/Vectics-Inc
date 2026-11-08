import crypto from "node:crypto";

/**
 * Unsubscribe link signing.
 *
 * The same algorithm is implemented in `scripts/email-campaign.mjs`
 * (signUnsubscribeToken). `npm run check:unsubscribe-token` asserts that both
 * implementations produce identical tokens — update both or neither.
 */

export function normalizeEmail(value: string) {
  return String(value || "").trim().toLowerCase();
}

export function signUnsubscribeToken(email: string, secret: string) {
  return crypto.createHmac("sha256", secret).update(normalizeEmail(email)).digest("base64url");
}

/** Constant-time verification of an `e` / `t` pair from the unsubscribe link. */
export function verifyUnsubscribeToken(email: string, token: string, secret: string) {
  if (!email || !token || !secret) return false;

  const expected = signUnsubscribeToken(email, secret);
  const received = String(token).trim();

  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(received);
  if (expectedBuffer.length !== receivedBuffer.length) return false;

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

export function buildUnsubscribeUrl(baseUrl: string, email: string, secret: string) {
  const token = signUnsubscribeToken(email, secret);
  return `${baseUrl.replace(/\/+$/, "")}/api/unsubscribe?e=${encodeURIComponent(normalizeEmail(email))}&t=${token}`;
}
