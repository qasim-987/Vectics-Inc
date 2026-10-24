import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Building2, Quote, CheckCircle2 } from "lucide-react";
import { clientStories } from "@/data/vectis";

export const metadata: Metadata = {
  title: "Clients & Depot Stories — Vectis Inc.",
  description:
    "Stories from independent distributor offices managing routes, stock, and the close with RouteCore.",
  alternates: {
    canonical: "https://vectisoperations.tech/clients",
  },
};

export default function ClientsPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: "Vectis Inc. Client Stories",
    description: "Case studies and operational field proof from distributor offices running RouteCore.",
    url: "https://vectisoperations.tech/clients",
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
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-amber block mb-6">
            // Field Proof
          </span>

          <h1 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight text-paper leading-[1.1]">
            Where RouteCore is used every single day.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted font-normal leading-relaxed">
            Stories from independent distributor offices managing fleets, retail shop credit, cash drawers, and the daily close.
          </p>
        </div>
      </section>

      {/* Client Stories List */}
      <section className="mx-auto max-w-[1180px] px-5 md:px-8 space-y-16">
        {clientStories.map((client, index) => (
          <article
            key={client.id}
            className="reveal rounded-2xl border border-white/[0.08] bg-ink-card/40 p-8 sm:p-12 hover:border-white/20 transition-all"
          >
            {/* Office Number & Client Name */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/[0.08] pb-6 mb-8">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-accent-amber">
                  {client.officeNumber}
                </span>
                <h2 className="text-2xl sm:text-3xl font-serif text-paper mt-1">
                  {client.clientName}
                </h2>
              </div>
              <span className="text-xs font-mono text-muted max-w-xs sm:text-right">
                {client.businessType}
              </span>
            </div>

            {/* Narrative & Quote Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start mb-10">
              <div className="lg:col-span-7 space-y-4">
                <h3 className="text-xs font-mono uppercase tracking-[0.18em] text-muted-dark">
                  Operational Context
                </h3>
                <p className="text-base text-paper/85 leading-relaxed font-normal">
                  {client.narrative}
                </p>

                {/* Field Photo Captions */}
                <div className="pt-4 grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {client.fieldPhotos.map((photo) => (
                    <div
                      key={photo.label}
                      className="rounded-lg border border-white/[0.06] bg-ink-soft p-4"
                    >
                      <span className="text-[0.68rem] font-mono uppercase text-accent-amber block mb-1">
                        {photo.label}
                      </span>
                      <p className="text-xs text-muted leading-snug">{photo.caption}</p>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quote Block */}
              <div className="lg:col-span-5 rounded-xl border border-white/[0.06] bg-ink-deep p-6 sm:p-8 relative">
                <Quote className="h-8 w-8 text-accent-amber/20 mb-3" />
                <blockquote className="font-serif italic text-base sm:text-lg text-paper/90 leading-relaxed">
                  &ldquo;{client.quote}&rdquo;
                </blockquote>
                <div className="mt-4 pt-4 border-t border-white/[0.06] text-xs font-mono text-muted">
                  — {client.quoteAuthor}
                </div>
              </div>
            </div>

            {/* Daily Metrics Row */}
            <div className="pt-6 border-t border-white/[0.08] grid grid-cols-3 gap-4 sm:gap-8">
              {client.dailyMetrics.map((metric) => (
                <div key={metric.label}>
                  <span className="text-xs font-mono uppercase text-muted-dark block">
                    {metric.label}
                  </span>
                  <span className="text-xl sm:text-2xl font-serif font-semibold text-paper mt-1 block">
                    {metric.value}
                  </span>
                </div>
              ))}
            </div>
          </article>
        ))}
      </section>

      {/* RouteCore CTA */}
      <section className="py-20 border-t border-white/[0.08] bg-ink-deep mt-24">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8 text-center max-w-2xl">
          <h2 className="text-3xl font-serif text-paper">
            Ready to streamline your distributor office?
          </h2>
          <p className="mt-3 text-base text-muted">
            See how RouteCore installs directly on your office PCs with full offline capability.
          </p>
          <div className="mt-8 flex justify-center gap-4">
            <Link
              href="/distributionlife"
              className="inline-flex items-center gap-2 rounded-full bg-paper px-7 py-3 text-xs font-semibold uppercase tracking-wider text-ink transition-colors hover:bg-paper-muted"
            >
              <span>Explore RouteCore</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
