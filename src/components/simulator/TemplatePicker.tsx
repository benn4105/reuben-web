"use client";

import { cn } from "@/lib/utils";
import { SIMULATION_TEMPLATES, type SimulationTemplate } from "@/lib/simulation/templates";
import { ArrowRight } from "lucide-react";

interface TemplatePickerProps {
  onSelect: (template: SimulationTemplate) => void;
  selectedId?: string | null;
  className?: string;
}

const COLOR_MAP: Record<string, {
  border: string;
  activeBorder: string;
  bg: string;
  activeBg: string;
  text: string;
  badge: string;
}> = {
  cyan: {
    border: "border-white/[0.08] hover:border-cyan-500/30",
    activeBorder: "border-cyan-500/50 ring-1 ring-cyan-500/20",
    bg: "hover:bg-cyan-500/5",
    activeBg: "bg-cyan-500/10",
    text: "text-cyan-400",
    badge: "bg-cyan-500/10 text-cyan-400 border-cyan-500/20",
  },
  violet: {
    border: "border-white/[0.08] hover:border-violet-500/30",
    activeBorder: "border-violet-500/50 ring-1 ring-violet-500/20",
    bg: "hover:bg-violet-500/5",
    activeBg: "bg-violet-500/10",
    text: "text-violet-400",
    badge: "bg-violet-500/10 text-violet-400 border-violet-500/20",
  },
  amber: {
    border: "border-white/[0.08] hover:border-amber-500/30",
    activeBorder: "border-amber-500/50 ring-1 ring-amber-500/20",
    bg: "hover:bg-amber-500/5",
    activeBg: "bg-amber-500/10",
    text: "text-amber-400",
    badge: "bg-amber-500/10 text-amber-400 border-amber-500/20",
  },
  emerald: {
    border: "border-white/[0.08] hover:border-emerald-500/30",
    activeBorder: "border-emerald-500/50 ring-1 ring-emerald-500/20",
    bg: "hover:bg-emerald-500/5",
    activeBg: "bg-emerald-500/10",
    text: "text-emerald-400",
    badge: "bg-emerald-500/10 text-emerald-400 border-emerald-500/20",
  },
  rose: {
    border: "border-white/[0.08] hover:border-rose-500/30",
    activeBorder: "border-rose-500/50 ring-1 ring-rose-500/20",
    bg: "hover:bg-rose-500/5",
    activeBg: "bg-rose-500/10",
    text: "text-rose-400",
    badge: "bg-rose-500/10 text-rose-400 border-rose-500/20",
  },
};

export default function TemplatePicker({ onSelect, selectedId, className }: TemplatePickerProps) {
  return (
    <div className={cn("space-y-3", className)}>
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-sm font-semibold text-white">Start from a template</h3>
          <p className="text-[11px] text-gray-500 mt-0.5">
            {SIMULATION_TEMPLATES.length} industry scenarios with realistic data
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-4 gap-3">
        {SIMULATION_TEMPLATES.map((template) => {
          const colors = COLOR_MAP[template.color] || COLOR_MAP.cyan;
          const isActive = selectedId === template.id;

          return (
            <button
              key={template.id}
              onClick={() => onSelect(template)}
              className={cn(
                "text-left p-4 rounded-xl border transition-all duration-200 group relative",
                isActive
                  ? `${colors.activeBg} ${colors.activeBorder}`
                  : `${colors.border} bg-white/[0.02] ${colors.bg}`
              )}
            >
              <div className="flex items-start justify-between gap-2 mb-2">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-lg shrink-0">{template.icon}</span>
                  <h4 className="text-sm font-medium text-white truncate">{template.name}</h4>
                </div>
                {isActive && (
                  <span className={cn("shrink-0 text-[10px] font-semibold px-1.5 py-0.5 rounded border", colors.badge)}>
                    Selected
                  </span>
                )}
              </div>
              <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-3">
                {template.description}
              </p>
              <div className="flex items-center justify-between">
                <span className={cn("text-[10px] font-semibold uppercase tracking-wider", colors.text)}>
                  {template.industry}
                </span>
                <span className="text-[11px] text-gray-600">
                  {template.scenarios.length + 1} scenarios / {template.baseline.forecastWeeks}w
                </span>
              </div>
              {!isActive && (
                <div className="absolute inset-0 rounded-xl flex items-center justify-center bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                  <span className="flex items-center gap-1.5 text-sm font-semibold text-white">
                    Load Template <ArrowRight size={14} />
                  </span>
                </div>
              )}
            </button>
          );
        })}
      </div>

    </div>
  );
}
