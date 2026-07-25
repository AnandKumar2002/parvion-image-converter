import HeroSection from "@/components/home/HeroSection";
import { UniversalConverter } from "@/components/features/UniversalConverter/UniversalConverter";
import ValuePropsSection from "@/components/home/ValuePropsSection";
import FeatureCategories from "@/components/home/FeatureCategories";
import { AdPlaceholder } from "@/components/shared/AdPlaceholder";

export default function Home() {
  return (
    <>
      <HeroSection>
        <div className="w-full">
          <UniversalConverter />
        </div>
      </HeroSection>

      {/* Full Width Ad Slot after Hero Section */}
      <div className="w-full">
        <AdPlaceholder />
      </div>

      <ValuePropsSection />

      <FeatureCategories />
    </>
  );
}
