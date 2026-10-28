"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, ArrowUp, Mail } from "lucide-react";
import { siteMeta, productsData } from "@/data/vectis";
import { productDropdownResources } from "@/data/home";
import { Reveal } from "./home/Reveal";
import { footerNavigation } from "@/data/site-navigation";

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
    <footer className="site-footer relative isolate overflow-hidden border-t border-darkText/10 bg-dark text-darkText">
      {/* ---------------------------- Closing CTA ---------------------------- */}
      <section id="contact" className="relative bg-dark py-16 sm:py-20">
        <div className="relative z-10 mx-auto max-w-shell px-6 sm:px-8 lg:px-12">
          <Reveal className="relative overflow-hidden rounded-panel border border-darkText/15 bg-dark p-8 sm:p-12 md:p-16">
            <div className="relative max-w-2xl">
              <span className="eyebrow eyebrow-dark">Contact</span>
              <h2 className="mt-4 max-w-2xl text-darkText">
                Let&apos;s make the next idea <span>useful.</span>
              </h2>
              <p className="mt-4 text-base leading-7 text-darkText/80 sm:text-lg">
                If you have a workflow to improve, a product to shape, or an idea for practical AI, we would love to hear what you are working on.
              </p>

              <div className="mt-10 flex flex-wrap items-center gap-4 sm:gap-4">
                <Link
                  href="#contact-form"
                  onClick={openContact}
                  className="btn btn-primary group"
                >
                  <span>Get in touch</span>
                  <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
                </Link>
                <a href={`mailto:${siteMeta.email}`} className="btn btn-outline">
                  <Mail className="h-3.5 w-3.5" />
                  <span>{siteMeta.email}</span>
                </a>
              </div>
            </div>

            <span className="absolute bottom-6 right-8 hidden text-sm text-darkText/70 sm:block">
              06 / 06 — Contact
            </span>
          </Reveal>
        </div>
      </section>

      {/* ------------------------------ Footer ------------------------------- */}
      <div className="relative z-10 mx-auto max-w-shell border-t border-darkText/15 px-6 py-12 sm:px-8 lg:px-12">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-3 lg:grid-cols-12 lg:gap-8">
          {/* Brand */}
          <div className="col-span-2 md:col-span-3 lg:col-span-4">
            <Link href="/" className="group inline-flex items-center" aria-label="Vectis Inc. home">
              <span className="inline-flex items-center whitespace-nowrap text-lg font-semibold leading-none tracking-[-0.02em] text-darkText">
                Vectis <span className="ml-2 font-normal text-darkText/80">Inc.</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm leading-6 text-darkText/80">
              Purpose-built software for everyday work. We build practical digital tools around the needs of real teams and the businesses they keep moving.
            </p>
            <p className="mt-4 text-sm text-darkText/80">
              {siteMeta.location}
            </p>
          </div>

          {/* Explore */}
          <div className="lg:col-span-2">
            <h3 className="eyebrow eyebrow-dark">Explore</h3>
            <ul className="mt-4 space-y-2">
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
            <ul className="mt-4 space-y-2">
              {productsData.map((product) => (
                <li key={product.id}>
                  <Link href={`/${product.slug}`} className={`${footerLink} inline-flex items-center gap-2`}>
                    <span className="link-underline">{product.name}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Resources */}
          <div className="lg:col-span-2">
            <h3 className="eyebrow eyebrow-dark">Resources</h3>
            <ul className="mt-4 space-y-2">
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
            <ul className="mt-4 space-y-2">
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
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 flex flex-col gap-4 border-t border-darkText/15 pt-6 text-sm text-darkText/80 sm:flex-row sm:items-center sm:justify-between">
          <span>© {new Date().getFullYear()} {siteMeta.legalName}. All rights reserved.</span>
          <span className="hidden md:block">Purpose-built software for everyday work</span>
          <a href="/#hero" className="inline-flex min-h-11 items-center gap-2 text-sm text-darkText/80 hover:text-darkText">
            Back to top <ArrowUp className="h-3 w-3" />
          </a>
        </div>
      </div>
    </footer>
  );
}
