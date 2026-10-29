import Link from "next/link";
import { ArrowUp, Mail } from "lucide-react";
import { siteMeta } from "@/data/vectis";

const footerLinks = [
  { label: "Services", href: "/#services" },
  { label: "Our approach", href: "/#approach" },
  { label: "About", href: "/about" },
  { label: "Privacy", href: "/privacy" },
  { label: "Terms", href: "/terms" },
];

export default function VectisFooter() {
  return (
    <footer className="site-footer border-t border-darkText/15 bg-dark text-darkText">
      <section id="contact" aria-labelledby="contact-title" className="py-16 sm:py-24">
        <div className="mx-auto grid max-w-shell gap-8 px-6 sm:px-8 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end lg:px-12">
          <div className="max-w-3xl">
            <p className="eyebrow eyebrow-dark">Contact</p>
            <h2 id="contact-title" className="mt-5 text-3xl font-semibold leading-tight tracking-[-0.04em] text-darkText sm:text-5xl">
              Have a problem worth solving?
            </h2>
            <p className="mt-5 max-w-2xl text-base leading-7 text-darkText/75 sm:text-lg">
              Tell us what your business needs. We can help you work out a practical next step.
            </p>
          </div>
          <div className="flex flex-wrap gap-3 lg:justify-end">
            <Link href="/contact" className="btn btn-primary">Start a project</Link>
            <a href={`mailto:${siteMeta.email}`} className="btn btn-outline">
              <Mail className="h-4 w-4" aria-hidden="true" />
              Email us
            </a>
          </div>
        </div>
      </section>

      <div className="border-t border-darkText/15">
        <div className="mx-auto grid max-w-shell gap-10 px-6 py-10 sm:px-8 md:grid-cols-[minmax(0,1fr)_auto] md:items-start lg:px-12">
          <div>
            <Link href="/" className="inline-flex min-h-11 items-center text-lg font-semibold tracking-[-0.04em] text-darkText" aria-label="Vectis Inc. home">
              Vectis <span className="ml-2 font-normal text-darkText/70">Inc.</span>
            </Link>
            <p className="mt-3 max-w-md text-sm leading-6 text-darkText/70">
              AI-powered software and automation for businesses.
            </p>
            <a href={`mailto:${siteMeta.email}`} className="mt-4 inline-flex min-h-11 items-center text-sm text-darkText/80 underline decoration-darkText/30 underline-offset-4 hover:text-darkText">
              {siteMeta.email}
            </a>
          </div>

          <nav aria-label="Footer" className="grid grid-cols-2 gap-x-8 gap-y-2 sm:grid-cols-3">
            {footerLinks.map((link) => (
              <Link key={link.label} href={link.href} className="inline-flex min-h-11 items-center text-sm text-darkText/75 transition-colors hover:text-darkText">
                {link.label}
              </Link>
            ))}
          </nav>
        </div>
      </div>

      <div className="border-t border-darkText/15">
        <div className="mx-auto flex max-w-shell flex-col gap-3 px-6 py-5 text-sm text-darkText/65 sm:flex-row sm:items-center sm:justify-between sm:px-8 lg:px-12">
          <span>© {new Date().getFullYear()} {siteMeta.legalName}. All rights reserved.</span>
          <a href="/#hero" className="inline-flex min-h-11 items-center gap-2 hover:text-darkText">
            Back to top <ArrowUp className="h-4 w-4" aria-hidden="true" />
          </a>
        </div>
      </div>
    </footer>
  );
}
