import { Metadata } from "next";
import { Mail, MessageSquare } from "lucide-react";
import PageHeader from "@/components/shared/PageHeader";

export const metadata: Metadata = {
  title: "Contact Us | Parvion Image Converter",
  description: "Get in touch with the Parvion team for support, feedback, or business inquiries.",
};

export default function ContactPage() {
  return (
    <div className="w-full max-w-5xl mx-auto py-12 px-4 sm:px-6">
      <PageHeader
        title="Contact Us"
        description="Have a question, feedback, or need support? We'd love to hear from you."
        icon="lucide:mail"
        color="text-indigo-500"
        bg="bg-indigo-500/10"
      />

      <div className="grid md:grid-cols-2 gap-8">
        {/* Direct Email Card */}
        <a 
          href="mailto:anandkumar101002@gmail.com"
          className="group block p-8 rounded-2xl bg-card/60 border border-border shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="w-14 h-14 rounded-xl bg-cyan-500/10 flex items-center justify-center mb-6 text-cyan-500 group-hover:scale-110 transition-transform">
              <Mail className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Email Support</h2>
            <p className="text-muted-foreground mb-6 flex-1">
              For general inquiries, bug reports, or feature requests, shoot us an email. We typically respond within 24 hours.
            </p>
          </div>
        </a>

        {/* Community/Social Card */}
        <div className="p-8 rounded-2xl bg-card/60 border border-border shadow-sm relative overflow-hidden flex flex-col">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent"></div>
          <div className="relative z-10 flex flex-col h-full">
            <div className="w-14 h-14 rounded-xl bg-indigo-500/10 flex items-center justify-center mb-6 text-indigo-500">
              <MessageSquare className="w-7 h-7" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Community</h2>
            <p className="text-muted-foreground mb-6 flex-1">
              Connect with us on social media for updates, tips, and behind-the-scenes looks at what we are building.
            </p>
            
            <div className="flex gap-4">
              <a href="https://www.instagram.com/__.anand._______/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-lg bg-background border border-border flex items-center justify-center hover:bg-foreground/5 hover:text-pink-500 transition-colors" title="Instagram">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
              </a>
              <a href="http://linkedin.com/in/01anand-kumar/" target="_blank" rel="noopener noreferrer" className="w-12 h-12 rounded-lg bg-background border border-border flex items-center justify-center hover:bg-foreground/5 hover:text-blue-500 transition-colors" title="LinkedIn">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="w-5 h-5"><path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"/><rect width="4" height="12" x="2" y="9"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-16 p-8 rounded-2xl bg-muted/30 border border-border text-center">
        <h3 className="text-xl font-bold mb-2">Business Inquiries</h3>
        <p className="text-muted-foreground mb-6">
          Interested in partnering with us or integrating our tools into your platform?
        </p>
        <a 
          href="mailto:anandkumar101002@gmail.com"
          className="inline-flex items-center justify-center px-6 py-3 rounded-lg bg-foreground text-background font-bold hover:bg-foreground/90 transition-colors"
        >
          Contact Business Team
        </a>
      </div>
    </div>
  );
}
