import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Conditions | Parvion Image Converter",
  description: "Read the Terms and Conditions for using Parvion Image Converter's free online tools.",
};

export default function TermsPage() {
  return (
    <div className="w-full max-w-4xl mx-auto py-12 px-4 sm:px-6">
      <div className="mb-12 border-b border-border pb-8">
        <h1 className="text-4xl md:text-5xl font-black tracking-tight mb-4">
          Terms and Conditions
        </h1>
      </div>

      <div className="prose prose-slate dark:prose-invert max-w-none prose-headings:font-bold prose-headings:tracking-tight prose-a:text-cyan-500 hover:prose-a:text-cyan-400">
        <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
          Please read these terms and conditions carefully before using Our Service. By accessing or using the Service, you agree to be bound by these Terms.
        </p>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">1. Acknowledgment</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            These are the Terms and Conditions governing the use of this Service and the agreement that operates between You and Parvion. These Terms and Conditions set out the rights and obligations of all users regarding the use of the Service.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Your access to and use of the Service is conditioned on Your acceptance of and compliance with these Terms and Conditions. These Terms and Conditions apply to all visitors, users, and others who access or use the Service.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">2. Privacy and Data Handling</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Parvion Image Converter operates entirely within your web browser (client-side processing). This means:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-4">
            <li>Your image files are <strong>never</strong> uploaded to our servers.</li>
            <li>We do not have access to, store, or share your files with any third parties.</li>
            <li>All processing is done locally on your device's hardware.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">3. Prohibited Uses</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            You may use the Service only for lawful purposes and in accordance with these Terms. You agree not to use the Service:
          </p>
          <ul className="list-disc pl-6 space-y-2 text-muted-foreground">
            <li>In any way that violates any applicable national or international law or regulation.</li>
            <li>For the purpose of exploiting, harming, or attempting to exploit or harm minors in any way.</li>
            <li>To attempt to bypass any security mechanisms or usage limits of the website.</li>
          </ul>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">4. Intellectual Property</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            The Service and its original content (excluding content provided by You), features, and functionality are and will remain the exclusive property of Parvion and its licensors. The Service is protected by copyright, trademark, and other laws of both the Country and foreign countries. Our trademarks and trade dress may not be used in connection with any product or service without the prior written consent of Parvion.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">5. Disclaimer of Warranties</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            The Service is provided to You "AS IS" and "AS AVAILABLE" and with all faults and defects without warranty of any kind. To the maximum extent permitted under applicable law, the operator of Parvion expressly disclaims all warranties, whether express, implied, statutory or otherwise, with respect to the Service.
          </p>
          <p className="text-muted-foreground leading-relaxed">
            Without limiting the foregoing, we do not make any representation or warranty of any kind, express or implied: (i) as to the operation or availability of the Service, or the information, content, and materials or products included thereon; (ii) that the Service will be uninterrupted or error-free; (iii) as to the accuracy, reliability, or currency of any information or content provided through the Service.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">6. Limitation of Liability</h2>
          <p className="text-muted-foreground leading-relaxed mb-4">
            Since this Service is provided entirely free of charge, the operator of Parvion bears no liability for any damages you might incur from its use. Your exclusive remedy for any dissatisfaction or issue with the Service is to stop using it.
          </p>
        </section>

        <section className="mb-10">
          <h2 className="text-2xl font-bold mb-4">7. Contact Us</h2>
          <p className="text-muted-foreground leading-relaxed">
            If you have any questions about these Terms and Conditions, You can contact us at: <a href="mailto:anandkumar101002@gmail.com" className="text-cyan-500 font-semibold hover:underline">anandkumar101002@gmail.com</a>
          </p>
        </section>
      </div>
    </div>
  );
}
