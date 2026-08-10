import type { Metadata } from "next";
import { notFound } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";
import { categories } from "@/src/data/categories";
import { features } from "@/src/data/features";
import { FeatureWorkspace } from "@/components/features/FeatureWorkspace";
import { AdPlaceholder } from "@/components/shared/AdPlaceholder";
import { toolContents } from "@/src/data/toolContent";
import { JsonLd } from "@/components/shared/JsonLd";
import { ShieldCheck } from "lucide-react";


interface PageProps {
  params: Promise<{ categorySlug: string; featureSlug: string }>;
}

/** Pre-render all active, non-coming-soon tool pages at build time */
export async function generateStaticParams() {
  return features
    .filter((f) => f.isActive && !f.isComingSoon)
    .map((f) => ({
      categorySlug: f.categorySlug,
      featureSlug: f.slug,
    }));
}

/** Unique title + description for every tool page */
export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { categorySlug, featureSlug } = await params;

  const category = categories.find((c) => c.slug === categorySlug && c.isActive);
  const feature = features.find(
    (f) => f.slug === featureSlug && f.categorySlug === categorySlug && f.isActive
  );

  if (!category || !feature) {
    return {
      title: "Tool Not Found | Parvion",
    };
  }

  const content = toolContents[feature.slug] || toolContents[feature.uiType];

  return {
    title: `${feature.name} — Free Online Tool | Parvion`,
    description: content
      ? `${feature.description} ${content.features[0]}`
      : `${feature.description} Free, browser-based, with complete privacy — your files never leave your device.`,
    keywords: [
      feature.name,
      `${feature.name} online`,
      `free ${feature.name}`,
      "browser-based image tool",
      "no upload image tool",
      "private image processing",
      "Parvion",
    ],
    alternates: {
      canonical: `https://image.parvion.in/${categorySlug}/${featureSlug}`,
    },
    openGraph: {
      title: `${feature.name} — Free Online Tool | Parvion`,
      description: feature.description,
      url: `https://image.parvion.in/${categorySlug}/${featureSlug}`,
      type: "website",
    },
  };
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

  const content = toolContents[feature.slug] || toolContents[feature.uiType];

  // SoftwareApplication schema for this tool
  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": `Parvion ${feature.name}`,
    "url": `https://image.parvion.in/${categorySlug}/${featureSlug}`,
    "description": feature.description,
    "applicationCategory": "MultimediaApplication",
    "operatingSystem": "Any (Web Browser)",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "featureList": content ? content.features : [],
  };

  // HowTo schema if we have steps
  const howToSchema = content && content.steps.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "HowTo",
        "name": `How to use ${feature.name}`,
        "description": `Step-by-step guide for using the free online ${feature.name} tool on Parvion.`,
        "step": content.steps.map((step, idx) => ({
          "@type": "HowToStep",
          "position": idx + 1,
          "text": step,
        })),
      }
    : null;

  // FAQPage schema
  const faqSchema = content && content.faqs && content.faqs.length > 0
    ? {
        "@context": "https://schema.org",
        "@type": "FAQPage",
        "mainEntity": content.faqs.map((faq) => ({
          "@type": "Question",
          "name": faq.question,
          "acceptedAnswer": {
            "@type": "Answer",
            "text": faq.answer,
          },
        })),
      }
    : null;

  return (
    <div className="w-full pb-16 sm:pb-24 space-y-12 animate-fade-in-up">
      <JsonLd schema={toolSchema} />
      {howToSchema && <JsonLd schema={howToSchema} />}
      {faqSchema && <JsonLd schema={faqSchema} />}

      <PageHeader
        title={feature.name}
        description={feature.description}
        icon={feature.icon}
        color={category.color}
        bg={category.bg}
      />

      <FeatureWorkspace feature={feature} />

      {/* Rich Publisher Content block (FAQs, Guides) for AdSense Compliance & SEO */}
      {content && !feature.isComingSoon && (
        <div className="border-t border-border/60 pt-12 mt-16 space-y-12 max-w-4xl mx-auto text-left px-2">
          
          {/* Guide Grid */}
          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-foreground flex items-center gap-2">
                How to use {feature.name}
              </h2>
              <ol className="list-decimal list-inside space-y-3 text-sm text-muted-foreground leading-relaxed">
                {content.steps.map((step, idx) => (
                  <li key={idx} className="pl-1">{step}</li>
                ))}
              </ol>
            </div>
            
            <div className="space-y-4">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                Key Features
              </h2>
              <ul className="list-disc list-inside space-y-3 text-sm text-muted-foreground leading-relaxed">
                {content.features.map((feat, idx) => (
                  <li key={idx} className="pl-1">{feat}</li>
                ))}
              </ul>
            </div>
          </div>

          {/* Privacy Note Callout */}
          <div className="bg-primary/5 border border-primary/10 rounded-3xl p-6 text-center">
            <p className="text-sm font-bold text-foreground flex items-center justify-center gap-2">
              <ShieldCheck className="w-4.5 h-4.5 text-primary shrink-0" />
              Privacy &amp; Data Safety
            </p>
            <p className="text-xs text-muted-foreground mt-2 leading-relaxed">
              {content.privacyNotes}
            </p>
          </div>

          {/* FAQ Accordion Section */}
          {content.faqs && content.faqs.length > 0 && (
            <div className="space-y-6">
              <h2 className="text-lg sm:text-xl font-bold text-foreground">
                Frequently Asked Questions
              </h2>
              <div className="space-y-4">
                {content.faqs.map((faq, idx) => (
                  <details 
                    key={idx} 
                    name="tool-faq"
                    className="group border border-border/60 rounded-2xl bg-card p-5 transition-all duration-300 [&_summary::-webkit-details-marker]:hidden"
                  >
                    <summary className="flex items-center justify-between font-bold text-sm sm:text-base text-foreground cursor-pointer list-none select-none">
                      <span>{faq.question}</span>
                      <span className="transition-transform duration-300 group-open:rotate-180 text-muted-foreground/60 flex-shrink-0 ml-4">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" /></svg>
                      </span>
                    </summary>
                    <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-4 border-t border-border/40 pt-4 animate-fade-in">
                      {faq.answer}
                    </p>
                  </details>
                ))}
              </div>
            </div>
          )}

        </div>
      )}

      {/* Ad slot (Only loaded on active, fully functional tool pages) */}
      {!feature.isComingSoon && (
        <div className="w-full mt-6">
          <AdPlaceholder />
        </div>
      )}
    </div>
  );
}
