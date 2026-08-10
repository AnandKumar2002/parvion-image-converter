import { Metadata } from "next";
import { ShieldCheck, Zap, Globe, Heart, Lock, Code2, User } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us | Parvion Image Converter",
  description:
    "Learn about Parvion Image Converter — a free, privacy-first suite of browser-based image tools built by Anand Kumar using WebAssembly and modern Web APIs.",
};

export default function AboutPage() {
  const values = [
    {
      icon: Lock,
      title: "100% Privacy",
      description:
        "We believe your files belong to you. That's why we built our tools to process everything locally in your browser. Nothing is ever uploaded to our servers.",
      color: "text-cyan-400",
      bg: "bg-cyan-500/10",
      gradient: "from-cyan-500/10",
    },
    {
      icon: Zap,
      title: "Lightning Fast",
      description:
        "By eliminating server uploads and downloads, our tools operate at the speed of your device, saving you precious time.",
      color: "text-blue-400",
      bg: "bg-blue-500/10",
      gradient: "from-blue-500/10",
    },
    {
      icon: Globe,
      title: "Accessible Anywhere",
      description:
        "Whether you're on a desktop, tablet, or mobile phone, our tools work seamlessly across all modern web browsers without any app installations.",
      color: "text-indigo-400",
      bg: "bg-indigo-500/10",
      gradient: "from-indigo-500/10",
    },
    {
      icon: Heart,
      title: "Free Forever",
      description:
        "We are committed to keeping our core image processing tools completely free and accessible to everyone around the world.",
      color: "text-pink-400",
      bg: "bg-pink-500/10",
      gradient: "from-pink-500/10",
    },
  ];

  const techStack = [
    {
      name: "HTML5 Canvas API",
      description:
        "The backbone of all image operations — format conversions, compression, cropping, resizing, rotating, and filter rendering all happen through the browser's 2D Canvas context. This is a native browser capability with no external dependencies.",
    },
    {
      name: "WebAssembly (WASM)",
      description:
        "Performance-critical operations like AI background removal run as compiled WebAssembly binaries inside the browser sandbox. WASM enables near-native execution speed for the AI segmentation neural network without any server involvement.",
    },
    {
      name: "FFmpeg (compiled to WASM)",
      description:
        "Video format tasks like GIF-to-MP4 conversion use FFmpeg — the industry-standard multimedia encoding library — compiled to WebAssembly by the FFmpeg.wasm project. This runs the full FFmpeg pipeline locally on your device.",
    },
    {
      name: "ONNX Runtime Web",
      description:
        "The AI background removal model is delivered as an ONNX (Open Neural Network Exchange) file and executed using the ONNX Runtime Web library, which runs the neural network inference directly in your browser.",
    },
  ];

  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 sm:px-6">
      {/* Hero */}
      <div className="text-center mb-16 space-y-4">
        <h1 className="text-4xl md:text-6xl font-black tracking-tight">
          About{" "}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 to-blue-500">
            Parvion
          </span>
        </h1>
        <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto">
          A free, privacy-first suite of browser-based image tools — built so you never have to
          upload your photos to a stranger's server again.
        </p>
      </div>

      {/* Our Story */}
      <div className="grid md:grid-cols-2 gap-12 items-center mb-24">
        <div className="space-y-6">
          <h2 className="text-3xl font-bold">Our Story</h2>
          <p className="text-muted-foreground leading-relaxed">
            Parvion Image Converter was born out of frustration. Every time we needed to quickly
            convert, compress, or resize an image, we were forced to upload our private files to
            sketchy third-party servers, wait in virtual &ldquo;queues&rdquo;, and deal with intrusive
            pop-up ads.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            We knew there had to be a better way. Leveraging modern web technologies like
            WebAssembly, we built a suite of tools that run directly inside your browser. This means
            your files never leave your device, ensuring absolute privacy and unmatched speed.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Today, Parvion covers over 20 image tools across three categories — conversion,
            compression, and editing — all completely free and all processed entirely on your device.
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

      {/* Core Values */}
      <div className="space-y-12 mb-24">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Our Core Values</h2>
          <p className="text-muted-foreground">The principles that guide everything we build.</p>
        </div>
        
        <div className="grid sm:grid-cols-2 gap-6">
          {values.map((val, idx) => {
            const Icon = val.icon;
            return (
              <div
                key={idx}
                className="group relative overflow-hidden bg-card/60 backdrop-blur-sm border border-border p-6 rounded-2xl hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                <div
                  className={`absolute inset-0 bg-gradient-to-br ${val.gradient} to-transparent opacity-0 group-hover:opacity-100 transition-opacity`}
                ></div>
                <div className="relative z-10">
                  <div
                    className={`w-14 h-14 rounded-xl ${val.bg} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}
                  >
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

      {/* How It Works Technically */}
      <div className="space-y-8 mb-24">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-primary mb-4">
            <Code2 className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">Under the Hood</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">How It Works Technically</h2>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Every Parvion tool processes images using standard web technologies that run natively in
            your browser — no plugins, no extensions, no servers.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {techStack.map((tech, idx) => (
            <div
              key={idx}
              className="bg-card/60 border border-border rounded-2xl p-6 space-y-3"
            >
              <h3 className="font-bold text-foreground flex items-center gap-2">
                <span className="w-6 h-6 rounded-md bg-primary/10 text-primary text-xs font-black flex items-center justify-center">
                  {idx + 1}
                </span>
                {tech.name}
              </h3>
              <p className="text-sm text-muted-foreground leading-relaxed">{tech.description}</p>
            </div>
          ))}
        </div>

        <div className="bg-card/40 border border-border/60 rounded-2xl p-6 text-center space-y-2">
          <p className="text-sm font-semibold text-foreground">
            All operations run inside your browser&apos;s sandboxed environment
          </p>
          <p className="text-xs text-muted-foreground max-w-xl mx-auto">
            Modern browsers isolate each tab and web app in a strict security sandbox. Even if
            Parvion wanted to access your files beyond what you explicitly upload, the browser
            architecture prevents it. Your files are safe by design, not just by policy.
          </p>
        </div>
      </div>

      {/* Meet the Builder — E-E-A-T signal */}
      <div className="space-y-8">
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-primary mb-4">
            <User className="w-5 h-5" />
            <span className="text-sm font-bold uppercase tracking-wider">The Builder</span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Who Built This?</h2>
        </div>

        <div className="bg-card/60 border border-border rounded-2xl p-8 flex flex-col sm:flex-row items-center sm:items-start gap-6">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-br from-cyan-500/20 to-blue-500/20 border border-border flex items-center justify-center flex-shrink-0">
            <span className="text-3xl font-black text-transparent bg-clip-text bg-gradient-to-br from-cyan-400 to-blue-500">
              AK
            </span>
          </div>
          <div className="space-y-3 text-center sm:text-left">
            <div>
              <h3 className="text-xl font-bold text-foreground">Anand Kumar</h3>
              <p className="text-sm text-muted-foreground">Full-Stack Developer &amp; Founder of Parvion</p>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed max-w-2xl">
              Anand built Parvion as a solution to a personal frustration: the lack of fast, private,
              and beautiful image tools on the web. With a background in full-stack web development
              and a strong interest in browser capabilities and WebAssembly, he designed and
              implemented all of Parvion&apos;s tools from scratch using Next.js, TypeScript, and the
              HTML5 Canvas API.
            </p>
            <div className="flex flex-wrap gap-3 justify-center sm:justify-start">
              <a
                href="mailto:anandkumar101002@gmail.com"
                className="text-xs text-cyan-500 hover:underline font-semibold"
              >
                anandkumar101002@gmail.com
              </a>
              <a
                href="https://www.instagram.com/__.anand._______/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-xs text-cyan-500 hover:underline font-semibold"
              >
                Instagram
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
