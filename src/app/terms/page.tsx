import React from "react";
import type { Metadata } from "next";
import { siteMeta } from "@/data/vectis";

export const metadata: Metadata = {
  title: "Terms of Use — Vectis Inc.",
  description: "Terms of use, software licensing terms, and operational warranties for Vectis Operations Inc.",
  alternates: {
    canonical: "https://vectisoperations.tech/terms",
  },
};

export default function TermsPage() {
  return (
    <div className="w-full bg-surface pt-32 pb-24 text-content">
      <div className="mx-auto max-w-[840px] px-5 md:px-8">
        {/* Header */}
        <div className="border-b border-surface-border pb-10 mb-12">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-brand block mb-4">
            // Legal & Terms of Service
          </span>
          <h1 className="text-4xl sm:text-5xl font-serif font-normal tracking-tight text-content">
            Terms of Use
          </h1>
          <p className="mt-4 text-xs font-mono text-content-muted">
            Last Updated: October 2026 • Vectis Operations Inc.
          </p>
        </div>

        {/* Terms Content */}
        <div className="space-y-10 text-content-muted text-base sm:text-lg leading-relaxed">
          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-content font-sans">
              1. Acceptance of Terms
            </h2>
            <p>
              By accessing the website (<a href="https://vectisoperations.tech" className="text-brand underline">vectisoperations.tech</a>) or downloading, installing, or evaluating software distributed by Vectis Operations Inc. (&quot;Vectis&quot;), you agree to be bound by these Terms of Use.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-content font-sans">
              2. Software Licensing
            </h2>
            <p>
              RouteCore is proprietary desktop software licensed on a per-depot or per-workstation basis. A license grants you a non-exclusive, non-transferable right to execute the software for your internal business operations. You may not decompile, reverse-engineer, resell, or distribute the binary packages without prior written consent.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-content font-sans">
              3. Operational Responsibility
            </h2>
            <p>
              RouteCore serves as a digital ledger and audit verification tool. The physical custody of cash, inventory warehouse counts, driver collections, and bank deposits remains the sole responsibility of your operating business.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-content font-sans">
              4. Accuracy of Operating Records
            </h2>
            <p>
              While our system executes deterministic accounting logic, reconciliation accuracy depends entirely on data entered by your warehouse staff and cashiers. We strongly advise printing and physically countersigning the daily summary report at the close of each shift.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-content font-sans">
              5. In-Development Products
            </h2>
            <p>
              Features and previews for PulseGrid and Vectis Studio are provided &quot;as-is&quot; for testing, research, and design feedback purposes. Functionality is subject to ongoing iteration prior to general production release.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-content font-sans">
              6. Intellectual Property
            </h2>
            <p>
              All trademarks, wordmarks, software designs, user interface layouts, documentation, and source code are the exclusive intellectual property of Vectis Operations Inc.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-content font-sans">
              7. Hardware & Peripherals
            </h2>
            <p>
              RouteCore interfaces with standard Windows desktop environments and POS receipt/laser printers. Compatibility with specific hardware scanners or printer drivers is governed by respective manufacturer specifications.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-content font-sans">
              8. Limitation of Liability
            </h2>
            <p>
              To the fullest extent permitted by applicable law, Vectis shall not be liable for indirect, incidental, or consequential damages resulting from operational downtime, equipment failure, or data loss. In all cases, total liability is capped at the license fees paid during the prior twelve months.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-content font-sans">
              9. Termination
            </h2>
            <p>
              We reserve the right to revoke software license tokens upon material breach of these terms, including unauthorized distribution or failure to remit agreed software licensing fees.
            </p>
          </section>

          <section className="space-y-3">
            <h2 className="text-xl font-semibold text-content font-sans">
              10. Governing Law
            </h2>
            <p>
              These Terms of Use shall be governed by and construed in accordance with standard commercial laws, without regard to conflict of law principles.
            </p>
          </section>

          <section className="space-y-3 border-t border-surface-border pt-8">
            <h2 className="text-xl font-semibold text-content font-sans">
              11. Contact Information
            </h2>
            <p>
              For legal inquiries regarding licensing or operational agreements, contact:{" "}
              <a href={`mailto:${siteMeta.email}`} className="text-brand underline font-mono">
                {siteMeta.email}
              </a>
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
