import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHeader from "../shared/PageHeader";
import { DynamicIcon } from "../layout/DynamicIcon";
import { categories } from "@/src/data/categories";
import { features } from "@/src/data/features";
import { AdPlaceholder } from "../shared/AdPlaceholder";

export default function FeatureCategories() {
  const displayCategories = categories
    .filter((c) => c.isActive)
    .map((cat) => ({
      ...cat,
      features: features.filter((f) => f.categorySlug === cat.slug && f.isActive && f.highlight),
    }))
    .filter((cat) => cat.features.length > 0);

  return (
    <section className="w-full pt-6 pb-12 sm:pt-8 sm:pb-16 space-y-24">
      {displayCategories.map((category, index) => (
        <div key={index} className="relative">
          <PageHeader
            title={category.title}
            description={category.description}
            icon={category.icon}
            color={category.color}
            bg={category.bg}
          />

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {category.features.map((feature, fIndex) => (
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

          <div className="flex justify-end mt-6">
            <Link href={`/${category.slug}`} className={`inline-flex items-center gap-2 px-5 py-2 rounded-full font-bold text-sm transition-all duration-300 hover:opacity-80 group ${category.color} ${category.bg}`}>
              Explore all {category.title} features
              <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
            </Link>
          </div>

          <div className="w-full mt-20 -mb-4">
             <AdPlaceholder />
          </div>
        </div>
      ))}
    </section>
  );
}
