#!/usr/bin/env node
/**
 * Vectis Inc. — bulk email campaign sender (Resend).
 *
 * Safety model: this script is a DRY RUN unless you explicitly pass --send.
 *
 *   node scripts/email-campaign.mjs --contacts campaigns/list.csv --template campaigns/templates/example.json
 *   node scripts/email-campaign.mjs ... --send --test you@example.com
 *   node scripts/email-campaign.mjs ... --send
 *
 * Flags
 *   --contacts <file>     CSV of recipients (required)
 *   --template <file>     JSON template: { subject, html?, text? } (required)
 *   --segment <a,b>       Only send to contacts carrying ANY of these tags
 *   --list-tags           Print tag counts for the CSV and exit
 *   --send                Actually deliver. Without it nothing leaves the machine.
 *   --test <email>        Send every message to this address only, with [TEST] prefix
 *   --limit <n>           Cap the number of recipients
 *   --from <addr>         Override CONTACT_FROM_EMAIL
 *   --reply-to <addr>     Override the reply-to address
 *   --subject <text>      Override the template subject
 *   --delay <ms>          Pause between batches (default 1000)
 *   --mock                Simulate the provider (no network, no sending)
 *   --out <dir>           Log directory (default campaigns/logs)
 *
 * Environment (read from .env.local / .env / real env)
 *   RESEND_API_KEY, CONTACT_FROM_EMAIL, EMAIL_UNSUBSCRIBE_SECRET,
 *   NEXT_PUBLIC_SITE_URL, SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY
 */

import fs from "node:fs/promises";
import { existsSync } from "node:fs";
import path from "node:path";
import crypto from "node:crypto";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const RESEND_BATCH_URL = "https://api.resend.com/emails/batch";
const BATCH_SIZE = 100;

const HELP = `Bulk email sender (Resend)

  --contacts <file>   CSV of recipients (required)
  --template <file>   JSON template { subject, html?, text? } (required)
  --segment <a,b>     Only contacts tagged with ANY of these
  --list-tags         Show tag counts and exit
  --send              Actually send (default is a dry run)
  --test <email>      Send only to this address, subject prefixed [TEST]
  --limit <n>         Cap recipients
  --from <addr>       Override sender
  --reply-to <addr>   Override reply-to
  --subject <text>    Override subject
  --delay <ms>        Delay between batches (default 1000)
  --mock              Simulate sending offline
  --out <dir>         Log directory (default campaigns/logs)
`;

/* ------------------------------------------------------------------ utils */

const c = {
  dim: (s) => `\x1b[2m${s}\x1b[0m`,
  bold: (s) => `\x1b[1m${s}\x1b[0m`,
  green: (s) => `\x1b[32m${s}\x1b[0m`,
  yellow: (s) => `\x1b[33m${s}\x1b[0m`,
  red: (s) => `\x1b[31m${s}\x1b[0m`,
  cyan: (s) => `\x1b[36m${s}\x1b[0m`,
};

const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

function parseArgs(args) {
  const flags = {};
  for (let i = 0; i < args.length; i += 1) {
    const token = args[i];
    if (!token.startsWith("--")) continue;
    const [rawKey, inlineValue] = token.slice(2).split("=");
    const key = rawKey.replace(/-([a-z])/g, (_, ch) => ch.toUpperCase());
    if (inlineValue !== undefined) {
      flags[key] = inlineValue;
      continue;
    }
    const next = args[i + 1];
    if (next !== undefined && !next.startsWith("--")) {
      flags[key] = next;
      i += 1;
    } else {
      flags[key] = true;
    }
  }
  return flags;
}

async function loadEnv() {
  for (const file of [".env.local", ".env"]) {
    const target = path.join(ROOT, file);
    if (!existsSync(target)) continue;
    const raw = await fs.readFile(target, "utf8");
    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*)$/);
      if (!match) continue;
      let value = match[2].trim();
      if (
        (value.startsWith('"') && value.endsWith('"')) ||
        (value.startsWith("'") && value.endsWith("'"))
      ) {
        value = value.slice(1, -1);
      }
      if (process.env[match[1]] === undefined) process.env[match[1]] = value;
    }
  }
}

