import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { heroImage } from "@/data/home";

/** A calm, contained hero image with the existing headline and CTA copy. */
export default function HeroSlideshow() {
    return (
    <section id="hero" aria-labelledby="hero-title" className="bg-bg">
      <div className="mx-auto grid min-h-[calc(100svh-var(--header-h))] w-full max-w-shell items-center gap-10 px-6 py-14 sm:gap-12 sm:px-8 sm:py-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:px-12 lg:py-20">
        <div className="max-w-[620px]">
          <h1 id="hero-title" className="max-w-[12ch] text-text">
            Build for the work that matters next.
          </h1>
          <p className="mt-6 max-w-[55ch] text-base leading-7 text-text-muted sm:text-lg sm:leading-8">
            Custom software, thoughtful web apps, and useful AI automation for real-world teams.
          </p>
          <p className="mt-4 max-w-[55ch] text-base leading-7 text-text-muted">
            We build useful digital tools for real teams—from custom software and web applications to practical AI automation.
          </p>
          <div className="mt-8 flex flex-wrap items-center gap-4">
            <Link href="#products" className="btn btn-primary">
              <span>See products</span><ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
            <Link href="/distributionlife" className="btn btn-secondary">
              <span>Explore RouteCore</span><ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>
        </div>

        <div className="relative min-h-[280px] overflow-hidden rounded-card border border-border bg-surface shadow-soft sm:min-h-[380px] lg:min-h-[460px]">
          <Image
            src={heroImage.src}
            alt={heroImage.alt}
            fill
            priority
            sizes="(max-width: 1023px) 100vw, 46vw"
            quality={82}
            placeholder="blur"
            blurDataURL={heroImage.blurDataURL}
            className="object-cover"
          />
        </div>
      </div>
    </section>
  );
}
