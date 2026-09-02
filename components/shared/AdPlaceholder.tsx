"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { features } from "@/src/data/features";

export function AdPlaceholder({ className = "", adSlot = "" }: { className?: string, adSlot?: string }) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID || "ca-pub-8823925019937744";
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);
  const pathname = usePathname();

  // Check if current page is a coming-soon or under-construction route
  const isComingSoonPage = pathname ? features.some(f => f.isComingSoon && pathname.endsWith(`/${f.slug}`)) : false;

  useEffect(() => {
    if (!publisherId || !adSlot || typeof window === "undefined") return;

    const checkVisibility = () => {
      if (containerRef.current && containerRef.current.offsetWidth > 0) {
        setIsReady(true);
        return true;
      }
      return false;
    };

    if (checkVisibility()) return;

    const observer = new ResizeObserver(() => {
      if (checkVisibility()) {
        observer.disconnect();
      }
    });

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, [publisherId, adSlot]);

  useEffect(() => {
    if (isReady && publisherId && adSlot) {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error", e);
      }
    }
  }, [isReady, publisherId, adSlot]);

  if (isComingSoonPage || !publisherId || !adSlot) {
    return null;
  }

  return (
    <div ref={containerRef} className={`w-full h-full overflow-hidden flex justify-center items-center ${className}`}>
      {isReady && (
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%", height: "100%" }}
          data-ad-client={publisherId}
          data-ad-slot={adSlot}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
