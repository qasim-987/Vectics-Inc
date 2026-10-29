import type { Metadata } from "next";

export const SITE_URL = "https://vectisoperations.tech";
const SOCIAL_IMAGE = "/opengraph-image";

export function createPageMetadata(title: string, description: string, path: string): Metadata {
  const url = new URL(path, SITE_URL).toString();
  const fullTitle = `${title} | Vectis Inc.`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title: fullTitle,
      description,
      url,
      siteName: "Vectis Inc.",
      images: [{ url: SOCIAL_IMAGE, width: 1200, height: 630, alt: "Vectis Inc. — AI software and business automation" }],
      locale: "en_US",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: fullTitle,
      description,
      images: [SOCIAL_IMAGE],
    },
  };
}
