"use client";

import { motion } from "framer-motion";
import ProjectCard from "@/components/ui/ProjectCard";

const projects = [
  {
    title: "Business Simulator",
    description: "A live public demo for modeling workforce, cost, and productivity scenarios. Compare forecasted outcomes and see the Reux prototype engine evaluate each path.",
    tags: ["Live Demo", "Simulation", "Decision Logic"],
    href: "/simulator",
    featured: true,
  },
  {
    title: "Reux Language",
    description: "A prototype backend language for schemas, transactions, migrations, simulations, and decision logic. Reux is prototype-complete and moving toward public beta.",
    tags: ["Prototype", "Backend Language", "Simulation"],
    href: "/projects/reux",
    featured: false,
  },
  {
    title: "Reux Live Demos",
    description: "Hosted commerce and logistics pilots showing Reux-generated database workflows, transactions, state changes, and outbox processing through a public browser demo.",
    tags: ["Public Demo", "PostgreSQL", "Transactions"],
    href: "/projects/reux/demo",
    featured: false,
  },
  {
    title: "PLOS",
    description: "Personal Life Operating System. A planned personal simulation platform for finances, habits, goals, and career decisions, with Reux as the simulation layer.",
    tags: ["Planned", "Personal Simulation", "Reux"],
    href: "#",
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
            The current ecosystem centers on Reux, simulation-driven products, and interactive demos that validate the language in real workflows.
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
