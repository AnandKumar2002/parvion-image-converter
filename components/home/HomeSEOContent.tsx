import Link from "next/link";
import { CheckCircle } from "lucide-react";

const FORMAT_TABLE = [
  { format: "JPG / JPEG", best: "Photographs, social media", transparent: "No", size: "Small" },
  { format: "PNG", best: "Logos, screenshots, graphics", transparent: "Yes", size: "Medium" },
  { format: "WebP", best: "Modern websites, fastest load", transparent: "Yes", size: "Smallest" },
  { format: "GIF", best: "Simple animations", transparent: "Partial", size: "Variable" },
  { format: "SVG", best: "Icons, illustrations, logos", transparent: "Yes", size: "Tiny (vector)" },
  { format: "HEIC", best: "iPhone photos (native)", transparent: "No", size: "Small" },
  { format: "AVIF", best: "Next-gen web images", transparent: "Yes", size: "Smallest" },
  { format: "PDF", best: "Documents, print, archival", transparent: "No", size: "Variable" },
];

const HOME_FAQS = [
  {
    q: "Are Parvion's image tools really completely free?",
    a: "Yes — every tool in the Parvion suite is free with no usage limits, no watermark on your output, and no account required. We are supported by non-intrusive display advertising, which is what allows us to keep the tools free for everyone.",
  },
  {
    q: "Do my files get uploaded to your servers?",
    a: "No — never. All image processing in Parvion happens entirely inside your web browser using the HTML5 Canvas API and WebAssembly. Your files are never transmitted to any server, never stored, and never seen by anyone other than you. This is a fundamental architectural choice, not just a privacy policy promise.",
  },
  {
    q: "What browsers and devices are supported?",
    a: "Parvion works on any modern browser — Chrome, Firefox, Safari, and Edge on desktop and mobile. No plugins, extensions, or app installations are required. The tools work on Windows, macOS, Linux, iOS (iPhone/iPad), and Android.",
  },
  {
    q: "Is there a file size limit for uploaded images?",
    a: "There is no arbitrary limit imposed by Parvion. The only practical constraint is your device's available memory. Most modern computers and smartphones can comfortably process images up to 50–100 megapixels or around 100MB in file size.",
  },
  {
    q: "Can I use Parvion for commercial projects?",
    a: "Yes. You are free to use Parvion to process images for any purpose — personal, freelance, or commercial. The tools themselves impose no licensing restrictions on the output files you create.",
  },
  {
    q: "How is Parvion different from other online image tools?",
    a: "Most online image tools work by uploading your file to a server, processing it remotely, and sending you the result. This is slow, raises privacy concerns, and requires a server to be available. Parvion processes everything locally in your browser, making it faster (no upload wait), more private (zero file transfers), and available even offline after the initial page load.",
  },
];

