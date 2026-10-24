"use client";

import React from "react";
import Link from "next/link";
import { ArrowRight, Mail } from "lucide-react";
import { siteMeta } from "@/data/vectis";

export default function VectisFooter() {
  const handleOpenContact = (e: React.MouseEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.dispatchEvent(new CustomEvent("open-contact"));
    }
  };

  return (
    <footer className="w-full bg-ink-deep text-paper border-t border-white/[0.08]">
      {/* Contact CTA Section */}
      <section
        id="contact"
        className="mx-auto max-w-[1180px] px-5 py-24 sm:py-32 md:px-8 border-b border-white/[0.08]"
      >
        <div className="reveal rounded-2xl border border-white/[0.08] bg-ink-card/60 p-8 sm:p-12 md:p-16 relative overflow-hidden backdrop-blur-sm">
          {/* Subtle warm glow background */}
          <div
            className="absolute -right-24 -top-24 h-96 w-96 rounded-full bg-amber-500/5 blur-3xl pointer-events-none"
            aria-hidden="true"
          />

          <div className="max-w-2xl">
            <span className="text-[0.78rem] font-mono uppercase tracking-[0.18em] text-accent-amber">
              // Contact
            </span>
            <h2 className="mt-4 text-3xl sm:text-4xl md:text-5xl font-serif font-normal tracking-tight text-paper">
              Let’s build what’s next.
            </h2>
            <p className="mt-4 text-base sm:text-lg text-muted leading-relaxed font-normal">
              Whether you run an operational business with distribution, fleet, or warehouse operations, or you want to build focused software together, we would love to hear from you.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-4">
              <button
                onClick={handleOpenContact}
                className="footer-cta group inline-flex items-center gap-3 rounded-full bg-paper px-7 py-3.5 text-xs font-semibold uppercase tracking-wider text-ink transition-all hover:bg-paper-muted hover:shadow-lg hover:shadow-white/5 active:scale-95"
              >
                <span>Get in touch</span>
                <ArrowRight className="footer-cta-arrow h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" />
              </button>

              <a
                href={`mailto:${siteMeta.email}`}
                className="inline-flex items-center gap-2 rounded-full border border-white/10 px-6 py-3.5 text-xs font-mono tracking-wide text-paper/80 hover:text-paper hover:border-white/25 transition-colors"
              >
                <Mail className="h-3.5 w-3.5 text-muted" />
                <span>{siteMeta.email}</span>
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Main Footer Navigation */}
      <div className="mx-auto max-w-[1180px] px-5 py-16 md:px-8">
        <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          {/* Brand & Wordmark Info */}
          <div className="lg:col-span-5 space-y-4">
            <Link
              href="/"
              className="inline-flex items-center group focus:outline-none"
              aria-label="Vectis Inc. home"
            >
              <span
                className="font-logo inline-flex items-center whitespace-nowrap text-xl font-extrabold uppercase leading-none tracking-[0.2em] text-paper"
              >
                VECT
                <svg
                  viewBox="0 0 64 80"
                  fill="currentColor"
                  className="h-4 w-auto mx-0.5 text-paper inline-block"
                  aria-hidden="true"
                >
                  <path d="M2.2 78 L32 5.2 L61.8 78 H47.15 L32 30.4 L16.85 78 Z" />
                </svg>
                IS Inc<span className="text-muted">.</span>
              </span>
            </Link>
            <p className="text-sm text-muted leading-relaxed max-w-sm">
              Software for the work that moves the world. Focused desktop and operational software engineered for independent distributors, route operators, and supply teams.
            </p>
            <p className="text-xs text-muted-dark font-mono">
              Rawalpindi • London • Remote
            </p>
          </div>

          {/* Navigation Links Columns */}
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-8 lg:col-span-7">
            {/* Products Column */}
            <div>
              <h3 className="text-[0.74rem] font-mono uppercase tracking-[0.18em] text-muted-dark mb-4">
                Products
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/distributionlife"
                    className="text-paper/80 hover:text-paper transition-colors inline-flex items-center gap-1.5"
                  >
                    <span>RouteCore</span>
                    <span className="inline-block h-1.5 w-1.5 rounded-full bg-emerald-400"></span>
                  </Link>
                </li>
                <li>
                  <Link
                    href="/nano"
                    className="text-paper/80 hover:text-paper transition-colors"
                  >
                    PulseGrid
                  </Link>
                </li>
                <li>
                  <Link
                    href="/studio"
                    className="text-paper/80 hover:text-paper transition-colors"
                  >
                    Vectis Studio
                  </Link>
                </li>
              </ul>
            </div>

            {/* Company Column */}
            <div>
              <h3 className="text-[0.74rem] font-mono uppercase tracking-[0.18em] text-muted-dark mb-4">
                Company
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/about"
                    className="text-paper/80 hover:text-paper transition-colors"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    href="/clients"
                    className="text-paper/80 hover:text-paper transition-colors"
                  >
                    Clients
                  </Link>
                </li>
                <li>
                  <Link
                    href="/journal"
                    className="text-paper/80 hover:text-paper transition-colors"
                  >
                    Journal
                  </Link>
                </li>
                <li>
                  <button
                    onClick={handleOpenContact}
                    className="text-paper/80 hover:text-paper transition-colors text-left"
                  >
                    Contact
                  </button>
                </li>
              </ul>
            </div>

            {/* Legal Column */}
            <div className="col-span-2 sm:col-span-1">
              <h3 className="text-[0.74rem] font-mono uppercase tracking-[0.18em] text-muted-dark mb-4">
                Legal
              </h3>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link
                    href="/privacy"
                    className="text-paper/80 hover:text-paper transition-colors"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    href="/terms"
                    className="text-paper/80 hover:text-paper transition-colors"
                  >
                    Terms of Use
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-16 pt-8 border-t border-white/[0.06] flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-muted-dark font-mono">
          <div>
            © {new Date().getFullYear()} Vectis Operations Inc. All rights reserved.
          </div>
          <div>
            Focused Software for Physical Work
          </div>
        </div>
      </div>
    </footer>
  );
}