const EMAIL_RE = /^[^\s@]+@[^\s@.]+(\.[^\s@.]+)+$/;

function normalizeEmail(value) {
  return String(value || "").trim().toLowerCase();
}

function escapeHtml(value) {
  return String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

/* -------------------------------------------------------------------- CSV */

/** Minimal RFC 4180 parser: quotes, escaped quotes, CRLF, embedded newlines. */
function parseCsv(text) {
  let source = text;
  if (source.charCodeAt(0) === 0xfeff) source = source.slice(1);

  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;

  for (let i = 0; i < source.length; i += 1) {
    const ch = source[i];
    if (inQuotes) {
      if (ch === '"') {
        if (source[i + 1] === '"') {
          field += '"';
          i += 1;
        } else {
          inQuotes = false;
        }
      } else {
        field += ch;
      }
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
    } else if (ch === ",") {
      row.push(field);
      field = "";
    } else if (ch === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
    } else if (ch !== "\r") {
      field += ch;
    }
  }

  if (field.length > 0 || row.length > 0) {
    row.push(field);
    rows.push(row);
  }

  return rows.filter((entry) => !(entry.length === 1 && entry[0].trim() === ""));
}

function normalizeHeader(header) {
  return header
    .trim()
    .toLowerCase()
    .replace(/\s+/g, "_")
    .replace(/[^a-z0-9_]/g, "");
}

function parseTags(value) {
  return String(value || "")
    .split(/[;|]/)
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);
}

function rowsToContacts(rows) {
  if (rows.length === 0) return { contacts: [], headers: [] };
  const headers = rows[0].map(normalizeHeader);
  const contacts = rows.slice(1).map((cells) => {
    const record = {};
    headers.forEach((key, index) => {
      if (!key) return;
      record[key] = (cells[index] ?? "").trim();
    });
    record.__tags = parseTags(record.tags ?? record.tag ?? "");
    return record;
  });
  return { contacts, headers };
}

/* --------------------------------------------------------------- template */

function renderTemplate(input, contact, { html = false } = {}) {
  return String(input).replace(
    /\{\{\s*([a-zA-Z0-9_]+)\s*(?:\|\s*([^}]*))?\}\}/g,
    (_match, key, fallback) => {
      const raw = contact[key];
      const value = raw === undefined || raw === null ? "" : String(raw).trim();
      if (value) return html ? escapeHtml(value) : value;
      const fb = fallback === undefined ? "" : fallback.trim();
      return html ? escapeHtml(fb) : fb;
    },
  );
}

function applyFooter(html, text, unsubscribeUrl) {
  let nextHtml = html;
  let nextText = text;

  if (!nextHtml.includes(unsubscribeUrl)) {
    nextHtml += `
<hr style="border:none;border-top:1px solid #e5e7eb;margin:32px 0 16px" />
<p style="font-size:12px;line-height:1.6;color:#6b7280;font-family:Arial,Helvetica,sans-serif">
  You are receiving this email because you contacted Vectis Inc. or subscribed to our updates.
  <br />
  <a href="${unsubscribeUrl}" style="color:#6b7280">Unsubscribe</a>
</p>`;
  }

  if (!nextText.includes(unsubscribeUrl)) {
    nextText += `\n\n---\nYou are receiving this email because you contacted Vectis Inc. or subscribed to our updates.\nUnsubscribe: ${unsubscribeUrl}\n`;
  }

  return { html: nextHtml, text: nextText };
}

/* ----------------------------------------------------------- suppressions */

