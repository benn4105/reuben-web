import { CheckCircle2, ClipboardList, FileSpreadsheet, LineChart, Send, Target } from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";

const sections = [
  {
    title: "1. Decision",
    icon: Target,
    prompts: [
      "What decision are you considering right now?",
      "What happens if you make the wrong call?",
      "Who owns the decision internally?",
      "When do you need to decide?",
    ],
  },
  {
    title: "2. Baseline",
    icon: FileSpreadsheet,
    prompts: [
      "What numbers define the current state?",
      "What spreadsheet, report, or system is the current source of truth?",
      "Which costs, staffing levels, demand numbers, margins, or cycle times matter?",
      "Which assumptions are uncertain or debated?",
    ],
  },
  {
    title: "3. Scenarios",
    icon: LineChart,
    prompts: [
      "What two to four options do you want to compare?",
      "What changes in each scenario?",
      "Which scenario feels safest today?",
      "Which scenario feels risky but potentially valuable?",
    ],
  },
  {
    title: "4. Success metric",
    icon: CheckCircle2,
    prompts: [
      "What metric should the simulator optimize for?",
      "What metric should it protect against?",
      "What would make the pilot obviously useful?",
      "What would make the pilot not worth expanding?",
    ],
  },
];

const copyableEmail = `Subject: Founder Pilot Intake

Decision:

Baseline numbers or spreadsheet:

Scenarios to compare:
1.
2.
3.

Most important success metric:

Timeline / decision deadline:
`;

export default function FounderPilotIntakePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-20 pt-28">
      <section className="container mx-auto px-4 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1fr_0.8fr] lg:items-start">
          <div>
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-200">
              Intake Checklist
            </div>
            <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">
              Send this before a Founder Pilot call.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">
              The best pilot starts with one real decision. This checklist helps a customer send enough context to scope a focused simulator without turning the first call into a discovery marathon.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <AnimatedButton href="/founder-pilot" variant="primary">
                Back to Offer
              </AnimatedButton>
              <AnimatedButton href="/founder-pilot/delivery-template" variant="secondary">
                View Delivery Template
              </AnimatedButton>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-5 flex items-center gap-3">
              <ClipboardList className="h-6 w-6 text-cyan-300" />
              <h2 className="text-xl font-bold text-white">Minimum viable intake</h2>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              If the customer can answer these four sections, you can usually scope the first simulator.
            </p>
            <div className="mt-6 grid gap-3">
              {["Decision", "Baseline", "Scenarios", "Success metric"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/25 p-4">
                  <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                  <span className="text-sm text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto mt-16 px-4 md:px-8">
        <div className="grid gap-5 md:grid-cols-2">
          {sections.map((section) => (
            <div key={section.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3">
                  <section.icon className="h-5 w-5 text-cyan-300" />
                </div>
                <h2 className="text-xl font-bold text-white">{section.title}</h2>
              </div>
              <div className="grid gap-3">
                {section.prompts.map((prompt) => (
                  <div key={prompt} className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-relaxed text-gray-300">
                    {prompt}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto mt-16 px-4 md:px-8">
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.04] p-6 md:p-8">
          <div className="mb-5 flex items-center gap-3">
            <Send className="h-6 w-6 text-cyan-300" />
            <h2 className="text-2xl font-bold text-white">Simple email template</h2>
          </div>
          <pre className="overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-5 text-sm leading-relaxed text-gray-300">
            <code>{copyableEmail}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}
