import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";
import { JsonLd } from "@/components/shared/JsonLd";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
});

export const metadata: Metadata = {
  title: "Parvion Image Converter - Free Online Image Tools",
  description: "Convert, compress, and edit your images instantly. Your photos never leave your device, keeping them 100% private and secure.",
  keywords: ["image converter", "image compressor", "free online image tools", "privacy image editor", "local image processing", "Parvion"],
  authors: [{ name: "Anand Kumar" }],
  verification: {
    google: "ca-pub-8823925019937744",
  },
  other: {
    "google-adsense-account": "ca-pub-8823925019937744",
  },
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://parvion.in",
    title: "Parvion Image Converter - Free Online Image Tools",
    description: "Convert, compress, and edit your images instantly. 100% private, client-side processing.",
    siteName: "Parvion",
  },
  twitter: {
    card: "summary_large_image",
    title: "Parvion Image Converter",
    description: "Convert, compress, and edit your images instantly directly in your browser. Complete privacy.",
  },
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "Parvion Image Converter",
  "url": "https://parvion.in",
  "description": "Free browser-based image tools: convert, compress, crop, resize, filter, watermark, and remove backgrounds — with complete privacy.",
  "potentialAction": {
    "@type": "SearchAction",
    "target": {
      "@type": "EntryPoint",
      "urlTemplate": "https://parvion.in/{search_term_string}"
    },
    "query-input": "required name=search_term_string"
  }
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "Parvion",
  "url": "https://parvion.in",
  "logo": "https://parvion.in/icon.png",
  "contactPoint": {
    "@type": "ContactPoint",
    "email": "anandkumar101002@gmail.com",
    "contactType": "customer support"
  }
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `window.__name = function (func) { return func; }` }} />
        <JsonLd schema={websiteSchema} />
        <JsonLd schema={organizationSchema} />
      </head>
      <body className={`${inter.className} min-h-screen bg-background text-foreground selection:bg-cyan-500/30 font-sans flex relative`} suppressHydrationWarning>
        {process.env.NEXT_PUBLIC_ADSENSE_PUB_ID && (
          <Script
            async
            src={`https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=${process.env.NEXT_PUBLIC_ADSENSE_PUB_ID}`}
            crossOrigin="anonymous"
            strategy="afterInteractive"
          />
        )}
        <Script id="microsoft-clarity" strategy="afterInteractive">
          {`
            (function(c,l,a,r,i,t,y){
                c[a]=c[a]||function(){(c[a].q=c[a].q||[]).push(arguments)};
                t=l.createElement(r);t.async=1;t.src="https://www.clarity.ms/tag/"+i;
                y=l.getElementsByTagName(r)[0];y.parentNode.insertBefore(t,y);
            })(window, document, "clarity", "script", "y0rk9o68ga");
          `}
        </Script>
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
