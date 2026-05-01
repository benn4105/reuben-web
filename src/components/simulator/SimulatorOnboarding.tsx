"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Cpu, TrendingUp, ShieldAlert, ArrowRight } from "lucide-react";

export function SimulatorOnboarding() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Only show once per session or use localStorage for real persistence
    const hasSeenOnboarding = sessionStorage.getItem("reux_sim_onboarding");
    if (!hasSeenOnboarding) {
      const id = window.setTimeout(() => setIsOpen(true), 0);
      return () => window.clearTimeout(id);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    sessionStorage.setItem("reux_sim_onboarding", "true");
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md border-white/[0.06] bg-[#0A0A0C]">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 flex items-center justify-center mb-4 border border-white/[0.08]">
            <Cpu size={24} className="text-cyan-400" />
          </div>
          <DialogTitle className="text-xl text-center text-white">Welcome to the Business Simulator</DialogTitle>
          <DialogDescription className="text-center text-gray-400 pt-2">
            This interactive demo showcases the power of the <strong>Reux</strong> programming language in a real-world scenario.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex gap-4 items-start">
            <div className="p-2 rounded-lg bg-emerald-500/10 shrink-0">
              <TrendingUp size={18} className="text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Model Decisions</h4>
              <p className="text-xs text-gray-500 mt-1">
                Change assumptions like hiring or productivity to see how they impact your bottom line weeks into the future.
              </p>
            </div>
          </div>
          
          <div className="flex gap-4 items-start">
            <div className="p-2 rounded-lg bg-rose-500/10 shrink-0">
              <ShieldAlert size={18} className="text-rose-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Compare Scenarios</h4>
              <p className="text-xs text-gray-500 mt-1">
                The engine evaluates risk and margin across multiple scenarios to recommend the safest path forward.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-2 rounded-lg bg-violet-500/10 shrink-0">
              <Cpu size={18} className="text-violet-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Powered by Reux</h4>
              <p className="text-xs text-gray-500 mt-1">
                Behind the scenes, the Reux language handles the complex forecasting algorithms and decision logic seamlessly.
              </p>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-stretch">
          <Button onClick={handleClose} className="w-full gap-2 bg-white text-black hover:bg-gray-200">
            Start Exploring <ArrowRight size={16} />
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
