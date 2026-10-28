"use client";

import React, { useState, useEffect, useRef } from "react";
import { X, CheckCircle2, AlertCircle, Send, Mail } from "lucide-react";
import { siteMeta } from "@/data/vectis";

interface ContactModalProps {
  isOpen?: boolean;
  onClose?: () => void;
}

export default function ContactModal({ isOpen: controlledIsOpen, onClose: controlledOnClose }: ContactModalProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [formLoadedAt, setFormLoadedAt] = useState<number>(0);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    organization: "",
    message: "",
    botField: "",
  });
  const [status, setStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [errorMessage, setErrorMessage] = useState("");
  const modalRef = useRef<HTMLDivElement>(null);
  const returnFocusRef = useRef<HTMLElement | null>(null);

  const activeIsOpen = controlledIsOpen !== undefined ? controlledIsOpen : isOpen;

  const handleClose = () => {
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setIsOpen(false);
    }
    if (status === "success") {
      setStatus("idle");
      setFormData({ name: "", email: "", organization: "", message: "", botField: "" });
    }
  };

  const handleCloseRef = useRef(handleClose);
  useEffect(() => {
    handleCloseRef.current = handleClose;
  });

  useEffect(() => {
    // Listen for custom trigger event
    const handleOpenEvent = () => {
      setIsOpen(true);
      setFormLoadedAt(Date.now());
    };
    window.addEventListener("open-contact", handleOpenEvent);

    const handleHashChange = () => {
      if (window.location.hash === "#contact-form") {
        setIsOpen(true);
        setFormLoadedAt(Date.now());
      }
    };
    window.addEventListener("hashchange", handleHashChange);
    if (window.location.hash === "#contact-form") {
      setIsOpen(true);
      setFormLoadedAt(Date.now());
    }

    return () => {
      window.removeEventListener("open-contact", handleOpenEvent);
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  useEffect(() => {
    if (!activeIsOpen) {
      document.body.style.overflow = "";
      return;
    }

    returnFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null;
    setFormLoadedAt(Date.now());
    document.body.style.overflow = "hidden";
    const focusable = () => Array.from(
      modalRef.current?.querySelectorAll<HTMLElement>(
        'a[href], button:not([disabled]), input:not([disabled]), textarea:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])',
      ) ?? [],
    ).filter((element) => !element.hasAttribute("aria-hidden"));
    window.requestAnimationFrame(() => focusable()[0]?.focus());

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        handleCloseRef.current();
        return;
      }
      if (event.key !== "Tab") return;
      const elements = focusable();
      if (!elements.length) return;
      const first = elements[0];
      const last = elements[elements.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => {
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
      returnFocusRef.current?.focus();
    };
  }, [activeIsOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus("loading");
    setErrorMessage("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: formData.name,
          email: formData.email,
          service: formData.organization || "Project or area of interest",
          message: formData.message,
          botField: formData.botField,
          formLoadedAt,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        throw new Error(data.error || "Unable to send message. Please try again.");
      }

      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setErrorMessage(err.message || "An unexpected error occurred. Please contact us directly via email.");
    }
  };

  if (!activeIsOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 md:p-8 bg-dark/70 backdrop-blur-sm transition-opacity duration-300 animate-fade-in"
      role="dialog"
      aria-modal="true"
      aria-labelledby="contact-modal-title"
      onClick={(e) => {
        if (e.target === e.currentTarget) handleClose();
      }}
    >
      <div
        ref={modalRef}
        className="relative w-full max-w-xl rounded-xl border border-surface-border bg-surface p-6 sm:p-8 text-content shadow-2xl transition-all max-h-[90vh] overflow-y-auto"
      >
        <button
          onClick={handleClose}
          aria-label="Close dialog"
          className="absolute right-4 top-4 rounded-lg p-2 text-content-muted hover:bg-surface-muted hover:text-content transition-colors"
        >
          <X className="h-5 w-5" />
        </button>

        <div className="mb-6">
          <span className="text-[0.78rem] font-mono uppercase tracking-[0.18em] text-brand">Get in touch
          </span>
          <h2 id="contact-modal-title" className="mt-2 text-2xl sm:text-3xl font-semibold tracking-tight text-content">
            Let’s talk about what you need.
          </h2>
          <p className="mt-2 text-sm sm:text-base text-content-muted font-normal">
            Tell us about your team, the work you want to improve, and what you would like to build.
          </p>
        </div>

        {status === "success" ? (
          <div className="rounded-lg border border-emerald-200 bg-emerald-50 p-6 text-center space-y-4">
            <CheckCircle2 className="mx-auto h-10 w-10 text-emerald-700" />
            <h3 className="text-lg font-semibold text-content">Message received</h3>
            <p className="text-sm text-content-muted">
              Thank you for reaching out. Thank you for reaching out. We will review your message and reply using the email address you provided.
            </p>
            <button
              onClick={handleClose}
              className="mt-4 inline-flex items-center justify-center rounded-md bg-brand px-6 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-brand-deep"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            {status === "error" && (
              <div className="flex items-start gap-4 rounded-lg border border-accent-red/30 bg-accent-red/10 p-4 text-xs text-content">
                <AlertCircle className="h-4 w-4 shrink-0 text-accent-red mt-2" />
                <div className="space-y-2">
                  <p>{errorMessage}</p>
                  <p>
                    Or write directly to:{" "}
                    <a href={`mailto:${siteMeta.email}`} className="underline font-mono text-content">
                      {siteMeta.email}
                    </a>
                  </p>
                </div>
              </div>
            )}

            {/* Honeypot field (anti-spam) */}
            <div className="hidden" aria-hidden="true">
              <label htmlFor="botField">Leave this blank</label>
              <input
                type="text"
                id="botField"
                name="botField"
                tabIndex={-1}
                autoComplete="off"
                value={formData.botField}
                onChange={(e) => setFormData({ ...formData, botField: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="name" className="text-xs font-medium uppercase tracking-wider text-content-muted">
                Your Name <span className="text-accent-red">*</span>
              </label>
              <input
                type="text"
                id="name"
                required
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="Your name"
                className="w-full rounded-md border border-surface-border bg-surface-muted px-4 py-2 text-sm text-content placeholder:text-content-subtle focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="email" className="text-xs font-medium uppercase tracking-wider text-content-muted">
                Email Address <span className="text-accent-red">*</span>
              </label>
              <input
                type="email"
                id="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                placeholder="name@company.com"
                className="w-full rounded-md border border-surface-border bg-surface-muted px-4 py-2 text-sm text-content placeholder:text-content-subtle focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="organization" className="text-xs font-medium uppercase tracking-wider text-content-muted">
                Organization / Operation Type
              </label>
              <input
                type="text"
                id="organization"
                value={formData.organization}
                onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                placeholder="Company or project (optional)"
                className="w-full rounded-md border border-surface-border bg-surface-muted px-4 py-2 text-sm text-content placeholder:text-content-subtle focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-all"
              />
            </div>

            <div className="space-y-2">
              <label htmlFor="message" className="text-xs font-medium uppercase tracking-wider text-content-muted">
                Message <span className="text-accent-red">*</span>
              </label>
              <textarea
                id="message"
                required
                rows={4}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Tell us about the work you want to improve or the product you want to build..."
                className="w-full rounded-md border border-surface-border bg-surface-muted px-4 py-2 text-sm text-content placeholder:text-content-subtle focus:border-brand focus:outline-none focus:ring-1 focus:ring-brand transition-all resize-none"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row items-center justify-between gap-4">
              <a
                href={`mailto:${siteMeta.email}`}
                className="inline-flex items-center gap-2 text-xs text-content-muted hover:text-content transition-colors"
              >
                <Mail className="h-3.5 w-3.5" />
                <span>Prefer direct email? {siteMeta.email}</span>
              </a>

              <button
                type="submit"
                disabled={status === "loading"}
                className="w-full sm:w-auto inline-flex items-center justify-center gap-2 rounded-md bg-brand px-6 py-2 text-xs font-semibold uppercase tracking-wider text-white transition-colors hover:bg-brand-deep disabled:opacity-50"
              >
                {status === "loading" ? (
                  <span>Sending...</span>
                ) : (
                  <>
                    <span>Send Message</span>
                    <Send className="h-3.5 w-3.5" />
                  </>
                )}
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
