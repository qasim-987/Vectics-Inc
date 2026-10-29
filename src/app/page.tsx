import React from "react";
import HomepageHero from "@/components/home/HomepageHero";
import StatementSection from "@/components/home/StatementSection";
import DayNarrative from "@/components/home/DayNarrative";
import ProductsSection from "@/components/home/ProductsSection";
import PrinciplesSection from "@/components/home/PrinciplesSection";
import ProcessSteps from "@/components/home/ProcessSteps";

/**
 * Homepage content remains in its existing order and uses the shared neutral visual system.
 *
 * The content is data-driven and the closing contact/footer remain shared
 * through the root layout.
 */
export default function HomePage() {
  return (
    <div className="w-full">
      <HomepageHero />
      <StatementSection />
      <DayNarrative />
      <ProductsSection />
      <PrinciplesSection />
      <ProcessSteps />
    </div>
  );
}
