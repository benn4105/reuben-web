"use client";

import { motion } from "framer-motion";
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
            Reuben is a technology research and engineering company dedicated to solving the hardest problems in distributed systems, compiler design, and high-performance computing.
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
              We believe that the software infrastructure of the future should not be built on the fragile abstractions of the past. The exponential growth of data and compute demands a paradigm shift in how we write, compile, and execute code.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed mb-6">
              At Reuben, we are redesigning the computing stack from first principles. By bridging the gap between low-level performance and high-level ergonomics, we empower engineers to build systems that are safe, scalable, and blazingly fast.
            </p>
            <p className="text-gray-300 text-lg leading-relaxed">
              We aren't just building abstract research. We prove our technology by building real, high-leverage products—like our Business Simulation Engine—which demonstrates the raw power of our Reux programming language in production environments.
            </p>
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
              We are a small, elite team of compiler engineers, distributed systems researchers, and designers who believe in the power of focused, uncompromising execution.
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
