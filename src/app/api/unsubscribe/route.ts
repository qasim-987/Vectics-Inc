import { NextRequest, NextResponse } from "next/server";
import { normalizeEmail, verifyUnsubscribeToken } from "@/lib/unsubscribe-token";
import { siteMeta } from "@/data/vectis";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const HTML_HEADERS = { "Content-Type": "text/html; charset=utf-8", "Cache-Control": "no-store" };

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function page(title: string, body: string, status = 200) {
  const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <meta name="robots" content="noindex" />
    <title>${escapeHtml(title)} — ${escapeHtml(siteMeta.name)}</title>
    <style>
      :root { color-scheme: light; }
      body { margin: 0; min-height: 100vh; display: grid; place-items: center;
             font-family: ui-sans-serif, system-ui, -apple-system, "Segoe UI", Arial, sans-serif;
             background: #f6f7f9; color: #111827; }
      main { max-width: 34rem; padding: 2.5rem; }
      .card { background: #fff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 2rem;
              box-shadow: 0 1px 2px rgba(16,24,40,.04); }
      h1 { font-size: 1.25rem; margin: 0 0 .75rem; letter-spacing: -.01em; }
      p { line-height: 1.65; color: #374151; margin: 0 0 .85rem; font-size: .95rem; }
      .who { font-weight: 600; color: #111827; }
      a { color: #111827; }
      .brand { font-size: .75rem; letter-spacing: .12em; text-transform: uppercase;
               color: #6b7280; margin-bottom: 1rem; }
      footer { margin-top: 1.25rem; font-size: .8rem; color: #9ca3af; }
    </style>
  </head>
  <body>
    <main>
      <div class="brand">${escapeHtml(siteMeta.name)}</div>
      <div class="card">
        <h1>${escapeHtml(title)}</h1>
        ${body}
        <footer>${escapeHtml(siteMeta.name)} · <a href="mailto:${escapeHtml(siteMeta.email)}">${escapeHtml(siteMeta.email)}</a></footer>
      </div>
    </main>
  </body>
</html>`;
  return new NextResponse(html, { status, headers: HTML_HEADERS });
}

function invalidLinkPage() {
  return page(
    "This unsubscribe link is not valid",
    `<p>We could not verify this link, so nothing was changed. It may have been cut off by your email client.</p>
     <p>Reply to the email you received, or write to
       <a href="mailto:${escapeHtml(siteMeta.email)}?subject=Unsubscribe">${escapeHtml(siteMeta.email)}</a>,
       and we will remove you by hand.</p>`,
    400,
  );
}

async function recordSuppression(email: string, source: string) {
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !key) {
    console.error("[UNSUBSCRIBE] SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY not set; could not record opt-out.");
    return { recorded: false, reason: "store-not-configured" as const };
  }

  try {
    const response = await fetch(`${url.replace(/\/+$/, "")}/rest/v1/email_suppressions`, {
      method: "POST",
      headers: {
        apikey: key,
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
        Prefer: "resolution=merge-duplicates,return=minimal",
      },
      body: JSON.stringify({ email, reason: "unsubscribe", source }),
      signal: AbortSignal.timeout(8_000),
    });

    if (!response.ok) {
      console.error("[UNSUBSCRIBE] Supabase rejected the opt-out.", response.status, (await response.text()).slice(0, 300));
      return { recorded: false, reason: "store-error" as const };
    }

    return { recorded: true, reason: "ok" as const };
  } catch (error) {
    console.error("[UNSUBSCRIBE] Supabase request failed.", error);
    return { recorded: false, reason: "store-error" as const };
  }
}

export async function GET(request: NextRequest) {
  const email = normalizeEmail(request.nextUrl.searchParams.get("e") ?? "");
  const token = request.nextUrl.searchParams.get("t") ?? "";
  const secret = process.env.EMAIL_UNSUBSCRIBE_SECRET;

  if (!secret || !email || !token || !verifyUnsubscribeToken(email, token, secret)) {
    return invalidLinkPage();
  }

  const outcome = await recordSuppression(email, "email-link");

  if (!outcome.recorded) {
    return page(
      "We could not complete that automatically",
      `<p>We were unable to update our records automatically. Please reply to the email you received, or write to
         <a href="mailto:${escapeHtml(siteMeta.email)}?subject=Unsubscribe%20${encodeURIComponent(email)}">${escapeHtml(siteMeta.email)}</a>,
         and we will remove you by hand.</p>`,
      503,
    );
  }

  return page(
    "You have been unsubscribed",
    `<p class="who">${escapeHtml(email)}</p>
     <p>You will not receive any further campaign emails from ${escapeHtml(siteMeta.name)}. This took effect immediately.</p>
     <p>If you have an open project or an active conversation with us, you will still hear from your contact directly.</p>
     <p>Changed your mind? Email <a href="mailto:${escapeHtml(siteMeta.email)}">${escapeHtml(siteMeta.email)}</a> and we will add you back.</p>`,
  );
}

/**
 * Gmail / Yahoo one-click unsubscribe (RFC 8058): the mailbox provider POSTs
 * `List-Unsubscribe=One-Click` to the List-Unsubscribe URL. No user interaction.
 */
export async function POST(request: NextRequest) {
  const email = normalizeEmail(request.nextUrl.searchParams.get("e") ?? "");
  const token = request.nextUrl.searchParams.get("t") ?? "";
  const secret = process.env.EMAIL_UNSUBSCRIBE_SECRET;

  if (!secret || !email || !token || !verifyUnsubscribeToken(email, token, secret)) {
    return NextResponse.json({ error: "Invalid unsubscribe token." }, { status: 400 });
  }

  const outcome = await recordSuppression(email, "one-click");
  if (!outcome.recorded) {
    return NextResponse.json({ error: "Could not record the unsubscribe request." }, { status: 503 });
  }

  return NextResponse.json({ success: true, email });
}
