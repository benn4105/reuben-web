"use client";

import { motion } from "framer-motion";
import {
  Code2,
  Database,
  Gauge,
  LineChart,
  PackageCheck,
  Rocket,
  ShieldCheck,
  Terminal,
  Truck,
  Workflow,
  Activity,
  Search,
  Send,
  User,
} from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { cn } from "@/lib/utils";

const codeSnippet = `module operations

simulate operations_throughput {
  dimension product = business_simulation
  dimension domain = operations
  dimension audience = enterprise

  employees = 50 count
  weekly_demand = 1200 orders
  productivity_gain = 0.08 percent
  overtime_reduction = 0.10 percent

  formula throughput = weekly_demand / employees
  formula operating_cost = employees * 950
  formula margin_delta = throughput * 18

  objective maximize margin_delta
  objective minimize operating_cost

  scenario process_improvement {
    productivity_gain = 0.12 percent
    overtime_reduction = 0.18 percent
  }

  forecast 12 weeks
}
`;

const roadmapMilestones = [
  {
    phase: "Now",
    title: "Public Prototype Complete",
    status: "100% prototype",
    description:
      "Reux has a working compiler, CLI, migrations, TypeScript generation, VS Code support, simulations, and hosted commerce/logistics demos.",
    items: ["Commerce and logistics pilots", "PostgreSQL-backed transactions", "Simulation examples", "Release preflight checks"],
  },
  {
    phase: "Beta",
    title: "Business Simulator MVP",
    status: "Completed",
    description:
      "A serious operator-facing app where users compare cost, productivity, risk, and margin scenarios while Reux powers the backend logic.",
    items: ["Scenario builder", "Forecast charts", "Recommendation panel", "Reux transparency view"],
  },
  {
    phase: "Beta",
    title: "Public Developer Access",
    status: "Planned",
    description:
      "Turn the local package and editor tooling into a cleaner beta path for technical users who want to try Reux in their own projects.",
    items: ["Package-name decision", "npm beta publish", "VS Code installer", "Getting-started docs"],
  },
  {
    phase: "Scale",
    title: "Simulation Ecosystem",
    status: "Planned",
    description:
      "Expand beyond commerce into PLOS (Personal Life Operating System) and enterprise simulation packs so Reux is validated by real decision workflows.",
    items: ["PLOS models", "Operations packs", "Workforce packs", "Explainable decision reports"],
  },
];

const liveCapabilities = [
  "Schema declarations and typed queries",
  "Transaction functions and durable events",
  "Conservative migrations with rollback notes",
  "Generated TypeScript integration",
  "Simulation declarations and scenario comparisons",
  "Hosted public demos for commerce and logistics",
  "VS Code syntax, diagnostics, formatting, and completions",
  "Release checks for packaging and roadmap sync",
];

