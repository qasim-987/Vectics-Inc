"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ArrowRight, Menu, X } from "lucide-react";

const navigation = [
  { label: "Services", href: "/#services" },
  { label: "Approach", href: "/#approach" },
  { label: "About", href: "/about" },
];

export default function VectisHeader() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const toggleRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    if (!mobileOpen) return () => { document.body.style.overflow = ""; };

    const panel = panelRef.current;
    const focusable = () => Array.from(panel?.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ) ?? []);
    focusable()[0]?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setMobileOpen(false);
        toggleRef.current?.focus();
        return;
      }
      if (event.key !== "Tab") return;
      const items = focusable();
      if (!items.length) return;
      if (event.shiftKey && document.activeElement === items[0]) {
        event.preventDefault();
        items[items.length - 1].focus();
      } else if (!event.shiftKey && document.activeElement === items[items.length - 1]) {
        event.preventDefault();
        items[0].focus();
      }
    };
    window.addEventListener("keydown", onKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [mobileOpen]);

  const closeMenu = () => setMobileOpen(false);

  return (
    <header className="sticky inset-x-0 top-0 z-50 h-[var(--header-h)] border-b border-border bg-surface">
      <div className="mx-auto flex h-full w-full max-w-shell items-center justify-between px-6 sm:px-8 lg:px-12">
        <Link href="/" className="inline-flex min-h-11 items-center rounded-sm text-lg font-semibold tracking-[-0.04em] text-text" aria-label="Vectis Inc. home">
          Vectis <span className="ml-2 font-normal text-text-muted">Inc.</span>
        </Link>

        <nav className="hidden items-center gap-1 lg:flex" aria-label="Primary">
          {navigation.map((item) => (
            <Link key={item.label} href={item.href} className="inline-flex min-h-11 items-center rounded-md px-4 text-sm font-medium text-text-muted transition-colors hover:bg-bg hover:text-text">
              {item.label}
            </Link>
          ))}
          <Link href="/#contact" className="btn btn-primary ml-3">Start a project</Link>
        </nav>

        <button
          ref={toggleRef}
          type="button"
          onClick={() => setMobileOpen((open) => !open)}
          aria-label={mobileOpen ? "Close navigation menu" : "Open navigation menu"}
          aria-expanded={mobileOpen}
          aria-controls="mobile-menu"
          className="inline-flex h-11 w-11 items-center justify-center rounded-md border border-border bg-surface text-text lg:hidden"
        >
          {mobileOpen ? <X className="h-5 w-5" aria-hidden="true" /> : <Menu className="h-5 w-5" aria-hidden="true" />}
        </button>
      </div>

      <div
        ref={panelRef}
        id="mobile-menu"
        aria-hidden={!mobileOpen}
        className={`fixed inset-x-0 bottom-0 top-[var(--header-h)] z-40 overflow-y-auto border-t border-border bg-surface px-6 py-8 lg:hidden ${mobileOpen ? "block" : "hidden"}`}
      >
        <nav aria-label="Mobile primary" className="mx-auto flex max-w-shell flex-col">
          {navigation.map((item) => (
            <Link key={item.label} href={item.href} onClick={closeMenu} className="flex min-h-14 items-center justify-between border-b border-border text-lg font-medium text-text">
              {item.label}
              <ArrowRight className="h-4 w-4 text-text-muted" aria-hidden="true" />
            </Link>
          ))}
          <Link href="/#contact" onClick={closeMenu} className="btn btn-primary mt-8 w-full">Start a project</Link>
        </nav>
      </div>
    </header>
  );
}
