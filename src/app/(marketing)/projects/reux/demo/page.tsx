import { ExternalLink, Rocket } from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";
import DemoIframe from "@/components/ui/DemoIframe";
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

          {configured && (
            <AnimatedButton href={demoSrc} variant="secondary" external>
              <span className="inline-flex items-center gap-2">
                Open Fullscreen
                <ExternalLink className="h-4 w-4" />
              </span>
            </AnimatedButton>
          )}
        </div>

        {configured ? (
          <DemoIframe src={demoSrc} />
        ) : (
          <div className="glass-card max-w-3xl rounded-xl p-8">
            <h2 className="mb-4 text-2xl font-bold text-white">Demo host not connected yet</h2>
            <p className="mb-6 text-gray-400">
              Set `NEXT_PUBLIC_REUX_DEMO_URL` on the website deployment after the Node demo service is live.
            </p>
            <AnimatedButton href="/projects/reux" variant="secondary">
              Back to Reux
            </AnimatedButton>
          </div>
        )}
      </div>
    </div>
  );
}
