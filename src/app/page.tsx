"use client";

import React, { useState } from "react";
import Link from "next/link";
import { ArrowRight, Play, Pause, CheckCircle2, ChevronRight, Layers, BarChart3, Terminal } from "lucide-react";
import { productsData, operationalPillars, principles, processSteps } from "@/data/vectis";

export default function HomePage() {
  const [isKenburnsPaused, setIsKenburnsPaused] = useState(false);

  return (
    <div className="w-full">
      {/* 1. HERO SECTION */}
      <section className="relative min-h-[92vh] sm:min-h-screen flex flex-col justify-end overflow-hidden pb-16 pt-32 sm:pb-24 sm:pt-40">
        {/* Animated Background with Ken-Burns Motion */}
        <div
          className={`absolute inset-0 -z-20 hero-kenburns ${isKenburnsPaused ? "is-paused" : ""}`}
          style={{
            backgroundImage: "linear-gradient(120deg, #10263a 0%, #193950 65%, #102a40 100%)",
          }}
        >
          {/* Subtle architectural grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.035]"
            style={{
              backgroundImage: "linear-gradient(#d6e4ee 1px, transparent 1px), linear-gradient(90deg, #d6e4ee 1px, transparent 1px)",
              backgroundSize: "64px 64px",
            }}
          />
        </div>

        <div className="mx-auto w-full max-w-[1180px] px-5 md:px-8">
          <div className="max-w-3xl">
            {/* Eyebrow */}
            <div className="hero-enter hero-enter-eyebrow">
              <span className="inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/[0.04] px-3.5 py-1 text-xs font-mono tracking-widest text-paper/80 uppercase">
                <span className="h-1.5 w-1.5 rounded-full bg-brand-light" />
                Vectis Inc. — Operational Software Studio
              </span>
            </div>

            {/* Headline */}
            <h1 className="mt-6 text-4xl sm:text-6xl md:text-7xl font-serif font-normal tracking-tight text-paper leading-[1.08]">
              <span className="block hero-enter hero-enter-line">
                Software for the work
              </span>
              <span className="block hero-enter hero-enter-line-2 italic text-paper/90">
                that moves the world.
              </span>
            </h1>

            {/* Lede */}
            <p className="hero-enter hero-enter-lede mt-6 text-lg sm:text-xl text-muted font-normal leading-relaxed max-w-2xl">
              We build focused software for operational businesses. Tools for the distributor office, the warehouse bay, and the road—starting with daily route distribution.
            </p>

            {/* CTA Buttons */}
            <div className="hero-enter hero-enter-cta mt-8 flex flex-wrap items-center gap-4">
              <Link
                href="/distributionlife"
                className="group inline-flex items-center gap-2.5 rounded-full bg-paper px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-ink transition-all hover:bg-paper-muted hover:shadow-lg active:scale-95"
              >
                <span>Explore RouteCore</span>
                <ArrowRight className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </Link>
              <Link
                href="#principles"
                className="inline-flex items-center gap-2 rounded-full border border-white/15 px-6 py-3.5 text-xs font-mono uppercase tracking-wider text-paper/80 transition-colors hover:border-white/30 hover:text-paper"
              >
                See how we work
              </Link>
            </div>
          </div>
        </div>

        {/* Ken-Burns Pause / Play Motion Control */}
        <div className="absolute bottom-6 right-6 z-10 hidden sm:block">
          <button
            onClick={() => setIsKenburnsPaused(!isKenburnsPaused)}
            className="cine-pause flex items-center gap-2 rounded-full border border-white/10 bg-ink-card/60 backdrop-blur-md px-3.5 py-1.5 text-xs font-mono text-muted hover:text-paper hover:border-white/25 transition-all"
            aria-label={isKenburnsPaused ? "Play background motion" : "Pause background motion"}
            title={isKenburnsPaused ? "Play motion" : "Pause motion"}
          >
            {isKenburnsPaused ? (
              <>
                <Play className="h-3 w-3 text-paper" />
                <span className="text-[0.7rem] uppercase tracking-wider">Play Motion</span>
              </>
            ) : (
              <>
                <Pause className="h-3 w-3 text-muted" />
                <span className="text-[0.7rem] uppercase tracking-wider">Pause Motion</span>
              </>
            )}
          </button>
        </div>
      </section>

      {/* 2. STATEMENT SECTION: WHY VECTIS EXISTS */}
      <section className="border-t border-surface-border py-24 sm:py-32 bg-surface">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8">
          <div className="reveal">
            <span className="text-[0.78rem] font-mono uppercase tracking-[0.18em] text-brand">
              // Why Vectis exists
            </span>
            <h2 className="mt-4 text-3xl sm:text-5xl font-serif font-normal tracking-tight text-content max-w-3xl leading-[1.15]">
              Operations rarely happen in clean rows.
            </h2>
          </div>

          <div className="reveal mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 md:gap-16 pt-8 border-t border-surface-border">
            <p className="text-base sm:text-lg text-content-muted font-normal leading-relaxed">
              Warehouses have damaged cartons and split load-outs. Drivers encounter urban gridlock, partial deliveries, and impromptu credit renegotiations. Retail kiosks pay in crumpled currency, deferred bank checks, and handwritten counterfoil notes.
            </p>
            <p className="text-base sm:text-lg text-content-muted font-normal leading-relaxed">
              Most enterprise software collapses when physical reality gets messy. We spend our mornings on the loading bays and our evenings at the cashier's desk, building durable software that stands up under operational pressure and ensures teams close the day accurately.
            </p>
          </div>
        </div>
      </section>

      {/* 3. SCROLL STORYTELLING SECTION: THE DAY */}
      <section className="border-t border-surface-border py-24 sm:py-32 bg-surface-muted">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8">
          <div className="reveal flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16">
            <div>
              <span className="text-[0.78rem] font-mono uppercase tracking-[0.18em] text-brand">
                // The day
              </span>
              <h2 className="mt-3 text-3xl sm:text-5xl font-serif font-normal tracking-tight text-content">
                The operation has a shape.
              </h2>
            </div>
            <p className="text-sm sm:text-base text-content-muted max-w-md">
              From the 5:30 AM warehouse count to the final bank ledger printout at nightfall, each operational hour has its own imperative.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {operationalPillars.map((item, index) => (
              <div
                key={item.phase}
                className="reveal group rounded-xl border border-surface-border bg-surface p-6 sm:p-7 flex flex-col justify-between hover:border-brand/40 transition-all hover:bg-surface"
                style={{ transitionDelay: `${index * 80}ms` }}
              >
                <div>
                  <div className="flex items-center justify-between mb-6">
                    <span className="font-mono text-xs uppercase tracking-widest text-brand">
                      0{index + 1} {item.phase}
                    </span>
                    <span className="rounded-full border border-surface-border px-2.5 py-0.5 text-[0.68rem] font-mono text-content-muted">
                      {item.tag}
                    </span>
                  </div>
                  <h3 className="text-xl font-medium tracking-tight text-content mb-3">
                    {item.title}
                  </h3>
                  <p className="text-sm text-content-muted leading-relaxed">
                    {item.description}
                  </p>
                </div>
                <div className="mt-8 pt-4 border-t border-surface-border flex items-center justify-between text-xs text-content-subtle font-mono">
                  <span>Physical handoff</span>
                  <span>Verified</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 4. PRODUCTS SECTION */}
      <section id="products" className="border-t border-surface-border py-24 sm:py-32 bg-surface">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8">
          <div className="reveal mb-16">
            <span className="text-[0.78rem] font-mono uppercase tracking-[0.18em] text-brand">
              // Products
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-serif font-normal tracking-tight text-content">
              What we’re building.
            </h2>
            <p className="mt-3 text-base sm:text-lg text-content-muted max-w-2xl">
              Software crafted for physical commerce and operational truth. One flagship desktop system live in daily operations, and two companion products in active development.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {productsData.map((prod, idx) => (
              <div
                key={prod.id}
                className="reveal group rounded-2xl border border-surface-border bg-surface p-7 sm:p-8 flex flex-col justify-between hover:border-brand/40 transition-all hover:shadow-lg hover:shadow-slate-200/60 relative overflow-hidden"
                style={{ transitionDelay: `${idx * 100}ms` }}
              >
                <div>
                  {/* Status Badge */}
                  <div className="flex items-center justify-between mb-6">
                    <span className="text-xs font-mono uppercase tracking-wider text-content-subtle">
                      Product 0{idx + 1}
                    </span>
                    <span
                      className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${
                        prod.statusBadge === "Live"
                          ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                          : "bg-slate-100 text-slate-700 border border-slate-200"
                      }`}
                    >
                      <span
                        className={`h-1.5 w-1.5 rounded-full ${
                          prod.statusBadge === "Live" ? "bg-emerald-600" : "bg-slate-500"
                        }`}
                      />
                      {prod.statusBadge}
                    </span>
                  </div>

                  {/* Icon Representation */}
                  <div className="mb-4 text-brand group-hover:text-brand transition-colors">
                    {prod.id === "routecore" && <Layers className="h-7 w-7" />}
                    {prod.id === "pulsegrid" && <BarChart3 className="h-7 w-7" />}
                    {prod.id === "vectis-studio" && <Terminal className="h-7 w-7" />}
                  </div>

                  <h3 className="text-2xl font-serif font-normal text-content mb-3">
                    {prod.name}
                  </h3>
                  <p className="text-xs font-mono text-content-muted mb-4 uppercase tracking-wider">
                    {prod.headline}
                  </p>
                  <p className="text-sm text-content-muted leading-relaxed font-normal">
                    {prod.shortDesc}
                  </p>
                </div>

                <div className="mt-8 pt-6 border-t border-surface-border">
                  <Link
                    href={`/${prod.slug}`}
                    className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-content group-hover:text-brand transition-colors"
                  >
                    <span>Explore {prod.name}</span>
                    <ArrowRight className="h-3.5 w-3.5 transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5. PRINCIPLES & PROCESS SECTION */}
      <section id="principles" className="border-t border-surface-border py-24 sm:py-32 bg-surface-muted">
        <div className="mx-auto max-w-[1180px] px-5 md:px-8">
          <div className="reveal mb-16">
            <span className="text-[0.78rem] font-mono uppercase tracking-[0.18em] text-brand">
              // How we work
            </span>
            <h2 className="mt-3 text-3xl sm:text-5xl font-serif font-normal tracking-tight text-content">
              Principles & Process
            </h2>
            <p className="mt-3 text-base sm:text-lg text-content-muted max-w-2xl">
              We design tools directly from warehouse observations. Four foundational convictions guide our software, translated through a five-step execution model.
            </p>
          </div>

          {/* 4 Core Principles */}
          <div className="mb-20">
            <h3 className="reveal text-xs font-mono uppercase tracking-[0.2em] text-content-subtle mb-8">
              Four Core Convictions
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {principles.map((pr, i) => (
                <div
                  key={pr.num}
                  className="reveal rounded-xl border border-surface-border bg-surface p-6 hover:border-brand/40 transition-all"
                  style={{ transitionDelay: `${i * 70}ms` }}
                >
                  <span className="font-mono text-2xl text-brand/80 font-light block mb-4">
                    {pr.num}
                  </span>
                  <h4 className="text-lg font-medium text-content mb-2">{pr.headline}</h4>
                  <p className="text-sm text-content-muted leading-relaxed">{pr.desc}</p>
                </div>
              ))}
            </div>
          </div>

          {/* 5 Process Steps */}
          <div>
            <h3 className="reveal text-xs font-mono uppercase tracking-[0.2em] text-content-subtle mb-8">
              Operational Delivery Framework
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
              {processSteps.map((step, i) => (
                <div
                  key={step.num}
                  className="reveal rounded-lg border border-surface-border bg-surface p-5 hover:bg-surface transition-all"
                  style={{ transitionDelay: `${i * 60}ms` }}
                >
                  <span className="font-mono text-xs uppercase tracking-widest text-content-subtle block mb-2">
                    Step {step.num}
                  </span>
                  <h5 className="text-base font-semibold text-content mb-2">{step.name}</h5>
                  <p className="text-xs text-content-muted leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
