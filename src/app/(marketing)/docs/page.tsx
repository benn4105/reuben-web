"use client";

import { motion } from "framer-motion";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { Terminal, Download, Code2, Eye, Database, Search, Zap, Send, LineChart, FileCode, Code, Server, AlertTriangle } from "lucide-react";

const INSTALL_CMD = "npm install @reux/cli -g";

const CAPABILITIES = [
  { icon: <Database size={20} className="text-emerald-400" />, title: "Schema + migration modeling" },
  { icon: <Search size={20} className="text-blue-400" />, title: "Typed queries" },
  { icon: <Zap size={20} className="text-yellow-400" />, title: "Transaction functions" },
  { icon: <Send size={20} className="text-orange-400" />, title: "Durable outbox events" },
  { icon: <LineChart size={20} className="text-cyan-400" />, title: "Simulation declarations" },
  { icon: <FileCode size={20} className="text-violet-400" />, title: "Generated TypeScript integration" },
  { icon: <Code size={20} className="text-indigo-400" />, title: "VS Code support" },
  { icon: <Server size={20} className="text-pink-400" />, title: "Public demo API" }
];

const EXAMPLES = [
  {
    title: "A simple simulate block",
    filename: "operations.reux",
    code: `simulate q3_operations {
  employees = 50
  weekly_demand = 1200
  productivity_gain = 0.12

  scenario aggressive_hiring {
    employees = 65
    productivity_gain = 0.06
  }

  forecast 12 weeks
}`
  },
  {
    title: "Transaction & Outbox Concept",
    filename: "checkout.reux",
    code: `transaction process_order(cart_id: UUID) {
  let cart = query(carts).find(cart_id)
  
  mut order = insert(orders, {
    total: cart.total,
    status: 'pending'
  })

  // Durable event emitted automatically
  emit order_placed {
    order_id: order.id,
    amount: order.total
  }
}`
  },
  {
    title: "Generated TypeScript Integration",
    filename: "app.ts",
    code: `import { reux } from './generated/reux-client';

async function handleCheckout(cartId: string) {
  // Fully typed transaction call
  const result = await reux.tx.process_order({ cart_id: cartId });
  
  if (result.ok) {
    console.log(\`Order \${result.data.order.id} placed successfully\`);
  }
}`
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
              Developer Preview
            </span>
          </div>
          
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-6">
            Getting Started with Reux
          </h1>
          <p className="text-xl text-gray-400 font-light mb-8 leading-relaxed max-w-3xl">
            Reux is currently a prototype backend language and runtime. It supports schemas, queries, transactions, durable events, migrations, simulation declarations, generated TypeScript, and early VS Code tooling.
          </p>
          <p className="text-lg text-gray-500 mb-12">
            Note: Local package publishing is not public yet.
          </p>

          {/* Current Capabilities */}
          <section className="mb-16">
            <h2 className="text-2xl font-bold mb-6">Current Capabilities</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {CAPABILITIES.map((cap, i) => (
                <div key={i} className="glass-card flex items-center gap-3 rounded-xl p-4 border border-white/5 hover:border-white/15 transition-colors">
                  <div className="shrink-0 p-2 bg-white/5 rounded-lg">{cap.icon}</div>
                  <div className="text-sm font-medium text-gray-300">{cap.title}</div>
                </div>
              ))}
            </div>
          </section>

          {/* Try It Today */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Eye className="text-emerald-400" size={24} />
              </div>
              <h2 className="text-2xl font-bold">Try It Today</h2>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              While the <code className="text-cyan-400 font-mono">npm install</code> command is planned for the upcoming public beta, you can explore Reux right now through our live demos and projects.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <AnimatedButton href="/simulator" variant="primary">
                Try Business Simulator
              </AnimatedButton>
              <AnimatedButton href="/projects/reux" variant="secondary">
                View Reux Project
              </AnimatedButton>
              <AnimatedButton href="https://github.com/benn4105/Reux" variant="secondary" external>
                GitHub
              </AnimatedButton>
            </div>

            <div className="relative group">
              <div className="absolute inset-0 bg-gradient-to-r from-cyan-500/10 to-violet-500/10 rounded-xl blur-sm transition-opacity opacity-0 group-hover:opacity-100" />
              <div className="relative glass border border-white/10 rounded-xl p-4 flex items-center justify-between opacity-50 cursor-not-allowed">
                <div className="flex items-center gap-3">
                  <Download className="text-violet-400" size={20} />
                  <code className="text-cyan-400 font-mono text-sm sm:text-base">
                    {INSTALL_CMD}
                  </code>
                </div>
                <span className="text-xs text-gray-500 uppercase tracking-wide shrink-0 ml-4">Planned</span>
              </div>
            </div>
          </section>

          {/* Writing Code */}
          <section className="mb-16" id="examples">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <Code2 className="text-cyan-400" size={24} />
              </div>
              <h2 className="text-2xl font-bold">Reux Syntax Preview</h2>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              Reux uses a declarative, highly readable syntax. Here is a quick look at what writing and generating Reux code feels like.
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
                      <code>{example.code}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* What is not ready yet */}
          <section className="p-8 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-left mb-16">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-amber-400" size={24} />
              <h2 className="text-xl font-bold text-amber-400">What is not ready yet</h2>
            </div>
            <ul className="space-y-3 text-sm text-amber-500/80 list-disc pl-5">
              <li><strong>Public npm package not finalized:</strong> The CLI and core runtime are still internal prototypes.</li>
              <li><strong>API stability:</strong> Syntax and language features may change before the public beta.</li>
              <li><strong>Not a full-stack language:</strong> Reux focuses purely on backend data modeling and decision logic. Product apps still use normal web frontend technologies.</li>
            </ul>
          </section>

          {/* What's Next */}
          <section className="text-center pb-8 border-t border-white/5 pt-12">
            <h2 className="text-2xl font-bold mb-4 text-white">Continue Exploring</h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Ready to see more? Follow our progress on the roadmap or run live simulations directly in the browser.
            </p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <AnimatedButton href="/simulator" variant="primary">
                Open Business Simulator
              </AnimatedButton>
              <AnimatedButton href="/projects/reux/roadmap" variant="secondary">
                View Roadmap
              </AnimatedButton>
            </div>
          </section>

        </motion.div>
      </div>
    </div>
  );
}
