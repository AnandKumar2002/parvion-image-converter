import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { DynamicIcon } from "@/components/layout/DynamicIcon";
import { categories } from "@/src/data/categories";
import { features } from "@/src/data/features";
import { AdPlaceholder } from "@/components/shared/AdPlaceholder";

interface PageProps {
  params: Promise<{ categorySlug: string }>;
}

export default async function CategoryPage({ params }: PageProps) {
  const { categorySlug } = await params;
  
  const category = categories.find((c) => c.slug === categorySlug && c.isActive);
  
  if (!category) {
    notFound();
  }

  const categoryFeatures = features.filter(
    (f) => f.categorySlug === category.slug && f.isActive
  );

  return (
    <div className="w-full pb-12 sm:pb-16 space-y-12 animate-fade-in-up">
      <PageHeader
        title={category.title}
        description={category.description}
        icon={category.icon}
        color={category.color}
        bg={category.bg}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryFeatures.map((feature, fIndex) => {
          const cardClasses = "bg-card/60 border border-border shadow-sm p-6 sm:p-8 rounded-lg transition-all duration-500 group relative overflow-hidden flex flex-col";

          const cardContent = (
            <>
              <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${category.gradient}`}></div>

              {/* Coming Soon badge */}
              {feature.isComingSoon && (
                <div className="absolute top-3 right-3 z-20 bg-amber-500/20 text-amber-500 border border-amber-500/30 text-[10px] font-bold uppercase tracking-widest px-2 py-0.5 rounded-full">
                  Coming Soon
                </div>
              )}

              <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 relative z-10 ${category.bg} ${feature.isComingSoon ? 'opacity-60' : ''}`}>
                 <DynamicIcon icon={feature.icon} className={`w-6 h-6 ${category.color}`} />
              </div>

              <div className="flex-1 relative z-10">
                <h4 className={`text-lg sm:text-xl font-bold mb-2 transition-colors ${feature.isComingSoon ? 'text-muted-foreground' : `text-foreground ${category.hoverColor}`}`}>{feature.name}</h4>
                <p className="text-sm text-muted-foreground font-light">{feature.description}</p>
              </div>

              <div className="mt-6 flex justify-end relative z-10">
                {feature.isComingSoon
                  ? <span className="text-xs text-muted-foreground/50 font-medium italic">In progress...</span>
                  : <ArrowRight className={`w-5 h-5 text-muted-foreground/30 group-hover:translate-x-1 transition-all ${category.hoverColor}`} />
                }
              </div>
            </>
          );

          return feature.isComingSoon ? (
            <div key={fIndex} className={`${cardClasses} cursor-default opacity-80`}>
              {cardContent}
            </div>
          ) : (
            <Link key={fIndex} href={`/${category.slug}/${feature.slug}`} className={`${cardClasses} hover:shadow-xl hover:bg-card cursor-pointer`}>
              {cardContent}
            </Link>
          );
        })}
      </div>
      <div className="w-full mt-2">
         <AdPlaceholder />
      </div>
    </div>
  );
}
