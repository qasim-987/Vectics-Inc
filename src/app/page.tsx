import HomepageHero from "@/components/home/HomepageHero";
import ProductsSection from "@/components/home/ProductsSection";
import ProcessSteps from "@/components/home/ProcessSteps";

export default function HomePage() {
  return (
    <div className="w-full">
      <HomepageHero />
      <ProductsSection />
      <ProcessSteps />
    </div>
  );
}
