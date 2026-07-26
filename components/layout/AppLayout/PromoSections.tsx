"use client";

import React from "react";
import { AdPlaceholder } from "../../shared/AdPlaceholder";

export function PromoSection({ side }: { side: "left" | "right" }) {
  return (
    <div className={`hidden lg:block w-[240px] flex-shrink-0 ${side === 'left' ? 'xl:block hidden' : ''}`}>
      <div className="sticky top-24 h-[calc(100vh-10rem)] min-h-[600px] mb-8">
        <AdPlaceholder className="!h-full rounded-2xl overflow-hidden" />
      </div>
    </div>
  );
}
