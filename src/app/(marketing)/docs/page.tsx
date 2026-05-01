"use client";

import { motion } from "framer-motion";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { Terminal, Download, Code2 } from "lucide-react";

const INSTALL_CMD = "npm install @reux/cli -g";

const EXAMPLES = [
  {
    title: "Basic Simulation",
    code: `// Define a basic business scenario in Reux
simulate q3_operations {
  employees = 50
  avg_hourly_cost = 28
  weekly_demand = 1200
  productivity_gain = 0.12
  
  forecast 12 weeks
}`
  },
  {
    title: "Scenario Comparison",
    code: `// Compare two potential scenarios
let baseline = simulate current_ops { ... }
let aggressive = simulate aggressive_hiring { ... }

let recommendation = compare(baseline, aggressive)
println("Recommended path: {recommendation.best_margin}")`
  }
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
            Developer Access & Docs
          </h1>
          <p className="text-xl text-gray-400 font-light mb-12 leading-relaxed">
            Learn how to inspect Reux examples, try the web demo, and what to expect from our upcoming developer tooling.
          </p>

          {/* Try the Web Demo */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Code2 className="text-emerald-400" size={24} />
              </div>
              <h2 className="text-2xl font-bold">1. Try the Web Demo</h2>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              The easiest way to experience Reux today is through the <strong className="text-white">Business Simulator</strong>. You do not need to install anything. The simulator provides a graphical scenario builder that automatically compiles and runs Reux code in the background, allowing you to inspect the generated snippets in the &quot;Model Transparency Layer.&quot;
            </p>
            <AnimatedButton href="/simulator" variant="secondary">
              Launch Business Simulator
            </AnimatedButton>
          </section>

          {/* Installation */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-violet-500/10">
                <Download className="text-violet-400" size={24} />
              </div>
              <h2 className="text-2xl font-bold">2. Local Installation (Coming Soon)</h2>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              Public package distribution is planned, but not finalized. Once the beta is officially published, the Reux compiler and CLI will be available via npm.
            </p>

            <div className="relative group mb-4">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 rounded-xl blur-sm transition-opacity opacity-0 group-hover:opacity-100" />
              <div className="relative glass border border-white/10 rounded-xl p-4 flex items-center justify-between opacity-50 cursor-not-allowed">
                <code className="text-cyan-400 font-mono text-sm sm:text-base">
                  {INSTALL_CMD}
                </code>
                <span className="text-xs text-gray-500 uppercase tracking-wide">Planned</span>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-4 bg-white/5 border border-white/10 p-4 rounded-lg">
              <strong className="text-white block mb-1">Current IDE Support Status</strong>
              We have an internal VS Code extension (via VSIX) that supports syntax highlighting, diagnostics, and formatting. We plan to distribute this on the VS Code Marketplace alongside the npm package.
            </p>
          </section>

          {/* Writing Code */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <Code2 className="text-cyan-400" size={24} />
              </div>
              <h2 className="text-2xl font-bold">3. Inspecting Reux Examples</h2>
            </div>
            
            <p className="text-gray-400 mb-6">
              Reux uses a declarative syntax for defining simulation bounds, risk factors, and scenarios. While you can&apos;t run these locally yet, you can inspect the syntax below to understand how the simulator engine works.
            </p>

            <div className="space-y-8">
              {EXAMPLES.map((example, i) => (
                <div key={i} className="rounded-xl overflow-hidden glass border border-white/10">
                  <div className="flex items-center px-4 py-3 border-b border-white/5 bg-black/50">
                    <span className="text-xs text-gray-500 font-mono">{example.title}</span>
                  </div>
                  <div className="p-6 bg-[#0A0A0A]/80 overflow-x-auto">
                    <pre className="font-mono text-sm leading-relaxed text-gray-300">
                      <code>{example.code}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Current Limitations */}
          <section className="p-8 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-left">
            <h2 className="text-xl font-bold mb-4 text-amber-500">Current Limitations</h2>
            <ul className="space-y-3 text-sm text-amber-500/80 list-disc pl-5">
              <li>Reux is currently focused entirely on simulation and data modeling. It does not generate UI or HTTP controllers.</li>
              <li>There is no public package registry or module import system for sharing Reux libraries externally yet.</li>
              <li>Developer access is restricted to internal team pilots and interactive web demos like the Business Simulator.</li>
            </ul>
          </section>

        </motion.div>
      </div>
    </div>
  );
}
