"use client";

import React, { useRef, useState } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValueEvent,
  useScroll,
  useSpring,
  useTransform,
} from "framer-motion";
import { operationalPillars } from "@/data/vectis";
import { dayStageMedia } from "@/data/home";
import { Reveal, RevealImage } from "./Reveal";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";

/**
 * Scroll-linked "The day" story.
 * A sticky image panel swaps through the four operational stages.
 * On smaller screens the panel is replaced by inline image reveals.
 */
export default function DayNarrative() {
  const sectionRef = useRef<HTMLElement>(null);
  const reduce = useHydratedReducedMotion();
  const [active, setActive] = useState(0);

  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ["start start", "end end"],
  });
  const smooth = useSpring(scrollYProgress, { stiffness: 90, damping: 26, mass: 0.4 });
  const lineScale = useTransform(smooth, [0, 1], [0, 1]);

  useMotionValueEvent(smooth, "change", (v) => {
    const next = Math.min(operationalPillars.length - 1, Math.max(0, Math.floor(v * operationalPillars.length)));
    setActive((current) => (current === next ? current : next));
  });

  return (
    <section
      ref={sectionRef}
      id="the-day"
      className="relative isolate overflow-hidden bg-bg py-16 text-text sm:py-20"
    >

      <div className="relative z-10 mx-auto max-w-shell px-6 sm:px-8 lg:px-12">
        {/* Section header */}
        <div className="flex flex-col gap-8 border-b border-paper/[0.12] pb-12 lg:flex-row lg:items-end lg:justify-between">
          <Reveal className="max-w-2xl">
            <span className="eyebrow eyebrow-dark">The day</span>
            <h2 className="mt-6 font-serif text-[clamp(2.4rem,5.4vw,4.8rem)] font-normal leading-[1.04] tracking-[-0.03em] text-paper">
              Good software has a thoughtful path.
            </h2>
          </Reveal>
          <Reveal delay={0.12} className="max-w-md">
            <p className="text-base leading-relaxed text-muted sm:text-lg">
              We move from understanding the work to supporting a product in use—keeping the decisions grounded and the process clear.
            </p>
            <span className="section-index mt-6 block">02 / 06 — The day</span>
          </Reveal>
        </div>

        <div className="mt-14 grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          {/* --------------------- Sticky image panel (desktop) ------------- */}
          <div className="hidden lg:col-span-6 lg:block xl:col-span-6">
            <div className="sticky top-[calc(var(--header-h)+28px)]">
              <div className="relative h-[min(72vh,680px)] overflow-hidden rounded-panel border border-paper/10 bg-ink-card shadow-soft">
                {dayStageMedia.map((stage, i) => (
                  <motion.div
                    key={stage.image.src}
                    className="absolute inset-0"
                    initial={false}
                    animate={{
                      opacity: active === i ? 1 : 0,
                      scale: 1,
                    }}
                    transition={{ duration: reduce ? 0 : 0.3, ease: [0.22, 1, 0.36, 1] }}
                    aria-hidden={active !== i}
                  >
                    <Image
                      src={stage.image.src}
                      alt={stage.image.alt}
                      fill
                      sizes="(min-width: 1024px) 48vw, 100vw"
                      quality={80}
                      placeholder="blur"
                      blurDataURL={stage.image.blurDataURL}
                      className="object-cover"
                    />

                  </motion.div>
                ))}

                {/* Panel chrome */}
                <div className="pointer-events-none absolute inset-0 bg-dark/65" aria-hidden="true" />
                <p className="absolute left-6 top-6 text-sm font-medium text-darkText">
                  Project stage · {String(active + 1).padStart(2, "0")} / 04
                </p>
                <div className="absolute bottom-7 left-7 right-7 flex items-end justify-between gap-4">
                  <div>
                    <span className="eyebrow block text-darkText/80">The day</span>
                    <p className="mt-2 font-serif text-3xl text-darkText">
                      {operationalPillars[active].phase}
                    </p>
                  </div>
                  <span className="font-mono text-[0.65rem] uppercase tracking-[0.16em] text-darkText/80">
                    {operationalPillars[active].tag}
                  </span>
                </div>
              </div>

              {/* Drawn progress rail */}
              <div className="mt-6 flex items-center gap-4">
                <div className="relative h-px flex-1 bg-paper/15">
                  <motion.div
                    className="absolute inset-0 origin-left bg-brass-light"
                    style={{ scaleX: reduce ? 1 : lineScale }}
                    aria-hidden="true"
                  />
                </div>
                <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted">
                  Discovery → Support
                </span>
              </div>
            </div>
          </div>

          {/* --------------------------- Story stages ----------------------- */}
          <div className="lg:col-span-6 xl:col-span-6">
            {operationalPillars.map((stage, i) => (
              <article
                key={stage.phase}
                className="relative flex min-h-[62vh] flex-col justify-center border-b border-border py-12 lg:min-h-[78vh] lg:py-16"
              >
                {/* Stage marker */}
                <div className="mb-8 flex items-center gap-4">
                  <span
                    className={`font-mono text-[0.68rem] uppercase tracking-[0.2em] transition-colors duration-300 ${
                      active === i ? "text-brass-light" : "text-muted-dark"
                    }`}
                  >
                    0{i + 1}
                  </span>
                  <span
                    className={`h-px flex-1 origin-left transition-transform duration-300 ${
                      active === i ? "scale-x-100 bg-brass-light" : "scale-x-0 bg-paper/20"
                    }`}
                  />
                  <span className="font-mono text-[0.62rem] uppercase tracking-[0.16em] text-muted-dark">
                    {stage.tag}
                  </span>
                </div>

                <Reveal delay={0.04}>
                  <span className="eyebrow eyebrow-dark block">{stage.phase}</span>
                  <h3 className="mt-4 font-serif text-[clamp(2rem,3.7vw,3.4rem)] leading-[1.08] tracking-[-0.028em] text-paper">
                    {stage.title}
                  </h3>
                  <p className="mt-6 max-w-lg text-base leading-relaxed text-muted sm:text-lg">
                    {stage.description}
                  </p>
                </Reveal>

                {/* Mobile inline image (sticky panel is desktop-only) */}
                <div className="mt-10 overflow-hidden rounded-card lg:hidden">
                  <RevealImage className="relative aspect-[16/10]">
                    <Image
                      src={dayStageMedia[i].image.src}
                      alt={dayStageMedia[i].image.alt}
                      fill
                      sizes="100vw"
                      quality={78}
                      placeholder="blur"
                      blurDataURL={dayStageMedia[i].image.blurDataURL}
                      className="object-cover"
                    />

                  </RevealImage>
                </div>

                <div className="mt-8 flex items-center justify-between font-mono text-[0.62rem] uppercase tracking-[0.14em] text-muted-dark">
                  <span>Real-world fit</span>
                  <span>In focus</span>
                </div>
              </article>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
