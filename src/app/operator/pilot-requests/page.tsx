"use client";

import type { ReactNode } from "react";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, ClipboardList, ExternalLink, KeyRound, Loader2, Mail, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_REUX_DEMO_URL?.replace(/\/$/, "") ?? "";
const TOKEN_STORAGE_KEY = "reuben_operator_token";

interface PilotRequestSummary {
  id: string;
  receivedAt: string;
  name: string;
  email: string;
  company?: string;
  role?: string;
  phone?: string;
  decision: string;
  sourceRunId?: string;
  pageUrl?: string;
  deliveryStatus?: string;
  deliveryChannel?: string;
  providerId?: string;
  fallbackEmail?: string;
  storage?: string;
  persistenceWarning?: string;
}

interface PilotRequestDetail {
  request: PilotRequestSummary & {
    delivery?: Record<string, unknown>;
  };
}

type Status = "idle" | "loading" | "ready" | "error";

export default function PilotRequestsPage() {
  const [token, setToken] = useState(() =>
    typeof window === "undefined" ? "" : window.sessionStorage.getItem(TOKEN_STORAGE_KEY) ?? "",
  );
  const [status, setStatus] = useState<Status>("idle");
  const [error, setError] = useState("");
  const [requests, setRequests] = useState<PilotRequestSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<PilotRequestDetail["request"] | null>(null);
  const [detailStatus, setDetailStatus] = useState<Status>("idle");

  const selectedSummary = useMemo(
    () => requests.find((request) => request.id === selectedId) ?? null,
    [requests, selectedId],
  );

  async function loadRequests(nextToken = token) {
    if (!API_BASE_URL) {
      setStatus("error");
      setError("NEXT_PUBLIC_REUX_DEMO_URL is not configured for this deployment.");
      return;
    }
    if (!nextToken.trim()) {
      setStatus("error");
      setError("Enter the Railway demo admin token first.");
      return;
    }

    setStatus("loading");
    setError("");
    window.sessionStorage.setItem(TOKEN_STORAGE_KEY, nextToken.trim());

    try {
      const response = await fetch(`${API_BASE_URL}/api/pilot-requests?limit=100`, {
        headers: {
          "x-reux-demo-token": nextToken.trim(),
          accept: "application/json",
        },
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(body.message || body.error || `Pilot request list failed with ${response.status}`);
      }

      const nextRequests: PilotRequestSummary[] = Array.isArray(body.requests) ? body.requests : [];
      setRequests(nextRequests);
      setStatus("ready");
      const nextSelected = selectedId && nextRequests.some((request) => request.id === selectedId)
        ? selectedId
        : nextRequests[0]?.id ?? null;
      setSelectedId(nextSelected);
      if (nextSelected) {
        void loadDetail(nextSelected, nextToken.trim());
      } else {
        setSelected(null);
      }
    } catch (loadError) {
      setStatus("error");
      setError(loadError instanceof Error ? loadError.message : "Could not load pilot requests.");
    }
  }

  async function loadDetail(id: string, nextToken = token) {
    if (!nextToken.trim()) return;

    setSelectedId(id);
    setDetailStatus("loading");
    try {
      const response = await fetch(`${API_BASE_URL}/api/pilot-requests/${encodeURIComponent(id)}`, {
        headers: {
          "x-reux-demo-token": nextToken.trim(),
          accept: "application/json",
        },
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(body.message || body.error || `Pilot request detail failed with ${response.status}`);
      }
      setSelected(body.request ?? null);
      setDetailStatus("ready");
    } catch (detailError) {
      setSelected(null);
      setDetailStatus("error");
      setError(detailError instanceof Error ? detailError.message : "Could not load pilot request detail.");
    }
  }

  return (
    <div className="min-h-screen bg-[#060608] px-4 py-8 text-white md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-6">
        <header className="flex flex-col gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.03] p-5 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/simulator" className="mb-4 inline-flex items-center gap-2 text-xs font-medium text-cyan-300 hover:text-cyan-200">
              <ArrowUpRight className="h-3.5 w-3.5 rotate-180" />
              Back to simulator
            </Link>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-200">
              <ClipboardList className="h-3.5 w-3.5" />
              Operator Intake
            </div>
            <h1 className="text-3xl font-bold tracking-tight">Founder Pilot Requests</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-gray-400">
              Review Business Simulator pilot leads submitted through the Reuben site. This page reads the Railway backend and requires the demo admin token.
            </p>
          </div>

          <form
            className="grid gap-2 sm:min-w-[420px]"
            onSubmit={(event) => {
              event.preventDefault();
              void loadRequests();
            }}
          >
            <label className="text-xs font-semibold uppercase tracking-wider text-gray-400">Admin token</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                <Input
                  value={token}
                  onChange={(event) => setToken(event.target.value)}
                  type="password"
                  placeholder="Railway demo admin token"
                  className="border-white/10 bg-black/40 pl-9 text-white placeholder:text-gray-600"
                />
              </div>
              <Button type="submit" disabled={status === "loading"} className="gap-2 bg-white text-black hover:bg-gray-200">
                {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Load
              </Button>
            </div>
          </form>
        </header>

        {error && (
          <div className="rounded-xl border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            {error}
          </div>
        )}

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.03]">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold">Requests</h2>
                <p className="text-xs text-gray-500">{requests.length} loaded</p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => void loadRequests()}
                disabled={status === "loading" || !token}
                className="gap-2 border-white/[0.08] text-gray-300 hover:text-white"
              >
                <RefreshCw className={cn("h-3.5 w-3.5", status === "loading" && "animate-spin")} />
                Refresh
              </Button>
            </div>

            <div className="max-h-[68vh] overflow-y-auto p-2">
              {status === "idle" ? (
                <EmptyList text="Enter the admin token to load pilot requests." />
              ) : status === "loading" ? (
                <EmptyList text="Loading requests..." />
              ) : requests.length === 0 ? (
                <EmptyList text="No pilot requests found yet." />
              ) : (
                <div className="grid gap-2">
                  {requests.map((request) => (
                    <button
                      key={request.id}
                      type="button"
                      onClick={() => void loadDetail(request.id)}
                      className={cn(
                        "rounded-xl border p-4 text-left transition-colors",
                        selectedId === request.id
                          ? "border-cyan-500/40 bg-cyan-500/10"
                          : "border-white/[0.06] bg-black/20 hover:border-white/[0.14] hover:bg-white/[0.04]",
                      )}
                    >
                      <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-semibold text-white">{request.name}</p>
                          <p className="truncate text-xs text-gray-500">{request.email}</p>
                        </div>
                        <span className="shrink-0 rounded-full border border-white/[0.08] bg-white/[0.04] px-2 py-0.5 text-[10px] uppercase tracking-wider text-gray-400">
                          {request.deliveryStatus ?? "unknown"}
                        </span>
                      </div>
                      <p className="mt-3 line-clamp-2 text-xs leading-relaxed text-gray-400">{request.decision}</p>
                      <p className="mt-3 text-[11px] text-gray-600">{formatDate(request.receivedAt)}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </section>

          <section className="rounded-2xl border border-white/[0.08] bg-white/[0.03]">
            <div className="border-b border-white/[0.08] px-5 py-4">
              <h2 className="text-sm font-semibold">Lead Detail</h2>
              <p className="text-xs text-gray-500">{selectedSummary?.id ?? "Select a request"}</p>
            </div>

            <div className="p-5">
              {detailStatus === "loading" ? (
                <EmptyList text="Loading detail..." />
              ) : selected ? (
                <LeadDetail request={selected} />
              ) : selectedSummary ? (
                <LeadDetail request={selectedSummary} />
              ) : (
                <EmptyList text="Select a pilot request to see the full intake." />
              )}
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}

function LeadDetail({ request }: { request: PilotRequestSummary & { delivery?: Record<string, unknown> } }) {
  const deliveryStatus = request.deliveryStatus ?? stringValue(request.delivery?.status) ?? "unknown";
  const deliveryChannel = request.deliveryChannel ?? stringValue(request.delivery?.channel) ?? "unknown channel";

  return (
    <div className="grid gap-5">
      <div>
        <h3 className="text-xl font-bold">{request.name}</h3>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-400">
          <a className="inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 hover:text-white" href={`mailto:${request.email}`}>
            <Mail className="h-3.5 w-3.5" />
            {request.email}
          </a>
          {request.company && <Badge>{request.company}</Badge>}
          {request.role && <Badge>{request.role}</Badge>}
          {request.phone && <Badge>{request.phone}</Badge>}
        </div>
      </div>

      <InfoBlock label="Decision to Model">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300">{request.decision}</p>
      </InfoBlock>

      <div className="grid gap-3 sm:grid-cols-2">
        <InfoBlock label="Received">
          <p>{formatDate(request.receivedAt)}</p>
        </InfoBlock>
        <InfoBlock label="Delivery">
          <p>{deliveryStatus}</p>
          <p className="mt-1 text-xs text-gray-500">{deliveryChannel}</p>
        </InfoBlock>
        <InfoBlock label="Storage">
          <p>{request.storage ?? "unknown"}</p>
          {request.persistenceWarning && <p className="mt-1 text-xs text-amber-300">{request.persistenceWarning}</p>}
        </InfoBlock>
        <InfoBlock label="Source Run">
          {request.sourceRunId ? <p className="font-mono text-xs">{request.sourceRunId}</p> : <p>Not attached</p>}
        </InfoBlock>
      </div>

      {request.pageUrl && (
        <InfoBlock label="Source Page">
          <a href={request.pageUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-cyan-300 hover:text-cyan-200">
            {request.pageUrl}
            <ExternalLink className="h-3.5 w-3.5" />
          </a>
        </InfoBlock>
      )}

      <InfoBlock label="Next Operator Step">
        <p className="text-sm leading-relaxed text-gray-300">
          Reply within 24 hours, request the spreadsheet or baseline assumptions, and scope one decision using the Founder Pilot Delivery Playbook.
        </p>
      </InfoBlock>
    </div>
  );
}

function InfoBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-white/[0.06] bg-black/20 p-4">
      <p className="mb-2 text-[11px] font-semibold uppercase tracking-wider text-gray-500">{label}</p>
      <div className="text-sm text-gray-300">{children}</div>
    </div>
  );
}

function Badge({ children }: { children: ReactNode }) {
  return (
    <span className="rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 text-xs text-gray-400">
      {children}
    </span>
  );
}

function EmptyList({ text }: { text: string }) {
  return (
    <div className="flex min-h-48 items-center justify-center rounded-xl border border-dashed border-white/[0.08] p-6 text-center text-sm text-gray-500">
      {text}
    </div>
  );
}

function formatDate(value: string) {
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return date.toLocaleString(undefined, {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

function stringValue(value: unknown) {
  return typeof value === "string" ? value : undefined;
}