async function loadLocalSuppressions(file) {
  if (!existsSync(file)) return new Set();
  try {
    const raw = JSON.parse(await fs.readFile(file, "utf8"));
    const list = Array.isArray(raw) ? raw : raw.emails ?? [];
    return new Set(list.map((entry) => normalizeEmail(typeof entry === "string" ? entry : entry.email)));
  } catch (error) {
    throw new Error(
      `Could not read suppression file ${file}: ${error.message}. Fix it before sending.`,
    );
  }
}

async function loadRemoteSuppressions() {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) return { emails: new Set(), configured: false };

  const endpoint = `${url.replace(/\/$/, "")}/rest/v1/email_suppressions?select=email`;
  const response = await fetch(endpoint, {
    headers: { apikey: key, Authorization: `Bearer ${key}` },
  });
  if (!response.ok) {
    throw new Error(
      `Supabase suppression lookup failed (${response.status}): ${(await response.text()).slice(0, 200)}`,
    );
  }
  const data = await response.json();
  return {
    emails: new Set((data ?? []).map((row) => normalizeEmail(row.email))),
    configured: true,
  };
}

/* ---------------------------------------------------------------- sending */

/** Must match src/lib/unsubscribe-token.ts — verified by scripts/check-unsubscribe-token.mjs */
function signUnsubscribeToken(email, secret) {
  return crypto.createHmac("sha256", secret).update(normalizeEmail(email)).digest("base64url");
}

function buildUnsubscribeUrl(baseUrl, email, secret) {
  const token = signUnsubscribeToken(email, secret);
  return `${baseUrl.replace(/\/$/, "")}/api/unsubscribe?e=${encodeURIComponent(email)}&t=${token}`;
}

function senderAddress(from) {
  const match = String(from).match(/<([^>]+)>/);
  return (match ? match[1] : String(from)).trim();
}

async function sendBatch(batch, context) {
  if (context.mock) {
    return batch.map(() => ({
      ok: true,
      id: `mock_${crypto.randomBytes(8).toString("hex")}`,
    }));
  }

  try {
    const response = await fetch(RESEND_BATCH_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${context.apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(batch),
      signal: AbortSignal.timeout(30_000),
    });

    const bodyText = await response.text();
    if (!response.ok) {
      let message = bodyText.slice(0, 300);
      try {
        const parsed = JSON.parse(bodyText);
        message = parsed.message || parsed.name || message;
      } catch {
        /* keep raw text */
      }
      return batch.map(() => ({ ok: false, error: `${response.status} ${message}` }));
    }

    const parsed = JSON.parse(bodyText);
    const ids = Array.isArray(parsed?.data) ? parsed.data : [];
    return batch.map((_item, index) => ({
      ok: true,
      id: ids[index]?.id ?? "",
    }));
  } catch (error) {
    return batch.map(() => ({ ok: false, error: error.message || "network error" }));
  }
}

/* ------------------------------------------------------------------- main */

