import { Metadata } from "next";
import { notFound } from "next/navigation";
import Link from "next/link";
import { guides } from "@/src/data/guides";
import { Calendar, Clock, ChevronLeft, ShieldCheck } from "lucide-react";
import { JsonLd } from "@/components/shared/JsonLd";

interface PageProps {
  params: Promise<{ guideSlug: string }>;
}

export async function generateStaticParams() {
  return guides.map((g) => ({ guideSlug: g.slug }));
}

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { guideSlug } = await params;
  const guide = guides.find((g) => g.slug === guideSlug);

  if (!guide) {
    return {
      title: "Guide Not Found | Parvion",
    };
  }

  return {
    title: `${guide.title} | Parvion Image Converter`,
    description: guide.excerpt,
    alternates: {
      canonical: `https://parvion.in/guides/${guideSlug}`,
    },
    openGraph: {
      title: `${guide.title} | Parvion Image Converter`,
      description: guide.excerpt,
      url: `https://parvion.in/guides/${guideSlug}`,
      type: "article",
      publishedTime: guide.publishedAt,
      authors: ["Anand Kumar"],
    },
  };
}

export default async function GuideArticlePage({ params }: PageProps) {
  const { guideSlug } = await params;
  const guide = guides.find((g) => g.slug === guideSlug);

  if (!guide) {
    notFound();
  }

  // Article Schema
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    "headline": guide.title,
    "description": guide.excerpt,
    "datePublished": guide.publishedAt,
    "author": {
      "@type": "Person",
      "name": "Anand Kumar",
      "url": "https://parvion.in/about"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Parvion",
      "logo": "https://parvion.in/icon.png"
    },
    "mainEntityOfPage": {
      "@type": "WebPage",
      "@id": `https://parvion.in/guides/${guideSlug}`
    }
  };

  // Convert simple markdown string to paragraphs and sections for presentation
  const paragraphs = guide.contentMarkdown
    .trim()
    .split("\n\n")
    .map((para) => {
      if (para.startsWith("### ")) {
        return { type: "h3", text: para.replace("### ", "") };
      }
      if (para.startsWith("## ")) {
        return { type: "h2", text: para.replace("## ", "") };
      }
      if (para.startsWith("* ")) {
        const items = para.split("\n").map(li => li.replace("* ", "").replace("- ", "").trim());
        return { type: "list", items };
      }
      if (para.startsWith("1. ")) {
        const items = para.split("\n").map(li => li.replace(/^\d+\.\s+/, "").trim());
        return { type: "ordered-list", items };
      }
      if (para.includes("|")) {
        // Table structure
        const rows = para.split("\n").map(r => r.split("|").map(cell => cell.trim()).filter(Boolean)).filter(r => r.length > 0 && !r[0].includes("---"));
        return { type: "table", rows };
      }
      if (para.startsWith("```")) {
        const codeLines = para.split("\n").filter(l => !l.startsWith("```"));
        return { type: "code", code: codeLines.join("\n") };
      }
      return { type: "p", text: para };
    });

  return (
    <article className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6 animate-fade-in-up">
      <JsonLd schema={articleSchema} />

      <Link 
        href="/guides"
        className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-foreground mb-8 group transition-colors"
      >
        <ChevronLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
        Back to Guides
      </Link>

      <header className="space-y-4 mb-8">
        <span className="inline-block text-[10px] uppercase font-bold tracking-wider text-cyan-500 bg-cyan-500/10 px-2.5 py-1 rounded-full">
          {guide.category}
        </span>
        
        <h1 className="text-3xl sm:text-5xl font-black tracking-tight text-foreground leading-tight">
          {guide.title}
        </h1>

        <div className="flex flex-wrap items-center gap-4 text-sm text-muted-foreground pt-2">
          <span className="flex items-center gap-1.5">
            <Calendar className="w-4 h-4" />
            {guide.publishedAt}
          </span>
          <span className="flex items-center gap-1.5">
            <Clock className="w-4 h-4" />
            {guide.readTime}
          </span>
          <span className="text-border">|</span>
          <span>By Anand Kumar</span>
        </div>
      </header>

      {/* Content Renderer */}
      <div className="prose prose-slate dark:prose-invert max-w-none pt-4 border-t border-border/40 space-y-6 leading-relaxed text-muted-foreground">
        {paragraphs.map((para, index) => {
          if (para.type === "h2") {
            return <h2 key={index} className="text-2xl font-bold text-foreground pt-4">{para.text}</h2>;
          }
          if (para.type === "h3") {
            return <h3 key={index} className="text-xl font-bold text-foreground pt-2">{para.text}</h3>;
          }
          if (para.type === "list") {
            return (
              <ul key={index} className="list-disc pl-6 space-y-2 text-sm font-light">
                {para.items?.map((item, itemIdx) => (
                  <li key={itemIdx}>{item}</li>
                ))}
              </ul>
            );
          }
          if (para.type === "ordered-list") {
            return (
              <ol key={index} className="list-decimal pl-6 space-y-2 text-sm font-light">
                {para.items?.map((item, itemIdx) => (
                  <li key={itemIdx}>{item}</li>
                ))}
              </ol>
            );
          }
          if (para.type === "table") {
            const hasHeader = para.rows && para.rows.length > 0;
            if (!hasHeader) return null;
            const headers = para.rows[0];
            const dataRows = para.rows.slice(1);
            return (
              <div key={index} className="overflow-x-auto rounded-xl border border-border my-6">
                <table className="w-full text-sm text-left">
                  <thead className="bg-muted/40 text-foreground font-bold border-b border-border">
                    <tr>
                      {headers.map((h, hIdx) => (
                        <th key={hIdx} className="px-4 py-3">{h}</th>
                      ))}
                    </tr>
                  </thead>
                  <tbody>
                    {dataRows.map((row, rowIdx) => (
                      <tr key={rowIdx} className="border-b border-border/40 last:border-0 hover:bg-muted/10">
                        {row.map((cell, cellIdx) => (
                          <td key={cellIdx} className="px-4 py-3 font-light">{cell}</td>
                        ))}
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            );
          }
          if (para.type === "code") {
            return (
              <pre key={index} className="bg-muted/40 border border-border p-4 rounded-xl overflow-x-auto text-xs text-foreground font-mono my-4">
                <code>{para.code}</code>
              </pre>
            );
          }
          return <p key={index} className="text-sm sm:text-base font-light text-muted-foreground/90">{para.text}</p>;
        })}
      </div>

      <div className="mt-16 pt-8 border-t border-border/40">
        <div className="bg-cyan-500/5 border border-cyan-500/10 rounded-2xl p-6 flex flex-col sm:flex-row items-center gap-4 text-center sm:text-left">
          <ShieldCheck className="w-12 h-12 text-cyan-500 shrink-0" />
          <div>
            <h4 className="font-bold text-foreground mb-1">100% Client-Side Conversion</h4>
            <p className="text-xs text-muted-foreground leading-relaxed">
              We value your privacy. All tool conversions and compressions mentioned in these guides run locally on your device using your browser's APIs. No files are ever sent to our servers.
            </p>
          </div>
        </div>
      </div>
    </article>
  );
}
