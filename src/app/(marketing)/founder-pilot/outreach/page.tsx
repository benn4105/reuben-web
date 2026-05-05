import { Building2, ClipboardList, Mail, MessageSquare, Store, Target, Users } from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";

const outreachMessages = [
  {
    title: "Short cold message",
    channel: "Email / LinkedIn",
    copy: `Hey [Name],

I am building Reuben, a business simulator for decisions that usually get modeled in spreadsheets.

The first founder pilot is simple: bring one real decision, one baseline, and two to four scenarios. I turn it into a focused simulator that compares margin, cost, risk, and the recommended path.

If you have a staffing, pricing, capacity, or process-change decision coming up, I would love to test it with you.

Founder Pilot: https://reuben-web.vercel.app/founder-pilot
Simulator: https://reuben-web.vercel.app/simulator`,
  },
  {
    title: "Warmer founder/operator note",
    channel: "Email / DM",
    copy: `Hey [Name],

You mentioned [specific decision/problem]. That is exactly the kind of thing I am testing with Reuben.

Instead of trying to build a giant platform first, I am doing focused founder pilots around one spreadsheet decision at a time. We take your baseline, compare a few scenarios, and turn it into a small simulator with a recommendation and transparent assumptions.

If you are open to it, send me the spreadsheet or the rough numbers and I will tell you if it is a good fit for a pilot.

Intake checklist: https://reuben-web.vercel.app/founder-pilot/intake`,
  },
  {
    title: "After-demo follow up",
    channel: "Post-call",
    copy: `Thanks for taking a look at Reuben.

The cleanest next step is to pick one decision with real stakes and scope it as a Founder Pilot.

What I need:
- The decision you are considering
- Current baseline numbers
- Two to four scenarios you want to compare
- The metric that matters most
- Any spreadsheet or report you already use

If that sounds good, send the baseline and I will turn it into a pilot scope.`,
  },
];

const targetProfiles = [
  {
    title: "Service business owner",
    icon: Store,
    bestFor: "Staffing, scheduling, pricing, overtime, throughput.",
    whyItHurts: "They feel operational pressure quickly but often make decisions from gut feel and messy spreadsheets.",
    firstAsk: "What recurring staffing or pricing decision keeps showing up every month?",
    goodSignals: ["Tracks labor cost", "Has seasonal demand", "Uses spreadsheets", "Feels capacity pressure"],
  },
  {
    title: "Ecommerce operator",
    icon: Building2,
    bestFor: "Pricing, margin, inventory, demand spikes, fulfillment quality.",
    whyItHurts: "Small changes in demand, price, or fulfillment quality can swing margin quickly.",
    firstAsk: "What pricing, inventory, or fulfillment decision are you debating right now?",
    goodSignals: ["Knows gross margin", "Has SKU/order data", "Runs promos", "Worries about stockouts"],
  },
  {
    title: "Ops manager",
    icon: Users,
    bestFor: "Capacity planning, process changes, hiring, automation, quality risk.",
    whyItHurts: "They are accountable for outcomes but often lack a clean way to compare tradeoffs before implementation.",
    firstAsk: "What operational change would be expensive to reverse if it is wrong?",
    goodSignals: ["Owns team metrics", "Has weekly reporting", "Manages headcount", "Reports risk or defects"],
  },
  {
    title: "Startup founder",
    icon: Target,
    bestFor: "Hiring plans, runway tradeoffs, growth assumptions, support load, pricing.",
    whyItHurts: "They make high-leverage decisions with incomplete data and need fast scenario clarity.",
    firstAsk: "What decision are you currently modeling in a spreadsheet before you commit?",
    goodSignals: ["Has a planning spreadsheet", "Needs investor/customer clarity", "Changing pricing", "Hiring soon"],
  },
];

const qualificationRules = [
  "The decision has financial or operational stakes.",
  "There is already a spreadsheet, report, or rough baseline.",
  "The customer can name at least two scenarios.",
  "The result would change what they do next.",
  "The pilot can stay scoped to one decision.",
];

export default function FounderPilotOutreachPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-20 pt-28">
      <section className="container mx-auto px-4 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.85fr] lg:items-start">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-200">
              Outreach Package
            </div>
            <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">
              First-customer outreach for the Founder Pilot.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">
              Use this page to find the right first pilot customers and send a clear message: one real spreadsheet decision becomes one working simulator.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <AnimatedButton href="/founder-pilot" variant="primary">
                Offer Page
              </AnimatedButton>
              <AnimatedButton href="/founder-pilot/intake" variant="secondary">
                Intake Checklist
              </AnimatedButton>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-5 flex items-center gap-3">
              <ClipboardList className="h-6 w-6 text-cyan-300" />
              <h2 className="text-xl font-bold text-white">Qualify fast</h2>
            </div>
            <div className="grid gap-3">
              {qualificationRules.map((rule) => (
                <div key={rule} className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-relaxed text-gray-300">
                  {rule}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto mt-16 px-4 md:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-cyan-300">Outreach copy</p>
          <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
            Copy, personalize, send.
          </h2>
        </div>
        <div className="grid gap-5 lg:grid-cols-3">
          {outreachMessages.map((message) => (
            <div key={message.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-5 flex items-center gap-3">
                <Mail className="h-5 w-5 text-cyan-300" />
                <div>
                  <h3 className="text-lg font-bold text-white">{message.title}</h3>
                  <p className="text-xs uppercase tracking-wider text-gray-500">{message.channel}</p>
                </div>
              </div>
              <pre className="whitespace-pre-wrap rounded-xl border border-white/10 bg-black/35 p-4 text-sm leading-relaxed text-gray-300">
                <code>{message.copy}</code>
              </pre>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto mt-16 px-4 md:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-cyan-300">Target profiles</p>
          <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
            Start with people who already make spreadsheet-heavy decisions.
          </h2>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          {targetProfiles.map((profile) => (
            <div key={profile.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3">
                  <profile.icon className="h-5 w-5 text-cyan-300" />
                </div>
                <h3 className="text-xl font-bold text-white">{profile.title}</h3>
              </div>
              <div className="grid gap-4">
                <InfoBlock label="Best for" copy={profile.bestFor} />
                <InfoBlock label="Why it hurts" copy={profile.whyItHurts} />
                <InfoBlock label="First ask" copy={profile.firstAsk} />
                <div>
                  <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Good signals</p>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {profile.goodSignals.map((signal) => (
                      <span key={signal} className="rounded-lg border border-white/10 bg-black/25 px-3 py-2 text-xs text-gray-300">
                        {signal}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto mt-16 px-4 md:px-8">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6 md:p-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">
            <div>
              <div className="mb-3 flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-emerald-300">
                <MessageSquare className="h-4 w-4" />
                Practical next move
              </div>
              <h2 className="text-2xl font-bold text-white">Send 10 targeted messages, not 100 vague ones.</h2>
              <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">
                Pick one profile, personalize the first line, and ask for one decision they are already considering. The goal is a scoped pilot, not a broad product pitch.
              </p>
            </div>
            <AnimatedButton href="/founder-pilot/demo-script" variant="secondary">
              Prep Demo Script
            </AnimatedButton>
          </div>
        </div>
      </section>
    </div>
  );
}

function InfoBlock({ label, copy }: { label: string; copy: string }) {
  return (
    <div>
      <p className="mb-1 text-xs font-semibold uppercase tracking-wider text-gray-500">{label}</p>
      <p className="text-sm leading-relaxed text-gray-300">{copy}</p>
    </div>
  );
}
