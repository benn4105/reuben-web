import { BarChart3, ClipboardCheck, FileText, Lightbulb, ListChecks, ShieldAlert } from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";

const reportSections = [
  {
    title: "Executive summary",
    icon: FileText,
    items: [
      "The decision being modeled.",
      "The baseline state.",
      "The scenarios compared.",
      "The recommendation in one paragraph.",
    ],
  },
  {
    title: "Assumptions used",
    icon: ClipboardCheck,
    items: [
      "Source of baseline numbers.",
      "Any estimated or uncertain inputs.",
      "Forecast period and why it was chosen.",
      "Business constraints the simulator should respect.",
    ],
  },
  {
    title: "Scenario comparison",
    icon: BarChart3,
    items: [
      "Margin impact.",
      "Risk score.",
      "Workforce or capacity load.",
      "Productivity, throughput, or cash impact.",
    ],
  },
  {
    title: "Recommendation",
    icon: Lightbulb,
    items: [
      "Best path forward.",
      "Why the model recommends it.",
      "What tradeoff the customer should understand.",
      "What would change the recommendation.",
    ],
  },
  {
    title: "Risks and caveats",
    icon: ShieldAlert,
    items: [
      "Weak assumptions.",
      "Missing data.",
      "Operational risks not captured yet.",
      "Where human judgment still matters.",
    ],
  },
  {
    title: "Next step",
    icon: ListChecks,
    items: [
      "Expand the simulator.",
      "Add real data imports.",
      "Build an internal workflow.",
      "Pause if the pilot did not prove value.",
    ],
  },
];

const closeoutMessage = `Founder Pilot Delivery Summary

Decision modeled:

Recommended path:

Why:

Biggest tradeoff:

Inputs that need better data:

Suggested next step:
`;

export default function FounderPilotDeliveryTemplatePage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-20 pt-28">
      <section className="container mx-auto px-4 md:px-8">
        <div className="max-w-4xl">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-200">
            Delivery Template
          </div>
          <h1 className="text-4xl font-black tracking-tight text-white md:text-6xl">
            Founder Pilot closeout format.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-400">
            Use this as the structure for the customer handoff after a pilot. It keeps the deliverable focused on the decision, the assumptions, the recommendation, and whether the pilot deserves a bigger build.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row">
            <AnimatedButton href="/founder-pilot/intake" variant="primary">
              View Intake Checklist
            </AnimatedButton>
            <AnimatedButton href="/founder-pilot/demo-script" variant="secondary">
              View Demo Script
            </AnimatedButton>
          </div>
        </div>
      </section>

      <section className="container mx-auto mt-16 px-4 md:px-8">
        <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {reportSections.map((section) => (
            <div key={section.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <div className="mb-5 flex items-center gap-3">
                <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3">
                  <section.icon className="h-5 w-5 text-cyan-300" />
                </div>
                <h2 className="text-xl font-bold text-white">{section.title}</h2>
              </div>
              <div className="grid gap-3">
                {section.items.map((item) => (
                  <div key={item} className="rounded-xl border border-white/10 bg-black/20 p-4 text-sm leading-relaxed text-gray-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto mt-16 px-4 md:px-8">
        <div className="rounded-2xl border border-emerald-500/20 bg-emerald-500/[0.04] p-6 md:p-8">
          <h2 className="text-2xl font-bold text-white">Closeout message skeleton</h2>
          <p className="mt-3 max-w-2xl text-sm leading-relaxed text-gray-400">
            This can become an email, PDF intro, or meeting agenda.
          </p>
          <pre className="mt-6 overflow-x-auto rounded-xl border border-white/10 bg-black/40 p-5 text-sm leading-relaxed text-gray-300">
            <code>{closeoutMessage}</code>
          </pre>
        </div>
      </section>
    </div>
  );
}
