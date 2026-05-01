"use client";

import { Server, HardDrive } from "lucide-react";
import { hasLiveApi } from "@/lib/simulation/api-client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type BackendStatus = "live" | "mock";

export function BackendStatusIndicator() {
  const status: BackendStatus = hasLiveApi() ? "live" : "mock";

  if (status === "live") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 text-xs font-medium cursor-help transition-colors hover:bg-emerald-500/20">
            <Server size={12} />
            <span className="hidden sm:inline">Live Connected</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Connected to real Reux backend</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-medium cursor-help transition-colors hover:bg-amber-500/20">
          <HardDrive size={12} />
          <span className="hidden sm:inline">Local Mock</span>
        </div>
      </TooltipTrigger>
      <TooltipContent>
        <p className="text-xs">No backend configured. Falling back to mock data.</p>
      </TooltipContent>
    </Tooltip>
  );
}
