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
 * All original copy is preserved; section labels from the brief ("Built with
 * purpose.", "From problem to product.", etc.) are layered in as headings.
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
