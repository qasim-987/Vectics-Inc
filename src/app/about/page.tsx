import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, ShieldCheck, HeartHandshake, Zap, Sparkles } from "lucide-react";
import { siteMeta, principles } from "@/data/vectis";

export const metadata: Metadata = {
  title: "About Vectis Inc. — Software & AI Studio",
  description:
    "Meet Vectis, a Forza Inc. company building custom software, web applications, and useful AI automation for real-world teams.",
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
    <div className="w-full bg-bg pt-12 sm:pt-16 pb-24 text-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Narrative */}
      <section className="mx-auto max-w-shell px-6 md:px-8 mb-20">
        <div className="max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-brand block mb-6">About Vectis Inc.
          </span>

          <h1 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight text-content leading-[1.1]">
            We build software for the businesses that keep the physical world moving.
          </h1>

          <p className="mt-8 text-lg sm:text-xl text-content-muted font-normal leading-relaxed">
            Vectis is part of Forza Inc., building practical digital products and custom software for teams doing consequential work. We combine thoughtful product design, dependable engineering, and useful AI automation to make everyday workflows clearer.
          </p>
        </div>
      </section>

      {/* Origin Story Section */}
      <section className="border-t border-surface-border bg-surface-muted py-24">
        <div className="mx-auto max-w-shell px-6 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-12 gap-12">
            <div className="md:col-span-4">
              <span className="text-[0.78rem] font-mono uppercase tracking-[0.18em] text-brand">Where we began
              </span>
              <h2 className="mt-4 text-3xl sm:text-4xl font-serif text-content">
                The Concrete Floor
              </h2>
            </div>

            <div className="md:col-span-8 space-y-6 text-base sm:text-lg text-content-muted font-normal leading-relaxed">
              <p>
                We start with the work itself: the people, existing systems, handoffs, and small points of friction that accumulate into a larger problem. A useful product begins with understanding those realities, not with choosing a fashionable technology.
              </p>
              <p>
                From custom software and web applications to AI-powered automation, we focus on clear outcomes, sensible scope, and reliable foundations. The right solution can be a new application, a careful integration, or a simpler way to handle repetitive work.
              </p>
              <p>
                As a company within Forza Inc., Vectis works with the wider Forza family to turn real needs into software that is useful, maintainable, and ready to evolve with the people who rely on it.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Four Stubborn Ideas */}
      <section className="py-24 mx-auto max-w-shell px-6 md:px-8">
        <div className="mb-16">
          <span className="text-[0.78rem] font-mono uppercase tracking-[0.18em] text-brand">Convictions
          </span>
          <h2 className="mt-4 text-3xl sm:text-5xl font-serif font-normal tracking-tight text-content">
            Four stubborn ideas.
          </h2>
          <p className="mt-4 text-base text-content-muted max-w-2xl">
            These are the principles that dictate how we write every line of code at Vectis Inc.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
          <div className="rounded-xl border border-surface-border bg-surface p-8">
            <span className="font-mono text-xs uppercase tracking-widest text-brand block mb-4">
              01 • Offline Resilience
            </span>
            <h3 className="text-xl font-medium text-content mb-4">
              Internet connections will fail. The software must not.
            </h3>
            <p className="text-sm text-content-muted leading-relaxed">
              Warehouses have thick concrete walls and unpredictable utility grids. We build desktop-native software powered by local SQLite databases that run without an internet connection for days on end without losing a single transaction.
            </p>
          </div>

          <div className="rounded-xl border border-surface-border bg-surface p-8">
            <span className="font-mono text-xs uppercase tracking-widest text-brand block mb-4">
              02 • Atomic Accountability
            </span>
            <h3 className="text-xl font-medium text-content mb-4">
              Every single rupee and carton must balance before the office locks.
            </h3>
            <p className="text-sm text-content-muted leading-relaxed">
              We treat inventory and cash with forensic seriousness. Our ledgers are deterministic: stock loaded minus sales minus returns must equal physical vault balances. We don&apos;t hide accounting discrepancies behind fuzzy estimates.
            </p>
          </div>

          <div className="rounded-xl border border-surface-border bg-surface p-8">
            <span className="font-mono text-xs uppercase tracking-widest text-brand block mb-4">
              03 • Ergonomic Speed
            </span>
            <h3 className="text-xl font-medium text-content mb-4">
              Keyboard velocity beats flashy design animations.
            </h3>
            <p className="text-sm text-content-muted leading-relaxed">
              When an operator is entering three hundred invoices a night, every mouse click is lost time. We design interfaces optimized for rapid numeric keypads, instant tab-navigation, and sub-millisecond database commits.
            </p>
          </div>

          <div className="rounded-xl border border-surface-border bg-surface p-8">
            <span className="font-mono text-xs uppercase tracking-widest text-brand block mb-4">
              04 • Direct Partnership
            </span>
            <h3 className="text-xl font-medium text-content mb-4">
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
        <div className="mx-auto max-w-shell px-6 md:px-8 text-center max-w-2xl">
          <h2 className="text-2xl sm:text-3xl font-serif text-content">
            Want to see how our software works in real depots?
          </h2>
          <p className="mt-4 text-sm sm:text-base text-content-muted leading-relaxed">
            Read case studies from independent distributors who run RouteCore every day.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/clients"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-brand-deep"
            >
              Explore Client Stories
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
