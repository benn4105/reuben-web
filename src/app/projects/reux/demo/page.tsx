import { ExternalLink, Rocket } from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { reuxDemoUrl } from "@/lib/demo";

export default function ReuxDemoPage() {
  const configured = reuxDemoUrl.length > 0;

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
              Try the Reux commerce console
            </h1>
            <p className="max-w-2xl text-lg leading-relaxed text-gray-400">
              A running slice of the language: migrations, typed queries, transactions, PostgreSQL state, and outbox events.
            </p>
          </div>

          {configured && (
            <AnimatedButton href={reuxDemoUrl} variant="secondary" external>
              <span className="inline-flex items-center gap-2">
                Open Fullscreen
                <ExternalLink className="h-4 w-4" />
              </span>
            </AnimatedButton>
          )}
        </div>

        {configured ? (
          <div className="overflow-hidden rounded-xl border border-white/10 bg-black shadow-2xl shadow-black/40">
            <iframe
              src={reuxDemoUrl}
              title="Reux pilot demo"
              className="h-[78vh] min-h-[680px] w-full bg-white"
            />
          </div>
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
