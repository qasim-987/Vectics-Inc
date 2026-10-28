"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUp, Mail } from "lucide-react";
import { siteMeta, productsData } from "@/data/vectis";
import { productDropdownResources } from "@/data/home";
import Atmosphere from "./home/Atmosphere";
import MagneticLink from "./home/MagneticLink";
import { Reveal } from "./home/Reveal";
import { footerNavigation, parentCompany } from "@/data/site-navigation";

const exploreLinks = footerNavigation;

const resourcesLinks = [
  ...productDropdownResources,
  { label: "Privacy Policy", href: "/privacy" },
  { label: "Terms of Use", href: "/terms" },
];



export default function VectisFooter() {
  const openContact = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();
    window.dispatchEvent(new CustomEvent("open-contact"));
  };

  const footerLink = "link-underline text-sm text-paper/70 transition-colors duration-300 hover:text-paper";

  return (
    <footer className="relative isolate overflow-hidden border-t border-paper/[0.1] bg-ink-deep text-paper">
      {/* ---------------------------- Closing CTA ---------------------------- */}
      <section id="contact" className="relative py-24 sm:py-32">
        <Atmosphere tone="dark" routes />
        <div className="relative z-10 mx-auto max-w-shell px-5 sm:px-8 lg:px-12">
          <Reveal className="relative overflow-hidden rounded-panel border border-paper/[0.12] bg-ink-card/55 p-8 shadow-soft backdrop-blur-sm sm:p-12 md:p-16">
            <div className="relative max-w-2xl">
              <span className="eyebrow eyebrow-dark">// Contact</span>
              <h2 className="mt-5 font-serif text-[clamp(2.5rem,5.6vw,5rem)] leading-[1.02] tracking-[-0.032em] text-paper">
                Let&apos;s make the next idea <span className="italic text-brass-light">useful.</span>
              </h2>
              <p className="mt-6 text-base leading-relaxed text-muted sm:text-lg">
                If you have a workflow to improve, a product to shape, or an idea for practical AI, we would love to hear what you are working on.
              </p>

              <div className="mt-9 flex flex-wrap items-center gap-3 sm:gap-4">
                <MagneticLink
                  href="#contact-form"
                  onClick={openContact}
                  className="btn btn-primary group"
                >
                  <span>Get in touch</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </MagneticLink>
                <a href={`mailto:${siteMeta.email}`} className="btn btn-outline">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{siteMeta.email}</span>
                </a>
              </div>
            </div>

            <span className="section-index absolute bottom-7 right-8 hidden sm:block">
              06 / 06 — Contact
            </span>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------ Footer ------------------------------- */}
      <div className="relative z-10 mx-auto max-w-shell border-t border-paper/[0.1] px-5 py-16 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-4">
            <Link href="/" className="group inline-flex items-center" aria-label="Vectis Inc. home">
              <span className="font-logo inline-flex items-center whitespace-nowrap text-xl font-extrabold uppercase leading-none tracking-[0.18em] text-paper">
                VECT
                <svg
                  viewBox="0 0 64 80"
                  fill="currentColor"
                  className="mx-[0.02em] inline-block h-4 w-auto text-brass-light transition-transform duration-500 group-hover:rotate-[8deg]"
                  aria-hidden="true"
                >
                  <path d="M2.2 78 L32 5.2 L61.8 78 H47.15 L32 30.4 L16.85 78 Z" />
                </svg>
                <span className="ml-[0.36em]">IS Inc</span>
                <span className="text-brass-light">.</span>
              </span>
            </Link>
            <p className="mt-5 max-w-sm text-sm leading-relaxed text-muted">
              Purpose-built software for everyday work. We build practical digital tools around the needs of real teams and the businesses they keep moving.
            </p>
            <p className="mt-5 font-mono text-[0.65rem] uppercase tracking-[0.16em] text-muted-dark">
              {siteMeta.location}
            </p>
            <a
              href={parentCompany.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-underline mt-5 inline-flex items-center gap-2 text-sm text-paper/70 hover:text-paper"
            >
              Vectis is part of {parentCompany.label}
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <h3 className="eyebrow eyebrow-dark">Explore</h3>
            <ul className="mt-5 space-y-3">
              {exploreLinks.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className={footerLink}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Products */}
          <div className="lg:col-span-2">
            <h3 className="eyebrow eyebrow-dark">Products</h3>
            <ul className="mt-5 space-y-3">
              {productsData.map((product) => (
                <li key={product.id}>
                  <Link href={`/${product.slug}`} className={`${footerLink} inline-flex items-center gap-2`}>
                    <span className="link-underline">{product.name}</span>
                    {product.statusBadge === "Live" && (
                      <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-live" aria-label="Live" />
                    )}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2">
            <h3 className="eyebrow eyebrow-dark">Resources</h3>
            <ul className="mt-5 space-y-3">
              {resourcesLinks.map((link) =>
                "external" in link && link.external ? (
                  <li key={link.label}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={footerLink}
                    >
                      {link.label}
                    </a>
                  </li>
                ) : (
                  <li key={link.label}>
                    <Link href={link.href} className={footerLink}>
                      {link.label}
                    </Link>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Connect */}
          <div className="lg:col-span-2">
            <h3 className="eyebrow eyebrow-dark">Connect</h3>
            <ul className="mt-5 space-y-3">
              <li>
                <a href={`mailto:${siteMeta.email}`} className={footerLink}>
                  {siteMeta.email}
                </a>
              </li>
              <li>
                <a href="#contact-form" onClick={openContact} className={footerLink}>
                  Get in touch
                </a>
              </li>
            </ul>
            <h4 className="eyebrow mt-7 text-muted-dark">Parent company</h4>
            <a
              href={parentCompany.href}
              target="_blank"
              rel="noopener noreferrer"
              className={`${footerLink} mt-4 inline-flex items-center gap-2`}
            >
              {parentCompany.label}
              <ArrowRight className="h-3 w-3" aria-hidden="true" />
            </a>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-16 flex flex-col gap-4 border-t border-paper/[0.08] pt-8 font-mono text-[0.64rem] uppercase tracking-[0.14em] text-muted-dark sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {siteMeta.legalName}. All rights reserved.</span>
          <span className="hidden md:block">Purpose-built software for everyday work</span>
          <a href="/#hero" className="link-underline inline-flex items-center gap-2 text-paper/70 hover:text-paper">
            Back to top <ArrowUp className="h-3 w-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
