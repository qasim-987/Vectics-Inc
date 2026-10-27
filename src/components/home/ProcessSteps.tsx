"use client";

import React, { useRef, useState } from "react";
import {
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
  useSpring,
} from "framer-motion";
import { processSteps } from "@/data/vectis";
import Atmosphere from "./Atmosphere";
import { Reveal } from "./Reveal";

/** "From problem to product" — a five-step loop with a scroll-drawn rail. */
export default function ProcessSteps() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useReducedMotion();
  const [activeStep, setActiveStep] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start 0.78", "end 0.6"],
  });
  const drawn = useSpring(scrollYProgress, { stiffness: 110, damping: 28, mass: 0.35 });

  useMotionValueEvent(drawn, "change", (v) => {
    const next = Math.min(
      processSteps.length - 1,
      Math.max(0, Math.floor(v * processSteps.length))
    );
    setActiveStep((current) => (current === next ? current : next));
  });

  return (
    <section
      ref={sectionRef}
      id="process"
      className="relative isolate overflow-hidden border-t border-paper/[0.08] bg-ink-deep py-24 text-paper sm:py-32"
    >
      <Atmosphere tone="dark" grid />

      <div className="relative z-10 mx-auto max-w-shell px-5 sm:px-8 lg:px-12">
        <div className="grid grid-cols-1 gap-8 border-b border-paper/[0.12] pb-14 lg:grid-cols-12 lg:items-end">
          <Reveal className="lg:col-span-8">
            <span className="eyebrow eyebrow-dark">The loop</span>
            <h2 className="mt-5 font-serif text-[clamp(2.3rem,5.2vw,4.6rem)] leading-[1.04] tracking-[-0.03em] text-paper">
              From problem to <span className="italic text-brass-light">product.</span>
            </h2>
          </Reveal>
          <Reveal delay={0.12} className="lg:col-span-4 lg:pl-8">
            <p className="text-base leading-relaxed text-muted">
              Each product starts with a concrete operational problem and stays close to the people
              who run it until the software earns its place.
            </p>
            <span className="section-index mt-6 block">05 / 06 — The loop</span>
          </Reveal>
        </div>

        <Reveal className="mt-12">
          <h3 className="eyebrow text-muted-dark">Operational Delivery Framework</h3>
        </Reveal>

        <div className="relative mt-10">
          {/* -------------------- Drawn rails -------------------- */}
          {/* Desktop: horizontal rail */}
          <div className="pointer-events-none absolute left-0 right-0 top-[22px] hidden h-px bg-paper/[0.12] lg:block" aria-hidden="true">
            <motion.div
              className="h-px w-full origin-left bg-brass-light"
              style={{ scaleX: reduce ? 1 : drawn }}
            />
          </div>
          {/* Mobile: vertical rail */}
          <div className="pointer-events-none absolute bottom-6 left-[21px] top-6 w-px bg-paper/[0.12] lg:hidden" aria-hidden="true">
            <motion.div
              className="h-full w-px origin-top bg-brass-light"
              style={{ scaleY: reduce ? 1 : drawn }}
            />
          </div>

          <ol className="grid grid-cols-1 gap-8 lg:grid-cols-5 lg:gap-7">
            {processSteps.map((step, i) => {
              const isActive = i <= activeStep;
              return (
                <li key={step.num} className="relative pl-14 lg:pl-0">
                  {/* Marker */}
                  <span
                    className={`absolute left-0 top-0 flex h-11 w-11 items-center justify-center rounded-full border font-mono text-[0.66rem] tracking-[0.08em] transition-transform duration-500 lg:relative lg:left-auto lg:top-auto ${
                      isActive
                        ? "border-brass/60 text-brass-light"
                        : "border-paper/15 text-muted-dark"
                    }`}
                    aria-hidden="true"
                  >
                    {/* Brass fill fades in as the step activates (opacity only) */}
                    <span
                      className={`absolute inset-0 rounded-full bg-brass/[0.12] transition-opacity duration-700 ${
                        isActive ? "opacity-100" : "opacity-0"
                      }`}
                    />
                    <span className="relative">{step.num}</span>
                  </span>

                  <Reveal delay={i * 0.08} className="lg:mt-7">
                    <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-dark">
                      Step {step.num}
                    </span>
                    <h4 className="mt-2 font-serif text-2xl text-paper sm:text-[1.7rem]">
                      {step.name}
                    </h4>
                    <p className="mt-3 text-sm leading-relaxed text-muted">{step.desc}</p>
                  </Reveal>
                </li>
              );
            })}
          </ol>
        </div>

        <Reveal delay={0.1} className="mt-16 flex items-center gap-4">
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-muted-dark">
            Observe → Map → Build → Use → Improve → Observe
          </span>
          <span className="h-px flex-1 bg-paper/10" aria-hidden="true" />
          <span className="font-mono text-[0.62rem] uppercase tracking-[0.18em] text-brass-light">
            Continuous
          </span>
        </Reveal>
      </div>
    </section>
  );
}
