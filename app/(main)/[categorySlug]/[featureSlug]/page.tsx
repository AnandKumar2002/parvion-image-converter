import { notFound } from "next/navigation";
import PageHeader from "@/components/shared/PageHeader";
import { categories } from "@/src/data/categories";
import { features } from "@/src/data/features";
import { FeatureWorkspace } from "@/components/features/FeatureWorkspace";
import { AdPlaceholder } from "@/components/shared/AdPlaceholder";
import { toolContents } from "@/src/data/toolContent";
import { ShieldCheck } from "lucide-react";


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

  const content = toolContents[feature.slug] || toolContents[feature.uiType];

  return (
    <div className="w-full pb-16 sm:pb-24 space-y-12 animate-fade-in-up">
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
              Privacy & Data Safety
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
