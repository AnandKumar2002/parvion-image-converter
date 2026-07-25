import { CloudUpload, Image as ImageIcon, Scissors } from "lucide-react";
import Link from "next/link";

export default function UploadSection() {
  const formats = [
    { ext: "PNG", color: "bg-cyan-400", href: "/convert/png-to-jpg" },
    { ext: "JPG", color: "bg-blue-400", href: "/convert/jpg-to-png" },
    { ext: "WEBP", color: "bg-emerald-400", href: "/convert/webp-converter" },
    { ext: "SVG", color: "bg-indigo-400", href: "/convert/svg-to-png" },
  ];

  return (
    <div className="animate-fade-in-up w-full max-w-lg mx-auto lg:max-w-none flex flex-col gap-6">
      
      {/* Dropzone Wrapper */}
      <div className="relative w-full group cursor-pointer block">
        {/* Outer glowing aura */}
        <div className="absolute -inset-2 bg-gradient-to-tr from-cyan-500/20 via-transparent to-purple-500/20 rounded-lg blur-2xl z-0 group-hover:blur-3xl group-hover:from-cyan-500/30 group-hover:to-purple-500/30 transition-all duration-700"></div>
        
        {/* Main Dropzone Container */}
        <div className="bg-card/60 backdrop-blur-2xl border-muted-foreground/30 dark:border-border shadow-xl hover:shadow-2xl rounded-lg p-8 flex flex-col items-center justify-center border-dashed border-2 relative z-10 overflow-hidden hover:border-cyan-500/50 hover:bg-cyan-500/5 transition-all duration-500 min-h-[300px] sm:min-h-[320px]">
          
          {/* Main Click Target */}
          <Link href="/convert/png-to-jpg" className="absolute inset-0 z-10"></Link>

          {/* Hover overlay */}
          <div className="absolute inset-0 bg-gradient-to-b from-foreground/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none"></div>

          {/* Icon Container */}
          <div className="w-24 h-24 sm:w-28 sm:h-28 bg-background border border-border shadow-xl rounded-2xl flex items-center justify-center mb-8 sm:mb-10 relative group-hover:-translate-y-4 group-hover:shadow-2xl transition-all duration-500 z-0 pointer-events-none">
            <div className="absolute inset-0 rounded-2xl bg-cyan-500/5 group-hover:bg-cyan-500/10 transition-colors duration-500"></div>
            <div className="absolute inset-[-4px] rounded-[1.25rem] border-2 border-cyan-500/0 group-hover:border-cyan-500/40 group-hover:scale-105 transition-all duration-500"></div>
            <CloudUpload className="text-cyan-500 dark:text-cyan-400 w-12 h-12 sm:w-16 sm:h-16 z-0 group-hover:scale-110 transition-transform duration-500" />
          </div>
          
          <h3 className="text-2xl sm:text-3xl font-extrabold text-foreground mb-3 sm:mb-4 relative z-0 pointer-events-none">Drop image here</h3>
          <p className="text-base sm:text-lg text-muted-foreground mb-10 sm:mb-12 text-center font-light relative z-0 pointer-events-none">or click to browse from your device</p>
          
          {/* Formats */}
          <div className="flex flex-wrap justify-center gap-3 sm:gap-4 z-20 relative">
            {formats.map((format, index) => (
              <Link key={index} href={format.href} className="flex items-center gap-2 bg-background/50 px-4 sm:px-5 py-2 sm:py-2.5 rounded-lg border border-border text-xs sm:text-sm font-bold text-foreground backdrop-blur-md shadow-sm hover:border-primary/50 hover:bg-primary/5 transition-all hover:scale-105 active:scale-95 cursor-pointer">
                <div className={`w-2 h-2 rounded-lg ${format.color}`}></div> {format.ext}
              </Link>
            ))}
          </div>
          
          {/* Decorative Background Elements */}
          <ImageIcon className="absolute top-8 sm:top-12 right-8 sm:right-12 text-foreground/5 w-16 h-16 sm:w-20 sm:h-20 rotate-12 group-hover:rotate-45 group-hover:scale-110 transition-transform duration-1000 pointer-events-none" />
          <Scissors className="absolute bottom-8 sm:bottom-12 left-8 sm:left-12 text-foreground/5 w-16 h-16 sm:w-20 sm:h-20 -rotate-12 group-hover:-rotate-45 group-hover:scale-110 transition-transform duration-1000 pointer-events-none" />
        </div>
      </div>
    </div>
  );
}
