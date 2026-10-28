"use client";

import React from "react";
import { Reveal } from "./Reveal";

/**
 * "Why Vectis exists" — the opening editorial statement in the neutral page rhythm.
 */
export default function StatementSection() {
  return (
    <section
      id="why-we-exist"
      className="relative isolate overflow-hidden bg-canvas text-char py-28 sm:py-36"
    >
      <span id="what-we-build" className="absolute -top-24" aria-hidden="true" />

      <div className="relative z-10 mx-auto max-w-shell px-6 sm:px-8 lg:px-12">
        <Reveal className="flex items-center justify-between gap-6 border-b border-char/15 pb-6">
          <span className="eyebrow eyebrow-light">Why Vectis exists</span>
          <span className="section-index hidden sm:block">01 / 06 — Why we exist</span>
        </Reveal>

        <Reveal delay={0.08} className="mt-12 max-w-5xl">
          <h2 className="font-serif text-[clamp(2.4rem,5.7vw,5.2rem)] font-normal leading-[1.03] tracking-[-0.032em] text-char">
            Good software meets real work where it happens.
          </h2>
        </Reveal>

        <div className="mt-16 grid grid-cols-1 gap-10 border-t border-char/15 pt-10 md:grid-cols-2 md:gap-16">
          <Reveal delay={0.1}>
            <span className="mb-6 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-brass-deep">
              01
            </span>
            <p className="text-lg leading-[1.75] text-char sm:text-xl">
              A growing business rarely follows a neat diagram. Teams juggle disconnected tools, repetitive handoffs, and decisions made with incomplete information.
            </p>
          </Reveal>
          <Reveal delay={0.2} className="md:border-l md:border-char/15 md:pl-16">
            <span className="mb-6 block font-mono text-[0.65rem] uppercase tracking-[0.2em] text-brass-deep">
              02
            </span>
            <p className="text-lg leading-[1.75] text-char-soft sm:text-xl">
              We build custom software, web applications, and practical AI automation around the way people actually work—so technology removes busywork instead of adding another layer.
            </p>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
