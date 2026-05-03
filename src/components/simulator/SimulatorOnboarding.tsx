"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Cpu, TrendingUp, ShieldAlert, ArrowRight } from "lucide-react";

export function SimulatorOnboarding() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    const hasSeenOnboarding = window.sessionStorage.getItem("reux_sim_onboarding");
    if (!hasSeenOnboarding) {
      const id = window.setTimeout(() => setIsOpen(true), 0);
      return () => window.clearTimeout(id);
    }
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    window.sessionStorage.setItem("reux_sim_onboarding", "true");
  };

  return (
    <Dialog
      open={isOpen}
      onOpenChange={(open) => {
        if (open) {
          setIsOpen(true);
          return;
        }
        handleClose();
      }}
    >
      <DialogContent className="sm:max-w-md border-white/[0.06] bg-[#0A0A0C]">
        <DialogHeader>
          <div className="mx-auto w-12 h-12 rounded-xl bg-gradient-to-tr from-cyan-500/20 to-violet-500/20 flex items-center justify-center mb-4 border border-white/[0.08]">
            <Cpu size={24} className="text-cyan-400" />
          </div>
          <DialogTitle className="text-xl text-center text-white">Welcome to the Business Simulator</DialogTitle>
          <DialogDescription className="text-center text-gray-400 pt-2">
            This public demo is safe to explore. It uses the <strong>Reux</strong> backend engine to model operational decisions and surface risk before you commit to them.
          </DialogDescription>
        </DialogHeader>
        
        <div className="py-4 space-y-4">
          <div className="flex gap-4 items-start">
            <div className="p-2 rounded-lg bg-emerald-500/10 shrink-0">
              <TrendingUp size={18} className="text-emerald-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Model Decisions</h4>
              <p className="text-xs text-gray-400 mt-1">
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
              <p className="text-xs text-gray-400 mt-1">
                The engine evaluates risk and margin across multiple scenarios to recommend the safest path forward.
              </p>
            </div>
          </div>

          <div className="flex gap-4 items-start">
            <div className="p-2 rounded-lg bg-violet-500/10 shrink-0">
              <Cpu size={18} className="text-violet-400" />
            </div>
            <div>
              <h4 className="text-sm font-semibold text-white">Reux Transparency</h4>
              <p className="text-xs text-gray-400 mt-1">
                While this UI is standard web tech, Reux securely handles all data-aware simulation and decision logic in the backend. Look for the &quot;Reux Code&quot; panels to see exactly what runs under the hood.
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
