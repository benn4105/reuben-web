"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import AnimatedButton from "@/components/ui/AnimatedButton";

export default function AboutPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen relative">
      {/* Background Decor */}
      <div className="absolute top-1/4 -left-1/4 w-[800px] h-[800px] bg-[#00F0FF] rounded-full blur-[200px] mix-blend-screen opacity-5 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 max-w-4xl relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-20 text-center"
        >
          <div className="inline-flex items-center space-x-2 mb-8">
            <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-[#00F0FF] to-[#8A2BE2] flex items-center justify-center shadow-[0_0_30px_rgba(138,43,226,0.3)]">
              <span className="font-bold text-white text-2xl leading-none">R</span>
            </div>
          </div>
          <h1 className="text-4xl md:text-6xl font-black tracking-tighter mb-8">
            Building the foundations of tomorrow.
          </h1>
          <p className="text-xl md:text-2xl text-gray-400 font-light leading-relaxed">
            Reuben is a technology company building data-aware tools for backend systems, simulation-driven products, and developer infrastructure.
          </p>
        </motion.div>

        <div className="space-y-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-[#00F0FF]" />
              Our Vision
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              We believe that backend software should be easier to audit, simulate, and reason about. Too much critical logic ends up scattered across frameworks, config files, and ad hoc scripts.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              At Reuben, we are building Reux - a prototype backend language designed for schemas, transactions, simulations, and decision logic. Our approach is practical: prove the language by shipping real products on top of it.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              The <strong className="text-white">Business Simulator</strong> is our first public proof point - a live demo where Reux models operational decisions, forecasts outcomes, and surfaces risk across scenarios.
            </p>
          </motion.div>

          {/* Ecosystem Map */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-8 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-[#00F0FF]" />
              The Ecosystem
            </h2>
            
            <div className="glass-card p-8 md:p-12 rounded-3xl relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-b from-transparent via-[#00F0FF]/5 to-transparent opacity-50" />
              
              <div className="relative z-10 flex flex-col items-center gap-4">
                {/* Foundation / Parent Layer */}
                <div className="w-full max-w-3xl glass border border-white/20 p-8 md:p-10 rounded-2xl text-center shadow-[0_0_30px_rgba(255,255,255,0.05)]">
                  <h4 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-2 uppercase">Reuben</h4>
                  <p className="text-sm md:text-lg text-gray-400 font-medium">Ecosystem & Parent Brand</p>
                </div>
                
                {/* Connector */}
                <div className="flex flex-col items-center justify-center w-full my-2">
                  <div className="h-12 w-px bg-gradient-to-b from-white/20 to-[#00F0FF]/50 relative">
                    <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 border-b-2 border-r-2 border-[#00F0FF]/50 rotate-45" />
                  </div>
                </div>

                {/* Engine Layer */}
                <div className="w-full max-w-2xl glass border border-[#00F0FF]/30 bg-[#00F0FF]/10 p-8 rounded-2xl text-center shadow-[0_0_30px_rgba(0,240,255,0.1)]">
                  <h4 className="text-2xl md:text-4xl font-black text-white tracking-tight mb-2">Reux</h4>
                  <p className="text-sm md:text-base text-[#00F0FF]/80 font-medium">Data-aware workflow & simulation language</p>
                </div>

                {/* Connector */}
                <div className="flex flex-col items-center justify-center w-full my-2">
                  <div className="h-12 w-px bg-gradient-to-b from-[#00F0FF]/50 to-white/20 relative">
                    <div className="absolute bottom-[-4px] left-1/2 -translate-x-1/2 w-2 h-2 border-b-2 border-r-2 border-white/20 rotate-45" />
                  </div>
                </div>

                {/* Application Layer */}
                <div className="w-full flex flex-col md:flex-row gap-6 justify-center">
                  <Link href="/projects/plos" className="flex-1 max-w-sm glass border border-white/10 p-6 rounded-2xl text-center hover:border-[#8A2BE2]/40 transition-colors cursor-pointer group shadow-lg">
                    <h4 className="text-lg md:text-xl text-white font-bold mb-2 group-hover:text-[#8A2BE2] transition-colors">PLOS</h4>
                    <p className="text-xs md:text-sm text-gray-400">Personal Life Operating System</p>
                  </Link>
                  <Link href="/simulator" className="flex-1 max-w-sm glass border border-white/10 p-6 rounded-2xl text-center hover:border-[#00F0FF]/40 transition-colors cursor-pointer group shadow-lg">
                    <h4 className="text-lg md:text-xl text-white font-bold mb-2 group-hover:text-[#00F0FF] transition-colors">Business Simulator</h4>
                    <p className="text-xs md:text-sm text-gray-400">Live operational scenario modeling</p>
                  </Link>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-2xl md:text-3xl font-bold mb-6 flex items-center gap-4">
              <span className="w-8 h-[1px] bg-[#8A2BE2]" />
              The Team
            </h2>
            <p className="text-gray-300 text-lg leading-relaxed mb-12">
              We are a small team of engineers and designers focused on language design, simulation tooling, and developer experience.
            </p>
            
            <div className="glass-card p-8 rounded-2xl flex flex-col items-center text-center">
              <h3 className="text-2xl font-bold text-white mb-4">Join Our Mission</h3>
              <p className="text-gray-400 mb-8 max-w-md">
                We&apos;re always looking for exceptional engineers who want to push the boundaries of what&apos;s possible in software.
              </p>
              <AnimatedButton href="mailto:careers@reuben.inc" variant="primary">
                View Open Roles
              </AnimatedButton>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
