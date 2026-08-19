import { Metadata } from "next";
import Link from "next/link";
import PageHeader from "@/components/shared/PageHeader";
import { guides } from "@/src/data/guides";
import { Calendar, Clock, ArrowRight } from "lucide-react";
import { JsonLd } from "@/components/shared/JsonLd";

export const metadata: Metadata = {
  title: "Guides & Tutorials | Parvion Image Converter",
  description: "Learn how to optimize, compress, and convert images for maximum web performance and absolute local privacy.",
  alternates: {
    canonical: "https://parvion.in/guides",
  },
};

export default function GuidesPage() {
  // Schema for item list of guides
  const guidesSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Parvion Image Guides and Tutorials",
    "description": "Educational articles covering privacy-first image tools, lossy vs. lossless compression, and next-generation formats.",
    "url": "https://parvion.in/guides",
    "numberOfItems": guides.length,
    "itemListElement": guides.map((guide, idx) => ({
      "@type": "ListItem",
      "position": idx + 1,
      "name": guide.title,
      "description": guide.excerpt,
      "url": `https://parvion.in/guides/${guide.slug}`,
    })),
  };

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 sm:px-6">
      <JsonLd schema={guidesSchema} />

      <PageHeader
        title="Guides & Tutorials"
        description="Comprehensive guides to help you optimize, compress, and convert your images with confidence."
        icon="lucide:book-open"
        color="text-cyan-500"
        bg="bg-cyan-500/10"
      />

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12">
        {guides.map((guide) => (
          <article
            key={guide.slug}
            className="group relative bg-card/60 backdrop-blur-sm border border-border p-6 rounded-2xl flex flex-col justify-between hover:shadow-xl hover:-translate-y-1 transition-all duration-300 overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
            
            <div className="relative z-10 space-y-4">
              <span className="inline-block text-[10px] uppercase font-bold tracking-wider text-cyan-500 bg-cyan-500/10 px-2.5 py-1 rounded-full">
                {guide.category}
              </span>
              
              <div className="space-y-2">
                <h2 className="text-xl font-bold text-foreground leading-tight group-hover:text-cyan-400 transition-colors">
                  <Link href={`/guides/${guide.slug}`}>
                    {guide.title}
                  </Link>
                </h2>
                
                <div className="flex items-center gap-2 text-xs text-muted-foreground/60 whitespace-nowrap">
                  <span>{guide.publishedAt}</span>
                  <span>•</span>
                  <span>{guide.readTime}</span>
                </div>
              </div>
              
              <p className="text-sm text-muted-foreground line-clamp-3 leading-relaxed font-light">
                {guide.excerpt}
              </p>
            </div>

            <div className="relative z-10 mt-6 pt-4 border-t border-border/40 flex justify-end text-xs">
              <Link 
                href={`/guides/${guide.slug}`}
                className="flex items-center gap-1 text-cyan-500 hover:text-cyan-400 font-semibold group/btn"
              >
                Read Article
                <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
