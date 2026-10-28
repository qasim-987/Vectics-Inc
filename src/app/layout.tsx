import type { Metadata, Viewport } from "next";
// Self-hosted webfonts (no external requests, no layout shift, works offline).
import "@fontsource-variable/inter/wght.css";
import "@fontsource/instrument-serif/latin-400.css";
import "./globals.css";
import VectisHeader from "@/components/VectisHeader";
import VectisFooter from "@/components/VectisFooter";
import ContactModal from "@/components/ContactModal";
import PageTransition from "@/components/PageTransition";
import { siteMeta } from "@/data/vectis";

export const metadata: Metadata = {
  metadataBase: new URL("https://vectisoperations.tech"),
  title: {
    default: "Vectis Inc. — Custom Software, AI & Web Apps",
    template: "%s | Vectis Inc.",
  },
  description:
    "Vectis builds custom software, web applications, and practical AI automation for real-world teams. A Vectis company within Forza Inc.",
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
    title: "Vectis Inc. — Custom Software, AI & Web Apps",
    description:
      "Vectis builds custom software, web applications, and practical AI automation for real-world teams. A Vectis company within Forza Inc.",
    url: "https://vectisoperations.tech",
    siteName: "Vectis Inc.",
    images: [{ url: "/opengraph-image.png", width: 1200, height: 630, alt: "Vectis Inc. — custom software, AI and web applications" }],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    images: ["/opengraph-image.png"],
    title: "Vectis Inc. — Custom Software, AI & Web Apps",
    description:
      "Custom software, thoughtful web applications, and useful AI automation for real-world teams.",
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
  themeColor: "#FAFAF7",
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
    parentOrganization: {
      "@type": "Organization",
      name: "Forza Inc.",
      url: "https://forzainc.tech/",
    },
  };

  const jsonLdWebSite = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: siteMeta.name,
    url: "https://vectisoperations.tech",
  };

  return (
    <html lang="en" className="scroll-smooth">
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
      <body className="min-h-screen bg-bg text-text antialiased font-sans overflow-x-hidden">
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-[60] focus:px-4 focus:py-2 focus:bg-accent focus:text-darkText focus:rounded-md focus:shadow-soft focus:outline-none text-xs font-semibold uppercase tracking-wider"
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
