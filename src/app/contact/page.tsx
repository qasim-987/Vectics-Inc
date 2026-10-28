import type { Metadata } from "next";
import ContactPageContent from "./ContactPageContent";

export const metadata: Metadata = {
  title: "Contact Vectis — Start a Software or AI Project",
  description: "Talk to Vectis about custom software, web applications, or practical AI automation for your team.",
  alternates: {
    canonical: "https://vectisoperations.tech/contact",
  },
};

export default function ContactPage() {
  return <ContactPageContent />;
}
