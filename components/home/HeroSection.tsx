import { ArrowRight } from "lucide-react";
import Link from "next/link";

export default function HeroSection({ children }: { children?: React.ReactNode }) {
  return (
    <div className="relative w-full">
      {/* Ambient Glow Removed */}

      <section className="relative w-full py-6 lg:py-10 flex flex-col items-center justify-center gap-10">
        
        {/* Text Content Area */}
        <div className="space-y-5 flex flex-col items-center text-center relative z-10 w-full">
          
          {/* Headline */}
          <h1 className="animate-fade-in-up text-3xl sm:text-4xl lg:text-5xl font-black text-foreground tracking-tight leading-[1.15]">
            The Free Image Toolkit That Respects Your Privacy.
          </h1>

          {/* Subtitle */}
          <p className="animate-fade-in-up text-base sm:text-lg text-muted-foreground max-w-2xl leading-relaxed font-light">
            Convert JPG, PNG, WebP &amp; more. Compress, crop, resize, remove backgrounds, apply filters,
            add watermarks — over 20 tools, completely free, running entirely inside your browser.
            <strong className="text-foreground font-semibold"> No uploads. No account. No limits.</strong>
          </p>

          {/* Stats row */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0" />
              20+ Tools, All Free
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-blue-400 shrink-0" />
              Files Stay on Your Device
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-400 shrink-0" />
              No Sign-Up Required
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 shrink-0" />
              Works on Any Device
            </span>
          </div>
          
        </div>
        
        {/* Upload Section Slot (Bottom) */}
        <div className="relative z-20 w-full mt-4">
          {children}
        </div>

      </section>
    </div>
  );
}
