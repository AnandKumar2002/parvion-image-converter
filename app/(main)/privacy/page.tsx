import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Parvion Image Converter",
  description: "Read the Privacy Policy for Parvion Image Converter to understand how we protect your files and data.",
};

export default function PrivacyPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-12 border-b border-border pb-8">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
          Privacy Policy
        </h1>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-cyan-500 hover:prose-a:text-cyan-400">
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          At Parvion Image Converter, we value your privacy above all else. This Privacy Policy describes how we handle information when you visit or use our website.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">1. Local Client-Side Processing</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Parvion operates entirely as a client-side web application. All tool tasks (image conversions, compression, editing, and background removal) are executed **directly inside your web browser** using local Javascript, Canvas APIs, and local WebAssembly neural networks.
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li>Your uploaded image files are **never** transmitted, uploaded, or stored on our servers.</li>
            <li>We do not have access to your personal files or pictures.</li>
            <li>Once you close the browser tab, your workspace state is cleared automatically.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">2. Cookies and Tracking</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We use cookies to maintain basic settings (like theme preference) and to analyze our website traffic. We do not use cookies to track personal identifying information.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">3. Google AdSense & Third-Party Advertising</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We serve advertisements through Google AdSense on our website. Please note the following regarding Google's advertising policies:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>Third-party vendors, including Google, use cookies to serve ads based on your prior visits to our website or other websites.</li>
            <li>Google's use of advertising cookies enables it and its partners to serve ads to you based on your visits to our site and/or other sites on the Internet.</li>
            <li>You may opt out of personalized advertising by visiting Google's <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-cyan-500 font-semibold hover:underline">Ads Settings</a>. Alternatively, you can opt out of a third-party vendor's use of cookies for personalized advertising by visiting <a href="https://www.aboutads.info" target="_blank" rel="noopener noreferrer" className="text-cyan-500 font-semibold hover:underline">www.aboutads.info</a>.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">4. Analytics</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            We may use third-party service providers (like Google Analytics) to monitor and analyze the use of our Service. These services compile aggregated data regarding site usage patterns (e.g. page views, browser type, referral traffic) to help us improve performance. No personal file data is tracked or collected.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">5. Children's Privacy</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Our Service does not address anyone under the age of 13. We do not knowingly collect personally identifiable information from children.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">6. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions about this Privacy Policy, please contact us at: <a href="mailto:anandkumar101002@gmail.com" className="text-cyan-500 font-semibold hover:underline">anandkumar101002@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
