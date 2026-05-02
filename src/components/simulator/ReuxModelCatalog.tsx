"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Activity, Database, ExternalLink, Layers3 } from "lucide-react";
import { hasLiveApi, listReuxSimulationModels } from "@/lib/simulation/api-client";
import type { ReuxSimulationMetadata } from "@/lib/simulation/types";
import { Button } from "@/components/ui/button";

function formatName(value: string): string {
  return value
    .replace(/[_-]+/g, " ")
    .replace(/\b\w/g, (match) => match.toUpperCase());
}

export default function ReuxModelCatalog() {
  const [models, setModels] = useState<ReuxSimulationMetadata[]>([]);
  const [loading, setLoading] = useState(hasLiveApi());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let active = true;

    async function loadCatalog() {
      if (!hasLiveApi()) {
        setLoading(false);
        return;
      }

      try {
        setError(null);
        const response = await listReuxSimulationModels();
        if (!active) return;
        setModels(response.simulations);
      } catch (err) {
        if (!active) return;
        setError(err instanceof Error ? err.message : "Could not load Reux model catalog");
      } finally {
        if (active) setLoading(false);
      }
    }

    loadCatalog();

    return () => {
      active = false;
    };
  }, []);

  if (!hasLiveApi()) {
    return (
      <section className="rounded-lg border border-amber-500/20 bg-amber-500/[0.04] p-5">
        <div className="flex items-start gap-3">
          <Database className="mt-0.5 h-5 w-5 shrink-0 text-amber-300" />
          <div>
            <h2 className="text-sm font-semibold text-white">Live Reux models unavailable</h2>
            <p className="mt-1 text-sm leading-relaxed text-gray-400">
              Configure `NEXT_PUBLIC_REUX_DEMO_URL` to show the hosted model catalog and run the public simulator against Railway.
            </p>
          </div>
        </div>
      </section>
    );
  }

  return (
    <section className="rounded-lg border border-white/[0.08] bg-white/[0.02] p-5">
      <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <div className="mb-2 inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-cyan-300">
            <Layers3 className="h-4 w-4" />
            Reux Model Catalog
          </div>
          <h2 className="text-lg font-semibold text-white">Executable models from the live backend</h2>
          <p className="mt-1 max-w-2xl text-sm leading-relaxed text-gray-500">
            The Business Simulator uses `operations_decision`; the same public API also exposes PLOS and workforce models.
          </p>
        </div>
        <Button asChild variant="outline" size="sm" className="border-white/[0.1] bg-transparent text-gray-300 hover:text-white">
          <Link href="/projects/reux/demo">
            Live Pilot
            <ExternalLink className="ml-2 h-3.5 w-3.5" />
          </Link>
        </Button>
      </div>

      {loading ? (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {Array.from({ length: 5 }).map((_, index) => (
            <div key={index} className="h-28 animate-pulse rounded-lg border border-white/[0.06] bg-white/[0.03]" />
          ))}
        </div>
      ) : error ? (
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/[0.04] p-4 text-sm text-rose-300">
          {error}
        </div>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2 xl:grid-cols-5">
          {models.map((model) => (
            <div key={model.name} className="rounded-lg border border-white/[0.07] bg-[#08080A] p-4">
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="truncate text-sm font-semibold text-white">{formatName(model.name)}</span>
                <Activity className="h-4 w-4 shrink-0 text-cyan-300" />
              </div>
              <div className="space-y-2 text-xs text-gray-500">
                <div className="flex items-center justify-between gap-2">
                  <span>Domain</span>
                  <span className="truncate text-gray-300">{model.dimensions.domain ?? "custom"}</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span>Forecast</span>
                  <span className="text-gray-300">{model.forecast.periods} {model.forecast.unit}s</span>
                </div>
                <div className="flex items-center justify-between gap-2">
                  <span>Metrics</span>
                  <span className="text-gray-300">{model.metrics.length}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
