import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, HeartHandshake, Zap, Sparkles } from "lucide-react";
import { siteMeta, principles } from "@/data/vectis";

export const metadata: Metadata = {
  title: "About Vectis Inc. — Software for Physical Operations",
  description:
    "Vectis Inc. builds focused software for operational businesses. Our engineering philosophy, four stubborn convictions, and dedication to physical commerce.",
  alternates: {
    canonical: "https://vectisoperations.tech/about",
  },
};

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Vectis Inc.",
    description: siteMeta.description,
    mainEntity: {
      "@type": "Organization",
      name: siteMeta.name,
      legalName: siteMeta.legalName,
      url: "https://vectisoperations.tech",
    },
  };

  return (
    <div className="w-full bg-surface pt-32 pb-24 text-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Narrative */}
      <section className="mx-auto max-w-[1180px] px-5 md:px-8 mb-20">
        <div className="max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-brand block mb-6">
            // About Vectis Inc.
          </span>

          <h1 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight text-content leading-[1.1]">
            We build software for the businesses that keep the physical world moving.
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-content-muted font-normal leading-relaxed">
            Most technology companies build for people sitting in front of glass conference room whiteboards. We build for the people who manage loading docks, count cases in unheated warehouses, reconcile driver cash bags, and keep retail shelves stocked across cities.
          </p>
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="border-t border-surface-border bg-surface-muted py-24">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <span className="text-[0.78rem] font-mono uppercase tracking-[0.18em] text-brand">
                // Where we began
              </span>
              <h2 className="mt-3 text-3xl sm:text-4xl font-serif text-content">
                The Concrete Floor
              </h2>
            </div>

            <div className="md:col-span-8 space-y-6 text-base sm:text-lg text-content-muted font-normal leading-relaxed">
              <p>
                Vectis Inc. was formed out of a straightforward realization: the software running independent distribution businesses was fundamentally broken. Distributors were either trapped on fragile twenty-year-old DOS programs or coerced into massive cloud subscriptions that took fifteen clicks just to log a single broken bottle of soda.
              </p>
              <p>
                When a distribution driver returns from an eight-hour route in heavy traffic, they do not have patience for web browsers that crash, spinning loading icons, or cloud authentication errors. They need a single, rock-solid desktop ledger that accepts keyboard entries as fast as their fingers can type.
              </p>
              <p>
                That is why we started RouteCore. We sat in cashier booths, watched delivery trucks roll out at 6:00 AM, and built software specifically to withstand the frantic pace of the evening close.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Four Stubborn Ideas */}
      <section className="py-24 mx-auto max-w-[1180px] px-5 md:px-8">
        <div className="mb-16">
          <span className="text-[0.78rem] font-mono uppercase tracking-[0.18em] text-brand">
            // Convictions
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-serif font-normal tracking-tight text-content">
            Four stubborn ideas.
          </h2>
          <p className="mt-3 text-base text-content-muted max-w-2xl">
            These are the principles that dictate how we write every line of code at Vectis Inc.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="reveal rounded-xl border border-surface-border bg-surface p-8">
            <span className="font-mono text-xs uppercase tracking-widest text-brand block mb-3">
              01 • Offline Resilience
            </span>
            <h3 className="text-xl font-medium text-content mb-3">
              Internet connections will fail. The software must not.
            </h3>
            <p className="text-sm text-content-muted leading-relaxed">
              Warehouses have thick concrete walls and unpredictable utility grids. We build desktop-native software powered by local SQLite databases that run without an internet connection for days on end without losing a single transaction.
            </p>
          </div>

          <div className="reveal rounded-xl border border-surface-border bg-surface p-8">
            <span className="font-mono text-xs uppercase tracking-widest text-brand block mb-3">
              02 • Atomic Accountability
            </span>
            <h3 className="text-xl font-medium text-content mb-3">
              Every single rupee and carton must balance before the office locks.
            </h3>
            <p className="text-sm text-content-muted leading-relaxed">
              We treat inventory and cash with forensic seriousness. Our ledgers are deterministic: stock loaded minus sales minus returns must equal physical vault balances. We don&apos;t hide accounting discrepancies behind fuzzy estimates.
            </p>
          </div>

          <div className="reveal rounded-xl border border-surface-border bg-surface p-8">
            <span className="font-mono text-xs uppercase tracking-widest text-brand block mb-3">
              03 • Ergonomic Speed
            </span>
            <h3 className="text-xl font-medium text-content mb-3">
              Keyboard velocity beats flashy design animations.
            </h3>
            <p className="text-sm text-content-muted leading-relaxed">
              When an operator is entering three hundred invoices a night, every mouse click is lost time. We design interfaces optimized for rapid numeric keypads, instant tab-navigation, and sub-millisecond database commits.
            </p>
          </div>

          <div className="reveal rounded-xl border border-surface-border bg-surface p-8">
            <span className="font-mono text-xs uppercase tracking-widest text-brand block mb-3">
              04 • Direct Partnership
            </span>
            <h3 className="text-xl font-medium text-content mb-3">
              We stand next to the people using our tools.
            </h3>
            <p className="text-sm text-content-muted leading-relaxed">
              We do not outsource our customer support to ticket queues. When a distributor has a question during an audit, they talk directly to the engineers who wrote the software. We iterate based on physical feedback, not marketing trends.
            </p>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-16 border-t border-surface-border bg-surface-muted">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8 text-center max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-serif text-content">
            Want to see how our software works in real depots?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-content-muted leading-relaxed">
            Read case studies from independent distributors who run RouteCore every day.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/clients"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-brand-deep"
            >
              Explore Client Stories
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
