"use client";

import { useEffect, useRef, useState } from "react";

export function AdPlaceholder({ className = "", adSlot = "" }: { className?: string, adSlot?: string }) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;
  const containerRef = useRef<HTMLDivElement>(null);
  const [isReady, setIsReady] = useState(false);

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
      <div className={`w-full h-24 sm:h-32 bg-primary rounded-lg opacity-80 flex items-center justify-center ${className}`}>
        <span className="text-xs text-primary-foreground uppercase font-bold tracking-widest">
          Advertisement
        </span>
      </div>
    );
  }

  return (
    <div ref={containerRef} className={`w-full overflow-hidden flex justify-center ${className}`}>
      {isReady && (
        <ins
          className="adsbygoogle"
          style={{ display: "block", width: "100%" }}
          data-ad-client={publisherId}
          data-ad-slot={adSlot || "auto"}
          data-ad-format="auto"
          data-full-width-responsive="true"
        />
      )}
    </div>
  );
}
