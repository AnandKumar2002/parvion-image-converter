"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { features } from "@/src/data/features";

export function AdPlaceholder({ className = "", adSlot = "" }: { className?: string, adSlot?: string }) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();

  // Check if current page is a coming-soon or under-construction route
  const isComingSoonPage = pathname ? features.some(f => f.isComingSoon && pathname.endsWith(`/${f.slug}`)) : false;

  if (isComingSoonPage) {
    return null;
  }

  useEffect(() => {
    if (!publisherId || typeof window === "undefined") return;

    const checkVisibility = () => {
      if (containerRef.current && containerRef.current.offsetWidth > 0) {
        setIsReady(true);
        return true;
      }
      return false;
    };

    if (checkVisibility()) return;

    // Watch for resizes or display changes to become visible
    const observer = new ResizeObserver(() => {
      if (checkVisibility()) {
        observer.disconnect();
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [publisherId]);

  useEffect(() => {
    if (isReady && publisherId) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error", e);
      }
    }
  }, [isReady, publisherId]);

  if (!publisherId) {
    return (
      <div className={`w-full h-full bg-primary rounded-lg opacity-80 flex items-center justify-center ${className}`}>
        <span className="text-xs text-primary-foreground uppercase font-bold tracking-widest">
          Advertisement
        </span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`w-full h-full overflow-hidden flex justify-center items-center ${className}`}>
      {isReady && (
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", height: "100%" }}
          data-ad-client={publisherId}
          data-ad-slot={adSlot || "auto"}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
