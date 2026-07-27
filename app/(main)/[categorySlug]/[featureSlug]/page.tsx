import { notFound } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";
import { categories } from "@/src/data/categories";
import { features } from "@/src/data/features";
import { FeatureWorkspace } from "@/components/features/FeatureWorkspace";
import { AdPlaceholder } from "@/components/shared/AdPlaceholder";

interface PageProps {
  params: Promise<{ categorySlug: string; featureSlug: string }>;
}

export default async function FeaturePage({ params }: PageProps) {
  const { categorySlug, featureSlug } = await params;
  
  const category = categories.find((c) => c.slug === categorySlug && c.isActive);
  const feature = features.find(
    (f) => f.slug === featureSlug && f.categorySlug === categorySlug && f.isActive
  );
  
  if (!category || !feature) {
    notFound();
  }

  return (
    <div className="w-full pb-12 sm:pb-16 space-y-12 animate-fade-in-up">
      <PageHeader
        title={feature.name}
        description={feature.description}
        icon={feature.icon}
        color={category.color}
        bg={category.bg}
      />

      <FeatureWorkspace feature={feature} />

      <div className="w-full mt-2">
         <AdPlaceholder />
      </div>
    </div>
  );
}
