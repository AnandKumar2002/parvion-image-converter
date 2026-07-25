"use client";

import { useEffect } from "react";

export function AdPlaceholder({ className = "", adSlot = "" }: { className?: string, adSlot?: string }) {
  const publisherId = process.env.NEXT_PUBLIC_ADSENSE_PUB_ID;

  useEffect(() => {
    if (publisherId && typeof window !== "undefined") {
      try {
        // @ts-ignore
        (window.adsbygoogle = window.adsbygoogle || []).push({});
      } catch (e) {
        console.error("AdSense error", e);
      }
    }
  }, [publisherId]);

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
    <div className={`w-full overflow-hidden flex justify-center ${className}`}>
      <ins
        className="adsbygoogle"
        style={{ display: "block", width: "100%" }}
        data-ad-client={publisherId}
        data-ad-slot={adSlot || "auto"}
        data-ad-format="auto"
        data-full-width-responsive="true"
      />
    </div>
  );
}
