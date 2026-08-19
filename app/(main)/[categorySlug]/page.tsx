import type { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";
import { DynamicIcon } from "@/components/layout/DynamicIcon";
import { categories } from "@/src/data/categories";
import { features } from "@/src/data/features";
import { categoryContents } from "@/src/data/categoryContent";
import { AdPlaceholder } from "@/components/shared/AdPlaceholder";
import { JsonLd } from "@/components/shared/JsonLd";

interface PageProps {
  params: Promise<{ categorySlug: string }>;
}

/** Pre-render all active category pages at build time */
export async function generateStaticParams() {
  return categories
    .filter((c) => c.isActive)
    .map((c) => ({ categorySlug: c.slug }));
}

/** Unique metadata per category */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = categories.find((c) => c.slug === categorySlug && c.isActive);

  if (!category) return { title: "Not Found | Parvion" };

  const catContent = categoryContents[categorySlug];

  const descriptions: Record<string, string> = {
    convert: "Free online image converter — convert JPG, PNG, WebP, GIF, SVG, HEIC, and AVIF in your browser. No uploads, complete privacy.",
    compress: "Free online image compressor — reduce JPG, PNG, and WebP file sizes with smart auto-compression, target-KB mode, and lossless optimisation.",
    tools: "Free browser-based image tools — crop, resize, rotate, flip, add watermarks, remove backgrounds, apply filters, and add borders. No installs needed.",
  };

  return {
    title: `${category.title} Images Online — Free Tools | Parvion`,
    description: descriptions[categorySlug] || catContent?.editorNote || category.description,
    alternates: {
      canonical: `https://parvion.in/${categorySlug}`,
    },
    openGraph: {
      title: `${category.title} Images Online — Free Tools | Parvion`,
      description: descriptions[categorySlug] || category.description,
      url: `https://parvion.in/${categorySlug}`,
      type: "website",
    },
  };
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

  const catContent = categoryContents[categorySlug];

  // ItemList schema for the category page
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": `${category.title} Image Tools`,
    "description": category.description,
    "url": `https://parvion.in/${categorySlug}`,
    "numberOfItems": categoryFeatures.filter((f) => !f.isComingSoon).length,
    "itemListElement": categoryFeatures
      .filter((f) => !f.isComingSoon)
      .map((f, idx) => ({
        "@type": "ListItem",
        "position": idx + 1,
        "name": f.name,
        "description": f.description,
        "url": `https://parvion.in/${categorySlug}/${f.slug}`,
      })),
  };

  return (
    <div className="w-full pb-12 sm:pb-16 space-y-12 animate-fade-in-up">
      <JsonLd schema={itemListSchema} />

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
                <h2 className={`text-lg sm:text-xl font-bold mb-2 transition-colors ${feature.isComingSoon ? 'text-muted-foreground' : `text-foreground ${category.hoverColor}`}`}>{feature.name}</h2>
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

      {/* Category Editorial Content: Explanatory text + supported formats + FAQs */}
      {catContent && (
        <div className="border-t border-border/60 pt-12 space-y-12 max-w-4xl mx-auto text-left px-2">

          {/* Body paragraphs */}
          <div className="space-y-6">
            <h2 className="text-2xl font-bold text-foreground">
              About {category.title} Tools
            </h2>
            {catContent.bodyParagraphs.map((para, idx) => (
              <p key={idx} className="text-sm text-muted-foreground leading-relaxed">
                {para}
              </p>
            ))}
          </div>

          {/* Supported formats */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-foreground">Supported Formats</h2>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="bg-card/50 border border-border rounded-xl p-5 space-y-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Input (What you can upload)</p>
                <div className="flex flex-wrap gap-2">
                  {catContent.supportedFormats.input.map((fmt) => (
                    <span key={fmt} className="text-xs bg-muted px-2.5 py-1 rounded-full font-semibold text-foreground">
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bg-card/50 border border-border rounded-xl p-5 space-y-3">
                <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Output (What you can download)</p>
                <div className="flex flex-wrap gap-2">
                  {catContent.supportedFormats.output.map((fmt) => (
                    <span key={fmt} className="text-xs bg-primary/10 text-primary px-2.5 py-1 rounded-full font-semibold">
                      {fmt}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* FAQs */}
          {catContent.faqs && catContent.faqs.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold text-foreground">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {catContent.faqs.map((faq, idx) => (
                  <details
                    key={idx}
                    name="category-faq"
                    className="group border border-border/60 rounded-2xl bg-card p-5 transition-all duration-300 [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between font-bold text-sm sm:text-base text-foreground cursor-pointer list-none select-none">
                      <span>{faq.question}</span>
                      <span className="transition-transform duration-300 group-open:rotate-180 text-muted-foreground/60 flex-shrink-0 ml-4">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                        </svg>
                      </span>
                    </summary>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-4 border-t border-border/40 pt-4">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
