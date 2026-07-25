"use client";

import React from "react";
import { AdPlaceholder } from "../../shared/AdPlaceholder";

export function PromoSection({ side }: { side: "left" | "right" }) {
  return (
    <div className={`hidden lg:block w-[240px] flex-shrink-0 ${side === 'left' ? 'xl:block hidden' : ''}`}>
      <div className="sticky top-24 h-[calc(100vh-8rem)] min-h-[600px]">
        <AdPlaceholder className="!h-full" />
      </div>
    </div>
  );
}
