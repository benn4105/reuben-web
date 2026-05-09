"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import GithubIcon from "@/components/ui/GithubIcon";
import { cn } from "@/lib/utils";

const links = [
  { href: "/", label: "Home" },
  { href: "/projects", label: "Projects" },
  { href: "/simulator", label: "Simulator" },
  { href: "/founder-pilot", label: "Founder Pilot" },
  { href: "/docs", label: "Developer Preview" },
  { href: "/about", label: "About" },
];

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <header
      className={cn(
        "fixed top-0 w-full z-50 transition-all duration-300",
        isScrolled
          ? "bg-[#0A0A0A]/85 backdrop-blur-xl border-b border-white/[0.06] py-4"
          : "bg-transparent py-6"
      )}
    >
      <div className="container mx-auto px-4 md:px-8 flex items-center justify-between">
        {/* Logo */}
        <Link href="/" className="relative z-10 flex items-center space-x-2 group">
          <div className="w-8 h-8 rounded bg-gradient-to-tr from-[#00F0FF] to-[#8A2BE2] flex items-center justify-center">
            <span className="font-bold text-white text-lg leading-none">R</span>
          </div>
          <span className="font-bold text-xl tracking-tight text-white group-hover:text-glow transition-all duration-300">
            Reuben
          </span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors hover:text-[#00F0FF]",
                pathname === link.href ? "text-white" : "text-gray-400"
              )}
            >
              {link.label}
            </Link>
          ))}
          <div className="w-px h-4 bg-gray-800" />
          <Link
            href="https://github.com/benn4105/Reux"
            target="_blank"
            rel="noopener noreferrer"
            className="text-gray-400 hover:text-white transition-colors flex items-center gap-2 text-sm font-medium"
          >
            <GithubIcon size={18} />
            <span>GitHub</span>
          </Link>
          <Link
            href="/founder-pilot"
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-500 text-white text-sm font-semibold hover:shadow-[0_0_20px_rgba(0,200,255,0.25)] transition-shadow"
          >
            Request Pilot
          </Link>
        </nav>

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden relative z-10 text-gray-300 hover:text-white"
          onClick={() => setIsOpen(!isOpen)}
          aria-label={isOpen ? "Close menu" : "Open menu"}
          aria-expanded={isOpen}
        >
          {isOpen ? <X size={24} /> : <Menu size={24} />}
        </button>

        {/* Mobile Navigation */}
        <motion.div
          initial={false}
          animate={isOpen ? { opacity: 1, y: 0 } : { opacity: 0, y: -20, pointerEvents: "none" }}
          className="absolute top-0 left-0 w-full h-screen bg-[#0A0A0A]/95 backdrop-blur-xl flex flex-col items-center justify-center space-y-8 md:hidden"
        >
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              onClick={() => setIsOpen(false)}
              className={cn(
                "text-2xl font-bold transition-colors",
                pathname === link.href ? "text-white" : "text-gray-400"
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="https://github.com/benn4105/Reux"
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => setIsOpen(false)}
            className="text-2xl font-bold text-gray-400 flex items-center gap-3"
          >
            <GithubIcon size={24} />
            <span>GitHub</span>
          </Link>
        </motion.div>
      </div>
    </header>
  );
}
