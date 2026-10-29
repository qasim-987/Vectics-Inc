import Link from "next/link";
import { ArrowRight } from "lucide-react";

export default function HomepageHero() {
  return (
    <section id="hero" aria-labelledby="hero-title" className="bg-bg">
      <div className="mx-auto flex min-h-[min(720px,calc(100svh-var(--header-h)))] w-full max-w-shell items-center px-6 py-20 sm:px-8 sm:py-24 lg:px-12 lg:py-28">
        <div className="max-w-4xl">
          <p className="eyebrow">Vectis Inc. <span aria-hidden="true">/</span> Software &amp; AI</p>
          <h1 id="hero-title" className="mt-8 max-w-[14ch] text-[clamp(3rem,8vw,6.5rem)] font-semibold leading-[0.98] tracking-[-0.065em] text-text">
            Software built around how your business works.
          </h1>
          <p className="mt-8 max-w-2xl text-lg leading-8 text-text-muted sm:text-xl sm:leading-9">
            We build AI-powered software and automation for businesses, helping teams simplify repetitive work and make better use of their time.
          </p>
          <div className="mt-10">
            <Link href="#contact" className="btn btn-primary group">
              Start a project
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}
