"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard,
  PlusCircle,
  ChevronLeft,
  ChevronRight,
  Cpu,
  Menu,
  X,
} from "lucide-react";

// shadcn / Radix components
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipTrigger,
  TooltipContent,
} from "@/components/ui/tooltip";

const navItems = [
  { href: "/simulator", label: "Dashboard", icon: LayoutDashboard },
  { href: "/simulator/new", label: "New Simulation", icon: PlusCircle },
];

interface SimulatorShellProps {
  children: React.ReactNode;
}

export default function SimulatorShell({ children }: SimulatorShellProps) {
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-[#060608]">
      {/* Mobile overlay */}
      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/60 lg:hidden"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={cn(
          "fixed lg:relative z-50 flex flex-col h-full border-r border-border/30 bg-sidebar transition-all duration-300",
          collapsed ? "w-16" : "w-56",
          mobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"
        )}
      >
        {/* Logo */}
        <div className="flex items-center gap-2.5 px-4 h-14 border-b border-border/30 shrink-0">
          <Link href="/" className="flex items-center gap-2.5 group min-w-0">
            <div className="w-7 h-7 rounded-md bg-gradient-to-tr from-cyan-500 to-violet-500 flex items-center justify-center shrink-0">
              <Cpu size={14} className="text-white" />
            </div>
            {!collapsed && (
              <div className="flex flex-col min-w-0">
                <span className="text-sm font-bold text-foreground tracking-tight leading-none">
                  Reux
                </span>
                <span className="text-[10px] text-muted-foreground/60 leading-none mt-0.5">
                  Simulation Engine
                </span>
              </div>
            )}
          </Link>
        </div>

        {/* Nav */}
        <nav className="flex-1 px-2 py-3 space-y-1 overflow-y-auto">
          {navItems.map(item => {
            const isActive =
              item.href === "/simulator"
                ? pathname === "/simulator"
                : pathname.startsWith(item.href);

            const navLink = (
              <Link
                key={item.href}
                href={item.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-muted-foreground hover:text-foreground hover:bg-sidebar-accent/50"
                )}
              >
                <item.icon size={18} className={isActive ? "text-cyan-400" : ""} />
                {!collapsed && <span>{item.label}</span>}
              </Link>
            );

            // Show tooltip when collapsed
            if (collapsed) {
              return (
                <Tooltip key={item.href}>
                  <TooltipTrigger asChild>{navLink}</TooltipTrigger>
                  <TooltipContent side="right">{item.label}</TooltipContent>
                </Tooltip>
              );
            }

            return navLink;
          })}
        </nav>

        {/* Collapse toggle (desktop) */}
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex items-center justify-center h-10 border-t border-border/30 text-muted-foreground/40 hover:text-muted-foreground transition-colors"
            >
              {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
            </button>
          </TooltipTrigger>
          <TooltipContent side="right">
            {collapsed ? "Expand sidebar" : "Collapse sidebar"}
          </TooltipContent>
        </Tooltip>
      </aside>

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 h-full">
        {/* Top bar */}
        <header className="flex items-center justify-between h-14 px-4 lg:px-6 border-b border-border/30 bg-sidebar/80 backdrop-blur-xl shrink-0">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setMobileOpen(!mobileOpen)}
              className="lg:hidden"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </Button>

            {/* Breadcrumb */}
            <nav className="flex items-center gap-1.5 text-sm">
              <Link href="/simulator" className="text-muted-foreground hover:text-foreground transition-colors">
                Simulator
              </Link>
              {pathname !== "/simulator" && (
                <>
                  <Separator orientation="vertical" className="h-4 mx-1 bg-border/20" />
                  <span className="text-foreground font-medium">
                    {pathname.includes("/new")
                      ? "New Simulation"
                      : pathname.includes("/compare")
                        ? "Compare"
                        : "Results"}
                  </span>
                </>
              )}
            </nav>
          </div>

          <div className="flex items-center gap-3">
            <Button asChild size="sm" className="gap-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white border-none hover:shadow-[0_0_20px_rgba(0,200,255,0.25)] transition-shadow">
              <Link href="/simulator/new">
                <PlusCircle size={14} />
                <span className="hidden sm:inline">New Simulation</span>
              </Link>
            </Button>
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto">
          <div className="p-4 lg:p-6 max-w-[1400px]">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
