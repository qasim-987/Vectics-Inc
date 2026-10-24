import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CheckCircle2, Printer, ShieldCheck, Database, FileText } from "lucide-react";
import { productsData } from "@/data/vectis";

const product = productsData.find((p) => p.slug === "distributionlife")!;

export const metadata: Metadata = {
  title: "RouteCore — Distributor Office Desktop Software",
  description:
    "Windows desktop software for distributor offices. Track route collections, inventory, retail shops, bank deposits and cash, then print the close-of-day summary.",
  alternates: {
    canonical: "https://vectisoperations.tech/distributionlife",
  },
};

export default function DistributionLifePage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "RouteCore",
    operatingSystem: "Windows 10, Windows 11",
    applicationCategory: "BusinessApplication",
    description: product.shortDesc,
    offers: {
      "@type": "Offer",
      price: "0",
      priceCurrency: "USD",
      availability: "https://schema.org/InStock",
    },
  };

  return (
    <div className="w-full pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <section className="mx-auto max-w-[1180px] px-5 md:px-8 mb-20">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-amber">
              // Live System
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 px-3 py-0.5 text-xs font-medium text-emerald-400 border border-emerald-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
              Live in Active Depots
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight text-paper leading-[1.1]">
            {product.headline}
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted font-normal leading-relaxed">
            {product.shortDesc}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#close-summary"
              className="inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-xs font-semibold uppercase tracking-wider text-ink transition-all hover:bg-paper-muted"
            >
              <span>See the Daily Record</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <Link
              href="/clients"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-xs font-mono uppercase tracking-wider text-paper/80 transition-colors hover:border-white/30 hover:text-paper"
            >
              Read Client Stories
            </Link>
          </div>
        </div>
      </section>

      {/* Architectural Philosophy Callout */}
      <section className="border-y border-white/[0.08] bg-ink-deep py-16">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <Database className="h-6 w-6 text-accent-amber shrink-0 mt-1" />
              <div>
                <h3 className="text-base font-semibold text-paper">Offline-First SQLite Engine</h3>
                <p className="mt-1 text-sm text-muted leading-relaxed">
                  Zero cloud dependency for daily operations. Runs instantaneously on standard Windows PCs, immune to warehouse ISP blackouts.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <ShieldCheck className="h-6 w-6 text-accent-amber shrink-0 mt-1" />
              <div>
                <h3 className="text-base font-semibold text-paper">Indisputable Cash Auditing</h3>
                <p className="mt-1 text-sm text-muted leading-relaxed">
                  Driver collections match line-item invoices against bank deposit slips, isolating discrepancies down to the single rupee.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <Printer className="h-6 w-6 text-accent-amber shrink-0 mt-1" />
              <div>
                <h3 className="text-base font-semibold text-paper">Deterministic Print Summaries</h3>
                <p className="mt-1 text-sm text-muted leading-relaxed">
                  Produces clean, physical end-of-day audit sheets for operations managers and accountants before the office locks up.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 5 Operational Pillars */}
      <section className="py-24 mx-auto max-w-[1180px] px-5 md:px-8">
        <div className="mb-16">
          <span className="text-[0.78rem] font-mono uppercase tracking-[0.18em] text-accent-amber">
            // Core capabilities
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-serif font-normal tracking-tight text-paper">
            Five pillars of the daily operation.
          </h2>
          <p className="mt-3 text-base text-muted max-w-2xl">
            RouteCore was shaped around physical depot handoffs. Each pillar addresses a specific operational touchpoint during the working day.
          </p>
        </div>

        <div className="space-y-6">
          {product.pillars?.map((pillar, i) => (
            <div
              key={pillar.title}
              className="reveal rounded-xl border border-white/[0.08] bg-ink-card/40 p-6 sm:p-8 flex flex-col md:flex-row md:items-center justify-between gap-6 hover:border-white/20 transition-all"
            >
              <div className="flex items-start gap-4">
                <span className="font-mono text-sm uppercase tracking-wider text-accent-amber shrink-0 mt-1">
                  0{i + 1}
                </span>
                <div>
                  <h3 className="text-xl font-medium text-paper">{pillar.title}</h3>
                  <p className="mt-2 text-sm text-muted leading-relaxed max-w-2xl">
                    {pillar.description}
                  </p>
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-2 text-xs font-mono text-muted-dark">
                <CheckCircle2 className="h-4 w-4 text-emerald-400" />
                <span>Standard Depot Feature</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Close-of-Day Printable Summary Simulation */}
      <section id="close-summary" className="py-20 border-t border-white/[0.08] bg-ink-deep">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8">
          <div className="mb-12">
            <span className="text-[0.78rem] font-mono uppercase tracking-[0.18em] text-accent-amber">
              // End-of-Day Output
            </span>
            <h2 className="mt-3 text-3xl sm:text-4xl font-serif font-normal text-paper">
              The Close-of-Day Summary
            </h2>
            <p className="mt-2 text-sm sm:text-base text-muted max-w-xl">
              An unambiguous, physical document printed at the conclusion of every shift.
            </p>
          </div>

          <div className="rounded-xl border border-white/10 bg-[#161413] p-6 sm:p-10 font-mono text-xs sm:text-sm text-paper/90 shadow-2xl overflow-x-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
              <div>
                <span className="text-accent-amber font-bold">VECTIS ROUTECORE v2.8</span>
                <span className="text-muted block text-xs mt-0.5">DAILY AUDIT TALLY • DEPOT 01</span>
              </div>
              <div className="text-right text-xs text-muted">
                <span>OPERATING DATE: OCT 24, 2026</span>
                <span className="block text-emerald-400">LEDGER STATUS: RECONCILED (100%)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 py-4 border-b border-white/10">
              <div>
                <span className="text-muted text-xs block">TOTAL DISPATCH VALUE</span>
                <span className="text-base text-paper font-semibold mt-1 block">Rs. 1,482,500</span>
              </div>
              <div>
                <span className="text-muted text-xs block">CASH COLLECTED</span>
                <span className="text-base text-paper font-semibold mt-1 block">Rs. 1,124,300</span>
              </div>
              <div>
                <span className="text-muted text-xs block">CREDIT EXTENSIONS</span>
                <span className="text-base text-paper font-semibold mt-1 block">Rs. 298,200</span>
              </div>
              <div>
                <span className="text-muted text-xs block">RETURNS RESTOCKED</span>
                <span className="text-base text-paper font-semibold mt-1 block">Rs. 60,000</span>
              </div>
            </div>

            <div className="pt-6 flex flex-col sm:flex-row items-center justify-between text-xs text-muted gap-4">
              <div className="flex items-center gap-2">
                <FileText className="h-4 w-4 text-accent-amber" />
                <span>Audit Slip Hash: 9d8f-7c1a-4b2e-0021 • Cashier ID: Tariq M.</span>
              </div>
              <div className="font-sans">
                <span className="text-paper/80 font-medium">Reconciled in 28 minutes</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
