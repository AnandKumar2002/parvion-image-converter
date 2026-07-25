import Link from "next/link";

export default function AppFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border mt-6 bg-sidebar/50">
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          <div className="col-span-2 md:col-span-2">
            <span className="font-bold text-2xl tracking-tight text-foreground">
              Parvion Image Converter
            </span>
            <p className="mt-4 text-sm text-muted-foreground max-w-sm">
              Simple, fast, and secure image tools. Everything runs directly on your device for complete privacy.
            </p>
          </div>
          
          <div>
            <h4 className="font-bold text-foreground mb-4">Features</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/convert" className="hover:text-cyan-400 transition-colors">Converter</Link></li>
              <li><Link href="/compress" className="hover:text-cyan-400 transition-colors">Compressor</Link></li>
              <li><Link href="/tools" className="hover:text-cyan-400 transition-colors">Tools</Link></li>
            </ul>
          </div>
          
          <div>
            <h4 className="font-bold text-foreground mb-4">Resources</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              <li><Link href="/about" className="hover:text-cyan-400 transition-colors">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-cyan-400 transition-colors">Contact Us</Link></li>
              <li><Link href="/terms" className="hover:text-cyan-400 transition-colors">Terms and Conditions</Link></li>
            </ul>
          </div>
        </div>
        
        <div className="mt-12 pt-8 border-t border-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground w-full text-center md:text-left">
            © {currentYear} Parvion Image Converter. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
