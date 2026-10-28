import { NextRequest, NextResponse } from "next/server";

export const runtime = "nodejs";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const MAX_NAME = 120;
const MAX_EMAIL = 254;
const MAX_ORGANIZATION = 180;
const MAX_MESSAGE = 8_000;

function cleanText(value: unknown, maxLength: number): string {
  return typeof value === "string" ? value.trim().slice(0, maxLength) : "";
}

export async function POST(request: NextRequest) {
  let payload: Record<string, unknown>;
  try {
    const parsed: unknown = await request.json();
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return NextResponse.json({ error: "Please send a valid contact request." }, { status: 400 });
    }
    payload = parsed as Record<string, unknown>;
  } catch {
    return NextResponse.json({ error: "The request body must be valid JSON." }, { status: 400 });
  }

  // Silently accept the bot submission without sending or logging its contents.
  if (cleanText(payload.botField, 500)) {
    return NextResponse.json({ success: true, message: "Request received." });
  }

  const formLoadedAt = Number(payload.formLoadedAt);
  if (Number.isFinite(formLoadedAt) && formLoadedAt > 0 && Date.now() - formLoadedAt < 1_200) {
    return NextResponse.json({ success: true, message: "Request received." });
  }

  const name = cleanText(payload.name ?? payload.firstName, MAX_NAME);
  const email = cleanText(payload.email, MAX_EMAIL);
  const organization = cleanText(payload.organization ?? payload.service, MAX_ORGANIZATION);
  const message = cleanText(payload.message, MAX_MESSAGE);

  if (!name || !email || !message) {
    return NextResponse.json({ error: "Name, email, and message are required." }, { status: 400 });
  }
  if (!EMAIL_RE.test(email)) {
    return NextResponse.json({ error: "Enter a valid email address." }, { status: 400 });
  }
  if (message.length < 10) {
    return NextResponse.json({ error: "Please add a little more detail to your message." }, { status: 400 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.CONTACT_FROM_EMAIL;
  const to = process.env.CONTACT_TO_EMAIL || "hello@vectisoperations.tech";
  if (!apiKey || !from) {
    console.error("[CONTACT] Email delivery is not configured. Set RESEND_API_KEY and CONTACT_FROM_EMAIL.");
    return NextResponse.json(
      { error: "The contact form is temporarily unavailable. Please email hello@vectisoperations.tech directly." },
      { status: 503 },
    );
  }

  const subject = `Website inquiry from ${name}`;
  const text = [
    "A new inquiry was submitted through the Vectis website.",
    "",
    `Name: ${name}`,
    `Email: ${email}`,
    `Organization / interest: ${organization || "Not provided"}`,
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

    return NextResponse.json({
      success: true,
      message: "Your message has been sent. We will be in touch soon.",
      receivedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error("[CONTACT] Email delivery failed.", error);
    return NextResponse.json(
      { error: "We could not send your message just now. Please try again or email us directly." },
      { status: 502 },
    );
  }
}
