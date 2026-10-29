import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { siteMeta } from "@/data/vectis";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata(
  "About",
  "Vectis builds AI-powered software and automation around the needs of businesses and the people who work in them.",
  "/about",
);

const principles = [
  {
    title: "Start with the problem",
    description: "We begin by understanding the work and the people doing it before recommending a technical solution.",
  },
  {
    title: "Keep the scope clear",
    description: "A focused plan helps teams make informed decisions about what to build now and what can wait.",
  },
  {
    title: "Build for real use",
    description: "We value clear interfaces, reliable foundations, and software that fits into the way a business operates.",
  },
  {
    title: "Improve with feedback",
    description: "We make room to learn from day-to-day use and refine the product as needs change.",
  },
];

export default function AboutPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    name: "About Vectis Inc.",
    description: siteMeta.description,
    mainEntity: {
      "@type": "Organization",
      name: siteMeta.name,
      legalName: siteMeta.legalName,
      url: "https://vectisoperations.tech",
    },
  };

  return (
    <div className="w-full bg-bg text-text">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="mx-auto max-w-shell px-6 py-20 sm:px-8 sm:py-28 lg:px-12">
        <div className="max-w-4xl">
          <p className="eyebrow">About Vectis</p>
          <h1 className="mt-6 max-w-[16ch] text-4xl font-semibold leading-[1.05] tracking-[-0.055em] sm:text-6xl">
            We build software that makes everyday work easier to manage.
          </h1>
          <p className="mt-7 max-w-2xl text-lg leading-8 text-text-muted">
            Vectis creates AI-powered software and automation for businesses. We combine practical engineering with a clear understanding of your workflows to build tools your team can use with confidence.
          </p>
        </div>
      </section>

      <section className="border-y border-border bg-surface py-16 sm:py-20">
        <div className="mx-auto max-w-shell px-6 sm:px-8 lg:px-12">
          <div className="grid gap-8 md:grid-cols-[minmax(0,0.7fr)_minmax(0,1fr)] md:gap-16">
            <div>
              <p className="eyebrow">How we work</p>
              <h2 className="mt-4 max-w-[12ch] text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
                Clear thinking before more technology.
              </h2>
            </div>
            <div className="space-y-5 text-base leading-7 text-text-muted">
              <p>
                Every business has its own processes, systems, and constraints. We take time to understand those details before shaping the right software or automation.
              </p>
              <p>
                The result should solve a defined need, fit your team&apos;s day-to-day work, and be straightforward to maintain and improve.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-shell px-6 py-16 sm:px-8 sm:py-24 lg:px-12">
        <div className="max-w-2xl">
          <p className="eyebrow">Our principles</p>
          <h2 className="mt-4 text-3xl font-semibold leading-tight tracking-[-0.04em] sm:text-4xl">
            A thoughtful way to build.
          </h2>
        </div>
        <div className="mt-8 grid gap-x-10 sm:grid-cols-2 lg:grid-cols-4">
          {principles.map((principle) => (
            <article key={principle.title} className="border-t border-border py-6">
              <h3 className="text-lg font-semibold text-text">{principle.title}</h3>
              <p className="mt-3 text-sm leading-6 text-text-muted">{principle.description}</p>
            </article>
          ))}
        </div>
        <div className="mt-12 border-t border-border pt-8">
          <Link href="/contact" className="btn btn-primary group">
            Talk about your project
            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" aria-hidden="true" />
          </Link>
        </div>
      </section>
    </div>
  );
}