export default function ReuxPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8A2BE2] rounded-full blur-[150px] mix-blend-screen opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#00F0FF] rounded-full blur-[150px] mix-blend-screen opacity-10 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center mb-24"
        >
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-8">
            <span className="text-sm font-medium tracking-wide text-[#00F0FF] uppercase">
              Prototype complete - public beta next
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Reux Programming Language
          </h1>
          <p className="text-2xl md:text-3xl text-gray-400 font-light mb-10">
            A data-aware backend language for transactions, simulations, and decision logic.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <AnimatedButton href="/simulator" variant="primary">
              Try the Business Simulator
            </AnimatedButton>
            <AnimatedButton href="/docs" variant="secondary">
              Developer Preview
            </AnimatedButton>
            <AnimatedButton href="https://github.com/benn4105/Reux" variant="secondary" external>
              GitHub
            </AnimatedButton>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
          {/* What is Reux */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-6">Built for Data-Aware Products</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              Reux is being built for the parts of applications where normal web stacks get messy: data models, state changes, workflows, forecasts, and decision rules.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              The strategy is practical: build the UI with TypeScript and React, then let Reux own the backend logic that needs to be reliable, auditable, and explainable. The <strong className="text-white">Business Simulator</strong> is the current public proof point — a live demo where Reux runs the scenario modeling behind the scenes.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              In the future, we plan to validate the language against rigorous environments like PLOS (Personal Life Operating System) and enterprise simulation workflows.
            </p>
          </motion.div>

          {/* Code Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-xl overflow-hidden glass border border-white/10 shadow-2xl relative group"
          >
            <div className="flex items-center px-4 py-3 border-b border-white/5 bg-black/50">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="ml-4 text-xs text-gray-500 font-mono">operations.reux</div>
            </div>
            <div className="p-6 bg-[#0A0A0A]/80 overflow-x-auto relative">
              {/* Optional glowing effect behind code */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/5 to-[#8A2BE2]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <pre className="font-mono text-sm leading-relaxed text-gray-300 relative z-10">
                <code dangerouslySetInnerHTML={{
                  __html: codeSnippet
                    .replace(/module|simulate|dimension|formula|objective|scenario|forecast/g, '<span class="text-pink-400">$&</span>')
                    .replace(/maximize|minimize/g, '<span class="text-blue-400">$&</span>')
                    .replace(/operations_throughput|process_improvement/g, '<span class="text-green-400">$&</span>')
                    .replace(/\b(count|orders|percent|weeks)\b/g, '<span class="text-yellow-300">$&</span>')
                }} />
              </pre>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-12 text-center">What Reux Can Model Today</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <Database className="w-8 h-8 text-[#00F0FF] mb-4" />,
                title: "Entities & Data Models",
                description: "Define strongly-typed schemas with constraints, relations, and unique indexes.",
              },
              {
                icon: <Search className="w-8 h-8 text-[#8A2BE2] mb-4" />,
                title: "Queries",
                description: "Declare typed, composable queries that compile securely down to raw PostgreSQL.",
              },
              {
                icon: <Workflow className="w-8 h-8 text-[#00F0FF] mb-4" />,
                title: "Lifecycle Transitions",
                description: "Enforce strict state machine rules, guaranteeing records only move through approved paths.",
              },
              {
                icon: <ShieldCheck className="w-8 h-8 text-[#8A2BE2] mb-4" />,
                title: "Transactions",
                description: "Write transactional functions with row locking, atomic mutations, and rollback guarantees.",
              },
              {
                icon: <Send className="w-8 h-8 text-[#00F0FF] mb-4" />,
                title: "Outbox & Events",
                description: "Emit durable, transactional events to safely decouple services and trigger side-effects.",
              },
              {
                icon: <LineChart className="w-8 h-8 text-[#8A2BE2] mb-4" />,
                title: "Simulations",
                description: "Model operational assumptions, run branching scenarios, and compare forecasted outcomes.",
              },
            ].map((feature, i) => (
              <div key={i} className="glass-card p-6 rounded-xl border border-white/5 hover:border-white/15 transition-all duration-300">
                {feature.icon}
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Use Cases Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24"
        >
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Domain Use Cases</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Reux is designed to capture the unique rules and workflows of specific industries.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[
              {
                icon: <LineChart className="w-8 h-8 text-[#00F0FF] mb-4" />,
                title: "Business Operations",
                description: "Models hiring plans, productivity gains, and cost-cutting scenarios to determine their impact on future operating margins.",
              },
              {
                icon: <PackageCheck className="w-8 h-8 text-[#8A2BE2] mb-4" />,
                title: "Commerce Workflows",
                description: "Models checkout state, atomic inventory reservations, payment failures, and cart fulfillment workflows.",
              },
              {
                icon: <Truck className="w-8 h-8 text-[#00F0FF] mb-4" />,
                title: "Logistics & Dispatch",
                description: "Models vehicle routing decisions, state transitions from 'assigned' to 'delivered', and dynamic driver compensation rules.",
              },
              {
                icon: <Activity className="w-8 h-8 text-[#8A2BE2] mb-4" />,
                title: "Clinic Operations",
                description: "Models patient check-in bottlenecks, room capacity constraints, and throughput scenarios for hospital wings.",
              },
              {
                icon: <User className="w-8 h-8 text-[#00F0FF] mb-4" />,
                title: "Personal Life (PLOS)",
                description: "Models habit compounding, budget forecasting, and major career decision scenarios over decades.",
              },
            ].map((useCase) => (
              <div key={useCase.title} className="glass-card p-6 rounded-xl border border-white/5 hover:border-white/15 transition-all duration-300">
                {useCase.icon}
                <h3 className="text-xl font-bold text-white mb-2">{useCase.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{useCase.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Roadmap */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24"
        >
          <div className="mb-12 flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div className="max-w-3xl">
              <h2 className="text-3xl font-bold mb-4">Roadmap</h2>
              <p className="text-gray-400 text-lg leading-relaxed">
                Reux has crossed the prototype-complete line. The next chapter is public beta polish, the Business Simulator, and broader validation through Reuben ecosystem products.
              </p>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:min-w-[360px]">
              {[
                { label: "Demo status", value: "Live" },
                { label: "Prototype completion", value: "100%" },
              ].map((metric) => (
                <div key={metric.label} className="glass-card rounded-xl p-5">
                  <div className="text-3xl font-black text-white">{metric.value}</div>
                  <div className="mt-1 text-xs uppercase tracking-wide text-gray-500">{metric.label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 lg:grid-cols-4">
            {roadmapMilestones.map((milestone) => (
              <div key={milestone.title} className="glass-card rounded-xl p-6">
                <div className="mb-5 flex items-center justify-between gap-3">
                  <span className="text-xs font-semibold uppercase tracking-wide text-[#00F0FF]">
                    {milestone.phase}
                  </span>
                  <span className={cn(
                    "rounded-full px-3 py-1 text-xs font-medium",
                    milestone.status === "Completed" || milestone.status === "100% prototype"
                      ? "border border-emerald-500/30 text-emerald-400 bg-emerald-500/10"
                      : "border border-white/10 text-gray-400"
                  )}>
                    {milestone.status}
                  </span>
                </div>
                <h3 className="mb-3 text-xl font-bold text-white">{milestone.title}</h3>
                <p className="mb-5 text-sm leading-relaxed text-gray-400">{milestone.description}</p>
                <ul className="space-y-2">
                  {milestone.items.map((item) => (
                    <li key={item} className="flex gap-2 text-sm text-gray-300">
                      <ShieldCheck className="mt-0.5 h-4 w-4 shrink-0 text-[#00F0FF]" />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div className="mt-8 text-center">
            <AnimatedButton href="/projects/reux/roadmap" variant="secondary">
              View Full Roadmap
            </AnimatedButton>
          </div>
        </motion.div>

        {/* Current Capabilities */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24 grid grid-cols-1 gap-8 lg:grid-cols-[0.8fr_1.2fr]"
        >
          <div>
            <div className="mb-4 inline-flex items-center gap-2 glass px-4 py-2 rounded-full">
              <Rocket className="h-4 w-4 text-[#00F0FF]" />
              <span className="text-sm font-medium tracking-wide text-gray-300 uppercase">
                Live today
              </span>
            </div>
            <h2 className="mb-4 text-3xl font-bold">What is Real Today</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-4">
              Reux is an active prototype. It is not yet production-ready for external teams to build their entire company on. 
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              However, the core language is already strong enough to power our Business Simulator, generate reliable backend artifacts, and validate the product thesis internally. Here is what is functioning right now:
            </p>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {liveCapabilities.map((capability, index) => {
              const icons = [Code2, Database, ShieldCheck, Terminal, LineChart, Gauge, Truck, PackageCheck];
              const Icon = icons[index] ?? ShieldCheck;
              return (
                <div key={capability} className="glass-card flex items-start gap-3 rounded-xl p-4">
                  <Icon className="mt-0.5 h-5 w-5 shrink-0 text-[#00F0FF]" />
                  <span className="text-sm leading-relaxed text-gray-300">{capability}</span>
                </div>
              );
            })}
          </div>
        </motion.div>

        {/* Active Pilots */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-24"
        >
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Live Pilots</h2>
            <p className="text-gray-400 text-lg leading-relaxed">
              Reux is already powering interactive products. The Business Simulator uses Reux to evaluate scenarios and recommend operational decisions.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              {
                icon: <LineChart className="w-8 h-8 text-[#00F0FF]" />,
                title: "Business Simulator",
                status: "Flagship MVP",
                description: "Models complex operational decisions. For example, Reux evaluates how hiring 15 employees affects productivity and costs over a 12-week forecast.",
                href: "/simulator",
                action: "Try the Business Simulator",
              },
              {
                icon: <PackageCheck className="w-8 h-8 text-[#8A2BE2]" />,
                title: "Commerce Console",
                status: "Public Demo",
                description: "Models checkout transactions and event emission. For example, Reux ensures a cart checkout atomically updates inventory and emits an 'order_placed' event.",
                href: "/projects/reux/demo?domain=commerce",
                action: "Open Demo",
              },
              {
                icon: <Truck className="w-8 h-8 text-[#00F0FF]" />,
                title: "Logistics Dispatch",
                status: "Public Demo",
                description: "Models state transitions in a fleet network. For example, Reux enforces rules so a shipment can only transition from 'assigned' to 'in_transit'.",
                href: "/projects/reux/demo?domain=logistics",
                action: "Open Demo",
              },
              {
                icon: <Activity className="w-8 h-8 text-rose-400" />,
                title: "Clinic Operations",
                status: "Public Demo",
                description: "Models patient check-in workflows and clinic capacity. For example, Reux handles the transactional transition of a patient from 'waiting' to 'in_room'.",
                href: "/projects/reux/demo?domain=clinic",
                action: "Open Demo",
              },
            ].map((pilot) => (
              <div key={pilot.title} className="glass-card p-8 rounded-xl border border-white/10">
                <div className="flex items-start justify-between gap-4 mb-6">
                  <div className="p-3 rounded-xl bg-white/5 border border-white/10">
                    {pilot.icon}
                  </div>
                  <span className={cn(
                    "text-xs font-semibold uppercase tracking-wide border rounded-full px-3 py-1",
                    pilot.status === "Flagship MVP" 
                      ? "text-[#00F0FF] border-[#00F0FF]/30" 
                      : "text-[#8A2BE2] border-[#8A2BE2]/30"
                  )}>
                    {pilot.status}
                  </span>
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{pilot.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-6">{pilot.description}</p>
                <AnimatedButton href={pilot.href} variant="secondary">
                  {pilot.action}
                </AnimatedButton>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Final CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mt-32 text-center pb-12"
        >
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-6">
            <Terminal size={14} className="text-[#00F0FF]" />
            <span className="text-sm font-medium tracking-wide text-[#00F0FF] uppercase">
              Start Exploring
            </span>
          </div>
          <h2 className="text-3xl font-bold mb-4">Ready to see the code?</h2>
          <p className="text-gray-400 text-lg leading-relaxed max-w-2xl mx-auto mb-8">
            Check out the Developer Preview to see current capabilities, generated TypeScript integration, and syntax examples.
          </p>
          <AnimatedButton href="/docs" variant="primary">
            View Developer Preview
          </AnimatedButton>
        </motion.div>
      </div>
    </div>
  );
}
