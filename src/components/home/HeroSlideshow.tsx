"use client";

import React, { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";
import useEmblaCarousel from "embla-carousel-react";
import Autoplay from "embla-carousel-autoplay";
import Fade from "embla-carousel-fade";
import { motion } from "framer-motion";
import { heroSlides } from "@/data/home";
import MagneticLink from "./MagneticLink";
import { useHydratedReducedMotion } from "./useHydratedReducedMotion";

const SLIDE_DURATION = 5600;
const EASE = [0.22, 1, 0.36, 1] as const;

// Keep the headline split at the intended line break for the mask reveal.
const HEADLINE_LINES = ["Build for the work", "that matters next."];

const wordVariants = {
  hidden: { y: "112%", opacity: 0 },
  show: (i: number) => ({
    y: "0%",
    opacity: 1,
    transition: { duration: 0.9, delay: 0.08 + i * 0.055, ease: EASE },
  }),
};

/**
 * Full-viewport operational slideshow.
 * Embla (Fade + Autoplay) drives the crossfade; Framer Motion replays the
 * word-mask headline on every slide change. Only transform/opacity animate.
 */
export default function HeroSlideshow() {
  const reduce = useHydratedReducedMotion();
  const [selected, setSelected] = useState(0);
  const [cycle, setCycle] = useState(0);
  const [manualPaused, setManualPaused] = useState(false);
  const [hovered, setHovered] = useState(false);
  const [enginePaused, setEnginePaused] = useState(false);
  const sectionRef = useRef<HTMLElement>(null);

  const plugins = useMemo(
    () => [
      Fade(),
      Autoplay({
        delay: SLIDE_DURATION,
        stopOnInteraction: false,
        stopOnMouseEnter: false, // handled on the whole hero, not just the image layer
        stopOnFocusIn: true,
        playOnInit: true,
        jump: false,
      }),
    ],
    []
  );

  const [emblaRef, emblaApi] = useEmblaCarousel(
    { loop: true, duration: 48, align: "center", watchDrag: false },
    plugins
  );

  const autoplay = emblaApi?.plugins()?.autoplay;
  // The engine state keeps the CSS progress bar in sync with autoplay's own
  // pause on focus / tab visibility.
  const isPaused = manualPaused || hovered || enginePaused || Boolean(reduce);

  const onSelect = useCallback((api: typeof emblaApi) => {
    if (!api) return;
    setSelected(api.selectedScrollSnap());
    setCycle((c) => c + 1);
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    onSelect(emblaApi);
    emblaApi.on("select", onSelect).on("reInit", onSelect);
    const onPlay = () => {
      setEnginePaused(false);
      setCycle((c) => c + 1); // restart the CSS progress bar in sync
    };
    const onStop = () => setEnginePaused(true);
    emblaApi.on("autoplay:play", onPlay).on("autoplay:stop", onStop);

    return () => {
      emblaApi
        .off("select", onSelect)
        .off("reInit", onSelect)
        .off("autoplay:play", onPlay)
        .off("autoplay:stop", onStop);
    };
  }, [emblaApi, onSelect]);

  // Reduced-motion: no autoplay, no Ken Burns, no progress animation.
  useEffect(() => {
    if (!autoplay) return;
    if (reduce) autoplay.stop();
    else if (!manualPaused && !hovered) autoplay.play();
    else autoplay.stop();
  }, [autoplay, reduce, manualPaused, hovered]);

  const goTo = useCallback(
    (index: number) => {
      if (!emblaApi) return;
      emblaApi.scrollTo(index);
      emblaApi.plugins()?.autoplay?.reset();
    },
    [emblaApi]
  );

  const next = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollNext();
    emblaApi.plugins()?.autoplay?.reset();
  }, [emblaApi]);

  const prev = useCallback(() => {
    if (!emblaApi) return;
    emblaApi.scrollPrev();
    emblaApi.plugins()?.autoplay?.reset();
  }, [emblaApi]);

  const togglePause = () => {
    setManualPaused((p) => {
      const nextPaused = !p;
      if (nextPaused) autoplay?.stop();
      else autoplay?.play(); // the autoplay:play handler restarts the progress bar
      return nextPaused;
    });
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLElement>) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      prev();
    } else if (e.key === "ArrowRight") {
      e.preventDefault();
      next();
    } else if (e.key === "Home") {
      e.preventDefault();
      goTo(0);
    } else if (e.key === "End") {
      e.preventDefault();
      goTo(heroSlides.length - 1);
    }
  };

  let wordIndex = 0;

  return (
    <section
      ref={sectionRef}
      id="hero"
      aria-roledescription="carousel"
      aria-label="Operational imagery"
      onKeyDown={onKeyDown}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      className={`relative isolate flex min-h-[100svh] flex-col justify-end overflow-hidden bg-ink-deep pt-28 pb-20 sm:pt-32 sm:pb-24 ${
        isPaused ? "is-motion-paused" : ""
      }`}
      style={{ "--slide-duration": `${SLIDE_DURATION}ms` } as React.CSSProperties}
    >
      {/* ------------------------------- Slides ------------------------------- */}
      <div className="embla" ref={emblaRef}>
        <div className="embla__container">
          {heroSlides.map((slide, index) => (
            <div
              className={`embla__slide ${selected === index ? "is-active" : ""}`}
              key={slide.src}
              role="group"
              aria-roledescription="slide"
              aria-label={`${index + 1} of ${heroSlides.length}: ${slide.label}`}
              aria-hidden={selected !== index}
            >
              <div className="hero-kenburns-inner absolute inset-0">
                <Image
                  src={slide.src}
                  alt={slide.alt}
                  fill
                  priority={index === 0}
                  loading={index === 0 ? undefined : "lazy"}
                  fetchPriority={index === 0 ? "high" : "auto"}
                  sizes="100vw"
                  quality={82}
                  placeholder="blur"
                  blurDataURL={slide.blurDataURL}
                  className="object-cover saturate-[0.8]"
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ------------------------- Legibility overlays ----------------------- */}
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(90deg, rgba(11,29,45,0.94) 0%, rgba(11,29,45,0.80) 36%, rgba(11,29,45,0.42) 72%, rgba(11,29,45,0.42) 100%)",
        }}
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute inset-0 z-[1]"
        style={{
          background:
            "linear-gradient(0deg, rgba(11,29,45,0.96) 0%, rgba(11,29,45,0.38) 32%, transparent 58%, rgba(11,29,45,0.45) 100%)",
        }}
        aria-hidden="true"
      />
      <div className="route-grid pointer-events-none absolute inset-0 z-[1] opacity-60" aria-hidden="true" />
      <div className="grain-layer pointer-events-none absolute inset-0 z-[1]" aria-hidden="true" />

      {/* ------------------------------ Content ------------------------------ */}
      <div className="relative z-10 mx-auto w-full max-w-shell px-5 sm:px-8 lg:px-12">
        <div className="max-w-[1050px]">
          {/* Eyebrow — existing site copy */}
          <motion.div
            key={`eyebrow-${cycle}`}
            initial={reduce ? false : { opacity: 0, y: 14 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: EASE }}
            className="mb-6 flex items-center gap-3"
          >
            <span className="inline-flex items-center gap-2 rounded-full border border-paper/15 bg-ink-deep/35 px-3.5 py-1.5 font-mono text-[0.63rem] uppercase tracking-[0.18em] text-paper/85 backdrop-blur-sm">
              <span className="h-1.5 w-1.5 rounded-full bg-live animate-pulse" />
              Vectis Inc. — Software and AI Studio
            </span>
          </motion.div>

          {/* Headline: word-by-word mask reveal replayed on every slide */}
          <motion.h1
            key={`headline-${cycle}`}
            aria-label="Build for the work that matters next."
            initial="hidden"
            animate="show"
            className="font-serif text-[clamp(2.5rem,5.8vw,5.4rem)] font-normal leading-[1.02] tracking-[-0.03em] text-paper"
          >
            {HEADLINE_LINES.map((line, lineIdx) => (
              <span
                key={line}
                className={`block overflow-hidden pb-[0.08em] ${
                  lineIdx === 1 ? "italic text-brass-light" : ""
                }`}
              >
                {line.split(" ").map((word) => {
                  const i = wordIndex++;
                  return (
                    <span key={`${word}-${i}`} className="inline-block overflow-hidden align-bottom">
                      <motion.span
                        custom={i}
                        variants={wordVariants}
                        className="inline-block will-change-transform"
                        style={{ marginRight: "0.24em" }}
                        aria-hidden="true"
                      >
                        {word}
                      </motion.span>
                    </span>
                  );
                })}
              </span>
            ))}
          </motion.h1>

          {/* Lede + CTAs stagger up */}
          <motion.div
            key={`lede-${cycle}`}
            initial={reduce ? false : { opacity: 0, y: 22 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.85, delay: 0.4, ease: EASE }}
          >
            <p className="mt-6 max-w-2xl text-base leading-relaxed text-paper/85 sm:text-lg">
              Custom software, thoughtful web apps, and useful AI automation for real-world teams.
            </p>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted sm:text-[0.95rem]">
              We build useful digital tools for real teams—from custom software and web applications to practical AI automation.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4">
              <MagneticLink href="#products" className="btn btn-primary group">
                <span>See products</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticLink>
              <MagneticLink href="/distributionlife" className="btn btn-outline group">
                <span>Explore RouteCore</span>
                <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
              </MagneticLink>
              <Link
                href="#principles"
                className="link-underline ml-1 font-mono text-[0.68rem] uppercase tracking-[0.16em] text-paper/70 transition-colors hover:text-paper"
              >
                See how we work
              </Link>
            </div>
          </motion.div>
        </div>

        {/* ------------------------- Slideshow controls ---------------------- */}
        <div className="mt-10 flex flex-col gap-6 border-t border-paper/[0.15] pt-6 sm:mt-14 sm:flex-row sm:items-center sm:justify-between">
          {/* Progress-bar indicator + slide numbers */}
          <div className="flex items-center gap-5">
            <div className="font-mono text-[0.6rem] uppercase tracking-[0.14em] text-paper/70 sm:text-[0.7rem] sm:tracking-[0.18em]">
              <span className="text-paper">{String(selected + 1).padStart(2, "0")}</span>
              <span className="mx-1.5 text-brass">/</span>
              <span>{String(heroSlides.length).padStart(2, "0")}</span>
            </div>
            <div className="flex flex-1 items-center gap-2" role="tablist" aria-label="Choose a slide">
              {heroSlides.map((slide, index) => (
                <button
                  key={slide.label}
                  type="button"
                  role="tab"
                  aria-selected={selected === index}
                  aria-current={selected === index ? "true" : undefined}
                  aria-label={`Go to slide ${index + 1}: ${slide.label}`}
                  onClick={() => goTo(index)}
                  className="group relative h-[3px] flex-1 min-w-[28px] max-w-[86px] overflow-hidden rounded-full bg-paper/20 sm:max-w-[104px]"
                >
                  <span
                    key={`${index}-${cycle}`}
                    className={`absolute inset-0 origin-left scale-x-0 bg-brass-light ${
                      selected === index && !reduce ? "hero-progress-fill" : ""
                    }`}
                    style={
                      reduce || selected > index ? { transform: "scaleX(1)" } : undefined
                    }
                  />
                </button>
              ))}
            </div>
            <span className="min-w-[68px] font-mono text-[0.6rem] uppercase tracking-[0.14em] text-paper/60 sm:min-w-[94px] sm:text-[0.63rem] sm:tracking-[0.16em]" aria-live="polite">
              {heroSlides[selected].label}
            </span>
          </div>

          <div className="flex items-center gap-2.5">
            {/* Manual motion control — existing site affordance */}
            <button
              type="button"
              onClick={togglePause}
              aria-pressed={manualPaused}
              aria-label={manualPaused ? "Play background motion" : "Pause background motion"}
              title={manualPaused ? "Play motion" : "Pause motion"}
              className="mr-1 hidden items-center gap-2 rounded-full border border-paper/15 bg-ink-deep/40 px-3 py-2 font-mono text-[0.62rem] uppercase tracking-[0.14em] text-paper/70 backdrop-blur-md transition-colors hover:border-paper/35 hover:text-paper sm:inline-flex"
            >
              {manualPaused ? <Play className="h-3 w-3" /> : <Pause className="h-3 w-3" />}
              <span>{manualPaused ? "Play motion" : "Pause motion"}</span>
            </button>

            <button
              type="button"
              onClick={prev}
              aria-label="Previous slide"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-paper/20 text-paper/80 transition-all duration-300 hover:border-brass hover:bg-paper/10 hover:text-paper"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={next}
              aria-label="Next slide"
              className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-paper/20 text-paper/80 transition-all duration-300 hover:border-brass hover:bg-paper/10 hover:text-paper"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* ---------------------------- Scroll cue ----------------------------- */}
      <Link
        href="#why-we-exist"
        aria-label="Scroll to next section"
        className="group absolute bottom-7 left-1/2 z-10 hidden -translate-x-1/2 flex-col items-center gap-2 lg:flex"
      >
        <span className="relative block h-11 w-px overflow-hidden bg-paper/20">
          <span className="animate-scroll-cue absolute inset-x-0 top-0 block h-5 bg-gradient-to-b from-brass-light to-transparent" />
        </span>
        <ChevronDown className="h-3.5 w-3.5 animate-float-y text-brass-light" />
      </Link>
    </section>
  );
}
