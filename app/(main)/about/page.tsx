import { Metadata } from "next";
import { ShieldCheck, Zap, Globe, Heart, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Parvion Image Converter",
  description: "Learn more about Parvion Image Converter, our mission, and our commitment to absolute privacy and speed.",
};

export default function AboutPage() {
  const values = [
    {
      icon: Lock,
      title: "100% Privacy",
      description: "We believe your files belong to you. That's why we built our tools to process everything locally in your browser. Nothing is ever uploaded to our servers.",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      gradient: "from-cyan-500/10",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description: "By eliminating server uploads and downloads, our tools operate at the speed of your device, saving you precious time.",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      gradient: "from-blue-500/10",
    },
    {
      icon: Globe,
      title: "Accessible Anywhere",
      description: "Whether you're on a desktop, tablet, or mobile phone, our tools work seamlessly across all modern web browsers without any app installations.",
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      gradient: "from-indigo-500/10",
    },
    {
      icon: Heart,
      title: "Free Forever",
      description: "We are committed to keeping our core image processing tools completely free and accessible to everyone around the world.",
      color: "text-pink-400",
      bg: "bg-pink-500/10",
      gradient: "from-pink-500/10",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 sm:px-6">
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight">
          About <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">Parvion</span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          We are on a mission to provide the fastest, safest, and most beautiful image tools on the web.
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed">
            Parvion Image Converter was born out of frustration. Every time we needed to quickly convert, compress, or resize an image, we were forced to upload our private files to sketchy third-party servers, wait in virtual "queues", and deal with intrusive pop-up ads.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We knew there had to be a better way. Leveraging modern web technologies like WebAssembly, we built a suite of tools that run directly inside your browser. This means your files never leave your device, ensuring absolute privacy and unmatched speed.
          </p>
        </div>
        <div className="relative h-[400px] rounded-2xl overflow-hidden bg-card/50 border border-border flex items-center justify-center p-8">
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-blue-500/10"></div>
          <div className="relative z-10 w-full h-full flex items-center justify-center">
            {/* Visual representation of local processing */}
            <div className="relative w-48 h-48">
              <div className="absolute inset-0 border-4 border-dashed border-cyan-500/30 rounded-full animate-[spin_10s_linear_infinite]"></div>
              <div className="absolute inset-4 border-4 border-dashed border-blue-500/30 rounded-full animate-[spin_15s_linear_infinite_reverse]"></div>
              <div className="absolute inset-0 flex items-center justify-center">
                <ShieldCheck className="w-16 h-16 text-cyan-400" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="space-y-12">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
          <p className="text-muted-foreground">The principles that guide everything we build.</p>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-6">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div key={idx} className="group relative overflow-hidden bg-card/60 backdrop-blur-sm border border-border p-6 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300">
                <div className={`absolute inset-0 bg-gradient-to-br ${val.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}></div>
                <div className="relative z-10">
                  <div className={`w-14 h-14 rounded-xl ${val.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                    <Icon className={`w-7 h-7 ${val.color}`} />
                  </div>
                  <h3 className="text-xl font-bold mb-2">{val.title}</h3>
                  <p className="text-muted-foreground leading-relaxed">{val.description}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
