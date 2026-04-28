"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { cn } from "@/lib/utils";

interface ProjectCardProps {
  title: string;
  description: string;
  tags: string[];
  href: string;
  featured?: boolean;
}

export default function ProjectCard({
  title,
  description,
  tags,
  href,
  featured = false,
}: ProjectCardProps) {
  return (
    <motion.div
      whileHover={{ y: -5 }}
      className={cn(
        "group relative block h-full overflow-hidden rounded-2xl p-px transition-all duration-300",
        featured ? "bg-gradient-to-br from-[#00F0FF] to-[#8A2BE2]" : "bg-white/10 hover:bg-white/20"
      )}
    >
      <Link href={href} className="relative z-10 flex h-full flex-col justify-between bg-[#0A0A0A] p-8 rounded-[15px] transition-colors">
        {featured && (
          <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-[#8A2BE2]/20 to-transparent blur-2xl" />
        )}
        
        <div className="relative z-20">
          <div className="flex justify-between items-start mb-4">
            <h3 className={cn("font-bold tracking-tight text-white", featured ? "text-3xl" : "text-xl")}>
              {title}
            </h3>
            <div className="p-2 rounded-full glass opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1 group-hover:-translate-y-1">
              <ArrowUpRight size={20} className="text-white" />
            </div>
          </div>
          <p className="text-gray-400 leading-relaxed mb-8">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-auto relative z-20">
          {tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-xs font-medium text-gray-300 glass rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </Link>
    </motion.div>
  );
}
