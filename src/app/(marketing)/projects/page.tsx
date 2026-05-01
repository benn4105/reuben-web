"use client";

import { motion } from "framer-motion";
import ProjectCard from "@/components/ui/ProjectCard";

const projects = [
  {
    title: "Reux",
    description: "A data-aware backend language for schemas, transactions, migrations, simulations, forecasts, and decision logic. Reux is prototype-complete and moving toward public beta.",
    tags: ["Programming Language", "Simulation", "Backend"],
    href: "/projects/reux",
    featured: true,
  },
  {
    title: "PLOS",
    description: "Personal Life Operating System. A future personal simulation platform for finances, habits, goals, health, career, and time decisions, with Reux planned as the simulation layer underneath.",
    tags: ["Personal Simulation", "Planning", "Reux"],
    href: "#",
    featured: false,
  },
  {
    title: "Business Simulation Engine",
    description: "A real-time decision console for modeling operational, workforce, productivity, cost, margin, and risk scenarios before a business commits to a change.",
    tags: ["Operations", "Forecasting", "Enterprise"],
    href: "#",
    featured: false,
  },
  {
    title: "Reux Live Demo",
    description: "Hosted commerce and logistics pilots showing Reux-generated database workflows, transactions, state changes, and outbox processing through a public browser demo.",
    tags: ["Public Demo", "PostgreSQL", "Transactions"],
    href: "/projects/reux/demo",
    featured: false,
  },
];

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
            Explore the foundational technologies and tools we build at Reuben. 
            The current ecosystem centers on Reux, simulation-driven products, and practical demos that prove the language in real workflows.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={project.featured ? "md:col-span-2" : "col-span-1"}
            >
              <ProjectCard {...project} />
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}
