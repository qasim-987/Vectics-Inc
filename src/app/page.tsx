import React from "react";
import HeroSlideshow from "@/components/home/HeroSlideshow";
import StatementSection from "@/components/home/StatementSection";
import DayNarrative from "@/components/home/DayNarrative";
import ProductsSection from "@/components/home/ProductsSection";
import PrinciplesSection from "@/components/home/PrinciplesSection";
import ProcessSteps from "@/components/home/ProcessSteps";

/**
 * Home — premium editorial rebuild.
 * Rhythm: dark hero → light statement → dark scroll story → light products →
 * dark principles → deep process. The closing CTA and footer live in the root
 * layout (VectisFooter), so routes/functionality remain untouched.
 *
 * The content is data-driven and the closing contact/footer remain shared
 * through the root layout.
 */
export default function HomePage() {
  return (
    <div className="w-full">
      <HeroSlideshow />
      <StatementSection />
      <DayNarrative />
      <ProductsSection />
      <PrinciplesSection />
      <ProcessSteps />
    </div>
  );
}
