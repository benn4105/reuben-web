"use client";

import { motion } from "framer-motion";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { ReactNode } from "react";

interface AnimatedButtonProps {
  children: ReactNode;
  href?: string;
  onClick?: () => void;
  variant?: "primary" | "secondary";
  className?: string;
  external?: boolean;
}

export default function AnimatedButton({
  children,
  href,
  onClick,
  variant = "primary",
  className,
  external = false,
}: AnimatedButtonProps) {
  const baseClasses = "relative inline-flex items-center justify-center px-8 py-3 font-semibold rounded-full overflow-hidden transition-all duration-300";
  
  const variants = {
    primary: "bg-white text-black hover:scale-105 hover:shadow-[0_0_30px_rgba(255,255,255,0.3)]",
    secondary: "glass text-white hover:bg-white/10 border border-white/20 hover:border-[#00F0FF]/50 hover:shadow-[0_0_20px_rgba(0,240,255,0.2)]",
  };

  const Component = href ? Link : "button";

  return (
    <motion.div whileTap={{ scale: 0.95 }} className="inline-block">

      <Component
        href={href || ""}
        onClick={onClick}
        target={external ? "_blank" : undefined}
        rel={external ? "noreferrer" : undefined}
        className={cn(baseClasses, variants[variant], className)}
      >
        <span className="relative z-10">{children}</span>
        {variant === "primary" && (
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-black/10 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite]" />
        )}
      </Component>
    </motion.div>
  );
}
