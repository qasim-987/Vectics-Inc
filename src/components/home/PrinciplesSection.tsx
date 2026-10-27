"use client";

import React from "react";
import { principles } from "@/data/vectis";
import Atmosphere from "./Atmosphere";
import { Reveal } from "./Reveal";

/** Four principles with a cursor-tracking spotlight + bottom-up fill sweep. */
export default function PrinciplesSection() {
  const trackPointer = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    e.currentTarget.style.setProperty("--mx", `${e.clientX - rect.left}px`);
    e.currentTarget.style.setProperty("--my", `${e.clientY - rect.top}px`);
  };

  return (
    <section
      id="principles"
      className="relative isolate overflow-hidden bg-ink-soft py-24 text-paper sm:py-32"
    >
      <span id="approach" className="absolute -top-24" aria-hidden="true" />
      <Atmosphere tone="dark" routes />

      <div className="relative z-10 mx-auto max-w-shell px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-8 border-b border-paper/[0.12] pb-14 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-8">
            <span className="eyebrow eyebrow-dark">// How we work</span>
            <h2 className="mt-5 font-serif text-[clamp(2.4rem,5.4vw,4.8rem)] leading-[1.03] tracking-[-0.03em] text-paper">
              Built with <span className="italic text-brass-light">purpose.</span>
            </h2>
            <p className="mt-4 font-serif text-xl italic text-muted sm:text-2xl">
              Principles &amp; Process
            </p>
          </Reveal>
          <Reveal delay={0.12} className="lg:col-span-4 lg:pl-8">
            <p className="text-base leading-relaxed text-muted">
              We design tools directly from warehouse observations. Four foundational convictions
              guide our software, translated through a five-step execution model.
            </p>
            <span className="section-index mt-6 block">04 / 06 — How we work</span>
          </Reveal>
        </div>

        <Reveal className="mt-14">
          <h3 className="eyebrow text-muted-dark">Four Core Convictions</h3>
        </Reveal>

        <div className="mt-7 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {principles.map((principle, i) => (
            <Reveal key={principle.num} delay={i * 0.09} className="h-full">
              <div
                onMouseMove={trackPointer}
                className="spotlight-card group h-full rounded-card border border-paper/[0.1] bg-ink-card/45 p-6 shadow-soft transition-[transform,border-color,box-shadow] duration-500 ease-expo hover:-translate-y-1.5 hover:border-brass/35 hover:shadow-lift sm:p-7"
              >
                <div className="flex items-start justify-between">
                  <span className="font-mono text-2xl font-light text-brass-light/85">
                    {principle.num}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-brass/60 transition-transform duration-500 group-hover:scale-150" />
                </div>

                <h4 className="mt-10 font-serif text-[1.85rem] leading-tight text-paper">
                  {principle.name}
                </h4>
                <p className="mt-2 font-mono text-[0.64rem] uppercase tracking-[0.12em] text-brass-light">
                  {principle.headline}
                </p>
                <p className="mt-5 text-sm leading-relaxed text-muted">{principle.desc}</p>

                <span className="mt-9 block h-px w-full bg-paper/10">
                  <span className="block h-px origin-left scale-x-0 bg-brass-light transition-transform duration-700 ease-expo group-hover:scale-x-100" />
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
