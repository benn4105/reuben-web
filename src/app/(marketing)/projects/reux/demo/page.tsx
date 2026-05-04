import { ExternalLink, Rocket, ShieldCheck, Terminal } from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";
import DemoIframe from "@/components/ui/DemoIframe";
import PilotRequestPanel from "@/components/simulator/PilotRequestPanel";
import { reuxDemoUrl } from "@/lib/demo";

interface ReuxDemoPageProps {
  searchParams?: Promise<{ domain?: string }>;
}

export default async function ReuxDemoPage({ searchParams }: ReuxDemoPageProps) {
  const configured = reuxDemoUrl.length > 0;
  const params = await searchParams;
  const domain = params?.domain === "logistics" ? "logistics" : "commerce";
  const demoTitle = domain === "logistics" ? "Try the Reux logistics dispatch console" : "Try the Reux commerce console";
  const demoCopy =
    domain === "logistics"
      ? "A running dispatch slice of the language: generated schema, typed queries, guarded shipment transitions, PostgreSQL state, and outbox events."
      : "A running commerce slice of the language: migrations, typed queries, transactions, PostgreSQL state, and outbox events.";
  const demoSrc = configured ? `${reuxDemoUrl}${reuxDemoUrl.includes("?") ? "&" : "?"}domain=${domain}` : "";

  return (
    <div className="pt-28 pb-16 min-h-screen bg-[#0A0A0A]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-8 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-3xl">
            <div className="mb-5 inline-flex items-center gap-2 glass px-4 py-2 rounded-full">
              <Rocket className="h-4 w-4 text-[#00F0FF]" />
              <span className="text-sm font-medium tracking-wide text-gray-300 uppercase">
                Reux Live Pilot
              </span>
            </div>
            <h1 className="mb-4 text-4xl font-black tracking-tight text-white md:text-6xl">
              {demoTitle}
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-gray-400">
              {demoCopy}
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <AnimatedButton href="/simulator" variant="primary">
              Try Business Simulator
            </AnimatedButton>
            {configured && (
              <AnimatedButton href={demoSrc} variant="secondary" external>
                <span className="inline-flex items-center gap-2">
                  Open Fullscreen
                  <ExternalLink className="h-4 w-4" />
                </span>
              </AnimatedButton>
            )}
          </div>
        </div>

        {configured ? (
          <DemoIframe src={demoSrc} />
        ) : (
          <div className="overflow-hidden rounded-2xl border border-white/10 bg-white/[0.03]">
            <div className="grid gap-0 lg:grid-cols-[0.95fr_1.05fr]">
              <div className="border-b border-white/10 p-6 md:p-8 lg:border-b-0 lg:border-r">
                <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-amber-500/25 bg-amber-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-amber-200">
                  <Terminal className="h-3.5 w-3.5" />
                  Demo standby
                </div>
                <h2 className="mb-4 text-3xl font-black tracking-tight text-white">
                  The hosted console is being refreshed.
                </h2>
                <p className="mb-6 text-sm leading-relaxed text-gray-400 md:text-base">
                  The Reux backend demo may be offline while the public service is redeployed. You can still try the flagship Business Simulator, review the Reux developer preview, or request a founder pilot with one real decision.
                </p>
                <div className="flex flex-col gap-3 sm:flex-row">
                  <AnimatedButton href="/simulator" variant="primary">
                    Try Business Simulator
                  </AnimatedButton>
                  <AnimatedButton href="/docs" variant="secondary">
                    Developer Preview
                  </AnimatedButton>
                </div>
              </div>

              <div className="grid gap-4 p-6 md:p-8">
                {[
                  "Commerce and logistics demos run against the same Reux runtime patterns.",
                  "The Business Simulator remains the primary public proof point.",
                  "Founder pilot requests are routed through the live intake flow when the backend is configured.",
                ].map((item) => (
                  <div key={item} className="flex gap-3 rounded-xl border border-white/10 bg-black/20 p-4">
                    <ShieldCheck className="mt-0.5 h-5 w-5 shrink-0 text-[#00F0FF]" />
                    <p className="text-sm leading-relaxed text-gray-300">{item}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        <div className="mt-6">
          <PilotRequestPanel />
        </div>
      </div>
    </div>
  );
}
