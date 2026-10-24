import React from "react";
import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, BookOpen, Clock, Calendar } from "lucide-react";
import { journalArticles } from "@/data/vectis";

export const metadata: Metadata = {
  title: "Journal & Field Essays — Vectis Inc.",
  description:
    "Writing on operational reality, distribution software, warehouse systems, and physical commerce from Vectis Inc.",
  alternates: {
    canonical: "https://vectisoperations.tech/journal",
  },
};

export default function JournalPage() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Blog",
    name: "Vectis Inc. Journal",
    description: "Writing on operations, software, and physical commerce.",
    url: "https://vectisoperations.tech/journal",
    blogPost: journalArticles.map((article) => ({
      "@type": "BlogPosting",
      headline: article.title,
      description: article.excerpt,
      datePublished: "2026-10-01",
      author: {
        "@type": "Organization",
        name: "Vectis Inc.",
      },
    })),
  };

  return (
    <div className="w-full pt-32 pb-24">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      {/* Hero Header */}
      <section className="mx-auto max-w-[1180px] px-5 md:px-8 mb-20">
        <div className="max-w-3xl">
          <span className="text-xs font-mono uppercase tracking-[0.2em] text-accent-amber block mb-6">
            // Field Notes
          </span>

          <h1 className="text-4xl sm:text-6xl font-serif font-normal tracking-tight text-paper leading-[1.1]">
            Writing on operations, software, and physical commerce.
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-muted font-normal leading-relaxed">
            Essays and engineering dispatches from warehouse docks, distributor ledger desks, and the front lines of daily route operations.
          </p>
        </div>
      </section>

      {/* Journal Articles List */}
      <section className="mx-auto max-w-[1180px] px-5 md:px-8 space-y-16">
        {journalArticles.map((article, index) => (
          <article
            key={article.id}
            id={article.slug}
            className="reveal rounded-2xl border border-white/[0.08] bg-ink-card/40 p-8 sm:p-12 hover:border-white/20 transition-all scroll-mt-28"
          >
            {/* Meta Row */}
            <div className="flex flex-wrap items-center justify-between gap-4 border-b border-white/[0.08] pb-6 mb-8 text-xs font-mono text-muted">
              <div className="flex items-center gap-3">
                <span className="text-accent-amber font-semibold uppercase tracking-wider">
                  {article.category}
                </span>
                <span>•</span>
                <span className="rounded-full border border-white/10 px-2.5 py-0.5 text-[0.68rem]">
                  {article.categoryBadge}
                </span>
              </div>
              <div className="flex items-center gap-4">
                <span className="inline-flex items-center gap-1.5">
                  <Calendar className="h-3.5 w-3.5" />
                  {article.publishedDate}
                </span>
                <span>•</span>
                <span className="inline-flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {article.readingTime}
                </span>
              </div>
            </div>

            {/* Article Headline */}
            <h2 className="text-2xl sm:text-4xl font-serif font-normal tracking-tight text-paper mb-6 leading-snug">
              {article.title}
            </h2>

            {/* Excerpt Lead */}
            <p className="text-base sm:text-lg text-paper/90 font-serif italic mb-8 border-l-2 border-accent-amber/40 pl-4 py-1 leading-relaxed">
              {article.excerpt}
            </p>

            {/* Full Essay Body */}
            <div className="space-y-4 text-base sm:text-lg text-paper/80 font-normal leading-relaxed pt-2">
              {article.body.map((paragraph, pIdx) => (
                <p key={pIdx}>{paragraph}</p>
              ))}
            </div>

            {/* Article Footer */}
            <div className="mt-10 pt-6 border-t border-white/[0.08] flex items-center justify-between text-xs font-mono text-muted-dark">
              <span>Published by Vectis Inc. Editorial</span>
              <span>Distribution Engineering</span>
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
