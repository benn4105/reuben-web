"use client";

import type { ReactNode } from "react";
import { useCallback, useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowUpRight,
  Check,
  ClipboardList,
  Copy,
  ExternalLink,
  FileText,
  KeyRound,
  Loader2,
  Mail,
  RefreshCw,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { copyToClipboard } from "@/lib/simulation/share";

// ─── Config ──────────────────────────────────────────────────────────────────

const API_BASE_URL = process.env.NEXT_PUBLIC_REUX_DEMO_URL?.replace(/\/$/, "") ?? "";
const TOKEN_STORAGE_KEY = "reuben_operator_token";

// ─── Lead status (client-side only) ─────────────────────────────────────────

type LeadStatus = "new" | "contacted" | "scoping" | "closed";

const LEAD_STATUSES: { value: LeadStatus; label: string; color: string }[] = [
  { value: "new", label: "New", color: "border-cyan-500/40 bg-cyan-500/15 text-cyan-300" },
  { value: "contacted", label: "Contacted", color: "border-violet-500/40 bg-violet-500/15 text-violet-300" },
  { value: "scoping", label: "Scoping", color: "border-amber-500/40 bg-amber-500/15 text-amber-300" },
  { value: "closed", label: "Closed", color: "border-emerald-500/40 bg-emerald-500/15 text-emerald-300" },
];

function getLeadStatus(id: string): LeadStatus {
  if (typeof window === "undefined") return "new";
  return (localStorage.getItem(`pilot_status_${id}`) as LeadStatus) || "new";
}

function setLeadStatus(id: string, status: LeadStatus) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`pilot_status_${id}`, status);
}

function getLeadNotes(id: string): string {
  if (typeof window === "undefined") return "";
  return localStorage.getItem(`pilot_notes_${id}`) ?? "";
}

function setLeadNotes(id: string, notes: string) {
  if (typeof window === "undefined") return;
  localStorage.setItem(`pilot_notes_${id}`, notes);
}

// ─── Types ───────────────────────────────────────────────────────────────────

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

type FetchStatus = "idle" | "loading" | "ready" | "error";

// ─── Text generators ────────────────────────────────────────────────────────

function generateReplyText(req: PilotRequestSummary): string {
  const greeting = req.name ? `Hi ${req.name.split(" ")[0]}` : "Hi";
  const company = req.company ? ` at ${req.company}` : "";
  return `${greeting},

Thanks for submitting a Founder Pilot request${company}. I've reviewed your scenario:

"${req.decision}"

I'd like to set up a short scoping call to understand the key variables and build out a proper simulation model for your team.

Could you share:
1. The spreadsheet or data you're currently using to evaluate this decision
2. The 2–3 most important outcomes you'd want to compare across scenarios
3. Your preferred timeline for having a recommendation ready

I'll have a working model and decision report within one week of our call.

Best,
[Your name]`;
}

function generateSummaryMarkdown(req: PilotRequestSummary, status: LeadStatus, notes: string): string {
  const lines = [
    `## Pilot Request: ${req.name}`,
    "",
    `| Field | Value |`,
    `|---|---|`,
    `| **Request ID** | \`${req.id}\` |`,
    `| **Submitted** | ${formatDate(req.receivedAt)} |`,
    `| **Contact** | ${req.name} <${req.email}> |`,
  ];
  if (req.company) lines.push(`| **Company** | ${req.company} |`);
  if (req.role) lines.push(`| **Role** | ${req.role} |`);
  if (req.phone) lines.push(`| **Phone** | ${req.phone} |`);
  lines.push(
    `| **Status** | ${status.charAt(0).toUpperCase() + status.slice(1)} |`,
    "",
    `### Business Challenge`,
    "",
    req.decision,
    "",
  );
  if (req.sourceRunId) {
    lines.push(`### Simulation Context`, "", `Source run: \`${req.sourceRunId}\``, "");
  }
  if (notes.trim()) {
    lines.push(`### Operator Notes`, "", notes.trim(), "");
  }
  return lines.join("\n");
}

// ─── Page ────────────────────────────────────────────────────────────────────

