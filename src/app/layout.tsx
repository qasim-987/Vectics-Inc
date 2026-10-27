import type { Metadata, Viewport } from "next";
// Self-hosted webfonts (no external requests, no layout shift, works offline).
import "@fontsource-variable/inter/wght.css";
import "@fontsource/instrument-serif/latin-400.css";
import "@fontsource/instrument-serif/latin-400-italic.css";
import "@fontsource/ibm-plex-mono/latin-400.css";
import "@fontsource/ibm-plex-mono/latin-500.css";
import "@fontsource/ibm-plex-mono/latin-600.css";
import "@fontsource/outfit/latin-700.css";
import "@fontsource/outfit/latin-800.css";
import "./globals.css";
import VectisHeader from "@/components/VectisHeader";
import VectisFooter from "@/components/VectisFooter";
import ContactModal from "@/components/ContactModal";
import ScrollObserver from "@/components/ScrollObserver";
import PageTransition from "@/components/PageTransition";
import { siteMeta } from "@/data/vectis";

export const metadata: Metadata = {
  metadataBase: new URL("https://vectisoperations.tech"),
  title: {
    default: "Vectis Inc. — Software for the work that moves the world",
    template: "%s | Vectis Inc.",
  },
  description:
    "Vectis Inc. builds focused software for operational businesses. Explore RouteCore, live distributor software, and PulseGrid and Vectis Studio in development.",
  keywords: [
    "Vectis Inc",
    "RouteCore",
    "Distribution software",
    "Route collections",
    "Warehouse management",
    "FMCG distribution",
    "Cash reconciliation",
    "Inventory tracking",
    "Operational software",
  ],
  authors: [{ name: "Vectis Operations Inc." }],
  creator: "Vectis Inc.",
  publisher: "Vectis Inc.",
  formatDetection: {
    email: true,
    address: true,
    telephone: true,
  },
  openGraph: {
    title: "Vectis Inc. — Software for the work that moves the world",
    description:
      "Vectis Inc. builds focused software for operational businesses. Explore RouteCore, live distributor software, and PulseGrid and Vectis Studio in development.",
    url: "https://vectisoperations.tech",
    siteName: "Vectis Inc.",
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Vectis Inc. — Software for the work that moves the world",
    description:
      "Focused software for operational businesses. Explore RouteCore, PulseGrid, and Vectis Studio.",
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  alternates: {
    canonical: "https://vectisoperations.tech",
  },
};

export const viewport: Viewport = {
  themeColor: "#0D1115",
  width: "device-width",
  initialScale: 1,
  maximumScale: 5,
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const jsonLdOrg = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteMeta.name,
    legalName: siteMeta.legalName,
    url: "https://vectisoperations.tech",
    email: siteMeta.email,
    description: siteMeta.description,
    sameAs: [],
  };

  const jsonLdWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteMeta.name,
    url: "https://vectisoperations.tech",
  };

  return (
    <html lang="en" className="dark scroll-smooth">
      <head>
        {/* Fonts are imported as self-hosted @fontsource CSS in this layout. */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdOrg) }}
        />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebSite) }}
        />
        {/* No-JS fallback: never leave motion-hidden content invisible. */}
        <noscript>
          <style
            dangerouslySetInnerHTML={{
              __html:
                '[style*="opacity:0"]{opacity:1!important;transform:none!important;clip-path:none!important}',
            }}
          />
        </noscript>
      </head>
      <body className="min-h-screen bg-ink-soft text-paper antialiased font-sans overflow-x-hidden selection:bg-paper selection:text-ink">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-paper focus:text-ink focus:rounded-md focus:shadow-lg focus:outline-none text-xs font-semibold uppercase tracking-wider"
        >
          Skip to main content
        </a>
        <ScrollObserver />
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
