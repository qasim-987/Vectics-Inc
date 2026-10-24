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
              // Companion Platform
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-0.5 text-xs font-medium text-amber-300 border border-amber-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
              In Active Development
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
              href="#questions"
              className="inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-xs font-semibold uppercase tracking-wider text-ink transition-all hover:bg-paper-muted"
            >
              <span>Explore Intelligence Model</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <Link
              href="/distributionlife"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-xs font-mono uppercase tracking-wider text-paper/80 transition-colors hover:border-white/30 hover:text-paper"
            >
              See RouteCore Desktop
            </Link>
          </div>
        </div>
      </section>

      {/* Animated SVG Network Route Diagram */}
      <section className="border-y border-white/[0.08] bg-ink-deep py-20 overflow-hidden relative">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8">
          <div className="mb-10 flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <span className="text-xs font-mono uppercase tracking-widest text-accent-blue">
                // Route Velocity & Demand Flow
              </span>
              <h2 className="text-2xl sm:text-3xl font-serif text-paper mt-1">
                From Route Invoices to Velocity Signals
              </h2>
            </div>
            <span className="text-xs font-mono text-muted">
              Live Synthesis Topology Simulation
            </span>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#141210] p-6 sm:p-10 relative overflow-hidden">
            {/* Ambient subtle glow */}
            <div className="absolute top-1/2 left-1/3 -translate-y-1/2 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

            {/* Interactive / Animated SVG */}
            <svg
              viewBox="0 0 900 380"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
              className="w-full h-auto text-paper"
            >
              {/* Connecting Route Lines */}
              <path
                d="M120 190 Q 280 80 450 190 T 780 190"
                stroke="#3b82f6"
                strokeWidth="2"
                strokeDasharray="6 6"
                className="opacity-60"
              />
              <path
                d="M120 190 Q 300 280 450 190 T 780 120"
                stroke="#f59e0b"
                strokeWidth="1.5"
                strokeDasharray="4 4"
                className="opacity-50"
              />
              <path
                d="M450 190 L 450 320"
                stroke="#9b9590"
                strokeWidth="1.5"
                strokeDasharray="3 3"
                className="opacity-40"
              />

              {/* Node 1: Central Depot */}
              <g transform="translate(120, 190)">
                <circle r="36" fill="#1c1917" stroke="#3b82f6" strokeWidth="2" />
                <circle r="8" fill="#3b82f6" className="animate-ping" opacity="0.4" />
                <circle r="6" fill="#3b82f6" />
                <text y="52" textAnchor="middle" fill="#f2efe9" fontSize="12" fontFamily="monospace">
                  CENTRAL DEPOT
                </text>
                <text y="66" textAnchor="middle" fill="#9b9590" fontSize="10" fontFamily="monospace">
                  Route Loadout Hub
                </text>
              </g>

              {/* Node 2: Route Corridor A */}
              <g transform="translate(290, 110)">
                <circle r="24" fill="#1c1917" stroke="#f2efe9" strokeWidth="1.5" />
                <circle r="4" fill="#3b82f6" />
                <text y="38" textAnchor="middle" fill="#f2efe9" fontSize="11" fontFamily="monospace">
                  North Territory
                </text>
                <text y="50" textAnchor="middle" fill="#3b82f6" fontSize="9" fontFamily="monospace">
                  +18% velocity
                </text>
              </g>

              {/* Node 3: Synthesis Engine (PulseGrid) */}
              <g transform="translate(450, 190)">
                <circle r="48" fill="#1c1917" stroke="#f59e0b" strokeWidth="2" />
                <circle r="12" fill="#f59e0b" className="animate-pulse" opacity="0.6" />
                <circle r="8" fill="#f59e0b" />
                <text y="64" textAnchor="middle" fill="#f2efe9" fontSize="12" fontWeight="bold" fontFamily="monospace">
                  PULSEGRID CORE
                </text>
                <text y="78" textAnchor="middle" fill="#f59e0b" fontSize="10" fontFamily="monospace">
                  Marginal Profit Engine
                </text>
              </g>

              {/* Node 4: Urban Retail Sector */}
              <g transform="translate(610, 240)">
                <circle r="22" fill="#1c1917" stroke="#f2efe9" strokeWidth="1.5" />
                <circle r="4" fill="#f59e0b" />
                <text y="36" textAnchor="middle" fill="#f2efe9" fontSize="11" fontFamily="monospace">
                  Kiosk Cluster
                </text>
                <text y="48" textAnchor="middle" fill="#9b9590" fontSize="9" fontFamily="monospace">
                  240 Active Stops
                </text>
              </g>

              {/* Node 5: Replenishment Forecast */}
              <g transform="translate(780, 150)">
                <circle r="36" fill="#1c1917" stroke="#3b82f6" strokeWidth="2" />
                <circle r="6" fill="#3b82f6" />
                <text y="52" textAnchor="middle" fill="#f2efe9" fontSize="12" fontFamily="monospace">
                  MANUFACTURER REORDER
                </text>
                <text y="66" textAnchor="middle" fill="#3b82f6" fontSize="10" fontFamily="monospace">
                  Optimized Stock Mix
                </text>
              </g>

              {/* Bottom Branch: Credit Risk Indicator */}
              <g transform="translate(450, 320)">
                <rect x="-80" y="-16" width="160" height="32" rx="16" fill="#1c1917" stroke="#e63946" strokeWidth="1" />
                <text y="4" textAnchor="middle" fill="#f2efe9" fontSize="10" fontFamily="monospace">
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
          <span className="text-[0.78rem] font-mono uppercase tracking-[0.18em] text-accent-amber">
            // Intelligence Framework
          </span>
          <h2 className="mt-3 text-3xl sm:text-5xl font-serif font-normal tracking-tight text-paper">
            Four questions PulseGrid answers.
          </h2>
          <p className="mt-3 text-base text-muted max-w-2xl">
            Distributors generate mountains of transaction data every week. PulseGrid translates invoice lines into decisive commercial actions.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {product.questionsAnswered?.map((q, idx) => (
            <div
              key={q}
              className="reveal rounded-xl border border-white/[0.08] bg-ink-card/40 p-8 hover:border-white/20 transition-all flex flex-col justify-between"
            >
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-accent-blue block mb-4">
                  Question 0{idx + 1}
                </span>
                <h3 className="text-xl sm:text-2xl font-serif text-paper leading-snug">
                  &ldquo;{q}&rdquo;
                </h3>
              </div>
              <p className="mt-6 text-sm text-muted pt-6 border-t border-white/[0.06] leading-relaxed">
                Evaluated against rolling 30-day route invoices, unit return rates, and shop settlement timelines.
              </p>
            </div>
          ))}
        </div>
      </section>

      {/* R&D Callout */}
      <section className="py-16 border-t border-white/[0.08] bg-ink-deep">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8 text-center max-w-2xl">
          <Compass className="h-8 w-8 text-accent-amber mx-auto mb-4" />
          <h2 className="text-2xl sm:text-3xl font-serif text-paper">
            Interested in the PulseGrid alpha pilot?
          </h2>
          <p className="mt-3 text-sm sm:text-base text-muted leading-relaxed">
            We are working closely with regional beverage and FMCG distributors to test early demand forecasting models. Contact our engineering team to join the alpha cohort.
          </p>
          <div className="mt-6">
            <Link
              href="#contact"
              className="inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-xs font-semibold uppercase tracking-wider text-ink transition-colors hover:bg-paper-muted"
            >
              Request Alpha Access
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