export default function PilotRequestsPage() {
  const [token, setToken] = useState(() =>
    typeof window === "undefined" ? "" : window.sessionStorage.getItem(TOKEN_STORAGE_KEY) ?? "",
  );
  const [status, setStatus] = useState<FetchStatus>("idle");
  const [error, setError] = useState("");
  const [requests, setRequests] = useState<PilotRequestSummary[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selected, setSelected] = useState<PilotRequestDetail["request"] | null>(null);
  const [detailStatus, setDetailStatus] = useState<FetchStatus>("idle");
  const [statusMap, setStatusMap] = useState<Record<string, LeadStatus>>({});
  const [notesMap, setNotesMap] = useState<Record<string, string>>({});
  const [toast, setToast] = useState<{ message: string; type: "success" | "error" } | null>(null);

  const selectedSummary = useMemo(
    () => requests.find((r) => r.id === selectedId) ?? null,
    [requests, selectedId],
  );

  // Hydrate localStorage state when requests change
  const hydrateLocalState = useCallback((reqs: PilotRequestSummary[]) => {
    const nextStatuses: Record<string, LeadStatus> = {};
    const nextNotes: Record<string, string> = {};
    for (const r of reqs) {
      nextStatuses[r.id] = getLeadStatus(r.id);
      nextNotes[r.id] = getLeadNotes(r.id);
    }
    setStatusMap(nextStatuses);
    setNotesMap(nextNotes);
  }, []);

  const showToast = useCallback((message: string, type: "success" | "error" = "success") => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 2500);
  }, []);

  async function loadRequests(nextToken = token) {
    if (!API_BASE_URL) {
      setStatus("error");
      setError("NEXT_PUBLIC_REUX_DEMO_URL is not configured. Set it in your Vercel/Railway environment to point at the Reux demo service.");
      return;
    }
    if (!nextToken.trim()) {
      setStatus("error");
      setError("Enter the Railway demo admin token (REUX_DEMO_SETUP_TOKEN from your Railway service variables).");
      return;
    }

    setStatus("loading");
    setError("");
    window.sessionStorage.setItem(TOKEN_STORAGE_KEY, nextToken.trim());

    try {
      const response = await fetch(`${API_BASE_URL}/api/pilot-requests?limit=100`, {
        headers: { "x-reux-demo-token": nextToken.trim(), accept: "application/json" },
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) {
        if (response.status === 401 || response.status === 403) {
          throw new Error("Authentication failed. Check that the token matches REUX_DEMO_SETUP_TOKEN on your Railway service.");
        }
        throw new Error(body.message || body.error || `Request failed (${response.status})`);
      }

      const nextRequests: PilotRequestSummary[] = Array.isArray(body.requests) ? body.requests : [];
      setRequests(nextRequests);
      hydrateLocalState(nextRequests);
      setStatus("ready");
      const nextSelected = selectedId && nextRequests.some((r) => r.id === selectedId)
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
      if (loadError instanceof TypeError && loadError.message.includes("fetch")) {
        setError("Network error — cannot reach the demo service. Check that NEXT_PUBLIC_REUX_DEMO_URL is correct and the Railway service is running.");
      } else {
        setError(loadError instanceof Error ? loadError.message : "Could not load pilot requests.");
      }
    }
  }

  async function loadDetail(id: string, nextToken = token) {
    if (!nextToken.trim()) return;
    setSelectedId(id);
    setDetailStatus("loading");
    try {
      const response = await fetch(`${API_BASE_URL}/api/pilot-requests/${encodeURIComponent(id)}`, {
        headers: { "x-reux-demo-token": nextToken.trim(), accept: "application/json" },
      });
      const body = await response.json().catch(() => ({}));
      if (!response.ok) throw new Error(body.message || body.error || `Detail failed (${response.status})`);
      setSelected(body.request ?? null);
      setDetailStatus("ready");
    } catch (detailError) {
      setSelected(null);
      setDetailStatus("error");
      setError(detailError instanceof Error ? detailError.message : "Could not load detail.");
    }
  }

  function handleStatusChange(id: string, next: LeadStatus) {
    setLeadStatus(id, next);
    setStatusMap((prev) => ({ ...prev, [id]: next }));
  }

  function handleNotesChange(id: string, notes: string) {
    setLeadNotes(id, notes);
    setNotesMap((prev) => ({ ...prev, [id]: notes }));
  }

  async function handleCopyReply(req: PilotRequestSummary) {
    const text = generateReplyText(req);
    const ok = await copyToClipboard(text);
    showToast(ok ? "Reply copied to clipboard" : "Failed to copy", ok ? "success" : "error");
  }

  async function handleCopySummary(req: PilotRequestSummary) {
    const reqStatus = statusMap[req.id] ?? "new";
    const notes = notesMap[req.id] ?? "";
    const md = generateSummaryMarkdown(req, reqStatus, notes);
    const ok = await copyToClipboard(md);
    showToast(ok ? "Summary copied to clipboard" : "Failed to copy", ok ? "success" : "error");
  }

  const activeRequest = selected ?? selectedSummary;

  return (
    <div className="min-h-screen bg-[#060608] px-4 py-8 text-white md:px-8">
      <div className="mx-auto flex max-w-7xl flex-col gap-5">
        {/* Header */}
        <header className="flex flex-col gap-4 rounded-xl border border-white/[0.08] bg-white/[0.03] p-5 md:flex-row md:items-end md:justify-between">
          <div>
            <Link href="/simulator" className="mb-3 inline-flex items-center gap-2 text-xs font-medium text-cyan-300 hover:text-cyan-200">
              <ArrowUpRight className="h-3.5 w-3.5 rotate-180" /> Back to simulator
            </Link>
            <div className="mb-2 inline-flex items-center gap-2 rounded-full border border-cyan-500/20 bg-cyan-500/10 px-3 py-1 text-xs font-semibold uppercase tracking-wider text-cyan-200">
              <ClipboardList className="h-3.5 w-3.5" /> Operator Intake
            </div>
            <h1 className="text-2xl font-bold tracking-tight">Founder Pilot Requests</h1>
            <p className="mt-1 max-w-xl text-xs leading-relaxed text-gray-500">
              Review and manage pilot leads from the Business Simulator. Requires the Railway <code className="text-gray-400">REUX_DEMO_SETUP_TOKEN</code>.
            </p>
          </div>

          <form className="grid gap-2 sm:min-w-[380px]" onSubmit={(e) => { e.preventDefault(); void loadRequests(); }}>
            <label className="text-[10px] font-semibold uppercase tracking-wider text-gray-500">Admin token</label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <KeyRound className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-600" />
                <Input value={token} onChange={(e) => setToken(e.target.value)} type="password" placeholder="REUX_DEMO_SETUP_TOKEN" className="border-white/10 bg-black/40 pl-9 text-white placeholder:text-gray-600" />
              </div>
              <Button type="submit" disabled={status === "loading"} className="gap-2 bg-white text-black hover:bg-gray-200">
                {status === "loading" ? <Loader2 className="h-4 w-4 animate-spin" /> : <RefreshCw className="h-4 w-4" />}
                Load
              </Button>
            </div>
          </form>
        </header>

        {/* Error */}
        {error && (
          <div className="flex items-start gap-3 rounded-lg border border-amber-500/20 bg-amber-500/10 px-4 py-3 text-sm text-amber-200">
            <span className="flex-1">{error}</span>
            <button type="button" onClick={() => setError("")} className="shrink-0 text-amber-400 hover:text-amber-200"><X className="h-4 w-4" /></button>
          </div>
        )}

        {/* Main grid */}
        <div className="grid gap-5 lg:grid-cols-[0.85fr_1.15fr]">
          {/* List */}
          <section className="rounded-xl border border-white/[0.08] bg-white/[0.03]">
            <div className="flex items-center justify-between border-b border-white/[0.08] px-4 py-3">
              <div>
                <h2 className="text-sm font-semibold">Requests</h2>
                <p className="text-[11px] text-gray-600">{requests.length} loaded</p>
              </div>
              <Button type="button" variant="outline" size="sm" onClick={() => void loadRequests()} disabled={status === "loading" || !token} className="gap-2 border-white/[0.08] text-gray-400 hover:text-white">
                <RefreshCw className={cn("h-3.5 w-3.5", status === "loading" && "animate-spin")} /> Refresh
              </Button>
            </div>

            <div className="max-h-[68vh] overflow-y-auto p-2">
              {status === "idle" ? (
                <EmptyState icon={<KeyRound className="h-5 w-5 text-gray-600" />} title="Enter admin token" subtitle="Paste the REUX_DEMO_SETUP_TOKEN from your Railway service to load pilot leads." />
              ) : status === "loading" ? (
                <EmptyState icon={<Loader2 className="h-5 w-5 animate-spin text-cyan-400" />} title="Loading requests…" />
              ) : requests.length === 0 ? (
                <EmptyState icon={<ClipboardList className="h-5 w-5 text-gray-600" />} title="No pilot requests yet" subtitle="When visitors submit the Founder Pilot form on the simulator page, their requests will appear here." />
              ) : (
                <div className="grid gap-1.5">
                  {requests.map((req) => {
                    const reqStatus = statusMap[req.id] ?? "new";
                    const statusMeta = LEAD_STATUSES.find((s) => s.value === reqStatus) ?? LEAD_STATUSES[0];
                    return (
                      <button key={req.id} type="button" onClick={() => void loadDetail(req.id)}
                        className={cn(
                          "rounded-lg border p-3 text-left transition-colors",
                          selectedId === req.id ? "border-cyan-500/40 bg-cyan-500/10" : "border-white/[0.06] bg-black/20 hover:border-white/[0.14] hover:bg-white/[0.04]",
                        )}>
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-semibold text-white">{req.name}</p>
                            <p className="truncate text-[11px] text-gray-500">{req.email}</p>
                          </div>
                          <span className={cn("shrink-0 rounded-full border px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wider", statusMeta.color)}>
                            {statusMeta.label}
                          </span>
                        </div>
                        <p className="mt-2 line-clamp-2 text-[11px] leading-relaxed text-gray-500">{req.decision}</p>
                        <p className="mt-2 text-[10px] text-gray-600">{formatDate(req.receivedAt)}</p>
                      </button>
                    );
                  })}
                </div>
              )}
            </div>
          </section>

          {/* Detail */}
          <section className="rounded-xl border border-white/[0.08] bg-white/[0.03]">
            <div className="border-b border-white/[0.08] px-5 py-3">
              <h2 className="text-sm font-semibold">Lead Detail</h2>
              <p className="text-[11px] text-gray-600">{selectedSummary?.id ?? "Select a request"}</p>
            </div>

            <div className="p-5">
              {detailStatus === "loading" ? (
                <EmptyState icon={<Loader2 className="h-5 w-5 animate-spin text-cyan-400" />} title="Loading detail…" />
              ) : activeRequest ? (
                <LeadDetail
                  request={activeRequest}
                  leadStatus={statusMap[activeRequest.id] ?? "new"}
                  notes={notesMap[activeRequest.id] ?? ""}
                  onStatusChange={(s) => handleStatusChange(activeRequest.id, s)}
                  onNotesChange={(n) => handleNotesChange(activeRequest.id, n)}
                  onCopyReply={() => void handleCopyReply(activeRequest)}
                  onCopySummary={() => void handleCopySummary(activeRequest)}
                />
              ) : (
                <EmptyState icon={<FileText className="h-5 w-5 text-gray-600" />} title="Select a pilot request" subtitle="Click a request in the list to see the full intake and operator tools." />
              )}
            </div>
          </section>
        </div>
      </div>

      {/* Toast */}
      {toast && (
        <div className={cn(
          "fixed bottom-5 right-5 z-50 flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium shadow-lg transition-all animate-in fade-in slide-in-from-bottom-2 duration-200",
          toast.type === "success" ? "border border-emerald-500/30 bg-emerald-500/15 text-emerald-300" : "border border-red-500/30 bg-red-500/15 text-red-300",
        )}>
          {toast.type === "success" ? <Check className="h-4 w-4" /> : <X className="h-4 w-4" />}
          {toast.message}
        </div>
      )}
    </div>
  );
}

