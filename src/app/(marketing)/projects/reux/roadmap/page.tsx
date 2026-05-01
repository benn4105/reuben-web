"use client";

import { motion, Variants } from "framer-motion";
import { CheckCircle2, CircleDashed, ArrowRightCircle } from "lucide-react";

export default function RoadmapPage() {
  const availableNow = [
    "Schema declarations for entities, enums, references, indexes, and constraints.",
    "Query declarations compiled to secure PostgreSQL SQL.",
    "Transaction functions with row locking, mutations, and after-commit hooks.",
    "Migration planning, safety checks, and schema manifests.",
    "Runtime support for PostgreSQL queries, transactions, and outbox processing.",
    "CLI tooling for formatting, checking, generation, and migrations."
  ];

  const inActiveBeta = [
    "Business Simulation Engine (Frontend MVP with Reux backend)",
    "Hosted commerce and logistics pilots",
    "Early VS Code support with syntax highlighting and diagnostics",
    "Simulation syntax with assumptions, scenarios, and forecasts"
  ];

  const nextMilestones = [
    {
      title: "Public Developer Access",
      description: "Choose the final package name, publish a beta package, and provide a clean VS Code installation path for external developers."
    },
    {
      title: "Simulation Engine Depth",
      description: "Expand Reux simulations into richer domain models for personal finance and operational decisions."
    }
  ];

  const laterMilestones = [
    {
      title: "Ecosystem Integration",
      description: "Connect Reux more directly to the Personal Life Operating System (PLOS) and external simulation environments."
    },
    {
      title: "Full IDE Language Server",
      description: "Stronger editor intelligence, semantic tokens, and a true language-server process."
    },
    {
      title: "Language Runtime Depth",
      description: "Broaden transaction control flow and deepen expression typing."
    }
  ];

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.5, ease: "easeOut" }
    }
  };

  return (
    <div className="pt-32 pb-24 px-4 md:px-8 max-w-5xl mx-auto w-full relative z-10">
      {/* Background gradients */}
      <div className="absolute top-40 left-1/4 w-96 h-96 bg-[#8A2BE2]/10 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none" />
      <div className="absolute bottom-40 right-1/4 w-96 h-96 bg-[#00F0FF]/10 rounded-full blur-[120px] -z-10 mix-blend-screen pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="mb-16 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-bold mb-6 text-white tracking-tight">
          Reux <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#00F0FF] to-[#8A2BE2]">Roadmap</span>
        </h1>
        <p className="text-lg md:text-xl text-gray-300 max-w-3xl mx-auto leading-relaxed">
          Reux is a data-native programming language for reliable backend systems, workflow-heavy applications, and simulation-driven decision tools. The prototype foundation is now complete: the next phase is public beta polish, business-simulator validation, and stronger developer access.
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ delay: 0.2, duration: 0.5 }}
        className="mb-20 grid grid-cols-1 md:grid-cols-2 gap-6"
      >
        <div className="glass p-6 rounded-2xl border border-[#00F0FF]/20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <h3 className="text-sm font-semibold text-[#00F0FF] uppercase tracking-wider mb-2">Demo Readiness</h3>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-bold text-white">~99%</span>
          </div>
          <div className="mt-4 w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#00F0FF] h-1.5 rounded-full" style={{ width: '99%' }}></div>
          </div>
        </div>
        
        <div className="glass p-6 rounded-2xl border border-[#8A2BE2]/20 relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-[#8A2BE2]/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <h3 className="text-sm font-semibold text-[#8A2BE2] uppercase tracking-wider mb-2">Prototype Completion</h3>
          <div className="flex items-end gap-3">
            <span className="text-5xl font-bold text-white">100%</span>
          </div>
          <div className="mt-4 w-full bg-gray-800 rounded-full h-1.5 overflow-hidden">
            <div className="bg-[#8A2BE2] h-1.5 rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="col-span-1 md:col-span-2 glass p-6 rounded-2xl border border-white/5 bg-white/5">
          <p className="text-gray-300 text-center text-sm md:text-base">
            Reux is not being positioned as a complete full-stack language yet. Today, it is best described as a backend, data, workflow, and simulation language with generated TypeScript integration points.
          </p>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mb-20"
      >
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
          <CheckCircle2 className="text-[#00F0FF] w-8 h-8" />
          <h2 className="text-3xl font-bold text-white">Available Now</h2>
          <span className="ml-3 rounded-full bg-[#00F0FF]/10 px-3 py-1 text-xs font-medium text-[#00F0FF] border border-[#00F0FF]/20">Prototype Core</span>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {availableNow.map((item, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              className="flex items-start gap-3 p-4 rounded-xl bg-white/[0.02] border border-white/5 hover:bg-white/[0.04] transition-colors group"
            >
              <CheckCircle2 className="w-5 h-5 text-emerald-500 mt-0.5 flex-shrink-0 opacity-70 group-hover:opacity-100 transition-opacity" />
              <p className="text-gray-400 text-sm leading-relaxed">{item}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mb-20"
      >
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
          <CircleDashed className="text-[#8A2BE2] w-8 h-8 animate-spin-slow" style={{ animationDuration: '4s' }} />
          <h2 className="text-3xl font-bold text-white">In Active Beta</h2>
          <span className="ml-3 rounded-full bg-[#8A2BE2]/10 px-3 py-1 text-xs font-medium text-[#8A2BE2] border border-[#8A2BE2]/20">Live Pilots</span>
        </div>
        <div className="grid grid-cols-1 gap-4">
          {inActiveBeta.map((item, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              className="flex items-center gap-4 p-5 rounded-xl border border-[#8A2BE2]/30 bg-gradient-to-r from-[#8A2BE2]/10 to-transparent relative overflow-hidden"
            >
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#8A2BE2] animate-pulse" />
              <div className="w-2 h-2 rounded-full bg-[#8A2BE2] shadow-[0_0_8px_rgba(138,43,226,0.8)] flex-shrink-0" />
              <p className="text-gray-100 font-medium">{item}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mb-20"
      >
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
          <ArrowRightCircle className="text-orange-400 w-8 h-8" />
          <h2 className="text-3xl font-bold text-white">Next</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {nextMilestones.map((milestone, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              className="p-6 rounded-2xl glass border border-white/10 hover:border-orange-400/30 transition-all duration-300 hover:-translate-y-1 group"
            >
              <h3 className="text-xl font-bold text-white mb-3 group-hover:text-orange-400 transition-colors">{milestone.title}</h3>
              <p className="text-gray-400 text-sm leading-relaxed">{milestone.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-100px" }}
        className="mb-24"
      >
        <div className="flex items-center gap-3 mb-8 border-b border-white/10 pb-4">
          <CircleDashed className="text-gray-500 w-8 h-8" />
          <h2 className="text-3xl font-bold text-white text-gray-400">Later</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {laterMilestones.map((milestone, idx) => (
            <motion.div 
              key={idx} 
              variants={itemVariants}
              className="p-6 rounded-2xl border border-white/[0.05] bg-white/[0.02]"
            >
              <h3 className="text-sm font-bold text-gray-300 mb-2">{milestone.title}</h3>
              <p className="text-gray-500 text-xs leading-relaxed">{milestone.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.8 }}
        className="relative p-8 md:p-12 rounded-3xl overflow-hidden border border-white/10 bg-black/40 backdrop-blur-sm"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/10 via-transparent to-[#8A2BE2]/10 opacity-30" />
        <h2 className="text-2xl md:text-3xl font-bold text-white mb-6 relative z-10">Long-Term Direction</h2>
        <div className="space-y-6 text-gray-300 text-sm md:text-base leading-relaxed relative z-10">
          <p>
            Reux is designed to become the language layer underneath data-aware and simulation-driven software. The goal is not just to describe data, but to help developers model decisions, workflows, state changes, and future scenarios before they happen.
          </p>
          <p>
            Over time, Reux may grow toward full-stack capabilities through service declarations, generated APIs, client contracts, realtime workflows, auth/session rules, and possibly UI-facing primitives. For now, the focus is building a strong, believable foundation: data, backend logic, transactions, events, and simulations.
          </p>
        </div>
      </motion.div>
    </div>
  );
}
