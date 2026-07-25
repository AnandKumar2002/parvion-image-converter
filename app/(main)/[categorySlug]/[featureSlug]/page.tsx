import { notFound } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";
import { categories } from "@/src/data/categories";
import { features } from "@/src/data/features";
import { FeatureWorkspace } from "@/components/features/FeatureWorkspace";

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
      {/* Top Advertisement */}
      <div className="w-full h-24 sm:h-32 bg-primary rounded-lg opacity-80 flex items-center justify-center">
         <span className="text-xs text-primary-foreground uppercase font-bold tracking-widest">Advertisement</span>
      </div>

      <PageHeader
        title={feature.name}
        description={feature.description}
        icon={feature.icon}
        color={category.color}
        bg={category.bg}
      />

      <FeatureWorkspace feature={feature} />

      <div className="w-full h-24 sm:h-32 bg-primary rounded-lg opacity-80 mt-2 flex items-center justify-center">
         <span className="text-xs text-primary-foreground uppercase font-bold tracking-widest">Advertisement</span>
      </div>
    </div>
  );
}
