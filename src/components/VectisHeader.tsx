"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import {
  AnimatePresence,
  motion,
  useMotionValueEvent,
  useReducedMotion,
  useScroll,
} from "framer-motion";
import { ArrowRight, ChevronDown, ExternalLink, Menu, X } from "lucide-react";
import {
  productDropdownMain,
  productDropdownResources,
  productMedia,
  type DropdownLink,
} from "@/data/home";
import { productsData } from "@/data/vectis";

const EASE = [0.22, 1, 0.36, 1] as const;

const primaryLinks = [
  { label: "Products", href: "/#products" },
  { label: "Clients", href: "/clients" },
  { label: "Journal", href: "/journal" },
  { label: "Approach", href: "/#approach" },
  { label: "About", href: "/about" },
];

const mobileLinks = [
  { label: "Products", href: "/#products" },
  { label: "Clients & Stories", href: "/clients" },
  { label: "Journal & Thinking", href: "/journal" },
  { label: "Approach", href: "/#approach" },
  { label: "About Vectis Inc.", href: "/about" },
];

export default function VectisHeader() {
  const pathname = usePathname();
  const reduce = useReducedMotion();
  const { scrollY } = useScroll();
  const [scrolled, setScrolled] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const lastY = useRef(0);
  const headerRef = useRef<HTMLElement>(null);

  /* Glass on scroll + hide on scroll down / show on scroll up. */
  useMotionValueEvent(scrollY, "change", (y) => {
    setScrolled(y > 24);
    const delta = y - lastY.current;
    lastY.current = y;
    if (Math.abs(delta) < 6) return;
    // A hover-open menu should never follow the reader down the page.
    if (dropdownOpen) setDropdownOpen(false);
    if (y < 140 || mobileOpen) setHidden(false);
    else setHidden(delta > 0);
  });

  /* Close overlays on route change, Escape, or outside click. */
  useEffect(() => {
    setDropdownOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setDropdownOpen(false);
        setMobileOpen(false);
      }
    };
    const onPointerDown = (e: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(e.target as Node)) {
        setDropdownOpen(false);
      }
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  const renderDropdownLink = (item: DropdownLink, i: number) => {
    const inner = (
      <>
        <span className="link-underline">{item.label}</span>
        {item.external ? (
          <ExternalLink className="h-3 w-3 opacity-60" />
        ) : (
          <ArrowRight className="h-3 w-3 -translate-x-2 opacity-0 transition-all duration-300 group-hover:translate-x-0 group-hover:opacity-80" />
        )}
      </>
    );
    const cls =
      "group flex items-center justify-between gap-3 py-2.5 text-sm text-paper/80 transition-colors hover:text-paper";
    return item.external ? (
      <a
        key={item.label}
        href={item.href}
        target="_blank"
        rel="noopener noreferrer"
        className={cls}
        onClick={() => setDropdownOpen(false)}
        style={{ transitionDelay: `${i * 20}ms` }}
      >
        {inner}
      </a>
    ) : (
      <Link
        key={item.label}
        href={item.href}
        className={cls}
        onClick={() => setDropdownOpen(false)}
      >
        {inner}
      </Link>
    );
  };

  return (
    <>
      <motion.header
      ref={headerRef}
      initial={false}
      animate={{ y: hidden && !reduce ? "-105%" : "0%" }}
      transition={{ duration: 0.48, ease: EASE }}
      onMouseLeave={() => setDropdownOpen(false)}
      className={`fixed inset-x-0 top-0 z-50 flex h-[var(--header-h)] items-center text-paper transition-[background-color,box-shadow] duration-500 ${
        scrolled || dropdownOpen ? "glass-nav" : "border-b border-transparent bg-transparent"
      }`}
      style={{ willChange: "transform" }}
    >
      <div className="mx-auto flex w-full max-w-shell items-center justify-between gap-4 px-5 sm:px-8 lg:px-12">
        {/* ---------------------------- Wordmark ---------------------------- */}
        <Link
          href="/"
          className="group inline-flex min-h-11 min-w-11 shrink-0 items-center"
          aria-label="Vectis Inc. home"
        >
          <span className="font-logo inline-flex items-center whitespace-nowrap text-[0.95rem] font-extrabold uppercase leading-none tracking-[0.18em] sm:text-[1.02rem]">
            <span className="text-paper">VECT</span>
            <svg
              viewBox="0 0 64 80"
              fill="currentColor"
              className="mx-[0.02em] inline-block h-[0.82em] w-auto text-brass-light transition-transform duration-500 group-hover:rotate-[8deg]"
              aria-hidden="true"
            >
              <path d="M2.2 78 L32 5.2 L61.8 78 H47.15 L32 30.4 L16.85 78 Z" />
            </svg>
            <span className="ml-[0.36em] text-paper">
              IS Inc<span className="text-brass-light">.</span>
            </span>
          </span>
        </Link>

        {/* -------------------------- Desktop nav --------------------------- */}
        <nav className="hidden items-center gap-5 lg:flex xl:gap-7" aria-label="Primary">
          {primaryLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              data-active={pathname === link.href ? "true" : undefined}
              className="link-underline inline-flex min-h-11 items-center text-[0.79rem] font-medium text-paper/75 transition-colors duration-300 hover:text-paper"
            >
              {link.label}
            </Link>
          ))}

          {/* DistributionLife dropdown trigger */}
          <button
            type="button"
            aria-haspopup="true"
            aria-expanded={dropdownOpen}
            aria-controls="distributionlife-menu"
            onClick={() => setDropdownOpen((o) => !o)}
            onMouseEnter={() => setDropdownOpen(true)}
            className={`inline-flex min-h-11 items-center gap-1.5 text-[0.79rem] font-medium transition-colors duration-300 ${
              dropdownOpen ? "text-brass-light" : "text-paper/75 hover:text-paper"
            }`}
          >
            DistributionLife
            <ChevronDown
              className={`h-3.5 w-3.5 transition-transform duration-300 ${dropdownOpen ? "rotate-180" : ""}`}
            />
          </button>
        </nav>

        <div className="flex items-center gap-3">
          <Link
            href="/#contact"
            className="btn btn-outline hidden !px-5 !py-2.5 sm:inline-flex"
          >
            <span>Contact</span>
            <ArrowRight className="h-3 w-3" />
          </Link>
          <button
            type="button"
            onClick={() => setMobileOpen((o) => !o)}
            aria-label={mobileOpen ? "Close menu" : "Open menu"}
            aria-expanded={mobileOpen}
            aria-controls="mobile-menu"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-paper/20 text-paper transition-colors hover:border-brass hover:text-brass-light lg:hidden"
          >
            {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </div>

      {/* ------------------------- Desktop dropdown ------------------------ */}
      <AnimatePresence>
        {dropdownOpen && (
          <motion.div
            id="distributionlife-menu"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.34, ease: EASE }}
            className="absolute inset-x-0 top-full hidden pt-2 px-5 sm:px-8 lg:block lg:px-12"
          >
            <div className="mx-auto grid max-w-shell grid-cols-12 overflow-hidden rounded-panel border border-paper/[0.12] bg-ink-deep/95 shadow-lift backdrop-blur-2xl">
              <div className="col-span-4 border-r border-paper/10 p-7">
                <span className="eyebrow eyebrow-dark">DistributionLife</span>
                <h3 className="mt-3 font-serif text-2xl leading-tight text-paper">
                  One system for the office.
                </h3>
                <p className="mt-3 text-sm leading-relaxed text-muted">
                  {productsData[0].headline}
                </p>
              </div>
              <div className="col-span-4 border-r border-paper/10 p-7">
                <span className="eyebrow text-muted-dark">Explore</span>
                <nav className="mt-4 flex flex-col" aria-label="DistributionLife">
                  {productDropdownMain.map(renderDropdownLink)}
                </nav>
              </div>
              <div className="col-span-4 p-7">
                <span className="eyebrow text-muted-dark">Resources</span>
                <nav className="mt-4 flex flex-col" aria-label="DistributionLife resources">
                  {productDropdownResources.map(renderDropdownLink)}
                </nav>
                <div className="relative mt-6 aspect-[16/9] overflow-hidden rounded-card border border-paper/10">
                  <Image
                    src={productMedia.distributionlife.src}
                    alt={productMedia.distributionlife.alt}
                    fill
                    sizes="320px"
                    quality={70}
                    className="object-cover opacity-80"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-ink-deep/80 to-transparent" />
                  <span className="absolute bottom-3 left-4 font-mono text-[0.6rem] uppercase tracking-[0.16em] text-paper/80">
                    Live in daily operations
                  </span>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

    </motion.header>
      {/* --------------------------- Mobile drawer ------------------------- */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div
            id="mobile-menu"
            initial={{ opacity: 0, y: -18 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -14 }}
            transition={{ duration: 0.42, ease: EASE }}
            className="fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 overflow-y-auto border-t border-paper/10 bg-ink-deep/[0.97] px-5 pb-10 pt-8 backdrop-blur-2xl lg:hidden"
          >
            <motion.nav
              aria-label="Mobile Navigation"
              initial="hidden"
              animate="show"
              variants={{ show: { transition: { staggerChildren: 0.055, delayChildren: 0.08 } } }}
              className="mx-auto flex max-w-shell flex-col"
            >
              <motion.span
                variants={{ hidden: { opacity: 0, y: 12 }, show: { opacity: 1, y: 0 } }}
                className="eyebrow mb-4 text-muted-dark"
              >
                Navigation
              </motion.span>
              {mobileLinks.map((link) => (
                <motion.div
                  key={link.label}
                  variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                >
                  <Link
                    href={link.href}
                    onClick={() => setMobileOpen(false)}
                    className="flex items-center justify-between border-b border-paper/[0.07] py-3 font-serif text-2xl text-paper transition-colors hover:text-brass-light"
                  >
                    {link.label}
                    <ArrowRight className="h-4 w-4 text-brass/70" />
                  </Link>
                </motion.div>
              ))}

              {/* DistributionLife group — same structure as the desktop menu */}
              <motion.div
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                className="mt-8"
              >
                <span className="eyebrow eyebrow-dark">DistributionLife</span>
                <div className="mt-3 grid grid-cols-2 gap-x-6 gap-y-1">
                  {[...productDropdownMain, ...productDropdownResources].map((item) =>
                    item.external ? (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        onClick={() => setMobileOpen(false)}
                        className="flex items-center justify-between gap-2 py-2 text-sm text-paper/75"
                      >
                        {item.label}
                        <ExternalLink className="h-3 w-3 opacity-50" />
                      </a>
                    ) : (
                      <Link
                        key={item.label}
                        href={item.href}
                        onClick={() => setMobileOpen(false)}
                        className="py-2 text-sm text-paper/75 transition-colors hover:text-paper"
                      >
                        {item.label}
                      </Link>
                    )
                  )}
                </div>
              </motion.div>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                className="mt-8"
              >
                <span className="eyebrow text-muted-dark">Software Products</span>
                <div className="mt-3 flex flex-col gap-2">
                  {productsData.map((product) => (
                    <Link
                      key={product.id}
                      href={`/${product.slug}`}
                      onClick={() => setMobileOpen(false)}
                      className="flex items-center justify-between rounded-card border border-paper/10 bg-paper/[0.02] px-4 py-3 text-sm text-paper"
                    >
                      <span>{product.name}</span>
                      <span
                        className={`font-mono text-[0.6rem] uppercase tracking-[0.14em] ${
                          product.statusBadge === "Live" ? "text-live" : "text-muted-dark"
                        }`}
                      >
                        {product.statusBadge}
                      </span>
                    </Link>
                  ))}
                </div>
              </motion.div>

              <motion.div
                variants={{ hidden: { opacity: 0, y: 16 }, show: { opacity: 1, y: 0 } }}
                className="mt-9 border-t border-paper/10 pt-7"
              >
                <Link
                  href="/#contact"
                  onClick={() => setMobileOpen(false)}
                  className="btn btn-primary w-full"
                >
                  <span>Get in touch</span>
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </motion.div>
            </motion.nav>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
