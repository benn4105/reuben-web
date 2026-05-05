import { BarChart3, Code2, FileText, MessageSquare, PlayCircle, Target } from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";

const scriptSections = [
  {
    label: "0:00 - 0:30",
    title: "Open with the problem",
    icon: Target,
    talkTrack:
      "Most expensive business decisions still start in spreadsheets. The issue is not that spreadsheets are bad; it is that the logic is hard to inspect, rerun, or turn into a repeatable workflow.",
    proof:
      "Use an example like hiring, pricing, overtime, capacity, or process change. Keep it grounded in money, risk, and timing.",
  },
  {
    label: "0:30 - 1:00",
    title: "Position Reuben and Reux",
    icon: Code2,
    talkTrack:
      "Reuben turns one real decision into a focused simulator. The UI is normal web technology, but the decision model is powered by Reux, our backend language for data-aware simulation and decision logic.",
    proof:
      "Make the boundary clear: Reux is not replacing the frontend. It owns the assumptions, scenarios, forecast rules, and recommendation logic.",
  },
  {
    label: "1:00 - 2:30",
    title: "Run the simulator",
    icon: PlayCircle,
    talkTrack:
      "Start from a sample operations model, show the baseline, select a scenario, and run the forecast. Explain that the point is not pretty charts alone; the point is comparing possible futures before spending real money.",
    proof:
      "Show margin, risk score, workforce load, productivity, and the recommendation panel.",
  },
  {
    label: "2:30 - 3:15",
    title: "Show the Reux transparency layer",
    icon: FileText,
    talkTrack:
      "The model is inspectable. Instead of hiding business logic across scattered code or spreadsheet cells, Reux gives us a structured representation of what the simulator evaluated.",
    proof:
      "Open the Reux source/transparency panel and point to assumptions, formulas, objectives, and forecast length.",
  },
  {
    label: "3:15 - 4:15",
    title: "Make the founder pilot offer",
    icon: MessageSquare,
    talkTrack:
      "For a first pilot, we do not need to model the entire company. Bring one spreadsheet decision, one baseline, and two to four scenarios. We turn that into a working simulator and review whether it improves the decision.",
    proof:
      "Explain the deliverable: a focused simulator, scenario comparison, recommendation, assumptions summary, and next-step proposal.",
  },
  {
    label: "4:15 - 5:00",
    title: "Close with next step",
    icon: BarChart3,
    talkTrack:
      "If this maps to a decision you are already considering, the next step is to send the spreadsheet or baseline numbers. We will scope one pilot around a decision that has real stakes.",
    proof:
      "Send the intake checklist link and ask for the decision, baseline numbers, scenarios, and success metric.",
  },
];

const demoChecklist = [
  "Homepage opens cleanly and the Business Simulator CTA is visible.",
  "Simulator loads a guided preset without needing an account.",
  "Run Simulation reaches a result page.",
  "Recommendation, comparison table, and Reux transparency panel are visible.",
  "Founder Pilot CTA is visible after a result.",
  "Intake form submit path has been tested on production.",
];

export default function FounderPilotDemoScriptPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-20 pt-28">
      <section className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-200">
            Demo Script
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
            Five-minute Founder Pilot walkthrough.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">
            Use this when showing the Business Simulator to a potential pilot customer. The goal is to make the offer obvious: one real decision becomes one working simulator.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AnimatedButton href="/simulator/new?preset=optimization" variant="primary">
              Open Demo Preset
            </AnimatedButton>
            <AnimatedButton href="/founder-pilot/intake" variant="secondary">
              Send Intake Checklist
            </AnimatedButton>
          </div>
        </div>
      </section>

      <section className="container mx-auto mt-16 px-4 md:px-8">
        <div className="grid gap-5">
          {scriptSections.map((section) => (
            <div key={section.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="grid gap-5 lg:grid-cols-[220px_1fr]">
                <div>
                  <div className="mb-4 flex items-center gap-3">
                    <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3">
                      <section.icon className="h-5 w-5 text-cyan-300" />
                    </div>
                    <span className="text-xs font-semibold uppercase tracking-wider text-cyan-200">{section.label}</span>
                  </div>
                  <h2 className="text-xl font-bold text-white">{section.title}</h2>
                </div>
                <div className="grid gap-4 md:grid-cols-2">
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Talk track</p>
                    <p className="text-sm leading-relaxed text-gray-300">{section.talkTrack}</p>
                  </div>
                  <div>
                    <p className="mb-2 text-xs font-semibold uppercase tracking-wider text-gray-500">Show or say</p>
                    <p className="text-sm leading-relaxed text-gray-400">{section.proof}</p>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto mt-16 px-4 md:px-8">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6 md:p-8">
          <h2 className="text-2xl font-bold text-white">Before the call</h2>
          <div className="mt-6 grid gap-3 md:grid-cols-2">
            {demoChecklist.map((item) => (
              <div key={item} className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-relaxed text-gray-300">
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
