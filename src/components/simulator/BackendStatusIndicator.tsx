"use client";

import { useEffect, useState } from "react";
import { Server, WifiOff, HardDrive } from "lucide-react";
import { cn } from "@/lib/utils";
import { hasLiveApi } from "@/lib/simulation/api-client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type BackendStatus = "live" | "mock" | "unavailable";

export function BackendStatusIndicator() {
  const [status, setStatus] = useState<BackendStatus>("mock");

  useEffect(() => {
    setStatus(hasLiveApi() ? "live" : "mock");
  }, []);

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

  if (status === "unavailable") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-400 text-xs font-medium cursor-help transition-colors hover:bg-rose-500/20">
            <WifiOff size={12} />
            <span className="hidden sm:inline">Backend Offline</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">Backend unavailable. Using local fallback.</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  // mock
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
