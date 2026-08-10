import { ShieldCheck, Zap, Cpu } from "lucide-react";

export default function ValuePropsSection() {
  const valueProps = [
    {
      icon: ShieldCheck,
      title: "100% Private by Design",
      description:
        "Every image you process stays entirely on your own computer. Parvion never uploads, transmits, or stores your files on any server. Your photos are yours — and only yours.",
      iconColor: "text-cyan-400",
      hoverBg: "group-hover:bg-cyan-500/10",
      gradient: "from-cyan-500/10 via-cyan-500/5 to-transparent",
    },
    {
      icon: Zap,
      title: "Faster Than Any Upload",
      description:
        "Because your files never travel over the internet, processing starts the instant you click. Convert, compress, or edit a photo in under a second — no queues, no waiting rooms.",
      iconColor: "text-blue-400",
      hoverBg: "group-hover:bg-blue-500/10",
      gradient: "from-blue-500/10 via-blue-500/5 to-transparent",
    },
    {
      icon: Cpu,
      title: "Works in Any Browser",
      description:
        "No app to install, no plugin to enable, no account to create. Open the tool, drop in your image, and download the result. Works on Chrome, Firefox, Safari, and Edge — on any device.",
      iconColor: "text-indigo-400",
      hoverBg: "group-hover:bg-indigo-500/10",
      gradient: "from-indigo-500/10 via-indigo-500/5 to-transparent",
    },
  ];

  return (
    <section className="w-full py-12 sm:py-18 border-y border-border mt-10">
      <div className="grid md:grid-cols-3 gap-6 lg:gap-8">
        {valueProps.map((prop, index) => {
          const IconComponent = prop.icon;
          return (
            <div
              key={index}
              className={`bg-card/60 border border-border shadow-sm p-8 rounded-lg hover:-translate-y-2 hover:shadow-2xl transition-all duration-500 group cursor-default relative overflow-hidden flex flex-col animate-fade-in-up delay-${(index + 2) * 100}`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-700 ${prop.gradient}`}></div>
              
              <div className="w-16 h-16 rounded-lg flex items-center justify-center mb-8 shadow-sm border border-border bg-background relative z-10 group-hover:scale-110 transition-transform duration-500">
                <IconComponent className={`w-8 h-8 ${prop.iconColor}`} />
              </div>
              
              <h3 className="text-xl sm:text-2xl font-bold text-foreground mb-4 relative z-10">{prop.title}</h3>
              <p className="text-base text-muted-foreground leading-relaxed font-light relative z-10">{prop.description}</p>
              
              {/* Ambient corner glow */}
              <div className={`absolute -bottom-10 -right-10 w-32 h-32 blur-[50px] rounded-full opacity-0 group-hover:opacity-20 transition-opacity duration-500 ${prop.hoverBg.replace("group-hover:", "")}`}></div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