export default function HomeSEOContent() {
  return (
    <div className="w-full space-y-16 py-12 border-t border-border/60 mt-6">

      {/* About the Suite */}
      <section className="w-full space-y-8">
        <div className="text-center space-y-3">
          <h2 className="text-2xl sm:text-3xl font-bold text-foreground tracking-tight">
            A Better Way to Edit Images Online
          </h2>
          <p className="text-muted-foreground text-base max-w-2xl mx-auto leading-relaxed">
            No server, no subscription, no compromises — just fast, private image tools that run directly in your browser.
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              Parvion is a free, browser-based image toolkit covering everything from format conversion
              and file compression to background removal, photo editing, and creative filters — all
              without installing any software or creating an account. Unlike traditional online tools
              that send your photos to a remote server, Parvion processes every image entirely on your
              own device using the HTML5 Canvas API and WebAssembly technology.
            </p>
            <p>
              This client-side approach means your photos are never uploaded anywhere. Processing starts
              the instant you click, with no upload wait times, no file size restrictions imposed by
              server quotas, and no risk of your private images being stored on a third-party server.
            </p>
          </div>
          <div className="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>
              The suite is organized into three categories. <strong className="text-foreground">Convert</strong> handles
              format changes between JPG, PNG, WebP, GIF, SVG, HEIC, AVIF, and PDF.
              <strong className="text-foreground"> Compress</strong> shrinks file sizes using smart
              auto-compression, a target-KB precision mode, or lossless-only optimisation.
              The <strong className="text-foreground">Tools</strong> studio covers cropping, resizing,
              rotating, flipping, watermarking, colour filters, AI background removal, and decorative
              borders &amp; frames.
            </p>
            <p>
              Every tool is permanently free, requires no registration, imposes no output watermarks,
              and works on any device with a modern web browser — desktop, laptop, tablet, or smartphone.
            </p>
          </div>
        </div>

      </section>

      {/* Supported Formats Table */}
      <section className="w-full space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Supported Image Formats
          </h2>
          <p className="text-sm text-muted-foreground">
            A quick reference for choosing the right format for your project.
          </p>
        </div>
        <div className="overflow-x-auto rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/30">
                <th className="text-left px-4 py-3 font-bold text-foreground">Format</th>
                <th className="text-left px-4 py-3 font-bold text-foreground">Best For</th>
                <th className="text-left px-4 py-3 font-bold text-foreground">Transparency</th>
                <th className="text-left px-4 py-3 font-bold text-foreground">File Size</th>
              </tr>
            </thead>
            <tbody>
              {FORMAT_TABLE.map((row, i) => (
                <tr
                  key={row.format}
                  className={`border-b border-border/40 last:border-0 ${
                    i % 2 === 0 ? "bg-card/30" : "bg-card/10"
                  }`}
                >
                  <td className="px-4 py-3 font-semibold text-foreground">{row.format}</td>
                  <td className="px-4 py-3 text-muted-foreground">{row.best}</td>
                  <td className="px-4 py-3">
                    <span
                      className={`text-xs font-bold px-2 py-0.5 rounded-full ${
                        row.transparent === "Yes"
                          ? "bg-emerald-500/10 text-emerald-500"
                          : row.transparent === "Partial"
                          ? "bg-amber-500/10 text-amber-500"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      {row.transparent}
                    </span>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{row.size}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="w-full space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">
            Frequently Asked Questions
          </h2>
          <p className="text-sm text-muted-foreground">
            Common questions about Parvion Image Converter.
          </p>
        </div>

        <div className="space-y-3">
          {HOME_FAQS.map((faq, idx) => (
            <details
              key={idx}
              name="home-faq"
              className="group border border-border/60 rounded-2xl bg-card p-5 transition-all duration-300 [&_summary::-webkit-details-marker]:hidden"
            >
              <summary className="flex items-center justify-between font-bold text-sm text-foreground cursor-pointer list-none select-none">
                <span>{faq.q}</span>
                <span className="transition-transform duration-300 group-open:rotate-180 text-muted-foreground/60 flex-shrink-0 ml-4">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </span>
              </summary>
              <p className="text-xs sm:text-sm text-muted-foreground leading-relaxed mt-4 border-t border-border/40 pt-4">
                {faq.a}
              </p>
            </details>
          ))}
        </div>
      </section>

      {/* Quick links to tools */}
      <section className="w-full space-y-6">
        <div className="text-center space-y-2">
          <h2 className="text-2xl font-bold text-foreground tracking-tight">Popular Tools</h2>
          <p className="text-sm text-muted-foreground">
            Jump straight to the tool you need.
          </p>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
          {[
            { name: "PNG to JPG", href: "/convert/png-to-jpg" },
            { name: "JPG to PNG", href: "/convert/jpg-to-png" },
            { name: "WebP Converter", href: "/convert/webp-converter" },
            { name: "HEIC to JPG", href: "/convert/heic-to-jpg" },
            { name: "Compress Images", href: "/compress/compress-images" },
            { name: "Reduce File Size", href: "/compress/reduce-file-size" },
            { name: "Background Remover", href: "/tools/background-remover" },
            { name: "Image to PDF", href: "/convert/image-to-pdf" },
            { name: "Crop Images", href: "/tools/crop-images" },
            { name: "Resize Images", href: "/tools/resize-images" },
            { name: "Add Watermark", href: "/tools/watermark" },
            { name: "Image Filters", href: "/tools/image-filters" },
          ].map((tool) => (
            <Link
              key={tool.href}
              href={tool.href}
              className="flex items-center gap-2 px-3 py-2.5 rounded-lg bg-card/60 border border-border text-xs font-semibold text-foreground hover:bg-card hover:border-primary/30 hover:text-primary transition-all duration-200 group"
            >
              <CheckCircle className="w-3.5 h-3.5 text-primary/40 group-hover:text-primary shrink-0 transition-colors" />
              {tool.name}
            </Link>
          ))}
        </div>
      </section>

    </div>
  );
}
