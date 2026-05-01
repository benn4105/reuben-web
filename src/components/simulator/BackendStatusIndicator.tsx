"use client";

import { useEffect, useState } from "react";
import { AlertTriangle, HardDrive, Loader2, Server } from "lucide-react";
import { checkLiveApiStatus, hasLiveApi, type LiveApiStatus } from "@/lib/simulation/api-client";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export type BackendStatus = "checking" | "live" | "degraded" | "mock";

export function BackendStatusIndicator() {
  const [status, setStatus] = useState<BackendStatus>(hasLiveApi() ? "checking" : "mock");
  const [message, setMessage] = useState(
    hasLiveApi()
      ? "Checking the live Reux backend..."
      : "No backend configured. Falling back to mock data."
  );

  useEffect(() => {
    let active = true;
    if (!hasLiveApi()) return;

    checkLiveApiStatus().then((result: LiveApiStatus) => {
      if (!active) return;
      setStatus(result.ok ? "live" : "degraded");
      setMessage(result.message);
    });

    return () => {
      active = false;
    };
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
          <p className="text-xs">{message}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  if (status === "checking") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-cyan-500/10 border border-cyan-500/20 text-cyan-300 text-xs font-medium cursor-help transition-colors hover:bg-cyan-500/20">
            <Loader2 size={12} className="animate-spin" />
            <span className="hidden sm:inline">Checking Backend</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="text-xs">{message}</p>
        </TooltipContent>
      </Tooltip>
    );
  }

  if (status === "degraded") {
    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <div className="flex items-center gap-1.5 px-2 py-1 rounded-md bg-rose-500/10 border border-rose-500/20 text-rose-300 text-xs font-medium cursor-help transition-colors hover:bg-rose-500/20">
            <AlertTriangle size={12} />
            <span className="hidden sm:inline">Backend Fallback</span>
          </div>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-64 text-xs">{message}</p>
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
        <p className="text-xs">{message}</p>
      </TooltipContent>
    </Tooltip>
  );
}