async function main() {
  const flags = parseArgs(process.argv.slice(2));

  if (flags.help || flags.h) {
    console.log(HELP);
    return;
  }

  await loadEnv();

  const contactsPath = flags.contacts && path.resolve(ROOT, String(flags.contacts));
  const templatePath = flags.template && path.resolve(ROOT, String(flags.template));

  if (!contactsPath || !templatePath) {
    console.error(c.red("Missing arguments.") + "\n");
    console.log(HELP);
    process.exitCode = 1;
    return;
  }

  for (const [label, file] of [
    ["Contacts CSV", contactsPath],
    ["Template", templatePath],
  ]) {
    if (!existsSync(file)) {
      console.error(c.red(`${label} not found: ${file}`));
      process.exitCode = 1;
      return;
    }
  }

  /* --- recipient list -------------------------------------------------- */
  const { contacts, headers } = rowsToContacts(parseCsv(await fs.readFile(contactsPath, "utf8")));
  const emailColumn = headers.find((h) => ["email", "email_address", "e_mail", "mail"].includes(h));
  if (!emailColumn) {
    console.error(
      c.red(
        `No email column found in ${path.basename(contactsPath)}. Columns seen: ${headers.join(", ") || "(none)"}`,
      ),
    );
    process.exitCode = 1;
    return;
  }

  if (flags.listTags) {
    const counts = new Map();
    for (const contact of contacts) {
      for (const tag of contact.__tags) counts.set(tag, (counts.get(tag) ?? 0) + 1);
    }
    if (counts.size === 0) {
      console.log(c.yellow("No tags found. Add a 'tags' column (e.g. \"vip;newsletter\") to target segments."));
      return;
    }
    console.log(c.bold("Segments in this list:"));
    for (const [tag, count] of [...counts.entries()].sort((a, b) => b[1] - a[1])) {
      console.log(`  ${tag.padEnd(24)} ${count}`);
    }
    return;
  }

  /* --- template -------------------------------------------------------- */
  let template;
  try {
    template = JSON.parse(await fs.readFile(templatePath, "utf8"));
  } catch (error) {
    console.error(c.red(`Template is not valid JSON: ${error.message}`));
    process.exitCode = 1;
    return;
  }

  const subjectTemplate = String(flags.subject || template.subject || "").trim();
  if (!subjectTemplate) {
    console.error(c.red("Template is missing a subject."));
    process.exitCode = 1;
    return;
  }
  if (!template.html && !template.text) {
    console.error(c.red("Template needs at least one of 'html' or 'text'."));
    process.exitCode = 1;
    return;
  }

  /* --- environment ----------------------------------------------------- */
  const apiKey = process.env.RESEND_API_KEY;
  const from = String(flags.from || process.env.CONTACT_FROM_EMAIL || "").trim();
  const replyTo = String(flags.replyTo || process.env.CONTACT_TO_EMAIL || process.env.REPLY_TO_EMAIL || "").trim();
  const secret = process.env.EMAIL_UNSUBSCRIBE_SECRET;
  const siteUrl = String(process.env.NEXT_PUBLIC_SITE_URL || process.env.SITE_URL || "").trim();
  const mock = Boolean(flags.mock);
  const sending = Boolean(flags.send);

  const problems = [];
  if (!from) problems.push("CONTACT_FROM_EMAIL (or --from) is required.");
  if (!secret) problems.push("EMAIL_UNSUBSCRIBE_SECRET is required so unsubscribe links can be signed.");
  if (!siteUrl) problems.push("NEXT_PUBLIC_SITE_URL is required to build absolute unsubscribe links.");
  if (sending && !mock && !apiKey) problems.push("RESEND_API_KEY is required to send.");
  if (problems.length > 0) {
    console.error(c.red("Configuration incomplete:"));
    for (const problem of problems) console.error(`  - ${problem}`);
    console.error(c.dim("\nSee BULK_EMAIL_SETUP.md for the one-time setup."));
    process.exitCode = 1;
    return;
  }

  /* --- suppression & filtering ----------------------------------------- */
  const localSuppressions = await loadLocalSuppressions(path.join(ROOT, "campaigns", "suppressions.json"));
  const remote = await loadRemoteSuppressions();
  const suppressed = new Set([...localSuppressions, ...remote.emails]);

  const segment = String(flags.segment || "")
    .split(",")
    .map((tag) => tag.trim().toLowerCase())
    .filter(Boolean);

  const seen = new Set();
  const stats = { invalid: 0, duplicate: 0, suppressed: 0, notInSegment: 0 };
  let recipients = [];

  for (const contact of contacts) {
    const email = normalizeEmail(contact[emailColumn]);
    if (!EMAIL_RE.test(email)) {
      stats.invalid += 1;
      continue;
    }
    if (seen.has(email)) {
      stats.duplicate += 1;
      continue;
    }
    seen.add(email);

    if (suppressed.has(email)) {
      stats.suppressed += 1;
      continue;
    }
    if (segment.length > 0 && !contact.__tags.some((tag) => segment.includes(tag))) {
      stats.notInSegment += 1;
      continue;
    }
    recipients.push({ ...contact, [emailColumn]: email });
  }

  const limit = Number(flags.limit);
  if (Number.isFinite(limit) && limit > 0) recipients = recipients.slice(0, limit);

  const campaignId = `campaign-${new Date().toISOString().replace(/[-:]/g, "").replace(/\..+/, "")}`;
  const outDir = path.resolve(ROOT, String(flags.out || "campaigns/logs"));

  console.log(c.bold("\nVectis bulk email"));
  console.log(c.dim("─".repeat(58)));
  console.log(`  Campaign     ${campaignId}`);
  console.log(`  Contacts     ${contacts.length} rows → ${recipients.length} recipients`);
  console.log(`  Skipped      ${c.yellow(String(stats.invalid))} invalid · ${c.yellow(String(stats.duplicate))} duplicate · ${c.yellow(String(stats.suppressed))} unsubscribed · ${c.yellow(String(stats.notInSegment))} outside segment`);
  console.log(`  Segment      ${segment.length ? segment.join(", ") : c.dim("all contacts")}`);
  console.log(`  From         ${from}`);
  console.log(`  Reply-To     ${replyTo || c.dim("not set")}`);
  console.log(`  Suppressions ${suppressed.size} (${remote.configured ? "Supabase" : "local file only"})`);
  console.log(`  Mode         ${sending ? (mock ? c.cyan("SEND (simulated)") : c.green("SEND")) : c.yellow("DRY RUN — nothing will be sent")}`);

  if (recipients.length === 0) {
    console.log(c.yellow("\nNo recipients matched those filters. Nothing to do.\n"));
    return;
  }

  /* --- build messages --------------------------------------------------- */
  const fromAddress = senderAddress(from);
  const provider = {
    apiKey,
    mock,
  };

  const testAddress = flags.test ? normalizeEmail(String(flags.test)) : "";

  const built = recipients.map((contact) => {
    const unsubscribeUrl = buildUnsubscribeUrl(siteUrl, contact[emailColumn], secret);
    const withUrl = { ...contact, unsubscribe_url: unsubscribeUrl };

    let html = template.html ? renderTemplate(template.html, withUrl, { html: true }) : "";
    let text = template.text ? renderTemplate(template.text, withUrl, { html: false }) : "";
    ({ html, text } = applyFooter(html, text, unsubscribeUrl));

    const subject = renderTemplate(subjectTemplate, contact).replace(/\s+/g, " ").trim();
    const recipient = testAddress || contact[emailColumn];

    return {
      email: contact[emailColumn],
      deliveredTo: recipient,
      message: {
        from,
        to: [recipient],
        subject: testAddress ? `[TEST] ${subject}` : subject,
        ...(html ? { html } : {}),
        ...(text ? { text } : {}),
        ...(replyTo ? { reply_to: replyTo } : {}),
        headers: {
          "List-Unsubscribe": `<${unsubscribeUrl}>, <mailto:${fromAddress}?subject=unsubscribe>`,
          "List-Unsubscribe-Post": "List-Unsubscribe=One-Click",
        },
      },
      unsubscribeUrl,
    };
  });

  /* --- preview ---------------------------------------------------------- */
  await fs.mkdir(outDir, { recursive: true });
  const previewPath = path.join(outDir, `${campaignId}.preview.html`);
  await fs.writeFile(previewPath, built[0].message.html || `<pre>${built[0].message.text}</pre>`, "utf8");
  console.log(`\n  Preview      ${path.relative(ROOT, previewPath)}`);

  if (!sending) {
    console.log(c.dim("\n  Sample rendering:"));
    console.log(c.dim(`    To: ${built[0].deliveredTo}`));
    console.log(c.dim(`    Subject: ${built[0].message.subject}`));
    console.log(c.dim(`    Unsubscribe: ${built[0].unsubscribeUrl}`));
    console.log(`\n  ${c.yellow("Dry run complete.")} Re-run with ${c.bold("--send")} to deliver.\n`);
    return;
  }

  if (testAddress && !EMAIL_RE.test(testAddress)) {
    console.error(c.red(`--test address is not a valid email: ${testAddress}`));
    process.exitCode = 1;
    return;
  }

  /* --- send ------------------------------------------------------------- */
  const delay = Math.max(0, Number(flags.delay ?? 1000) || 0);
  const results = [];
  const startedAt = Date.now();

  for (let offset = 0; offset < built.length; offset += BATCH_SIZE) {
    const chunk = built.slice(offset, offset + BATCH_SIZE);
    const outcome = await sendBatch(
      chunk.map((item) => item.message),
      provider,
    );

    chunk.forEach((item, index) => {
      const result = outcome[index] ?? { ok: false, error: "missing provider response" };
      results.push({
        email: item.email,
        delivered_to: item.deliveredTo,
        status: result.ok ? "sent" : "failed",
        provider_id: result.id ?? "",
        error: result.error ?? "",
      });
    });

    const done = Math.min(offset + BATCH_SIZE, built.length);
    const failed = results.filter((row) => row.status === "failed").length;
    const label = `${done}/${built.length}`;
    process.stdout.write(`\r  Sending ${label.padEnd(12)} ${failed > 0 ? c.red(`${failed} failed`) : c.green("all ok")}   `);

    if (offset + BATCH_SIZE < built.length) await sleep(delay);
  }
  process.stdout.write("\n");

  /* --- report ----------------------------------------------------------- */
  const sent = results.filter((row) => row.status === "sent").length;
  const failedRows = results.filter((row) => row.status === "failed");
  const elapsed = ((Date.now() - startedAt) / 1000).toFixed(1);

  const header = ["email", "delivered_to", "status", "provider_id", "error"];
  const csv = [
    header.join(","),
    ...results.map((row) =>
      header.map((key) => `"${String(row[key] ?? "").replace(/"/g, '""')}"`).join(","),
    ),
  ].join("\n");

  const csvPath = path.join(outDir, `${campaignId}.csv`);
  const jsonPath = path.join(outDir, `${campaignId}.json`);
  await fs.writeFile(csvPath, csv, "utf8");
  await fs.writeFile(
    jsonPath,
    JSON.stringify(
      {
        campaignId,
        createdAt: new Date().toISOString(),
        mode: mock ? "mock" : "live",
        testAddress: testAddress || null,
        segment,
        subject: subjectTemplate,
        from,
        counts: { rows: contacts.length, recipients: recipients.length, sent, failed: failedRows.length, ...stats },
        results,
      },
      null,
      2,
    ),
    "utf8",
  );

  console.log(c.bold("\nResult"));
  console.log(c.dim("─".repeat(58)));
  console.log(`  Sent    ${c.green(String(sent))}`);
  console.log(`  Failed  ${failedRows.length ? c.red(String(failedRows.length)) : "0"}`);
  console.log(`  Time    ${elapsed}s`);
  console.log(`  Log     ${path.relative(ROOT, csvPath)}`);
  console.log(`  Detail  ${path.relative(ROOT, jsonPath)}`);

  if (failedRows.length > 0) {
    console.log(c.yellow("\n  First failures:"));
    for (const row of failedRows.slice(0, 5)) {
      console.log(`    ${row.email} — ${row.error}`);
    }
    process.exitCode = 1;
  }
  console.log("");
}

const invokedDirectly =
  process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url);

if (invokedDirectly) {
  main().catch((error) => {
    console.error(c.red(`\nUnexpected error: ${error.stack || error.message}`));
    process.exitCode = 1;
  });
}

export {
  buildUnsubscribeUrl,
  normalizeEmail,
  parseCsv,
  renderTemplate,
  rowsToContacts,
  signUnsubscribeToken,
};
