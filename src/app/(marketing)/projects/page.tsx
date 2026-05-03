"use client";

import { motion } from "framer-motion";
import ProjectCard from "@/components/ui/ProjectCard";

const liveProjects = [
  {
    title: "Business Simulator",
    description: "A live public product demo for testing staffing, pricing, capacity, and process changes before committing real money. Reux powers the forecast, recommendation, and transparency layer.",
    tags: ["Live Demo", "Sellable Prototype", "Decision Logic"],
    href: "/simulator",
    featured: true,
  },
];

const prototypeProjects = [
  {
    title: "Reux Language",
    description: "A prototype backend language for schemas, transactions, migrations, simulations, and decision logic. Its first public proof point is the Business Simulator.",
    tags: ["Prototype Complete", "Backend Language", "Simulation"],
    href: "/projects/reux",
    featured: false,
  },
  {
    title: "Reux Live Demos",
    description: "Hosted commerce, logistics, and Business Simulator pilots showing Reux-generated workflows, transactions, queue health, and outbox processing with guided tester flows.",
    tags: ["Public Demo", "PostgreSQL", "Simulator"],
    href: "/projects/reux/demo",
    featured: false,
  },
];

const plannedProjects = [
  {
    title: "PLOS",
    description: "Personal Life Operating System. A planned personal simulation platform for finances, habits, goals, and career decisions, with Reux as the simulation layer.",
    tags: ["Planned", "Personal Simulation", "Future"],
    href: "/projects/plos",
    featured: false,
  },
];

function StatusBadge({ status, color }: { status: string; color: string }) {
  const colorMap: Record<string, string> = {
    emerald: "bg-emerald-500/10 border-emerald-500/30 text-emerald-400",
    cyan: "bg-cyan-500/10 border-cyan-500/30 text-cyan-400",
    gray: "bg-white/5 border-white/10 text-gray-400",
  };
  return (
    <span className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full border text-xs font-semibold uppercase tracking-wider ${colorMap[color]}`}>
      {color === "emerald" && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />}
      {status}
    </span>
  );
}

export default function ProjectsPage() {
  return (
    <div className="pt-32 pb-24 min-h-screen">
      <div className="container mx-auto px-4 md:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-3xl mb-16"
        >
          <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">Our Work</h1>
          <p className="text-xl text-gray-400">
            The Reuben ecosystem spans a prototype backend language, simulation-driven products, and interactive demos. Here is what is live, what is prototype-complete, and what is planned.
          </p>
        </motion.div>

        {/* Live */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <StatusBadge status="Live" color="emerald" />
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Available now</h2>
          </div>
          <div className="grid grid-cols-1 gap-8">
            {liveProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Prototype Complete */}
        <section className="mb-16">
          <div className="flex items-center gap-3 mb-6">
            <StatusBadge status="Prototype Complete" color="cyan" />
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Foundation & pilots</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {prototypeProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </div>
        </section>

        {/* Planned */}
        <section>
          <div className="flex items-center gap-3 mb-6">
            <StatusBadge status="Planned" color="gray" />
            <h2 className="text-sm font-semibold text-gray-500 uppercase tracking-wider">Future products</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {plannedProjects.map((project, index) => (
              <motion.div
                key={project.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 + index * 0.1 }}
              >
                <ProjectCard {...project} />
              </motion.div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
