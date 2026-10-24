"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { Menu, X, ArrowRight } from "lucide-react";

export default function VectisHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 30);
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Prevent background scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
  }, [mobileMenuOpen]);

  return (
    <header
      className={`site-header fixed inset-x-0 top-0 z-50 transition-[background-color,border-color,backdrop-filter] duration-300 ease-out ${
        scrolled
          ? "bg-ink-soft/90 backdrop-blur-md border-b border-white/[0.08] py-3.5 shadow-2xl shadow-black/60"
          : "bg-transparent border-b border-transparent py-5"
      }`}
    >
      <div className="site-header-bar mx-auto flex max-w-[1180px] items-center justify-between px-5 md:px-8 text-paper">
        {/* Custom Geometric Wordmark */}
        <Link
          href="/"
          className="inline-flex min-h-11 min-w-11 items-center group focus:outline-none"
          aria-label="Vectis Inc. home"
        >
          <span
            className="site-wordmark font-logo inline-flex items-center whitespace-nowrap text-[0.98rem] font-extrabold uppercase leading-none tracking-[0.16em] sm:text-[1.08rem] sm:tracking-[0.2em]"
            style={{ letterSpacing: "0.2em" }}
          >
            <span className="inline-flex justify-end overflow-hidden">
              <span className="inline-block text-paper">VECT</span>
            </span>
            {/* Geometric Chevron Glyph */}
            <svg
              viewBox="0 0 64 80"
              fill="currentColor"
              className="shrink-0 text-paper transition-transform duration-300 group-hover:scale-110"
              style={{
                height: "0.84em",
                width: "auto",
                marginLeft: "0.04em",
                transform: "translateY(-0.015em)",
              }}
              aria-hidden="true"
            >
              <path d="M2.2 78 L32 5.2 L61.8 78 H47.15 L32 30.4 L16.85 78 Z" />
            </svg>
            <span className="inline-flex overflow-hidden" style={{ marginLeft: "0.45em" }}>
              <span className="inline-block text-paper">
                IS Inc<span className="tracking-normal text-muted">.</span>
              </span>
            </span>
          </span>
        </Link>

        {/* Desktop Navigation Links */}
        <nav className="hidden items-center gap-6 lg:flex lg:gap-8" aria-label="Primary">
          <Link
            href="/#products"
            className="inline-flex min-h-11 items-center text-[0.84rem] text-paper/80 hover:text-paper transition-colors font-medium"
          >
            Products
          </Link>
          <Link
            href="/clients"
            className="inline-flex min-h-11 items-center text-[0.84rem] text-paper/80 hover:text-paper transition-colors font-medium"
          >
            Clients
          </Link>
          <Link
            href="/journal"
            className="inline-flex min-h-11 items-center text-[0.84rem] text-paper/80 hover:text-paper transition-colors font-medium"
          >
            Journal
          </Link>
          <Link
            href="/about"
            className="inline-flex min-h-11 items-center text-[0.84rem] text-paper/80 hover:text-paper transition-colors font-medium"
          >
            About
          </Link>
        </nav>

        {/* Header Right Action & Mobile Toggle */}
        <div className="flex items-center gap-4">
          <Link
            href="#contact"
            className="hidden sm:inline-flex items-center justify-center gap-2 rounded-full border border-paper/30 hover:border-paper px-4 py-2 text-xs font-mono uppercase tracking-wider text-paper hover:bg-paper/10 transition-all"
          >
            Contact
          </Link>

          {/* Mobile Hamburger Button */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label={mobileMenuOpen ? "Close menu" : "Open menu"}
            className="inline-flex lg:hidden p-2 text-paper hover:text-white focus:outline-none"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Navigation Drawer */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-x-0 top-[65px] bottom-0 bg-ink-soft/98 backdrop-blur-2xl border-t border-white/[0.08] p-6 flex flex-col justify-between z-50 animate-reveal-in">
          <nav className="flex flex-col space-y-4 pt-4" aria-label="Mobile Navigation">
            <span className="text-[10px] font-mono uppercase tracking-widest text-muted block mb-2">
              Navigation
            </span>
            <Link
              href="/#products"
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-serif text-paper hover:text-white transition-colors py-2 border-b border-white/[0.04]"
            >
              Products
            </Link>
            <Link
              href="/clients"
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-serif text-paper hover:text-white transition-colors py-2 border-b border-white/[0.04]"
            >
              Clients &amp; Stories
            </Link>
            <Link
              href="/journal"
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-serif text-paper hover:text-white transition-colors py-2 border-b border-white/[0.04]"
            >
              Journal &amp; Thinking
            </Link>
            <Link
              href="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="text-2xl font-serif text-paper hover:text-white transition-colors py-2 border-b border-white/[0.04]"
            >
              About Vectis Inc.
            </Link>

            <div className="pt-6">
              <span className="text-[10px] font-mono uppercase tracking-widest text-muted block mb-3">
                Software Products
              </span>
              <div className="grid grid-cols-1 gap-2.5">
                <Link
                  href="/distributionlife"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-sm text-paper"
                >
                  <span>RouteCore</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Live
                  </span>
                </Link>
                <Link
                  href="/nano"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-sm text-paper"
                >
                  <span>PulseGrid</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-muted">
                    In development
                  </span>
                </Link>
                <Link
                  href="/studio"
                  onClick={() => setMobileMenuOpen(false)}
                  className="flex items-center justify-between p-3 rounded-lg bg-white/[0.02] border border-white/[0.06] text-sm text-paper"
                >
                  <span>Vectis Studio</span>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-white/[0.06] text-muted">
                    In development
                  </span>
                </Link>
              </div>
            </div>
          </nav>

          <div className="pt-6 border-t border-white/[0.08]">
            <Link
              href="#contact"
              onClick={() => setMobileMenuOpen(false)}
              className="w-full inline-flex items-center justify-center gap-2 py-3.5 rounded-full border border-paper text-paper text-sm font-medium hover:bg-paper hover:text-ink transition-all"
            >
              Get in touch
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      )}
    </header>
  );
}
