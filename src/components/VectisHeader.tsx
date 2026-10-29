"use client";

import React, { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, ChevronDown, ExternalLink, Menu, X } from "lucide-react";
import {
  productDropdownMain,
  productDropdownResources,
  productDropdownLogin,
  type DropdownLink,
} from "@/data/home";
import { productsData } from "@/data/vectis";
import { primaryNavigation } from "@/data/site-navigation";

const productTrigger = primaryNavigation.find((item) => item.label === "Products")!;
const mainLinks = primaryNavigation.filter((item) => item.label !== "Products");

function MenuLink({ item, onClick }: { item: DropdownLink; onClick?: () => void }) {
  const className = "group flex min-h-10 items-center justify-between gap-4 rounded-md px-4 text-sm text-text-muted transition-colors hover:bg-bg hover:text-text focus-visible:outline-offset-2";
  const label = <><span>{item.label}</span>{item.external && <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />}</>;
  return item.external ? (
    <a href={item.href} target="_blank" rel="noopener noreferrer" className={className} onClick={onClick}>{label}</a>
  ) : (
    <Link href={item.href} className={className} onClick={onClick}>{label}</Link>
  );
}

export default function VectisHeader() {
  const pathname = usePathname();
  const [productsOpen, setProductsOpen] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState<string | null>(null);
  const headerRef = useRef<HTMLElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const mobileToggleRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    setProductsOpen(false);
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (pathname !== "/") {
      setActiveSection(null);
      return;
    }
    const targets = ["products", "approach"]
      .map((id) => document.getElementById(id))
      .filter((element): element is HTMLElement => Boolean(element));
    if (!targets.length) return;
    const observer = new IntersectionObserver((entries) => {
      const current = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => Math.abs(a.boundingClientRect.top) - Math.abs(b.boundingClientRect.top))[0];
      if (current) setActiveSection(current.target.id);
    }, { rootMargin: "-30% 0px -58% 0px", threshold: 0 });
    targets.forEach((target) => observer.observe(target));
    return () => observer.disconnect();
  }, [pathname]);

  useEffect(() => {
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setProductsOpen(false);
        setMobileOpen(false);
        const mobilePanel = document.getElementById("mobile-menu");
        const productsPanel = document.getElementById("products-menu");
        if (mobilePanel?.getAttribute("aria-hidden") === "false") mobileToggleRef.current?.focus();
        else if (productsPanel?.getAttribute("aria-hidden") === "false") toggleRef.current?.focus();
      }
    };
    const onPointerDown = (event: PointerEvent) => {
      if (headerRef.current && !headerRef.current.contains(event.target as Node)) setProductsOpen(false);
    };
    window.addEventListener("keydown", onKeyDown);
    window.addEventListener("pointerdown", onPointerDown);
    return () => {
      window.removeEventListener("keydown", onKeyDown);
      window.removeEventListener("pointerdown", onPointerDown);
    };
  }, []);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    if (!mobileOpen) return () => { document.body.style.overflow = ""; };
    const panel = menuRef.current;
    const focusable = () => Array.from(panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ) ?? []);
    focusable()[0]?.focus();
    const trapFocus = (event: KeyboardEvent) => {
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      if (event.shiftKey && document.activeElement === items[0]) {
        event.preventDefault(); items[items.length - 1].focus();
      } else if (!event.shiftKey && document.activeElement === items[items.length - 1]) {
        event.preventDefault(); items[0].focus();
      }
    };
    window.addEventListener("keydown", trapFocus);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", trapFocus);
    };
  }, [mobileOpen]);

  const active = (href: string) => pathname === href || (pathname === "/" && activeSection === href.split("#")[1]);
  const closeMobile = () => setMobileOpen(false);

  return (
    <header ref={headerRef} className="sticky inset-x-0 top-0 z-50 h-[var(--header-h)] border-b border-border bg-surface">
      <div className="mx-auto flex h-full w-full max-w-shell items-center justify-between px-6 lg:px-12">
        <Link href="/" className="inline-flex min-h-11 items-center rounded-sm text-lg font-semibold tracking-[-0.03em] text-text" aria-label="Vectis Inc. home">
          Vectis <span className="ml-2 font-normal text-text-muted">Inc.</span>
        </Link>

        <nav className="hidden items-center gap-2 lg:flex" aria-label="Primary">
          <div className="relative">
            <button
              ref={toggleRef}
              type="button"
              aria-expanded={productsOpen}
              aria-controls="products-menu"
              onClick={() => setProductsOpen((open) => !open)}
              className={`inline-flex h-10 items-center gap-2 rounded-md px-4 text-sm font-medium transition-colors hover:bg-bg ${active(productTrigger.href) ? "text-accent" : "text-text-muted"}`}
            >
              {productTrigger.label}
              <ChevronDown className={`h-4 w-4 transition-transform ${productsOpen ? "rotate-180" : ""}`} aria-hidden="true" />
            </button>
          </div>
          {mainLinks.map((item) => (
            <Link
              key={item.label}
              href={item.href}
              aria-current={active(item.href) ? (item.href.includes("#") ? "location" : "page") : undefined}
              className={`inline-flex h-10 items-center rounded-md px-4 text-sm font-medium transition-colors hover:bg-bg ${active(item.href) ? "text-accent" : "text-text-muted hover:text-text"}`}
            >
              {item.label}
            </Link>
          ))}
          <Link href="/#contact" className="btn btn-primary ml-4">Contact</Link>
        </nav>

        <button
          ref={mobileToggleRef}
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close menu" : "Open menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          className="inline-flex h-12 w-12 items-center justify-center rounded-md border border-border bg-surface text-text lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <div
        id="products-menu"
        aria-hidden={!productsOpen}
        className={`absolute left-1/2 top-[calc(100%-1px)] w-[min(720px,calc(100vw-48px))] -translate-x-1/2 rounded-b-xl border border-border bg-surface p-6 shadow-soft ${productsOpen ? "hidden lg:block" : "hidden"}`}
      >
          <div className="grid grid-cols-3 gap-6">
            <div>
              <p className="eyebrow mb-2">Products</p>
              {productDropdownMain.map((item) => <MenuLink key={item.label} item={item} />)}
            </div>
            <div>
              <p className="eyebrow mb-2">Resources</p>
              {productDropdownResources.map((item) => <MenuLink key={item.label} item={item} />)}
            </div>
            <div>
              <p className="eyebrow mb-2">Log in</p>
              {productDropdownLogin.map((item) => <MenuLink key={item.label} item={item} />)}
            </div>
          </div>
      </div>

      <div
        ref={menuRef}
        id="mobile-menu"
        aria-hidden={!mobileOpen}
        className={`fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 overflow-y-auto border-t border-border bg-surface px-6 py-6 lg:hidden ${mobileOpen ? "block" : "hidden"}`}
      >
          <nav aria-label="Primary" className="mx-auto flex max-w-shell flex-col">
            {[productTrigger, ...mainLinks].map((item) => (
              <Link key={item.label} href={item.href} onClick={closeMobile} aria-current={active(item.href) ? "page" : undefined} className="flex min-h-12 items-center justify-between border-b border-border text-lg font-medium text-text">
                {item.label}<ArrowRight className="h-4 w-4 text-text-muted" aria-hidden="true" />
              </Link>
            ))}
            <p className="eyebrow mb-2 mt-6">Products</p>
            {productsData.map((product) => (
              <Link key={product.id} href={`/${product.slug}`} onClick={closeMobile} className="flex min-h-11 items-center justify-between border-b border-border text-sm text-text-muted hover:text-text">
                {product.name}<ArrowRight className="h-4 w-4" aria-hidden="true" />
              </Link>
            ))}
            <div className="mt-6">
              <Link href="/#contact" onClick={closeMobile} className="btn btn-primary w-full">Contact</Link>
            </div>
          </nav>
      </div>
    </header>
  );
}
