"use client";

import React from "react";
import { processSteps } from "@/data/vectis";
import { Reveal } from "./Reveal";

/** Five-stage delivery loop on the shared neutral surface. */
export default function ProcessSteps() {
  return (
    <section
      id="process"
      className="relative isolate overflow-hidden border-t border-border bg-bg py-16 text-text sm:py-20"
    >
      <div className="relative z-10 mx-auto max-w-shell px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-8 border-b border-border pb-12 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-8">
            <span className="eyebrow">The loop</span>
            <h2 className="mt-6 text-text">
              Turn practical needs into <span className="text-accent">useful tools.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12} className="lg:col-span-4 lg:pl-8">
            <p className="text-base leading-7 text-text-muted">
              Every engagement starts with a real business need and stays close to the people who use the result, from first discovery through continued improvement.
            </p>
            <span className="section-index mt-6 block">05 / 06 — The loop</span>
          </Reveal>
        </div>

        <Reveal className="mt-12">
          <h3 className="eyebrow text-text-muted">A practical delivery framework</h3>
        </Reveal>

        <div className="relative mt-8">
          <div className="pointer-events-none absolute left-0 right-0 top-6 hidden h-px bg-border lg:block" aria-hidden="true" />
          <div className="pointer-events-none absolute bottom-6 left-6 top-6 w-px bg-border lg:hidden" aria-hidden="true" />

          <ol className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-6">
            {processSteps.map((step, index) => (
              <li key={step.num} className="relative pl-16 lg:pl-0">
                <span
                  className="absolute left-0 top-0 z-10 inline-flex h-12 w-12 items-center justify-center rounded-md border border-border bg-surface text-sm font-medium text-text lg:relative lg:left-auto lg:top-auto"
                  aria-hidden="true"
                >
                  {step.num}
                </span>
                <Reveal delay={Math.min(index * 0.04, 0.16)} className="lg:mt-6">
                  <span className="text-sm text-text-muted">Step {step.num}</span>
                  <h4 className="mt-2 text-text">{step.name}</h4>
                  <p className="mt-4 text-sm leading-6 text-text-muted">{step.desc}</p>
                </Reveal>
              </li>
            ))}
          </ol>
        </div>

        <Reveal delay={0.1} className="mt-12 flex items-center gap-4">
          <span className="text-sm text-text-muted">
            Discover → Plan → Build → Launch → Improve → Discover
          </span>
          <span className="h-px flex-1 bg-border" aria-hidden="true" />
          <span className="text-sm font-medium text-accent">Continuous</span>
        </Reveal>
      </div>
    </section>
  );
}
