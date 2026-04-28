"use client";

import { motion } from "framer-motion";
import ProjectCard from "@/components/ui/ProjectCard";

const projects = [
  {
    title: "Reux",
    description: "A new paradigm for structured computing. Reux offers uncompromising performance with a syntax designed for humans and systems alike. Built-in database integration and zero-cost abstractions make it the perfect tool for next-generation infrastructure.",
    tags: ["Programming Language", "Compilers", "Systems"],
    href: "/projects/reux",
    featured: true,
  },
  {
    title: "Aura",
    description: "A lightweight, distributed key-value store optimized for ultra-low latency reads. Built entirely in Reux, Aura demonstrates the language's capabilities in high-concurrency environments.",
    tags: ["Database", "Distributed Systems", "Reux"],
    href: "#",
    featured: false,
  },
  {
    title: "Nexus",
    description: "A modern build system and package manager for the Reux ecosystem. Nexus handles dependency resolution, reproducible builds, and artifact caching with minimal overhead.",
    tags: ["Tooling", "Build System", "CLI"],
    href: "#",
    featured: false,
  },
  {
    title: "Prism",
    description: "A highly-optimized graphics rendering engine designed for scientific visualization and data analysis. Leverages GPU compute shaders for real-time rendering of massive datasets.",
    tags: ["Graphics", "Compute", "C++"],
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
            Explore the foundational technologies and tools we build at Reuben. 
            From languages to distributed systems, our projects define the bleeding edge.
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
