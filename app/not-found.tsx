import Link from "next/link";
import { Home, BookOpen } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 py-16 animate-fade-in-up">
      <div className="w-16 h-16 rounded-2xl bg-primary/10 text-primary flex items-center justify-center mb-6 font-mono text-2xl font-black">
        404
      </div>
      <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground mb-3">
        Page Not Found
      </h1>
      <p className="text-base text-muted-foreground max-w-md mb-8 leading-relaxed">
        The page you are looking for doesn&apos;t exist or may have been moved. You can return to our free image toolkit or explore our optimization guides.
      </p>
      <div className="flex flex-wrap items-center justify-center gap-4">
        <Link
          href="/"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-primary text-primary-foreground font-semibold text-sm hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>
        <Link
          href="/guides"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-card border border-border text-foreground font-semibold text-sm hover:bg-muted transition-colors"
        >
          <BookOpen className="w-4 h-4" />
          Browse Guides
        </Link>
      </div>
    </div>
  );
}
