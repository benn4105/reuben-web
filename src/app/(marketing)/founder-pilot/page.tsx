import {
  BarChart3,
  CheckCircle2,
  Clock3,
  FileSpreadsheet,
  FileText,
  LineChart,
  ListChecks,
  MessageSquare,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";
import PilotRequestPanel from "@/components/simulator/PilotRequestPanel";

const deliverables = [
  {
    title: "A focused simulator flow",
    copy: "Your baseline and scenarios become a working decision simulator instead of a static spreadsheet.",
    icon: BarChart3,
  },
  {
    title: "Scenario comparison",
    copy: "Reux evaluates margin, cost, risk, workforce load, productivity, and the best path forward.",
    icon: LineChart,
  },
  {
    title: "Transparent assumptions",
    copy: "You can inspect the assumptions and Reux model logic behind the recommendation.",
    icon: ShieldCheck,
  },
  {
    title: "A repeatable pilot handoff",
    copy: "You leave with a concrete workflow that can become a larger internal simulator or customer-facing tool.",
    icon: ListChecks,
  },
];

const intakeItems = [
  "One spreadsheet, model, or operating decision you already care about.",
  "A current baseline: staffing, demand, cost, margin, cycle time, defect rate, or similar.",
  "Two to four scenarios you are considering before spending money.",
  "One success metric that matters most: margin, risk, throughput, staffing, or cash impact.",
];

const timeline = [
  {
    step: "1",
    title: "Pilot scope",
    copy: "We pick one decision, define the baseline, and decide which scenarios matter.",
  },
  {
    step: "2",
    title: "Model build",
    copy: "The decision is translated into assumptions, forecast rules, and Reux-backed scenario logic.",
  },
  {
    step: "3",
    title: "Review session",
    copy: "You review the simulator, compare outcomes, and decide whether the model is worth expanding.",
  },
];

const workflowResources = [
  {
    title: "Outreach package",
    copy: "Copy-ready messages and target customer profiles for finding the first founder pilot customers.",
    href: "/founder-pilot/outreach",
    icon: MessageSquare,
    action: "Open outreach",
  },
  {
    title: "Demo script",
    copy: "A five-minute walkthrough for showing the simulator, the Reux transparency layer, and the founder pilot offer.",
    href: "/founder-pilot/demo-script",
    icon: MessageSquare,
    action: "Open script",
  },
  {
    title: "Intake checklist",
    copy: "The questions to send before a pilot call so the first conversation starts with a real decision and real numbers.",
    href: "/founder-pilot/intake",
    icon: FileSpreadsheet,
    action: "Open checklist",
  },
  {
    title: "Delivery template",
    copy: "A repeatable closeout format for assumptions, scenario comparison, recommendation, risks, and next step.",
    href: "/founder-pilot/delivery-template",
    icon: FileText,
    action: "Open template",
  },
];

export default function FounderPilotPage() {
  return (
    <div className="min-h-screen bg-[#0A0A0A] pb-20 pt-28">
      <section className="container mx-auto px-4 md:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div className="max-w-4xl">
            <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-cyan-500/25 bg-cyan-500/10 px-4 py-2 text-xs font-semibold uppercase tracking-wider text-cyan-200">
              <Sparkles className="h-4 w-4" />
              Founder Pilot
            </div>
            <h1 className="max-w-4xl text-4xl font-black tracking-tight text-white md:text-6xl">
              Turn one spreadsheet decision into a working simulator.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-gray-400 md:text-xl">
              The Reuben Founder Pilot is for operators, founders, and teams who want to test a real business decision before committing budget, staff, pricing, or process changes.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <AnimatedButton href="#pilot-intake" variant="primary">
                Request Founder Pilot
              </AnimatedButton>
              <AnimatedButton href="/simulator/new?preset=optimization" variant="secondary">
                Try Sample Simulator
              </AnimatedButton>
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
            <div className="mb-5 flex items-center gap-3">
              <div className="rounded-xl border border-cyan-500/20 bg-cyan-500/10 p-3">
                <FileSpreadsheet className="h-6 w-6 text-cyan-300" />
              </div>
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-gray-500">Best first pilot</p>
                <h2 className="text-xl font-bold text-white">One decision, not a giant platform build</h2>
              </div>
            </div>
            <p className="text-sm leading-relaxed text-gray-400">
              Bring the messy decision you would normally model in a spreadsheet. We turn it into a structured scenario simulator so the assumptions, tradeoffs, and recommendation are easier to trust.
            </p>
            <div className="mt-6 grid gap-3">
              {["Staffing plan", "Pricing change", "Capacity expansion", "Process improvement", "Demand spike", "Cost reduction"].map((item) => (
                <div key={item} className="flex items-center gap-3 rounded-xl border border-white/10 bg-black/25 px-4 py-3">
                  <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-300" />
                  <span className="text-sm text-gray-300">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto mt-20 px-4 md:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-cyan-300">What you get</p>
          <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
            A small but real deliverable.
          </h2>
          <p className="mt-4 text-gray-400">
            This is intentionally scoped. The goal is to prove whether Reux-backed simulation helps one real decision before expanding into a larger product.
          </p>
        </div>

        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {deliverables.map((item) => (
            <div key={item.title} className="rounded-2xl border border-white/10 bg-white/[0.03] p-6">
              <item.icon className="mb-5 h-7 w-7 text-[#00F0FF]" />
              <h3 className="mb-3 text-lg font-bold text-white">{item.title}</h3>
              <p className="text-sm leading-relaxed text-gray-500">{item.copy}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="container mx-auto mt-20 px-4 md:px-8">
        <div className="grid gap-8 lg:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <FileSpreadsheet className="h-6 w-6 text-cyan-300" />
              <h2 className="text-2xl font-bold text-white">What to bring</h2>
            </div>
            <div className="grid gap-4">
              {intakeItems.map((item) => (
                <div key={item} className="flex gap-3">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-300" />
                  <p className="text-sm leading-relaxed text-gray-400">{item}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-6 md:p-8">
            <div className="mb-6 flex items-center gap-3">
              <Clock3 className="h-6 w-6 text-cyan-300" />
              <h2 className="text-2xl font-bold text-white">How it works</h2>
            </div>
            <div className="grid gap-4">
              {timeline.map((item) => (
                <div key={item.step} className="grid grid-cols-[auto_1fr] gap-4 rounded-xl border border-white/10 bg-black/20 p-4">
                  <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-sm font-bold text-cyan-200">
                    {item.step}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    <p className="mt-1 text-sm leading-relaxed text-gray-500">{item.copy}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto mt-20 px-4 md:px-8">
        <div className="rounded-2xl border border-cyan-500/20 bg-cyan-500/[0.04] p-6 md:p-8">
          <div className="grid gap-8 lg:grid-cols-[0.85fr_1.15fr] lg:items-center">
            <div>
              <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-cyan-200">Positioning</p>
              <h2 className="text-3xl font-black tracking-tight text-white">
                Not a consulting maze. A proof of value.
              </h2>
              <p className="mt-4 text-sm leading-relaxed text-gray-400 md:text-base">
                The pilot should answer a simple question: does structured simulation improve the way this team makes one important decision? If yes, the next step is a larger simulator, workflow, or internal decision tool.
              </p>
            </div>
            <div className="grid gap-3 sm:grid-cols-3">
              {[
                { label: "Scope", value: "1 decision" },
                { label: "Input", value: "1 model" },
                { label: "Output", value: "1 simulator" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-white/10 bg-black/25 p-5">
                  <div className="text-2xl font-black text-white">{item.value}</div>
                  <div className="mt-1 text-xs uppercase tracking-wider text-gray-500">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="container mx-auto mt-20 px-4 md:px-8">
        <div className="mb-8 max-w-3xl">
          <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-cyan-300">Pilot workflow</p>
          <h2 className="text-3xl font-black tracking-tight text-white md:text-4xl">
            Use these links to run the first customer conversation.
          </h2>
          <p className="mt-4 text-gray-400">
            The offer page is public, but these resources are written to help you pitch, intake, and deliver the first pilot consistently.
          </p>
        </div>
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {workflowResources.map((resource) => (
            <a
              key={resource.title}
              href={resource.href}
              className="group rounded-2xl border border-white/10 bg-white/[0.03] p-6 transition-colors hover:border-cyan-500/35 hover:bg-cyan-500/[0.04]"
            >
              <resource.icon className="mb-5 h-7 w-7 text-[#00F0FF]" />
              <h3 className="mb-3 text-lg font-bold text-white">{resource.title}</h3>
              <p className="mb-5 text-sm leading-relaxed text-gray-500">{resource.copy}</p>
              <span className="text-sm font-semibold text-cyan-200 transition-colors group-hover:text-white">
                {resource.action} -&gt;
              </span>
            </a>
          ))}
        </div>
      </section>

      <section id="pilot-intake" className="container mx-auto mt-20 px-4 md:px-8">
        <PilotRequestPanel className="scroll-mt-28" />
      </section>
    </div>
  );
}
