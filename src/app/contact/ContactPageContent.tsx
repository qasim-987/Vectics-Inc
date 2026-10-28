"use client";

import React, { useState } from "react";
import { ChevronDown, ArrowRight, Mail } from "lucide-react";
import { siteMeta } from "@/data/vectis";
import Container from "@/components/Container";
import SectionLabel from "@/components/SectionLabel";
import Button from "@/components/Button";

const contactFaqs = [
  {
    q: "What should I include in an initial inquiry?",
    a: "A short description of your team, the problem you are trying to solve, and any useful timing or technical context is a great start. You do not need a finished specification.",
  },
  {
    q: "Can you help shape an early idea?",
    a: "Yes. We can help clarify the problem, explore possible approaches, and agree on a sensible first scope before committing to a larger build.",
  },
  {
    q: "What happens after I send a message?",
    a: "Your inquiry is sent to the Vectis team. We will review the details and reply using the email address you provided.",
  },
];

export default function ContactPageContent() {
  const [openFaq, setOpenFaq] = useState<number | null>(0);
  const openForm = () => window.dispatchEvent(new CustomEvent("open-contact"));

  return (
    <div className="min-h-[70vh] bg-canvas pb-24 pt-32 text-char sm:pb-32">
      <Container as="section">
        <div className="max-w-3xl">
          <SectionLabel className="eyebrow-light">Start a conversation</SectionLabel>
          <h1 className="mt-5 font-serif text-[clamp(2.8rem,6vw,5.8rem)] leading-[1.02] tracking-[-0.035em]">
            Tell us what you&apos;re trying to make better.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-char-soft">
            Whether you need custom software, a considered web application, or a practical use for AI, start with the problem. We&apos;ll take it from there together.
          </p>
          <div className="mt-9 flex flex-wrap gap-4">
            <button type="button" onClick={openForm} className="btn btn-primary group">
              <span>Send an inquiry</span>
              <ArrowRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-1" aria-hidden="true" />
            </button>
            <a href={`mailto:${siteMeta.email}`} className="btn border border-char/20 text-char hover:bg-char/5">
              <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              <span>{siteMeta.email}</span>
            </a>
            <Button href="/#products" variant="text">See our products</Button>
          </div>
        </div>

        <div className="mt-20 grid gap-12 border-t border-char/15 pt-10 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-4">
            <span className="eyebrow eyebrow-light">// A few quick answers</span>
            <h2 className="mt-4 font-serif text-3xl leading-tight sm:text-4xl">Before we talk.</h2>
            <p className="mt-4 max-w-sm leading-relaxed text-char-soft">
              A clear first note is enough. No lengthy brief or polished pitch deck required.
            </p>
          </div>
          <div id="faq" className="space-y-3 lg:col-span-8">
            {contactFaqs.map((faq, index) => (
              <section key={faq.q} className="overflow-hidden rounded-card border border-char/15 bg-canvas-raised">
                <h3>
                  <button
                    type="button"
                    aria-expanded={openFaq === index}
                    aria-controls={`contact-faq-${index}`}
                    onClick={() => setOpenFaq(openFaq === index ? null : index)}
                    className="flex min-h-16 w-full items-center justify-between gap-5 px-5 py-4 text-left font-medium text-char sm:px-6"
                  >
                    {faq.q}
                    <ChevronDown className={`h-4 w-4 shrink-0 text-brass-deep transition-transform ${openFaq === index ? "rotate-180" : ""}`} aria-hidden="true" />
                  </button>
                </h3>
                {openFaq === index && (
                  <p id={`contact-faq-${index}`} className="border-t border-char/10 px-5 py-5 text-sm leading-relaxed text-char-soft sm:px-6">
                    {faq.a}
                  </p>
                )}
              </section>
            ))}
          </div>
        </div>
      </Container>
    </div>
  );
}
