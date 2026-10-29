import ContactPageContent from "./ContactPageContent";
import { createPageMetadata } from "@/lib/seo";

export const metadata = createPageMetadata(
  "Contact",
  "Talk to Vectis about custom software, web applications, or practical AI automation for your team.",
  "/contact",
);

export default function ContactPage() {
  return <ContactPageContent />;
}
