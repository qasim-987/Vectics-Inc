#!/usr/bin/env node
/**
 * Asserts that the unsubscribe-token algorithm used by the sender script is
 * byte-identical to the one used by /api/unsubscribe.
 *
 * If they ever diverge the API rejects every link with a 400, and recipients
 * cannot opt out — a legal problem, not just a bug. Run via
 * `npm run check:unsubscribe-token` (Node 22+ strips the TS types on import).
 */

const { signUnsubscribeToken: signScript, buildUnsubscribeUrl } = await import(
  "./email-campaign.mjs"
);
const {
  signUnsubscribeToken: signRoute,
  verifyUnsubscribeToken,
  normalizeEmail,
} = await import("../src/lib/unsubscribe-token.ts");

const secrets = ["local-test-secret", "a-much-longer-production-style-secret-0123456789"];
const emails = ["Aisha.Khan@Example.com", " bilal@example.com ", "x@y.co", "trailing+tag@sub.domain.io"];

let failures = 0;
const fail = (message) => {
  failures += 1;
  console.error(`  FAIL ${message}`);
};

for (const secret of secrets) {
  for (const email of emails) {
    const fromScript = signScript(email, secret);
    const fromRoute = signRoute(email, secret);

    if (fromScript !== fromRoute) {
      fail(`sender and route disagree for "${email}"`);
    }
    if (!/^[A-Za-z0-9_-]+$/.test(fromScript)) {
      fail(`token is not URL-safe for "${email}": ${fromScript}`);
    }
    if (!verifyUnsubscribeToken(email, fromScript, secret)) {
      fail(`route rejected a token produced by the sender for "${email}"`);
    }
    // Case and surrounding whitespace must not matter — mail clients mangle both.
    if (!verifyUnsubscribeToken(normalizeEmail(`  ${email.toUpperCase()} `), fromScript, secret)) {
      fail(`normalisation mismatch for "${email}"`);
    }
    if (verifyUnsubscribeToken(email, fromScript, `${secret}x`)) {
      fail(`token verified with the wrong secret for "${email}"`);
    }
  }
}

// A token minted for one address must never unlock another address.
if (verifyUnsubscribeToken("someone.else@example.com", signScript("a@b.com", secrets[0]), secrets[0])) {
  fail("a token for a@b.com also unsubscribed someone.else@example.com");
}

// The public URL must round-trip through URLSearchParams intact.
const url = new URL(buildUnsubscribeUrl("https://vectisoperations.tech/", "a+b@example.com", secrets[0]));
if (!verifyUnsubscribeToken(url.searchParams.get("e") ?? "", url.searchParams.get("t") ?? "", secrets[0])) {
  fail("unsubscribe URL did not round-trip through URLSearchParams");
}
if (url.pathname !== "/api/unsubscribe") {
  fail(`unexpected unsubscribe path: ${url.pathname}`);
}

if (failures > 0) {
  console.error(`\n${failures} unsubscribe-token check(s) failed.`);
  process.exit(1);
}

console.log(`Unsubscribe tokens OK — ${secrets.length * emails.length} combinations, URL-safe, address-bound, route agrees with sender.`);
