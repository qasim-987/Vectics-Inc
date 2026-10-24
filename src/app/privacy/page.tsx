import React from "react";
import type { Metadata } from "next";
import { siteMeta } from "@/data/vectis";

export const metadata: Metadata = {
  title: "Privacy Policy — Vectis Inc.",
  description: "Privacy policy and data governance terms for Vectis Operations Inc. and RouteCore.",
  alternates: {
    canonical: "https://vectisoperations.tech/privacy",
  },
};

export default function PrivacyPage() {
  return (
    <div className="w-full pt-32 pb-24">
      <div className="mx-auto max-w-[840px] px-5 md:px-8">
        {/* Header */}
        <div className="border-b border-white/[0.08] pb-10 mb-12">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-amber block mb-4">
            // Legal & Data Governance
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-normal tracking-tight text-paper">
            Privacy Policy
          </h1>
          <p className="mt-4 text-xs font-mono text-muted">
            Last Updated: October 2026 • Vectis Operations Inc.
          </p>
        </div>

        {/* Policy Content */}
        <div className="space-y-10 text-paper/85 text-base sm:text-lg leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-paper font-sans">
              1. Scope & Identity
            </h2>
            <p>
              This Privacy Policy explains how Vectis Operations Inc. (&quot;Vectis&quot;, &quot;we&quot;, &quot;us&quot;, or &quot;our&quot;) handles information gathered through our website (<a href="https://vectisoperations.tech" className="text-accent-amber underline">vectisoperations.tech</a>) and our desktop applications, including RouteCore.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-paper font-sans">
              2. Absolute Offline Ledger Isolation
            </h2>
            <div className="rounded-xl border border-white/10 bg-ink-card/50 p-6 text-sm sm:text-base text-paper/90">
              <strong className="text-accent-amber block mb-2 font-mono uppercase text-xs">
                Key Operational Guarantee
              </strong>
              RouteCore operates on an offline-first architecture. All customer records, shop balances, route driver cash tallies, inventory levels, and bank deposit slips are stored strictly on your local premises in an encrypted local database. Vectis Inc. does not host, sync, access, or hold copies of your operational data on external cloud servers.
            </div>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-paper font-sans">
              3. Information We Collect
            </h2>
            <p>
              When you interact with our website or contact our team directly, we may collect:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-sm sm:text-base text-muted">
              <li>Contact Details: Name, corporate email address, organization name, and message contents submitted via our inquiry form.</li>
              <li>Technical Telemetry: Standard HTTP server headers, browser user-agent, and anonymized referral metrics to ensure website performance.</li>
              <li>Licensing Verification: When installing RouteCore, our licensing utility may verify machine activation status via a cryptographically hashed hardware token that contains zero personal or operational records.</li>
            </ul>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-paper font-sans">
              4. How We Use Collected Data
            </h2>
            <p>
              Information collected through our website is used solely to respond to inquiries, evaluate software deployment readiness, fulfill contractual obligations, and provide technical assistance to distributor offices.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-paper font-sans">
              5. Data Protection & Non-Disclosure
            </h2>
            <p>
              We never sell, rent, monetize, or trade client contact details or operational intelligence to third parties, data brokers, or advertising networks.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-paper font-sans">
              6. Data Retention
            </h2>
            <p>
              Inquiry submissions are retained for up to twelve months to maintain business correspondence history, after which they are securely purged from our records unless required for ongoing contractual agreements.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-paper font-sans">
              7. Security Measures
            </h2>
            <p>
              We implement industry-standard TLS encryption for all web communications and adhere to strict access control policies internally to protect data integrity.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-paper font-sans">
              8. Your Rights
            </h2>
            <p>
              You have the right to request access to any personal communication data we hold about you, request corrections, or request deletion of your contact records.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-paper font-sans">
              9. Policy Updates
            </h2>
            <p>
              We may revise this Privacy Policy periodically to reflect legal adjustments or software updates. The latest version will always be published on this page with an updated timestamp.
            </p>
          </section>

          <section className="space-y-3 border-t border-white/[0.08] pt-8">
            <h2 className="text-xl font-semibold text-paper font-sans">
              10. Contact Us
            </h2>
            <p>
              For privacy inquiries or data governance questions, please write to our data protection officer at:{" "}
              <a href={`mailto:${siteMeta.email}`} className="text-accent-amber underline font-mono">
                {siteMeta.email}
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
