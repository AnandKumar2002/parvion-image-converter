import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroSection({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative w-full">
      {/* Ambient Glow Removed */}

      <section className="relative w-full py-6 lg:py-10 flex flex-col items-center justify-center gap-10">
        
        {/* Text Content Area */}
        <div className="space-y-6 flex flex-col items-center text-center relative z-10 w-full">
          
          {/* Headline */}
          <h1 className="animate-fade-in-up text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-[1.15]">
            Fast, Free, and Secure Image Tools.
          </h1>
          
        </div>
        
        {/* Upload Section Slot (Bottom) */}
        <div className="relative z-20 w-full mt-4">
          {children}
        </div>

      </section>
    </div>
  );
}
