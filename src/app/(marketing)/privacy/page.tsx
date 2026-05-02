import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Privacy Policy | Reuben",
  description: "Privacy policy for Reuben Inc. and the Reux ecosystem.",
};

export default function PrivacyPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-4 md:px-8 max-w-3xl">
        <h1 className="text-4xl font-bold tracking-tight mb-4">Privacy Policy</h1>
        <p className="text-gray-400 mb-8">Last updated: May 2026</p>

        <div className="prose prose-invert prose-gray max-w-none space-y-6 text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Overview</h2>
            <p>
              Reuben Inc. (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) operates the reuben.inc website and the Business Simulator demo. This page describes what data we collect and how we use it.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">What We Collect</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li><strong className="text-gray-300">Simulator usage:</strong> Scenario inputs you submit to the Business Simulator are processed to generate results. This data is not stored permanently and is used only for the demo session.</li>
              <li><strong className="text-gray-300">Analytics:</strong> We may collect anonymous page visit data (e.g., page views, referrer) to understand how visitors use the site. No personally identifiable information is collected through analytics.</li>
              <li><strong className="text-gray-300">Contact emails:</strong> If you email us directly (e.g., via the PLOS interest link), we receive your email address and message content.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">What We Do Not Collect</h2>
            <ul className="list-disc pl-5 space-y-2 text-gray-400">
              <li>We do not require accounts or passwords.</li>
              <li>We do not use tracking cookies for advertising.</li>
              <li>We do not sell or share personal data with third parties.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Third-Party Services</h2>
            <p>
              The site is hosted on Railway and Vercel. These providers may collect standard server logs (IP addresses, request timestamps) as part of their hosting infrastructure.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-white mb-3">Contact</h2>
            <p>
              Questions about this policy can be sent to{" "}
              <a href="mailto:privacy@reuben.inc" className="text-[#00F0FF] hover:underline">privacy@reuben.inc</a>.
            </p>
          </section>
        </div>
      </div>
    </div>
  );
}
