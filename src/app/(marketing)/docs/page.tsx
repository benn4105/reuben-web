"use client";

import { motion } from "framer-motion";
import { useState } from "react";
import AnimatedButton from "@/components/ui/AnimatedButton";
import {
  Terminal,
  Download,
  Code2,
  Eye,
  Code,
  AlertTriangle,
  Copy,
  Check,
  SlidersHorizontal,
  PlayCircle,
  BarChart3,
  Share2,
  MessageSquare,
} from "lucide-react";
import IdeMockup from "@/components/ui/IdeMockup";
import { copyToClipboard } from "@/lib/simulation/share";

const INSTALL_CMD = "npm install @reux/cli -g";
const SOURCE_INSTALL_CMD = `git clone https://github.com/benn4105/Reux.git
cd Reux
npm install
npm run onboarding:smoke`;

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={async () => {
        const ok = await copyToClipboard(text);
        if (ok) {
          setCopied(true);
          setTimeout(() => setCopied(false), 2000);
        }
      }}
      className="flex items-center gap-1 text-[11px] text-gray-500 hover:text-gray-300 transition-colors"
      title="Copy to clipboard"
    >
      {copied ? (
        <><Check size={12} className="text-emerald-400" /> Copied</>
      ) : (
        <><Copy size={12} /> Copy</>
      )}
    </button>
  );
}


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
    title: "Transaction and outbox event",
    filename: "payments.dl",
    code: `transaction function capturePayment(orderRef: Order, amount: Decimal<12,2>) writes Payment retry 3 {
  let order = load orderRef for update
  let payment = insert Payment {
    order: orderRef,
    amount: amount,
    currency: order.currency,
    status: Captured
  }

  enqueue PaymentCaptured {
    payment: payment.id,
    order: orderRef,
    amount: amount,
    currency: order.currency
  }

  after commit sendReceipt(orderRef)
}`
  },
  {
    title: "Generated TypeScript integration",
    filename: "app.ts",
    code: `import { createPilotApi } from './generated/pilot-api';
import { createPostgresDatabase } from './runtime';

async function checkout(orderId: string, amount: string) {
  const db = createPostgresDatabase(process.env.DATABASE_URL);
  const api = createPilotApi(db);
  const result = await api.transactions.capturePayment({
    orderRef: orderId,
    amount
  });
  
  console.log(result.bindings.payment.id);
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
            The source repository is public today. The packaged npm beta is still being prepared, so the best developer path is cloning the repo and running the local CLI.
          </p>

          {/* Try It Today */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-emerald-500/10">
                <Eye className="text-emerald-400" size={24} />
              </div>
              <h2 className="text-2xl font-bold">Try It Today</h2>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              The best way to understand Reux is to see it in action. Explore our live Business Simulator to see how Reux evaluates complex operational scenarios in real-time.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-8">
              <AnimatedButton href="/simulator" variant="primary">
                Try Business Simulator
              </AnimatedButton>
              <AnimatedButton href="#run-from-source" variant="secondary">
                Run From Source
              </AnimatedButton>
            </div>
          </section>

          {/* Business Simulator User Guide */}
          <section className="mb-16" id="business-simulator-guide">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <BarChart3 className="text-cyan-400" size={24} />
              </div>
              <h2 className="text-2xl font-bold">How to Use the Business Simulator</h2>
            </div>

            <p className="text-gray-400 mb-6 leading-relaxed">
              The Business Simulator is the fastest public way to see Reux working. You do not need an account, admin token, private data, or developer setup. Pick a template, adjust sample assumptions, run the forecast, and review the recommended path.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
              {[
                {
                  icon: SlidersHorizontal,
                  title: "1. Choose a template",
                  description: "Start with operations, capacity, staffing, or pricing. Each template loads a baseline and a few realistic scenarios.",
                },
                {
                  icon: SlidersHorizontal,
                  title: "2. Edit assumptions",
                  description: "Change employees, demand, margin, productivity, supplier risk, defects, or forecast length. The live preview updates immediately.",
                },
                {
                  icon: PlayCircle,
                  title: "3. Run the scenario",
                  description: "The backend evaluates the baseline and scenario paths, then returns forecast metrics and a recommendation.",
                },
                {
                  icon: BarChart3,
                  title: "4. Interpret the result",
                  description: "Focus on margin, risk score, workforce load, and the recommendation panel. The best path is not always the highest revenue path.",
                },
                {
                  icon: Share2,
                  title: "5. Share or rerun",
                  description: "Copy the saved result link for short-term review, or share the configuration link so someone else can rerun the assumptions.",
                },
                {
                  icon: MessageSquare,
                  title: "6. Bring your own decision",
                  description: "If the demo maps to a real business problem, use the pilot CTA to start with one spreadsheet decision and a few scenarios.",
                },
              ].map((step) => (
                <div key={step.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <step.icon className="mb-4 h-6 w-6 text-[#00F0FF]" />
                  <h3 className="text-sm font-bold text-white mb-2">{step.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{step.description}</p>
                </div>
              ))}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
              {[
                {
                  title: "Margin",
                  description: "Shows whether the scenario improves weekly profitability after operating costs.",
                },
                {
                  title: "Risk score",
                  description: "Summarizes supplier delay, defect pressure, workforce load, and operational complexity.",
                },
                {
                  title: "Reux transparency",
                  description: "Shows the model source that produced the forecast, so the decision logic is inspectable.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-cyan-500/10 bg-cyan-500/[0.03] p-5">
                  <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="rounded-lg border border-amber-500/20 bg-amber-500/[0.04] px-5 py-4">
              <h3 className="text-sm font-bold text-amber-300 mb-2">Public demo note</h3>
              <p className="text-sm text-amber-500/80 leading-relaxed">
                The public simulator uses sample assumptions. Saved result links are temporary and may expire. For a real pilot, start with one spreadsheet decision and use the contact CTA after a result.
              </p>
            </div>
          </section>

          {/* Run From Source */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-violet-500/10">
                <Terminal className="text-violet-400" size={24} />
              </div>
              <h2 className="text-2xl font-bold" id="run-from-source">Run From Source</h2>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              Reux is available from source today. Clone the public repo, install dependencies, and run the onboarding smoke test to prove the compiler, CLI, examples, seed checks, SQL emitters, and simulation runner are working locally. The standard <code className="text-cyan-400 font-mono">npm install</code> package path will come later when the public beta package name and API stability are finalized.
            </p>

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

            <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {[
                { label: "Public repo", value: "Available" },
                { label: "Local CLI", value: "Available" },
                { label: "npm beta", value: "Planned" },
              ].map((item) => (
                <div key={item.label} className="rounded-xl border border-white/10 bg-white/[0.03] p-4">
                  <div className="text-xs uppercase tracking-wider text-gray-500 mb-1">{item.label}</div>
                  <div className="text-sm font-semibold text-white">{item.value}</div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-xl overflow-hidden glass border border-white/10">
              <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/50">
                <span className="text-xs text-gray-500 font-mono">run from source today</span>
                <div className="flex items-center gap-3">
                  <CopyButton text={SOURCE_INSTALL_CMD} />
                  <span className="text-xs text-emerald-400">Available</span>
                </div>
              </div>
              <div className="p-5 bg-[#0A0A0A]/80 overflow-x-auto">
                <pre className="font-mono text-sm leading-relaxed text-gray-300">
                  <code>{SOURCE_INSTALL_CMD}</code>
                </pre>
              </div>
            </div>

            <div className="mt-6 flex flex-col sm:flex-row gap-4">
              <AnimatedButton href="https://github.com/benn4105/Reux" variant="secondary" external>
                Open GitHub Repository
              </AnimatedButton>
              <AnimatedButton href="/projects/reux/roadmap" variant="secondary">
                View Beta Roadmap
              </AnimatedButton>
            </div>
          </section>

          {/* Developer Access Checklist */}
          <section className="mb-16">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <Terminal className="text-cyan-400" size={24} />
              </div>
              <h2 className="text-2xl font-bold">Developer Access Checklist</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                {
                  title: "1. Run the smoke path",
                  description: "Use onboarding:smoke first. It is database-free and proves the local toolchain works.",
                },
                {
                  title: "2. Read examples",
                  description: "Start with examples/simulations/business_simulator.reux and examples/pilot_reux.dl.",
                },
                {
                  title: "3. Enable editor support",
                  description: "Use editors/vscode for file associations, syntax highlighting, diagnostics, formatting, and completions.",
                },
                {
                  title: "4. Try PostgreSQL later",
                  description: "Only set DATABASE_URL when you want runtime checks, migrations, seeds, or the local hosted demo.",
                },
              ].map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-white/[0.03] p-5">
                  <h3 className="text-sm font-bold text-white mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-500 leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Syntax Examples */}
          <section className="mb-16" id="examples">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-cyan-500/10">
                <Code2 className="text-cyan-400" size={24} />
              </div>
              <h2 className="text-2xl font-bold">Syntax Examples</h2>
            </div>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              Reux uses a declarative, highly readable syntax. Here is a quick look at what writing and generating Reux code feels like.
            </p>

            <div className="space-y-8">
              {EXAMPLES.map((example, i) => (
                <div key={i} className="rounded-xl overflow-hidden glass border border-white/10">
                  <div className="flex items-center justify-between px-4 py-3 border-b border-white/5 bg-black/50">
                    <span className="text-xs text-gray-500 font-mono">{example.filename}</span>
                    <span className="text-xs text-gray-500">{example.title}</span>
                  </div>
                  <div className="p-6 bg-[#0A0A0A]/80 overflow-x-auto">
                    <pre className="font-mono text-sm leading-relaxed text-gray-300">
                      <code>{example.code}</code>
                    </pre>
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-6 rounded-lg border border-cyan-500/10 bg-cyan-500/[0.03] px-5 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <p className="text-xs text-gray-400">
                The <code className="text-cyan-400 font-mono">simulate</code> block above is the same syntax the live Business Simulator compiles and runs.{" "}
                <span className="text-gray-500">Try it with your own numbers.</span>
              </p>
              <AnimatedButton href="/simulator/new?preset=optimization" variant="secondary">
                Open Simulator
              </AnimatedButton>
            </div>
          </section>

          {/* Editor Support Preview */}
          <section className="mb-24" id="ide">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-2 rounded-lg bg-indigo-500/10">
                <Code className="text-indigo-400" size={24} />
              </div>
              <h2 className="text-2xl font-bold">Editor Support Preview</h2>
            </div>
            <p className="text-gray-400 mb-8 leading-relaxed max-w-3xl">
              Reux has early VS Code support with syntax highlighting, plus CLI-backed diagnostics, formatting, completions, hover info, and definition jumps. A dedicated language server process (full LSP) is planned but not yet live.
            </p>
            <div className="relative mb-16">
              <IdeMockup />
            </div>
          </section>

          {/* What is not ready yet */}
          <section className="p-8 rounded-2xl bg-amber-500/5 border border-amber-500/20 text-left mb-16">
            <div className="flex items-center gap-3 mb-4">
              <AlertTriangle className="text-amber-400" size={24} />
              <h2 className="text-xl font-bold text-amber-400">What is not ready yet</h2>
            </div>
            <ul className="space-y-3 text-sm text-amber-500/80 list-disc pl-5">
              <li><strong>Public npm package not finalized:</strong> The source repo is available, but packaged npm distribution is still being prepared.</li>
              <li><strong>API stability:</strong> Syntax and language features may change before the public beta.</li>
              <li><strong>Full language server:</strong> Current editor support is useful, but a dedicated LSP is still planned.</li>
              <li><strong>Not a full-stack language:</strong> Reux focuses purely on backend data modeling and decision logic. Product apps still use normal web frontend technologies.</li>
            </ul>
          </section>

          {/* Continue Exploring */}
          <section className="pb-8 border-t border-white/5 pt-12">
            <h2 className="text-2xl font-bold mb-2 text-white">Continue Exploring</h2>
            <p className="text-gray-400 mb-8 max-w-xl">
              Pick what fits your workflow.
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {[
                {
                  title: "Try the Simulator",
                  description: "Run a live simulation in your browser. No account, no install.",
                  href: "/simulator",
                  color: "border-cyan-500/20 hover:border-cyan-500/40",
                  icon: "01",
                },
                {
                  title: "Run From Source",
                  description: "Clone the repo, install deps, and run the onboarding smoke test locally.",
                  href: "#run-from-source",
                  color: "border-violet-500/20 hover:border-violet-500/40",
                  icon: "02",
                },
                {
                  title: "Browse Syntax Examples",
                  description: "Jump to simulate blocks, transaction functions, and generated TypeScript.",
                  href: "#examples",
                  color: "border-white/10 hover:border-white/20",
                  icon: "03",
                },
                {
                  title: "View Roadmap",
                  description: "See what is available now, in beta, next, and future.",
                  href: "/projects/reux/roadmap",
                  color: "border-amber-500/20 hover:border-amber-500/40",
                  icon: "04",
                },
                {
                  title: "GitHub Repository",
                  description: "Browse source code, examples, and open issues.",
                  href: "https://github.com/benn4105/Reux",
                  color: "border-white/10 hover:border-white/20",
                  icon: "05",
                  external: true,
                },
                {
                  title: "Reux Product Page",
                  description: "Features, use cases, live pilots, and the full product story.",
                  href: "/projects/reux",
                  color: "border-white/10 hover:border-white/20",
                  icon: "06",
                },
              ].map((card) => (
                <a
                  key={card.title}
                  href={card.href}
                  {...(card.external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className={`group flex gap-4 p-5 rounded-xl border ${card.color} bg-white/[0.02] hover:bg-white/[0.04] transition-all duration-200`}
                >
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 bg-white/[0.03] text-xs font-bold text-[#00F0FF]">
                    {card.icon}
                  </span>
                  <div>
                    <h3 className="text-sm font-bold text-white mb-1 group-hover:text-[#00F0FF] transition-colors">{card.title}</h3>
                    <p className="text-xs text-gray-500 leading-relaxed">{card.description}</p>
                  </div>
                </a>
              ))}
            </div>
          </section>

        </motion.div>
      </div>
    </div>
  );
}
