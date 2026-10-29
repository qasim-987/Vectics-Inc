import type { Metadata, Viewport } from "next";
import "./globals.css";
import VectisHeader from "@/components/VectisHeader";
import VectisFooter from "@/components/VectisFooter";
import ContactModal from "@/components/ContactModal";
import PageTransition from "@/components/PageTransition";
import { siteMeta } from "@/data/vectis";

const siteUrl = "https://vectisoperations.tech";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Vectis Inc. — AI Software & Business Automation",
    template: "%s | Vectis Inc.",
  },
  description:
    "Vectis builds AI-powered software and automation for businesses, including custom websites, web apps, dashboards, internal tools, and integrations.",
  keywords: [
    "Vectis Inc",
    "AI business automation",
    "AI agents",
    "custom websites",
    "web applications",
    "dashboards and analytics",
    "internal tools",
    "API integrations",
  ],
  authors: [{ name: siteMeta.legalName }],
  creator: siteMeta.name,
  publisher: siteMeta.name,
  formatDetection: { email: true, address: false, telephone: false },
  openGraph: {
    title: "Vectis Inc. — AI Software & Business Automation",
    description:
      "AI-powered software and automation for businesses, built around the way teams work.",
    url: siteUrl,
    siteName: siteMeta.name,
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary",
    title: "Vectis Inc. — AI Software & Business Automation",
    description:
      "AI-powered software and automation for businesses, built around the way teams work.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-snippet": -1 },
  },
  alternates: { canonical: siteUrl },
};

export const viewport: Viewport = {
  themeColor: "#FAFAF7",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteMeta.name,
    legalName: siteMeta.legalName,
    url: siteUrl,
    email: siteMeta.email,
    description: siteMeta.description,
  };

  const jsonLdWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteMeta.name,
    url: siteUrl,
  };

  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }} />
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }} />
      </head>
      <body className="min-h-screen bg-bg text-text antialiased font-sans">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[60] focus:rounded-md focus:bg-accent focus:px-4 focus:py-3 focus:text-white focus:outline-none"
        >
          Skip to main content
        </a>
        <VectisHeader />
        <main id="main-content" className="relative">
          <PageTransition>{children}</PageTransition>
        </main>
        <VectisFooter />
        <ContactModal />
      </body>
    </html>
  );
}
