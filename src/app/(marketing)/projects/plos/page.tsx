"use client";

import { motion } from "framer-motion";
import { 
  Activity, 
  Target, 
  BrainCircuit, 
  Rocket, 
  Calculator, 
  Briefcase 
} from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";

const features = [
  {
    icon: <Calculator className="w-8 h-8 text-[#00F0FF] mb-4" />,
    title: "Financial Scenarios",
    description: "Model long-term wealth compounding, major purchases, and retirement paths using stochastic forecasts rather than static spreadsheets.",
  },
  {
    icon: <Activity className="w-8 h-8 text-[#8A2BE2] mb-4" />,
    title: "Health & Habit Vectors",
    description: "Track sleep, exercise, and diet as input variables to your daily productivity, visualizing the long-term ROI of consistent habits.",
  },
  {
    icon: <Briefcase className="w-8 h-8 text-[#00F0FF] mb-4" />,
    title: "Career Branching",
    description: "Evaluate job offers, geographic moves, and educational investments by simulating risk, equity vesting, and lifestyle costs over decades.",
  },
  {
    icon: <Target className="w-8 h-8 text-[#8A2BE2] mb-4" />,
    title: "Objective Functions",
    description: "Define your personal 'win conditions' (e.g., maximize free time, minimize financial risk) and let the engine recommend the optimal path.",
  }
];

export default function PlosPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen relative overflow-hidden bg-[#0A0A0A]">
      {/* Background Gradients */}
      <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-[#8A2BE2] rounded-full blur-[200px] mix-blend-screen opacity-15 pointer-events-none" />
      <div className="absolute bottom-[-200px] left-[-200px] w-[600px] h-[600px] bg-[#00F0FF] rounded-full blur-[150px] mix-blend-screen opacity-10 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center mb-24"
        >
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-8 border border-[#8A2BE2]/30">
            <Rocket className="w-4 h-4 text-[#8A2BE2]" />
            <span className="text-sm font-medium tracking-wide text-[#8A2BE2] uppercase">
              Planned Product
            </span>
          </div>
          
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6">
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-white to-white/70">PLOS</span>
          </h1>
          <h2 className="text-2xl md:text-4xl font-bold mb-8 text-white/90">
            Personal Life Operating System
          </h2>
          
          <p className="text-xl md:text-2xl text-gray-400 font-light mb-4 leading-relaxed">
            Enterprise-grade scenario modeling, brought to the individual. Simulate your finances, habits, and career decisions over decades.
          </p>
          <p className="text-base text-gray-500 mb-10">
            PLOS is a planned future product. We are currently focused on shipping the Reux language and Business Simulator first.
          </p>
        </motion.div>

        {/* Vision Statement */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-5xl mx-auto mb-32"
        >
          <div className="glass-card p-8 md:p-12 rounded-3xl border border-white/10 relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/5 to-transparent opacity-50" />
            <div className="relative z-10 grid grid-cols-1 md:grid-cols-[1fr_2px_1fr] gap-12 items-center">
              <div>
                <h3 className="text-3xl font-bold text-white mb-6">The End of the Static Spreadsheet</h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  Right now, individuals model their lives in messy, fragile Excel files. They build static formulas that fail to account for variance, compounding behavioral changes, or sudden shocks.
                </p>
              </div>
              <div className="hidden md:block w-full h-full bg-gradient-to-b from-transparent via-white/10 to-transparent" />
              <div>
                <h3 className="text-3xl font-bold text-white mb-6">Dynamic Life Simulation</h3>
                <p className="text-gray-400 text-lg leading-relaxed">
                  PLOS is designed to replace spreadsheets with a dynamic engine. By combining real-world inputs with Reux-backed simulation models, PLOS will let you compare branching scenarios before making major life decisions.
                </p>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="mb-32"
        >
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">Core Capabilities</h2>
            <p className="text-gray-400 text-xl max-w-2xl mx-auto">
              A holistic model of your life vectors.
            </p>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            {features.map((feature, idx) => (
              <div key={idx} className="glass p-8 rounded-2xl border border-white/5 hover:border-white/15 transition-all duration-300 group">
                <div className="transform group-hover:scale-110 transition-transform duration-300 origin-left">
                  {feature.icon}
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">{feature.title}</h3>
                <p className="text-gray-400 leading-relaxed text-lg">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Reux Engine Tie-in */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto mb-32"
        >
          <div className="flex flex-col md:flex-row items-center gap-12 glass-card p-10 rounded-3xl border border-[#00F0FF]/20">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <BrainCircuit className="w-8 h-8 text-[#00F0FF]" />
                <h3 className="text-2xl font-bold text-white">Powered by Reux</h3>
              </div>
              <p className="text-gray-300 text-lg leading-relaxed mb-6">
                PLOS is planned as the first consumer-facing product that validates Reux-backed personal simulation workflows.
              </p>
              <p className="text-gray-400 text-lg leading-relaxed">
                The intended architecture is for career choices, budget changes, and habit tweaks in the PLOS UI to become Reux simulation declarations or model inputs as the runtime matures.
              </p>
            </div>
            <div className="flex-1 w-full">
              <div className="rounded-xl overflow-hidden glass border border-white/10 bg-black/50">
                <div className="px-4 py-2 border-b border-white/5 bg-[#00F0FF]/10">
                  <span className="text-xs text-[#00F0FF] font-mono">plos_career_node.reux</span>
                </div>
                <div className="p-4 overflow-x-auto">
                  <pre className="font-mono text-xs md:text-sm text-gray-300">
                    <code>{`simulate career_branch {
  base_salary = 120000
  equity_grant = 50000
  
  scenario take_startup_job {
    base_salary = 100000
    equity_grant = 200000
    risk_multiplier = 0.8
  }
  
  objective maximize total_comp
  forecast 4 years
}`}</code>
                  </pre>
                </div>
              </div>
            </div>
          </div>
        </motion.div>

        {/* Waitlist / CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
          className="text-center max-w-2xl mx-auto pb-12"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-6">Join the Early Access List</h2>
          <p className="text-gray-400 text-lg mb-8">
            PLOS is currently in active development. We are focusing on releasing the underlying Reux compiler and Business Simulator first. Leave your email to be notified when PLOS beta opens.
          </p>
          
          <form className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto" onSubmit={(e) => e.preventDefault()}>
            <input 
              type="email" 
              placeholder="Enter your email" 
              className="flex-1 bg-white/5 border border-white/10 rounded-full px-6 py-3 text-white focus:outline-none focus:ring-2 focus:ring-[#8A2BE2] transition-shadow"
              required
            />
            <AnimatedButton onClick={() => {}} variant="primary" className="whitespace-nowrap">
              Join Waitlist
            </AnimatedButton>
          </form>
          <p className="text-xs text-gray-500 mt-4">
            No spam. We&apos;ll only email you when we have a playable demo.
          </p>
        </motion.div>

      </div>
    </div>
  );
}