// ─── Lead Detail ─────────────────────────────────────────────────────────────

function LeadDetail({
  request,
  leadStatus,
  notes,
  onStatusChange,
  onNotesChange,
  onCopyReply,
  onCopySummary,
}: {
  request: PilotRequestSummary & { delivery?: Record<string, unknown> };
  leadStatus: LeadStatus;
  notes: string;
  onStatusChange: (s: LeadStatus) => void;
  onNotesChange: (n: string) => void;
  onCopyReply: () => void;
  onCopySummary: () => void;
}) {
  const deliveryStatus = request.deliveryStatus ?? stringValue(request.delivery?.status) ?? "unknown";
  const deliveryChannel = request.deliveryChannel ?? stringValue(request.delivery?.channel) ?? "—";

  return (
    <div className="grid gap-4">
      {/* Contact header */}
      <div>
        <h3 className="text-lg font-bold">{request.name}</h3>
        <div className="mt-2 flex flex-wrap gap-2 text-xs text-gray-400">
          <a className="inline-flex items-center gap-1 rounded-full border border-white/[0.08] bg-white/[0.04] px-2.5 py-1 hover:text-white" href={`mailto:${request.email}`}>
            <Mail className="h-3 w-3" /> {request.email}
          </a>
          {request.company && <Badge>{request.company}</Badge>}
          {request.role && <Badge>{request.role}</Badge>}
          {request.phone && <Badge>{request.phone}</Badge>}
        </div>
      </div>

      {/* Status selector */}
      <div className="rounded-lg border border-white/[0.06] bg-black/20 p-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Lead Status</p>
        <div className="flex flex-wrap gap-1.5">
          {LEAD_STATUSES.map((s) => (
            <button key={s.value} type="button" onClick={() => onStatusChange(s.value)}
              className={cn(
                "rounded-md border px-3 py-1.5 text-xs font-semibold transition-colors",
                leadStatus === s.value ? s.color : "border-white/[0.06] bg-white/[0.02] text-gray-500 hover:text-gray-300",
              )}>
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {/* Decision */}
      <InfoBlock label="Decision to Model">
        <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-300">{request.decision}</p>
      </InfoBlock>

      {/* Metadata grid */}
      <div className="grid gap-3 sm:grid-cols-2">
        <InfoBlock label="Received"><p>{formatDate(request.receivedAt)}</p></InfoBlock>
        <InfoBlock label="Delivery"><p>{deliveryStatus}</p><p className="mt-0.5 text-[11px] text-gray-600">{deliveryChannel}</p></InfoBlock>
        <InfoBlock label="Storage">
          <p>{request.storage ?? "unknown"}</p>
          {request.persistenceWarning && <p className="mt-0.5 text-[11px] text-amber-300">{request.persistenceWarning}</p>}
        </InfoBlock>
        <InfoBlock label="Source Run">
          {request.sourceRunId ? <p className="font-mono text-xs">{request.sourceRunId}</p> : <p className="text-gray-600">Not attached</p>}
        </InfoBlock>
      </div>

      {request.pageUrl && (
        <InfoBlock label="Source Page">
          <a href={request.pageUrl} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-xs text-cyan-300 hover:text-cyan-200">
            {request.pageUrl} <ExternalLink className="h-3 w-3" />
          </a>
        </InfoBlock>
      )}

      {/* Operator notes */}
      <div className="rounded-lg border border-white/[0.06] bg-black/20 p-3">
        <p className="mb-2 text-[10px] font-semibold uppercase tracking-wider text-gray-500">Operator Notes</p>
        <textarea
          value={notes}
          onChange={(e) => onNotesChange(e.target.value)}
          rows={3}
          placeholder="Internal notes — saved to localStorage only…"
          className="w-full resize-y rounded-md border border-white/[0.08] bg-black/30 px-3 py-2 text-sm text-gray-300 placeholder:text-gray-600 focus:border-cyan-500/40 focus:outline-none"
        />
        <p className="mt-1 text-[10px] text-gray-600">Not synced to the backend. Browser-local only.</p>
      </div>

      {/* Actions */}
      <div className="flex flex-wrap gap-2">
        <Button type="button" variant="outline" size="sm" className="gap-2 border-white/[0.08] text-gray-300 hover:text-white" onClick={onCopyReply}>
          <Copy className="h-3.5 w-3.5" /> Copy Reply
        </Button>
        <Button type="button" variant="outline" size="sm" className="gap-2 border-white/[0.08] text-gray-300 hover:text-white" onClick={onCopySummary}>
          <FileText className="h-3.5 w-3.5" /> Copy Summary
        </Button>
        <a href={`mailto:${request.email}`} className="inline-flex items-center gap-2 rounded-md border border-white/[0.08] bg-transparent px-3 py-1.5 text-xs font-medium text-gray-300 hover:text-white">
          <Mail className="h-3.5 w-3.5" /> Open in Mail
        </a>
      </div>
    </div>
  );
}

// ─── Shared components ───────────────────────────────────────────────────────

function InfoBlock({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-lg border border-white/[0.06] bg-black/20 p-3">
      <p className="mb-1.5 text-[10px] font-semibold uppercase tracking-wider text-gray-500">{label}</p>
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

function EmptyState({ icon, title, subtitle }: { icon: ReactNode; title: string; subtitle?: string }) {
  return (
    <div className="flex min-h-48 flex-col items-center justify-center gap-3 rounded-lg border border-dashed border-white/[0.08] p-6 text-center">
      {icon}
      <p className="text-sm font-medium text-gray-400">{title}</p>
      {subtitle && <p className="max-w-xs text-xs leading-relaxed text-gray-600">{subtitle}</p>}
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
