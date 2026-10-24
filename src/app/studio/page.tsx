import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Terminal, Globe, LayoutDashboard, Wrench } from "lucide-react";
import { productsData } from "@/data/vectis";

const product = productsData.find((p) => p.slug === "studio")!;

export const metadata: Metadata = {
  title: "Vectis Studio — Operational Workflow Prototyping",
  description:
    "Vectis Studio is in development: a tool for turning operational workflows into early software prototypes that teams can preview, discuss and refine together.",
  alternates: {
    canonical: "https://vectisoperations.tech/studio",
  },
};

export default function StudioPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    name: "Vectis Studio",
    applicationCategory: "DesignApplication",
    description: product.shortDesc,
    operatingSystem: "Web-based Studio",
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
              // Prototyping Environment
            </span>
            <span className="inline-flex items-center gap-1.5 rounded-full bg-amber-500/10 px-3 py-0.5 text-xs font-medium text-amber-300 border border-amber-500/20">
              <span className="h-1.5 w-1.5 rounded-full bg-amber-400"></span>
              In Development
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
              href="#outputs"
              className="inline-flex items-center gap-2 rounded-full bg-paper px-6 py-3 text-xs font-semibold uppercase tracking-wider text-ink transition-all hover:bg-paper-muted"
            >
              <span>Explore Studio Outputs</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3 text-xs font-mono uppercase tracking-wider text-paper/80 transition-colors hover:border-white/30 hover:text-paper"
            >
              Our Engineering Philosophy
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Studio Outputs */}
      <section id="outputs" className="border-t border-white/[0.08] bg-ink-deep py-24">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8">
          <div className="mb-16">
            <span className="text-[0.78rem] font-mono uppercase tracking-[0.18em] text-accent-amber">
              // Output Archetypes
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-serif font-normal tracking-tight text-paper">
              Three kinds of working prototypes.
            </h2>
            <p className="mt-3 text-base text-muted max-w-2xl">
              From public customer interfaces to internal warehouse screens, Vectis Studio translates physical operational logic into responsive interfaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {product.studioOutputs?.map((output, idx) => (
              <div
                key={output.title}
                className="reveal rounded-xl border border-white/[0.08] bg-ink-card/40 p-8 flex flex-col justify-between hover:border-white/20 transition-all"
              >
                <div>
                  <div className="mb-6 text-accent-amber">
                    {idx === 0 && <Globe className="h-8 w-8" />}
                    {idx === 1 && <LayoutDashboard className="h-8 w-8" />}
                    {idx === 2 && <Wrench className="h-8 w-8" />}
                  </div>
                  <span className="font-mono text-xs uppercase tracking-widest text-muted-dark block mb-2">
                    Output 0{idx + 1}
                  </span>
                  <h3 className="text-2xl font-serif text-paper mb-3">{output.title}</h3>
                  <p className="text-sm text-muted leading-relaxed">{output.description}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-white/[0.06] flex items-center justify-between text-xs font-mono text-muted-dark">
                  <span>Interactive Sandbox</span>
                  <span>TypeScript / React</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Studio Prototyping Terminal Simulation */}
      <section className="py-24 mx-auto max-w-[1180px] px-5 md:px-8">
        <div className="rounded-2xl border border-white/10 bg-[#121110] p-6 sm:p-10 font-mono text-xs sm:text-sm text-paper/80 shadow-2xl">
          <div className="flex items-center justify-between border-b border-white/10 pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-red-500/80" />
              <span className="h-3 w-3 rounded-full bg-amber-500/80" />
              <span className="h-3 w-3 rounded-full bg-emerald-500/80" />
              <span className="ml-3 text-xs text-muted">vectis-studio --workflow=dispatch-dock</span>
            </div>
            <span className="text-xs text-accent-amber uppercase tracking-wider">Live Schema Compiler</span>
          </div>

          <div className="space-y-3 font-mono leading-relaxed">
            <p className="text-muted-dark">// 1. Define physical handoff</p>
            <p className="text-emerald-400">
              workflow &quot;Morning Dock Loadout&quot; &#123;
            </p>
            <p className="pl-6 text-paper/90">
              bay: &quot;Bay-04&quot;, vehicles: 18, check_manifest: strict
            </p>
            <p className="pl-6 text-paper/90">
              on_variance: trigger_supervisor_override()
            </p>
            <p className="text-emerald-400">&#125;</p>

            <p className="text-muted-dark pt-3">// 2. Generated interactive view</p>
            <div className="rounded-lg border border-white/10 bg-black/40 p-4 font-sans text-sm text-paper">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-paper">Dispatch Dock View (18 Drivers Active)</span>
                <span className="text-xs font-mono text-emerald-400 bg-emerald-500/10 px-2 py-0.5 rounded">
                  Manifest Verified
                </span>
              </div>
              <p className="text-xs text-muted mt-1">
                Drivers tap to verify carton tallies directly on warehouse tablets.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
