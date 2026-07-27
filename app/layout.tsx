import type { Metadata } from "next";
import { Inter } from "next/font/google";
import Script from "next/script";
import "./globals.css";
import { ThemeProvider } from "@/components/layout/ThemeProvider";

const inter = Inter({ 
  subsets: ["latin"],
  display: 'swap',
  preload: false
});

export const metadata: Metadata = {
  title: "Parvion Image Converter - Free Online Image Tools",
  description: "Convert, compress, and edit your images instantly. Your photos never leave your device, keeping them 100% private and secure.",
  keywords: ["image converter", "image compressor", "free online image tools", "privacy image editor", "local image processing", "Parvion"],
  authors: [{ name: "Anand Kumar" }],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: "https://image.parvion.in",
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

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: `window.__name = function (func) { return func; }` }} />
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
