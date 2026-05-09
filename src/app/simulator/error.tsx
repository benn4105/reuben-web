"use client";

import { useEffect } from "react";
import AnimatedButton from "@/components/ui/AnimatedButton";
import { AlertTriangle, RefreshCcw } from "lucide-react";

export default function SimulatorError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error("Simulator error:", error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center relative bg-[#0A0A0A] p-4">
      {/* Background Decor */}
      <div className="absolute top-1/4 -left-1/4 w-[600px] h-[600px] bg-rose-500/20 rounded-full blur-[150px] mix-blend-screen opacity-10 pointer-events-none" />
      <div className="absolute bottom-1/4 -right-1/4 w-[400px] h-[400px] bg-amber-500/20 rounded-full blur-[150px] mix-blend-screen opacity-10 pointer-events-none" />

      <div className="relative z-10 text-center max-w-lg w-full">
        <div className="mb-6 flex justify-center">
          <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/20 shadow-[0_0_40px_rgba(244,63,94,0.1)]">
            <AlertTriangle size={48} className="text-rose-400" />
          </div>
        </div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-white mb-4">
          Simulation Error
        </h1>
        
        <p className="text-gray-400 mb-6 text-sm md:text-base leading-relaxed">
          The simulator encountered an unexpected error. This usually happens if the connection to the Reux engine is lost or if invalid parameters were submitted.
        </p>

        <div className="bg-black/50 border border-rose-500/10 rounded-lg p-4 mb-8 text-left overflow-hidden">
          <p className="text-xs font-mono text-rose-400/80 truncate">
            {error.message || "An unknown error occurred"}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <button
            onClick={() => reset()}
            className="flex items-center gap-2 px-6 py-3 rounded-lg bg-white text-black text-sm font-semibold hover:bg-gray-200 transition-colors"
          >
            <RefreshCcw size={16} />
            Try again
          </button>
          <AnimatedButton href="/simulator" variant="secondary">
            Return to Dashboard
          </AnimatedButton>
        </div>
      </div>
    </div>
  );
}
