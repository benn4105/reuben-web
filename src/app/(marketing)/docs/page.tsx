"use client";

import { motion } from "framer-motion";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { Terminal, Download, Code2, Copy } from "lucide-react";
import { useState } from "react";

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
  const [copied, setCopied] = useState(false);

  const copyInstall = () => {
    navigator.clipboard.writeText(INSTALL_CMD);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

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
            Reux Quickstart
          </h1>
          <p className="text-xl text-gray-400 font-light mb-12 leading-relaxed">
            Get up and running with the Reux compiler and Business Simulation Engine in minutes.
          </p>

          {/* Installation */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-violet-500/10">
                <Download className="text-violet-400" size={24} />
              </div>
              <h2 className="text-2xl font-bold">1. Installation</h2>
            </div>
            
            <p className="text-gray-400 mb-6">
              The Reux compiler and CLI are available via npm. Note: this is a beta release.
            </p>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 rounded-xl blur-sm transition-opacity opacity-0 group-hover:opacity-100" />
              <div className="relative glass border border-white/10 rounded-xl p-4 flex items-center justify-between">
                <code className="text-cyan-400 font-mono text-sm sm:text-base">
                  {INSTALL_CMD}
                </code>
                <button 
                  onClick={copyInstall}
                  className="p-2 rounded-md hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
                >
                  {copied ? <span className="text-xs text-emerald-400">Copied!</span> : <Copy size={16} />}
                </button>
              </div>
            </div>

            <p className="text-sm text-gray-500 mt-4">
              We also offer a VS Code extension via VSIX (coming soon to the marketplace).
            </p>
          </section>

          {/* Writing Code */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <Code2 className="text-cyan-400" size={24} />
              </div>
              <h2 className="text-2xl font-bold">2. Writing Simulations</h2>
            </div>
            
            <p className="text-gray-400 mb-6">
              Reux uses a declarative syntax for defining simulation bounds, risk factors, and scenarios.
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

          {/* Next Steps */}
          <section className="p-8 rounded-2xl glass border border-white/10 text-center">
            <h2 className="text-2xl font-bold mb-4">Want to see it in action?</h2>
            <p className="text-gray-400 mb-8 max-w-lg mx-auto">
              You don't need to write code to experience the power of Reux. We've built a full Business Simulation Engine powered by the language.
            </p>
            <AnimatedButton href="/simulator" variant="primary">
              Launch Business Simulator
            </AnimatedButton>
          </section>

        </motion.div>
      </div>
    </div>
  );
}
