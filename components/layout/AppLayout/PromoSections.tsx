"use client";

import React from "react";
import Link from "next/link";
import { features } from "@/src/data/features";
import { Sparkles, Zap } from "lucide-react";
import { AdPlaceholder } from "../../shared/AdPlaceholder";

import { usePathname } from "next/navigation";

export function PromoSection({ side }: { side: "left" | "right" }) {
  const pathname = usePathname();
  const isComingSoonPage = pathname ? features.some(f => f.isComingSoon && pathname.endsWith(`/${f.slug}`)) : false;

  // Get some active features to cross-promote
  const popularTools = features
    .filter(f => f.isActive && !f.isComingSoon)
    .slice(side === "left" ? 0 : 8, side === "left" ? 8 : 16);

  return (
    <div className={`hidden lg:block w-[240px] flex-shrink-0 ${side === 'left' ? 'xl:block hidden' : ''}`}>
      <div className="sticky top-24 h-[calc(100vh-10rem)] min-h-[600px] mb-8 flex flex-col gap-6">
        
        {/* Premium Tool Showcase Promotion Card */}
        <div className="flex-1 bg-card/40 border border-border/80 rounded-3xl p-5 flex flex-col justify-between backdrop-blur-md relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-24 h-24 bg-primary/5 rounded-full blur-2xl group-hover:bg-primary/10 transition-colors duration-500" />
          
          <div className="space-y-5 relative z-10">
            <div className="flex items-center gap-2 text-primary">
              <Zap className="w-4 h-4 fill-primary/10" />
              <span className="text-xs font-bold uppercase tracking-wider">Popular Tools</span>
            </div>
            
            <div className="space-y-3 max-h-[240px] overflow-y-auto pr-1.5 no-scrollbar">
              {popularTools.map((tool) => (
                <Link
                  key={tool.id}
                  href={`/${tool.categorySlug}/${tool.slug}`}
                  className="block p-3 rounded-2xl bg-muted/20 hover:bg-primary/5 border border-border/50 hover:border-primary/20 transition-all duration-300 group/item"
                >
                  <p className="text-xs font-bold text-foreground group-hover/item:text-primary transition-colors">
                    {tool.name}
                  </p>
                  <p className="text-[10px] text-muted-foreground line-clamp-1 mt-1">
                    {tool.description}
                  </p>
                </Link>
              ))}
            </div>
          </div>

          <div className="bg-primary/5 border border-primary/10 rounded-2xl p-4 text-center mt-4">
            <Sparkles className="w-5 h-5 text-primary mx-auto mb-2" />
            <p className="text-xs font-bold text-foreground">100% Free & Local</p>
            <p className="text-[10px] text-muted-foreground mt-1">No file uploads to servers. Fast browser processing.</p>
          </div>
        </div>

        {/* Real AdSense Slot - only renders when adSlot is active */}
        {!isComingSoonPage && process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID && (
          <div className="flex-1 flex items-center justify-center overflow-hidden">
            <AdPlaceholder adSlot={process.env.NEXT_PUBLIC_ADSENSE_SLOT_ID} className="!h-full overflow-hidden" />
          </div>
        )}

      </div>
    </div>
  );
}
