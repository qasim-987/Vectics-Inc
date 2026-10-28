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
    <div className="w-full bg-bg pt-12 sm:pt-16 pb-24 text-content">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <section className="mx-auto max-w-shell px-6 md:px-8 mb-20">
        <div className="max-w-3xl">
          <div className="flex items-center gap-4 mb-6">
            <span className="text-xs font-mono uppercase tracking-[0.2em] text-brand">Prototyping Environment
            </span>
            <span className="status-badge">In Development</span>
          </div>

          <h1 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight text-content leading-[1.1]">
            {product.headline}
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-content-muted font-normal leading-relaxed">
            {product.shortDesc}
          </p>

          <div className="mt-8 flex flex-wrap items-center gap-4">
            <a
              href="#outputs"
              className="inline-flex items-center gap-2 rounded-full bg-brand px-6 py-4 text-xs font-semibold uppercase tracking-wider text-white transition-all hover:bg-brand-deep"
            >
              <span>Explore Studio Outputs</span>
              <ArrowRight className="h-3.5 w-3.5" />
            </a>
            <Link
              href="/about"
              className="inline-flex items-center gap-2 rounded-full border border-surface-border px-6 py-4 text-xs font-mono uppercase tracking-wider text-content-muted transition-colors hover:border-brand/40 hover:text-brand"
            >
              Our Engineering Philosophy
            </Link>
          </div>
        </div>
      </section>

      {/* 3 Studio Outputs */}
      <section id="outputs" className="border-t border-surface-border bg-surface-muted py-24">
        <div className="mx-auto max-w-shell px-6 md:px-8">
          <div className="mb-16">
            <span className="text-[0.78rem] font-mono uppercase tracking-[0.18em] text-brand">Output Archetypes
            </span>
            <h2 className="mt-4 text-3xl sm:text-5xl font-serif font-normal tracking-tight text-content">
              Three kinds of working prototypes.
            </h2>
            <p className="mt-4 text-base text-content-muted max-w-2xl">
              From public customer interfaces to internal warehouse screens, Vectis Studio translates physical operational logic into responsive interfaces.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {product.studioOutputs?.map((output, idx) => (
              <div
                key={output.title}
                className="rounded-xl border border-surface-border bg-surface p-8 flex flex-col justify-between hover:border-brand/40 transition-all"
              >
                <div>
                  <div className="mb-6 text-brand">
                    {idx === 0 && <Globe className="h-8 w-8" />}
                    {idx === 1 && <LayoutDashboard className="h-8 w-8" />}
                    {idx === 2 && <Wrench className="h-8 w-8" />}
                  </div>
                  <span className="font-mono text-xs uppercase tracking-widest text-content-subtle block mb-2">
                    Output 0{idx + 1}
                  </span>
                  <h3 className="text-2xl font-serif text-content mb-4">{output.title}</h3>
                  <p className="text-sm text-content-muted leading-relaxed">{output.description}</p>
                </div>
                <div className="mt-8 pt-4 border-t border-surface-border flex items-center justify-between text-xs font-mono text-content-subtle">
                  <span>Interactive Sandbox</span>
                  <span>TypeScript / React</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Studio Prototyping Terminal Simulation */}
      <section className="py-24 mx-auto max-w-shell px-6 md:px-8">
        <div className="rounded-2xl border border-surface-border bg-surface-muted p-6 sm:p-10 font-mono text-xs sm:text-sm text-content-muted shadow-sm shadow-slate-200/60">
          <div className="flex items-center justify-between border-b border-surface-border pb-4 mb-6">
            <div className="flex items-center gap-2">
              <span className="h-3 w-3 rounded-full bg-slate-300" />
              <span className="h-3 w-3 rounded-full bg-slate-400" />
              <span className="h-3 w-3 rounded-full bg-brand/60" />
              <span className="ml-4 text-xs text-content-muted">vectis-studio --workflow=dispatch-dock</span>
            </div>
            <span className="text-xs text-brand uppercase tracking-wider">Live Schema Compiler</span>
          </div>

          <div className="space-y-4 font-mono leading-relaxed">
            <p className="text-content-subtle">1. Define physical handoff</p>
            <p className="text-emerald-700">
              workflow &quot;Morning Dock Loadout&quot; &#123;
            </p>
            <p className="pl-6 text-content">
              bay: &quot;Bay-04&quot;, vehicles: 18, check_manifest: strict
            </p>
            <p className="pl-6 text-content">
              on_variance: trigger_supervisor_override()
            </p>
            <p className="text-emerald-700">&#125;</p>

            <p className="text-content-subtle pt-4">2. Generated interactive view</p>
            <div className="rounded-lg border border-surface-border bg-surface p-4 font-sans text-sm text-content">
              <div className="flex items-center justify-between">
                <span className="font-semibold text-content">Dispatch Dock View (18 Drivers Active)</span>
                <span className="text-xs font-mono text-emerald-700 bg-emerald-50 px-2 py-2 rounded">
                  Manifest Verified
                </span>
              </div>
              <p className="text-xs text-content-muted mt-2">
                Drivers tap to verify carton tallies directly on warehouse tablets.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
