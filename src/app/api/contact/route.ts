import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { siteMeta } from "@/data/vectis";

export const runtime = "nodejs";
export const maxDuration = 15;

const CONTACT_WINDOW_MS = 10 * 60 * 1000;
const CONTACT_LIMIT = 5;
const rateBuckets = new Map<string, { count: number; resetAt: number }>();

const ContactSchema = z.object({
  name: z.string().trim().max(120).optional(),
  firstName: z.string().trim().max(120).optional(),
  email: z.string().trim().max(254).email("Enter a valid email address."),
  organization: z.string().trim().max(180).optional().default(""),
  service: z.string().trim().max(180).optional().default(""),
  message: z.string().trim().min(10, "Please add a little more detail to your message.").max(8_000),
  botField: z.string().max(500).optional().default(""),
  formLoadedAt: z.coerce.number().optional(),
}).refine((payload) => Boolean(payload.name || payload.firstName), {
  path: ["name"],
  message: "Name is required.",
});

function getRequestKey(request: NextRequest) {
  const trustedProxyIp = request.headers.get("x-real-ip");
  const forwardedIp = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return trustedProxyIp || forwardedIp || "unknown";
}

/** Best-effort per-instance protection; use a shared store for distributed enforcement. */
function checkRateLimit(key: string, now: number) {
  if (rateBuckets.size > 2_000) {
    for (const [bucketKey, bucket] of rateBuckets) {
      if (bucket.resetAt <= now) rateBuckets.delete(bucketKey);
    }
  }

  const current = rateBuckets.get(key);
  if (!current || current.resetAt <= now) {
    rateBuckets.set(key, { count: 1, resetAt: now + CONTACT_WINDOW_MS });
    return { limited: false, resetAt: now + CONTACT_WINDOW_MS };
  }
  if (current.count >= CONTACT_LIMIT) {
    return { limited: true, resetAt: current.resetAt };
  }
  current.count += 1;
  rateBuckets.set(key, current);
  return { limited: false, resetAt: current.resetAt };
}

export async function POST(request: NextRequest) {
  const now = Date.now();
  const rateLimit = checkRateLimit(getRequestKey(request), now);
  if (rateLimit.limited) {
    return NextResponse.json(
      { error: "Too many contact requests. Please try again later." },
      {
        status: 429,
        headers: { "Retry-After": String(Math.max(1, Math.ceil((rateLimit.resetAt - now) / 1000))) },
      },
    );
  }

  let payload: unknown;
  try {
    payload = await request.json();
  } catch {
    return NextResponse.json({ error: "The request body must be valid JSON." }, { status: 400 });
  }

  if (!payload || typeof payload !== "object" || Array.isArray(payload)) {
    return NextResponse.json({ error: "Please send a valid contact request." }, { status: 400 });
  }

  const raw = payload as Record<string, unknown>;
  if (typeof raw.botField === "string" && raw.botField.trim()) {
    return NextResponse.json({ success: true, message: "Request received." });
  }

  const parsed = ContactSchema.safeParse(payload);
  if (!parsed.success) {
    return NextResponse.json(
      { error: parsed.error.issues[0]?.message ?? "Please check the information and try again." },
      { status: 400 },
    );
  }

  const formLoadedAt = parsed.data.formLoadedAt;
  if (formLoadedAt && now - formLoadedAt < 1_200) {
    return NextResponse.json({ success: true, message: "Request received." });
  }

  const name = parsed.data.name || parsed.data.firstName || "";
  const email = parsed.data.email;
  const organization = parsed.data.organization;
  const service = parsed.data.service;
  const message = parsed.data.message;

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || siteMeta.email;
  if (!apiKey || !from) {
    console.error("[CONTACT] Email delivery is not configured. Set RESEND_API_KEY and CONTACT_FROM_EMAIL.");
    return NextResponse.json(
      { error: `The contact form is temporarily unavailable. Please email ${siteMeta.email} directly.` },
      { status: 503 },
    );
  }

  const subject = `Website inquiry from ${name}`;
  const text = [
    "A new inquiry was submitted through the Vectis website.",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Business: ${organization || "Not provided"}`,
    `Service: ${service || "Not specified"}`,
    "",
    "Message:",
    message,
  ].join("\n");

  try {
    const response = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from, to: [to], reply_to: email, subject, text }),
      signal: AbortSignal.timeout(10_000),
    });

    if (!response.ok) {
      const details = await response.text().catch(() => "");
      console.error("[CONTACT] Email provider rejected delivery.", response.status, details.slice(0, 500));
      return NextResponse.json(
        { error: "We could not send your message just now. Please try again or email us directly." },
        { status: 502 },
      );
    }

    return NextResponse.json({ success: true, message: "Your message has been sent. We will be in touch soon." });
  } catch (error) {
    console.error("[CONTACT] Email delivery failed.", error);
    return NextResponse.json(
      { error: "We could not send your message just now. Please try again or email us directly." },
      { status: 502 },
    );
  }
}
