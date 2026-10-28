"use client";

import React from "react";
import { principles } from "@/data/vectis";
import { Reveal } from "./Reveal";

/** Four principles with a cursor-tracking spotlight + bottom-up fill sweep. */
export default function PrinciplesSection() {


  return (
    <section
      id="principles"
      className="relative isolate overflow-hidden bg-bg py-16 text-text sm:py-20"
    >
      <span id="approach" className="absolute -top-24" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-shell px-6 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-8 border-b border-paper/[0.12] pb-14 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-8">
            <span className="eyebrow eyebrow-dark">How we work</span>
            <h2 className="mt-6 font-serif text-[clamp(2.4rem,5.4vw,4.8rem)] leading-[1.03] tracking-[-0.03em] text-paper">
              Guided by <span className="text-brass-light">what matters.</span>
            </h2>
            <p className="mt-4 font-serif text-xl text-muted sm:text-2xl">
              The standards behind the work
            </p>
          </Reveal>
          <Reveal delay={0.12} className="lg:col-span-4 lg:pl-8">
            <p className="text-base leading-relaxed text-muted">
              Our work is guided by a few durable principles: stay clear, solve the actual problem, and take responsibility for what ships.
            </p>
            <span className="section-index mt-6 block">04 / 06 — How we work</span>
          </Reveal>
        </div>

        <Reveal className="mt-14">
          <h3 className="eyebrow text-muted-dark">How we work</h3>
        </Reveal>

        <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((principle, i) => (
            <Reveal key={principle.num} delay={i * 0.09} className="h-full">
              <div
                className="h-full rounded-card border border-border bg-surface p-6 shadow-soft sm:p-8"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-2xl font-light text-brass-light/85">
                    {principle.num}
                  </span>
                </div>

                <h4 className="mt-10 font-serif text-[1.85rem] leading-tight text-paper">
                  {principle.name}
                </h4>
                <p className="mt-2 font-mono text-[0.64rem] uppercase tracking-[0.12em] text-brass-light">
                  {principle.headline}
                </p>
                <p className="mt-6 text-sm leading-relaxed text-muted">{principle.desc}</p>

                <span className="mt-8 block border-t border-border" aria-hidden="true" />
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
