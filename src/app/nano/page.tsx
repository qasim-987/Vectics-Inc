import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Activity, TrendingUp, Compass, Network } from "lucide-react";
import { productsData } from "@/data/vectis";

const product = productsData.find((p) => p.slug === "nano")!;

export const metadata: Metadata = {
  title: "PulseGrid — Market Intelligence for Distributors",
  description:
    "PulseGrid is in development at Vectis Inc.: market intelligence for distributors, exploring demand, pricing and product mix to support daily inventory decisions.",
  alternates: {
    canonical: "https://vectisoperations.tech/nano",
  },
};

export default function NanoPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "PulseGrid",
    applicationCategory: "BusinessIntelligenceApplication",
    description: product.shortDesc,
    operatingSystem: "Web-based companion",
  };

  return (
    <div className="w-full bg-surface pt-32 pb-24 text-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <section className="mx-auto max-w-[1180px] px-5 md:px-8 mb-20">
        <div className="max-w-3xl">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-brand">
              // Companion Platform
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-slate-100 px-3 py-0.5 text-xs font-medium text-slate-700 border border-slate-200">
              <span className="h-1.5 w-1.5 rounded-full bg-slate-500"></span>
              In Active Development
            </span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight text-content leading-[1.1]">
            {product.headline}
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-content-muted font-normal leading-relaxed">
            {product.shortDesc}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#questions"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-brand-deep"
            >
              <span>Explore Intelligence Model</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <Link
              href="/distributionlife"
              className="inline-flex items-center gap-2 rounded-full border border-surface-border px-6 py-3 text-xs font-mono uppercase tracking-wider text-content-muted transition-colors hover:border-brand/40 hover:text-brand"
            >
              See RouteCore Desktop
            </Link>
          </div>
        </div>
      </section>

      {/* Animated SVG Network Route Diagram */}
      <section className="border-y border-surface-border bg-surface-muted py-20 overflow-hidden relative">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-brand">
                // Route Velocity & Demand Flow
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-content mt-1">
                From Route Invoices to Velocity Signals
              </h2>
            </div>
            <span className="text-xs font-mono text-content-muted">
              Live Synthesis Topology Simulation
            </span>
          </div>

          <div className="rounded-2xl border border-surface-border bg-surface p-6 sm:p-10 relative overflow-hidden">
            {/* Interactive / Animated SVG */}
            <svg
              viewBox="0 0 900 380"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto text-content"
            >
              {/* Connecting Route Lines */}
              <path
                d="M120 190 Q 280 80 450 190 T 780 190"
                stroke="#285f85"
                strokeWidth="2"
                strokeDasharray="6 6"
                className="opacity-60"
              />
              <path
                d="M120 190 Q 300 280 450 190 T 780 120"
                stroke="#457868"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="opacity-50"
              />
              <path
                d="M450 190 L 450 320"
                stroke="#5c7184"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                className="opacity-40"
              />

              {/* Node 1: Central Depot */}
              <g transform="translate(120, 190)">
                <circle r="36" fill="#f3f6f9" stroke="#285f85" strokeWidth="2" />
                <circle r="8" fill="#285f85" opacity="0.4" />
                <circle r="6" fill="#285f85" />
                <text y="52" textAnchor="middle" fill="#172d43" fontSize="12" fontFamily="monospace">
                  CENTRAL DEPOT
                </text>
                <text y="66" textAnchor="middle" fill="#5c7184" fontSize="10" fontFamily="monospace">
                  Route Loadout Hub
                </text>
              </g>

              {/* Node 2: Route Corridor A */}
              <g transform="translate(290, 110)">
                <circle r="24" fill="#f3f6f9" stroke="#172d43" strokeWidth="1.5" />
                <circle r="4" fill="#285f85" />
                <text y="38" textAnchor="middle" fill="#172d43" fontSize="11" fontFamily="monospace">
                  North Territory
                </text>
                <text y="50" textAnchor="middle" fill="#285f85" fontSize="9" fontFamily="monospace">
                  +18% velocity
                </text>
              </g>

              {/* Node 3: Synthesis Engine (PulseGrid) */}
              <g transform="translate(450, 190)">
                <circle r="48" fill="#f3f6f9" stroke="#457868" strokeWidth="2" />
                <circle r="12" fill="#457868" opacity="0.6" />
                <circle r="8" fill="#457868" />
                <text y="64" textAnchor="middle" fill="#172d43" fontSize="12" fontWeight="bold" fontFamily="monospace">
                  PULSEGRID CORE
                </text>
                <text y="78" textAnchor="middle" fill="#457868" fontSize="10" fontFamily="monospace">
                  Marginal Profit Engine
                </text>
              </g>

              {/* Node 4: Urban Retail Sector */}
              <g transform="translate(610, 240)">
                <circle r="22" fill="#f3f6f9" stroke="#172d43" strokeWidth="1.5" />
                <circle r="4" fill="#457868" />
                <text y="36" textAnchor="middle" fill="#172d43" fontSize="11" fontFamily="monospace">
                  Kiosk Cluster
                </text>
                <text y="48" textAnchor="middle" fill="#5c7184" fontSize="9" fontFamily="monospace">
                  240 Active Stops
                </text>
              </g>

              {/* Node 5: Replenishment Forecast */}
              <g transform="translate(780, 150)">
                <circle r="36" fill="#f3f6f9" stroke="#285f85" strokeWidth="2" />
                <circle r="6" fill="#285f85" />
                <text y="52" textAnchor="middle" fill="#172d43" fontSize="12" fontFamily="monospace">
                  MANUFACTURER REORDER
                </text>
                <text y="66" textAnchor="middle" fill="#285f85" fontSize="10" fontFamily="monospace">
                  Optimized Stock Mix
                </text>
              </g>

              {/* Bottom Branch: Credit Risk Indicator */}
              <g transform="translate(450, 320)">
                <rect x="-80" y="-16" width="160" height="32" rx="16" fill="#f3f6f9" stroke="#839bad" strokeWidth="1" />
                <text y="4" textAnchor="middle" fill="#172d43" fontSize="10" fontFamily="monospace">
                  Credit Leakage Monitor
                </text>
              </g>
            </svg>
          </div>
        </div>
      </section>

      {/* 4 Questions Answered */}
      <section id="questions" className="py-24 mx-auto max-w-[1180px] px-5 md:px-8">
        <div className="mb-16">
          <span className="text-[0.78rem] font-mono uppercase tracking-[0.18em] text-brand">
            // Intelligence Framework
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-serif font-normal tracking-tight text-content">
            Four questions PulseGrid answers.
          </h2>
          <p className="mt-3 text-base text-content-muted max-w-2xl">
            Distributors generate mountains of transaction data every week. PulseGrid translates invoice lines into decisive commercial actions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {product.questionsAnswered?.map((q, idx) => (
            <div
              key={q}
              className="reveal rounded-xl border border-surface-border bg-surface p-8 hover:border-brand/40 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-brand block mb-4">
                  Question 0{idx + 1}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif text-content leading-snug">
                  &ldquo;{q}&rdquo;
                </h3>
              </div>
              <p className="mt-6 text-sm text-content-muted pt-6 border-t border-surface-border leading-relaxed">
                Evaluated against rolling 30-day route invoices, unit return rates, and shop settlement timelines.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* R&D Callout */}
      <section className="py-16 border-t border-surface-border bg-surface-muted">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8 text-center max-w-2xl">
          <Compass className="h-8 w-8 text-brand mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-serif text-content">
            Interested in the PulseGrid alpha pilot?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-content-muted leading-relaxed">
            We are working closely with regional beverage and FMCG distributors to test early demand forecasting models. Contact our engineering team to join the alpha cohort.
          </p>
          <div className="mt-6">
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-3 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-brand-deep"
            >
              Request Alpha Access
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
