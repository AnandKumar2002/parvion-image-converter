import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { DynamicIcon } from "@/components/layout/DynamicIcon";
import { categories } from "@/src/data/categories";
import { features } from "@/src/data/features";

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
      {/* Top Advertisement */}
      <div className="w-full h-24 sm:h-32 bg-primary rounded-lg opacity-80 flex items-center justify-center">
         <span className="text-xs text-primary-foreground uppercase font-bold tracking-widest">Advertisement</span>
      </div>

      <PageHeader
        title={category.title}
        description={category.description}
        icon={category.icon}
        color={category.color}
        bg={category.bg}
      />

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {categoryFeatures.map((feature, fIndex) => (
          <Link
            key={fIndex}
            href={`/${category.slug}/${feature.slug}`}
            className="bg-card/60 border border-border shadow-sm p-6 sm:p-8 rounded-lg hover:shadow-xl hover:bg-card transition-all duration-500 group cursor-pointer relative overflow-hidden flex flex-col"
          >
            <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${category.gradient}`}></div>
            
            <div className={`w-12 h-12 rounded-lg flex items-center justify-center mb-6 transition-transform duration-500 group-hover:scale-110 relative z-10 ${category.bg}`}>
               <DynamicIcon icon={feature.icon} className={`w-6 h-6 ${category.color}`} />
            </div>
            
            <div className="flex-1 relative z-10">
              <h4 className={`text-lg sm:text-xl font-bold text-foreground mb-2 transition-colors ${category.hoverColor}`}>{feature.name}</h4>
              <p className="text-sm text-muted-foreground font-light">{feature.description}</p>
            </div>
            
            <div className="mt-6 flex justify-end relative z-10">
              <ArrowRight className={`w-5 h-5 text-muted-foreground/30 group-hover:translate-x-1 transition-all ${category.hoverColor}`} />
            </div>
          </Link>
        ))}
      </div>

      <div className="w-full h-24 sm:h-32 bg-primary rounded-lg opacity-80 mt-2 flex items-center justify-center">
         <span className="text-xs text-primary-foreground uppercase font-bold tracking-widest">Advertisement</span>
      </div>
    </div>
  );
}
