"use client";

import { motion } from "framer-motion";
import { Terminal, Cpu, Database, Zap } from "lucide-react";
import AnimatedButton from "@/components/ui/AnimatedButton";

const codeSnippet = `// Reux - High Performance HTTP Server Example
import std::net::http
import std::db::postgres

fn main() -> Result<(), Error> {
    let db = postgres::connect("postgresql://localhost/reux_db")?
    
    let server = http::Server::new("0.0.0.0:8080")
    
    // Zero-cost routing with pattern matching
    server.route("GET", "/users/:id", |req, res| {
        let id: u64 = req.params["id"].parse()?
        
        // Native database integration
        let user = db.query("SELECT * FROM users WHERE id = ?", id).first()?
        
        res.json(user)
    })
    
    println!("Server running on port 8080")
    server.start()
}
`;

export default function ReuxPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-[#8A2BE2] rounded-full blur-[150px] mix-blend-screen opacity-10 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-[#00F0FF] rounded-full blur-[150px] mix-blend-screen opacity-10 pointer-events-none" />

      <div className="container mx-auto px-4 md:px-8 relative z-10">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto text-center mb-24"
        >
          <div className="inline-flex items-center space-x-2 glass px-4 py-2 rounded-full mb-8">
            <span className="text-sm font-medium tracking-wide text-[#00F0FF] uppercase">
              v1.0.0 Release Candidate
            </span>
          </div>
          <h1 className="text-5xl md:text-7xl font-black tracking-tighter mb-6">
            Reux Programming Language
          </h1>
          <p className="text-2xl md:text-3xl text-gray-400 font-light mb-10">
            A new paradigm for structured computing.
          </p>
          <div className="flex justify-center gap-4">
            <AnimatedButton href="https://github.com/reuben/reux" variant="primary">
              View on GitHub
            </AnimatedButton>
            <AnimatedButton href="#" variant="secondary">
              Read the Docs
            </AnimatedButton>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 mb-24 items-center">
          {/* What is Reux */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
          >
            <h2 className="text-3xl font-bold mb-6">Built for the Modern Web</h2>
            <p className="text-gray-400 text-lg leading-relaxed mb-6">
              Reux was designed from the ground up to address the complexities of modern backend engineering. It combines the safety and performance of systems languages with the developer ergonomics of high-level scripting languages.
            </p>
            <p className="text-gray-400 text-lg leading-relaxed">
              With built-in native constructs for concurrent execution, database operations, and state management, Reux eliminates entire categories of boilerplate code.
            </p>
          </motion.div>

          {/* Code Preview */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8 }}
            className="rounded-xl overflow-hidden glass border border-white/10 shadow-2xl relative group"
          >
            <div className="flex items-center px-4 py-3 border-b border-white/5 bg-black/50">
              <div className="flex space-x-2">
                <div className="w-3 h-3 rounded-full bg-red-500/80" />
                <div className="w-3 h-3 rounded-full bg-yellow-500/80" />
                <div className="w-3 h-3 rounded-full bg-green-500/80" />
              </div>
              <div className="ml-4 text-xs text-gray-500 font-mono">main.rx</div>
            </div>
            <div className="p-6 bg-[#0A0A0A]/80 overflow-x-auto relative">
              {/* Optional glowing effect behind code */}
              <div className="absolute inset-0 bg-gradient-to-br from-[#00F0FF]/5 to-[#8A2BE2]/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              <pre className="font-mono text-sm leading-relaxed text-gray-300 relative z-10">
                <code dangerouslySetInnerHTML={{
                  __html: codeSnippet
                    .replace(/import/g, '<span class="text-pink-400">import</span>')
                    .replace(/fn /g, '<span class="text-blue-400">fn </span>')
                    .replace(/let /g, '<span class="text-blue-400">let </span>')
                    .replace(/Result/g, '<span class="text-yellow-300">Result</span>')
                    .replace(/Error/g, '<span class="text-yellow-300">Error</span>')
                    .replace(/main/g, '<span class="text-green-400">main</span>')
                    .replace(/"(.*?)"/g, '<span class="text-yellow-200">"$1"</span>')
                    .replace(/\/\/(.*)/g, '<span class="text-gray-500">//$1</span>')
                }} />
              </pre>
            </div>
          </motion.div>
        </div>

        {/* Features Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.8 }}
        >
          <h2 className="text-3xl font-bold mb-12 text-center">Key Features</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[
              {
                icon: <Zap className="w-8 h-8 text-[#00F0FF] mb-4" />,
                title: "Zero-Cost Abstractions",
                description: "High-level abstractions compile down to heavily optimized machine code.",
              },
              {
                icon: <Database className="w-8 h-8 text-[#8A2BE2] mb-4" />,
                title: "Native SQL Integration",
                description: "Write type-safe queries directly within your application code.",
              },
              {
                icon: <Cpu className="w-8 h-8 text-[#00F0FF] mb-4" />,
                title: "Fearless Concurrency",
                description: "Actor-based concurrency model prevents data races at compile time.",
              },
              {
                icon: <Terminal className="w-8 h-8 text-[#8A2BE2] mb-4" />,
                title: "Incredible Tooling",
                description: "Formatter, linter, and language server built directly into the compiler.",
              },
            ].map((feature, i) => (
              <div key={i} className="glass-card p-6 rounded-xl hover:-translate-y-2 transition-transform duration-300">
                {feature.icon}
                <h3 className="text-xl font-bold text-white mb-2">{feature.title}</h3>
                <p className="text-gray-400 text-sm leading-relaxed">{feature.description}</p>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
