import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { firstName, lastName, email, service, message, botField, formLoadedAt } = body;

    // Honeypot anti-spam protection: if botField is populated, silently reject
    if (botField && botField.trim().length > 0) {
      console.warn("[ANTI-SPAM] Honeypot triggered by automated bot submission.");
      return NextResponse.json({ success: true, message: "Inquiry processed" }, { status: 200 });
    }

    // Timestamp check: if submitted in under 1.5 seconds, likely an automated scraper
    if (formLoadedAt && Date.now() - Number(formLoadedAt) < 1500) {
      console.warn("[ANTI-SPAM] Rejected submission completed in < 1.5 seconds.");
      return NextResponse.json({ success: true, message: "Inquiry processed" }, { status: 200 });
    }

    // Input validation
    const name = (firstName || "").trim();
    if (!name || !email || !message) {
      return NextResponse.json(
        { error: "Name, email, and message are required fields." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Please provide a valid corporate email address." },
        { status: 400 }
      );
    }

    // Log verified inquiry
    console.log("[VECTIS INQUIRY LOG]", {
      timestamp: new Date().toISOString(),
      clientName: `${name} ${lastName || ""}`.trim(),
      email,
      operation: service || "General Depot Scoping",
      messageLength: message.length,
    });

    return NextResponse.json({
      success: true,
      message: "Your inquiry has been logged. A Vectis Inc. engineer will review your operational requirements and respond within 24 hours.",
      receivedAt: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error("[API CONTACT ERROR]", error);
    return NextResponse.json(
      { error: "Internal server error processing contact request." },
      { status: 500 }
    );
  }
}
