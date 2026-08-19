import type { Metadata } from "next";
import HeroSection from "@/components/home/HeroSection";
import { UniversalConverter } from "@/components/features/UniversalConverter/UniversalConverter";
import ValuePropsSection from "@/components/home/ValuePropsSection";
import FeatureCategories from "@/components/home/FeatureCategories";
import HomeSEOContent from "@/components/home/HomeSEOContent";
import { AdPlaceholder } from "@/components/shared/AdPlaceholder";

export const metadata: Metadata = {
  title: "Free Online Image Converter, Compressor & Editor | Parvion",
  description:
    "Convert JPG, PNG, WebP, HEIC & more. Compress images, remove backgrounds with AI, crop, resize, add watermarks, apply filters — 20+ free tools that run entirely in your browser. No uploads, no account, complete privacy.",
  alternates: {
    canonical: "https://parvion.in",
  },
};

export default function Home() {
  return (
    <>
      <HeroSection>
        <div className="w-full">
          <UniversalConverter />
        </div>
      </HeroSection>

      {/* Full Width Ad Slot after Hero Section */}
      <div className="w-full mt-2 mb-4">
        <AdPlaceholder />
      </div>

      <ValuePropsSection />

      <FeatureCategories />

      {/* Rich editorial content: About, Format Table, FAQs, Popular Tools */}
      <HomeSEOContent />
    </>
  );
}
