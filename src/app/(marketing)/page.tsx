"use client";

import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import HeroScene from "@/components/3d/HeroScene";
import AnimatedButton from "@/components/ui/AnimatedButton";
import ProjectCard from "@/components/ui/ProjectCard";

export default function Home() {
  const containerRef = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 0.5], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 0.5], [1, 0.8]);
  const y = useTransform(scrollYProgress, [0, 0.5], [0, -50]);

  return (
    <div ref={containerRef} className="flex flex-col min-h-screen">
      {/* Hero Section */}
      <section className="relative h-screen flex items-center justify-center overflow-hidden">
        <HeroScene />
        
        <motion.div 
          style={{ opacity, scale, y }}
          className="relative z-10 container mx-auto px-4 md:px-8 flex flex-col items-center text-center mt-20"
        >
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-8"
          >
            <span className="w-2 h-2 rounded-full bg-[#00F0FF] animate-pulse" />
            <span className="text-sm font-medium tracking-wide text-gray-300 uppercase">
              Welcome to Reuben
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="text-5xl md:text-7xl lg:text-8xl font-semibold tracking-tight mb-6 text-white"
          >
            Engineering the <br className="hidden md:block" />
            <span className="text-gray-400">
              Future of Systems
            </span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
            className="text-lg md:text-xl text-gray-400 max-w-2xl mb-12"
          >
            Reuben builds data-aware tools for modern computing.
            Try our public demo — a Business Simulator powered by the Reux prototype engine.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="flex flex-col sm:flex-row items-center gap-6"
          >
            <AnimatedButton href="/simulator" variant="primary">
              Launch Simulator
            </AnimatedButton>
            <AnimatedButton href="/projects/reux" variant="secondary">
              Explore Reux Language
            </AnimatedButton>
          </motion.div>
        </motion.div>

        {/* Scroll Indicator */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.5 }}
          className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center"
        >
          <span className="text-xs text-gray-500 uppercase tracking-widest mb-2">Scroll</span>
          <div className="w-[1px] h-12 bg-gradient-to-b from-gray-500 to-transparent" />
        </motion.div>
      </section>

      {/* Featured Project Section */}
      <section className="py-32 relative z-20 bg-[#0A0A0A]/15 backdrop-blur-xl">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-end mb-16">
            <div>
              <h2 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">
                Featured Projects
              </h2>
              <p className="text-gray-400 max-w-md">
                The Reux prototype language and the live Business Simulator demo that proves it works.
              </p>
            </div>
            <AnimatedButton href="/projects" variant="secondary" className="mt-8 md:mt-0 hidden md:inline-flex">
              View All Projects
            </AnimatedButton>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <ProjectCard
              title="Business Simulator"
              description="A live demo where you model workforce, cost, and productivity scenarios, then compare forecasted outcomes. Powered by the Reux prototype engine."
              tags={["Live Demo", "Simulation", "Decision Logic"]}
              href="/simulator"
              featured={true}
            />
            <ProjectCard
              title="Reux Language"
              description="A prototype backend language for schemas, transactions, simulations, and decision logic. Data-aware by design, with generated TypeScript integration."
              tags={["Prototype", "Backend Language", "Simulation"]}
              href="/projects/reux"
              featured={false}
            />
          </div>
          
          <div className="mt-12 flex justify-center md:hidden">
            <AnimatedButton href="/projects" variant="secondary">
              View All Projects
            </AnimatedButton>
          </div>
        </div>
      </section>

      {/* Capabilities Section */}
      <section className="py-24 relative z-20 border-t border-white/5 bg-[#0A0A0A]/15 backdrop-blur-xl">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold tracking-tight mb-6">What We Build</h2>
            <p className="text-gray-400 max-w-2xl mx-auto">
              The Reuben ecosystem spans backend language design, simulation tooling, and developer infrastructure.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {[
              {
                title: "Language Design",
                description: "Reux: a prototype backend language for schemas, transactions, simulations, and decision logic.",
              },
              {
                title: "Simulation Products",
                description: "The Business Simulator lets operators model and compare operational scenarios before committing.",
              },
              {
                title: "Developer Tooling",
                description: "CLI, VS Code extension, generated TypeScript, and release preflight checks.",
              },
            ].map((item, index) => (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="glass-card p-8 rounded-2xl"
              >
                <h3 className="text-2xl font-bold text-white mb-4">{item.title}</h3>
                <p className="text-gray-400 leading-relaxed">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-32 relative z-20 overflow-hidden bg-[#0A0A0A]/15 backdrop-blur-xl">
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A] via-transparent to-[#0A0A0A] z-10 pointer-events-none" />
        <div className="absolute inset-0 flex items-center justify-center opacity-30">
          <div className="w-[800px] h-[800px] bg-[#00F0FF] rounded-full blur-[150px] mix-blend-screen opacity-20" />
          <div className="w-[600px] h-[600px] bg-[#8A2BE2] rounded-full blur-[120px] mix-blend-screen opacity-20 -translate-x-1/2" />
        </div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-20 text-center">
          <h2 className="text-4xl md:text-6xl font-bold tracking-tight mb-8">See It In Action</h2>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto mb-12">
            The Business Simulator is live. Model real operational decisions and see how Reux evaluates the outcomes.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <AnimatedButton href="/simulator" variant="primary">
              Open the Simulator
            </AnimatedButton>
            <AnimatedButton href="/docs" variant="secondary">
              Developer Docs
            </AnimatedButton>
          </div>
        </div>
      </section>
    </div>
  );
}
