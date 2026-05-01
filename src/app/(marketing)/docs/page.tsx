"use client";

import { motion } from "framer-motion";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { Terminal, Download, Code2, ArrowRight, BookOpen, Eye } from "lucide-react";

const INSTALL_CMD = "npm install @reux/cli -g";

const EXAMPLES = [
  {
    title: "Define a Simulation",
    filename: "operations.reux",
    code: `simulate q3_operations {
  employees = 50
  avg_hourly_cost = 28
  weekly_demand = 1200
  productivity_gain = 0.12

  scenario aggressive_hiring {
    employees = 65
    productivity_gain = 0.06
  }

  forecast 12 weeks
}`,
  },
  {
    title: "Compare Scenarios",
    filename: "compare.reux",
    code: `simulate expansion_vs_optimization {
  // Baseline assumptions
  employees = 50
  weekly_demand = 1200

  scenario expand {
    employees = 70
    weekly_demand = 1800
  }

  scenario optimize {
    productivity_gain = 0.15
    overtime_reduction = 0.20
  }

  objective maximize margin_delta
  objective minimize operating_cost
  forecast 12 weeks
}`,
  },
];

export default function DocsPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#00F0FF] rounded-full blur-[150px] mix-blend-screen opacity-10 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-8">
            <Terminal size={14} className="text-[#00F0FF]" />
            <span className="text-sm font-medium tracking-wide text-[#00F0FF] uppercase">
              Developer Documentation
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            Getting Started with Reux
          </h1>
          <p className="text-xl text-gray-400 font-light mb-12 leading-relaxed max-w-3xl">
            Reux is a prototype backend language for data-aware workflows, simulations, and decision logic.
            The fastest way to see it in action is the live Business Simulator demo.
          </p>

          {/* Quickstart Overview */}
          <section className="mb-16">
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
              {[
                {
                  icon: <Eye size={20} className="text-emerald-400" />,
                  label: "Try the demo",
                  detail: "No install needed",
                  href: "/simulator",
                },
                {
                  icon: <BookOpen size={20} className="text-violet-400" />,
                  label: "Read the syntax",
                  detail: "Simulation examples below",
                  href: "#examples",
                },
                {
                  icon: <ArrowRight size={20} className="text-orange-400" />,
                  label: "See the roadmap",
                  detail: "What\u2019s live and what\u2019s next",
                  href: "/projects/reux/roadmap",
                },
              ].map((item) => (
                <a
                  key={item.label}
                  href={item.href}
                  className="glass-card flex items-start gap-3 rounded-xl p-4 border border-white/5 hover:border-white/15 transition-colors group"
                >
                  <div className="mt-0.5 shrink-0">{item.icon}</div>
                  <div>
                    <div className="text-sm font-semibold text-white group-hover:text-[#00F0FF] transition-colors">
                      {item.label}
                    </div>
                    <div className="text-xs text-gray-500">{item.detail}</div>
                  </div>
                </a>
              ))}
            </div>
          </section>

          {/* Try the Web Demo */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Eye className="text-emerald-400" size={24} />
              </div>
              <h2 className="text-2xl font-bold">1. Try the Live Demo</h2>
            </div>
            
            <p className="text-gray-400 mb-4 leading-relaxed">
              The <strong className="text-white">Business Simulator</strong> is a graphical scenario builder that runs Reux code in the background.
              You can model workforce, cost, and productivity scenarios, compare forecasted outcomes, and inspect the generated Reux code in the transparency panel.
            </p>
            <p className="text-gray-400 mb-6 leading-relaxed">
              No installation required. Works in any modern browser.
            </p>
            <AnimatedButton href="/simulator" variant="primary">
              Open the Simulator
            </AnimatedButton>
          </section>

          {/* Installation */}
          <section className="mb-16">
            <div className="flex flex-wrap items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-violet-500/10">
                <Download className="text-violet-400" size={24} />
              </div>
              <h2 className="text-2xl font-bold">2. Local Installation</h2>
              <span className="text-xs font-medium uppercase tracking-wide text-gray-500 border border-white/10 rounded-full px-2.5 py-0.5">Coming Soon</span>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              Public package distribution is planned but not finalized. Once the beta CLI is published, you&apos;ll be able to install Reux via npm and run simulations locally.
            </p>

            <div className="relative group mb-6">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 rounded-xl blur-sm transition-opacity opacity-0 group-hover:opacity-100" />
              <div className="relative glass border border-white/10 rounded-xl p-4 flex items-center justify-between opacity-50 cursor-not-allowed">
                <code className="text-cyan-400 font-mono text-sm sm:text-base">
                  {INSTALL_CMD}
                </code>
                <span className="text-xs text-gray-500 uppercase tracking-wide shrink-0 ml-4">Planned</span>
              </div>
            </div>

            <div className="text-sm text-gray-500 bg-white/5 border border-white/10 p-4 rounded-lg space-y-2">
              <p>
                <strong className="text-white">VS Code Support:</strong>{" "}
                An internal extension (VSIX) provides syntax highlighting, diagnostics, and formatting. 
                It will be published to the VS Code Marketplace alongside the npm package.
              </p>
              <p>
                <strong className="text-white">TypeScript Generation:</strong>{" "}
                Reux generates typed TypeScript artifacts from your schema and simulation definitions, 
                so your frontend code stays in sync with your backend models.
              </p>
            </div>
          </section>

          {/* Writing Code */}
          <section className="mb-16" id="examples">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <Code2 className="text-cyan-400" size={24} />
              </div>
              <h2 className="text-2xl font-bold">3. Reux Syntax Examples</h2>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              Reux uses declarative syntax to define simulation parameters, scenarios, objectives, and forecast periods.
              The Business Simulator builds these definitions automatically from your inputs — here&apos;s what the generated code looks like.
            </p>

            <div className="space-y-8">
              {EXAMPLES.map((example, i) => (
                <div key={i} className="rounded-xl overflow-hidden glass border border-white/10">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/50">
                    <span className="text-xs text-gray-500 font-mono">{example.filename}</span>
                    <span className="text-xs text-gray-600">{example.title}</span>
                  </div>
                  <div className="p-6 bg-[#0A0A0A]/80 overflow-x-auto">
                    <pre className="font-mono text-sm leading-relaxed text-gray-300">
                      <code dangerouslySetInnerHTML={{
                        __html: example.code
                          .replace(/\b(simulate|scenario|forecast|objective|let|mut)\b/g, '<span class="text-pink-400">$&</span>')
                          .replace(/\b(maximize|minimize)\b/g, '<span class="text-blue-400">$&</span>')
                          .replace(/\b(weeks)\b/g, '<span class="text-yellow-300">$&</span>')
                          .replace(/\/\/.*/g, '<span class="text-gray-600">$&</span>')
                      }} />
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Current Limitations */}
          <section className="p-8 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-left mb-16">
            <h2 className="text-xl font-bold mb-4 text-amber-400">Current Limitations</h2>
            <ul className="space-y-3 text-sm text-amber-500/80 list-disc pl-5">
              <li>Reux is a <strong className="text-amber-400">prototype</strong>. It powers internal products like the Business Simulator, but is not yet production-ready for external teams.</li>
              <li>There is no public package registry or module import system for sharing Reux libraries externally yet.</li>
              <li>Direct developer access is limited to web demos and code inspection. Local CLI access is coming in the next beta phase.</li>
            </ul>
          </section>

          {/* What's Next */}
          <section className="text-center">
            <h2 className="text-2xl font-bold mb-4 text-white">What&apos;s Next</h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Check the roadmap for upcoming milestones, or jump into the simulator to see Reux running live.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <AnimatedButton href="/simulator" variant="primary">
                Open the Simulator
              </AnimatedButton>
              <AnimatedButton href="/projects/reux/roadmap" variant="secondary">
                View Roadmap
              </AnimatedButton>
              <AnimatedButton href="https://github.com/benn4105/Reux" variant="secondary" external>
                GitHub
              </AnimatedButton>
            </div>
          </section>

        </motion.div>
      </div>
    </div>
  );
}
