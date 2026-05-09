"use client";

import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import {
  Activity,
  CheckCircle2,
  AlertTriangle,
  XCircle,
  RefreshCw,
  Server,
  Database,
  Cpu,
  Clock,
  Zap,
  PackageCheck,
  Truck,
  LineChart,
  ArrowUpRight,
  ArrowDownRight,
  Minus,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

// ─── Mock Data ───────────────────────────────────────────────────────────────

type HealthStatus = "healthy" | "degraded" | "down";

interface SystemService {
  name: string;
  status: HealthStatus;
  latency: number;
  uptime: string;
  icon: React.ReactNode;
}

interface QueueMetric {
  domain: string;
  pending: number;
  processing: number;
  completed: number;
  failed: number;
  throughput: string;
  trend: "up" | "down" | "flat";
}

interface WorkerInfo {
  id: string;
  domain: string;
  status: "active" | "idle" | "error";
  uptime: string;
  lastHeartbeat: string;
  processed: number;
}

function generateMockData() {
  const services: SystemService[] = [
    { name: "Reux API", status: "healthy", latency: 42, uptime: "99.97%", icon: <Server size={18} /> },
    { name: "PostgreSQL", status: "healthy", latency: 8, uptime: "99.99%", icon: <Database size={18} /> },
    { name: "Worker Pool", status: "healthy", latency: 15, uptime: "99.91%", icon: <Cpu size={18} /> },
    { name: "Outbox Processor", status: "healthy", latency: 23, uptime: "99.88%", icon: <Zap size={18} /> },
  ];

  const queues: QueueMetric[] = [
    { domain: "Commerce", pending: 3, processing: 1, completed: 1847, failed: 2, throughput: "142/hr", trend: "up" },
    { domain: "Logistics", pending: 7, processing: 2, completed: 923, failed: 0, throughput: "89/hr", trend: "flat" },
    { domain: "Simulation", pending: 1, processing: 0, completed: 456, failed: 1, throughput: "34/hr", trend: "up" },
  ];

  const workers: WorkerInfo[] = [
    { id: "wrk-01a", domain: "Commerce", status: "active", uptime: "4d 12h", lastHeartbeat: "2s ago", processed: 612 },
    { id: "wrk-01b", domain: "Commerce", status: "active", uptime: "4d 12h", lastHeartbeat: "1s ago", processed: 589 },
    { id: "wrk-02a", domain: "Logistics", status: "active", uptime: "3d 8h", lastHeartbeat: "3s ago", processed: 471 },
    { id: "wrk-02b", domain: "Logistics", status: "idle", uptime: "3d 8h", lastHeartbeat: "12s ago", processed: 452 },
    { id: "wrk-03a", domain: "Simulation", status: "active", uptime: "2d 1h", lastHeartbeat: "1s ago", processed: 234 },
    { id: "wrk-03b", domain: "Simulation", status: "idle", uptime: "2d 1h", lastHeartbeat: "8s ago", processed: 222 },
  ];

  return { services, queues, workers };
}

// ─── Status helpers ──────────────────────────────────────────────────────────

function StatusDot({ status }: { status: HealthStatus | "active" | "idle" | "error" }) {
  const color = {
    healthy: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]",
    active: "bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.6)]",
    degraded: "bg-amber-500 shadow-[0_0_8px_rgba(245,158,11,0.6)]",
    idle: "bg-amber-500/60",
    down: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]",
    error: "bg-rose-500 shadow-[0_0_8px_rgba(244,63,94,0.6)]",
  }[status];

  return <span className={cn("inline-block w-2 h-2 rounded-full shrink-0", color)} />;
}

function StatusIcon({ status }: { status: HealthStatus }) {
  if (status === "healthy") return <CheckCircle2 size={16} className="text-emerald-400" />;
  if (status === "degraded") return <AlertTriangle size={16} className="text-amber-400" />;
  return <XCircle size={16} className="text-rose-400" />;
}

function TrendIcon({ trend }: { trend: "up" | "down" | "flat" }) {
  if (trend === "up") return <ArrowUpRight size={14} className="text-emerald-400" />;
  if (trend === "down") return <ArrowDownRight size={14} className="text-rose-400" />;
  return <Minus size={14} className="text-gray-500" />;
}

function DomainIcon({ domain }: { domain: string }) {
  if (domain === "Commerce") return <PackageCheck size={16} className="text-violet-400" />;
  if (domain === "Logistics") return <Truck size={16} className="text-cyan-400" />;
  return <LineChart size={16} className="text-amber-400" />;
}

// ─── Mini bar ────────────────────────────────────────────────────────────────

function MiniBar({ values, colors }: { values: number[]; colors: string[] }) {
  const total = values.reduce((a, b) => a + b, 0) || 1;
  return (
    <div className="flex h-1.5 rounded-full overflow-hidden bg-white/[0.06] w-full" role="img" aria-label="Queue distribution">
      {values.map((v, i) => (
        <div key={i} className={cn("h-full", colors[i])} style={{ width: `${(v / total) * 100}%` }} />
      ))}
    </div>
  );
}

// ─── Page Component ──────────────────────────────────────────────────────────

export default function OperationsDashboard() {
  const [data, setData] = useState(generateMockData);
  const [refreshing, setRefreshing] = useState(false);
  const [lastRefreshLabel, setLastRefreshLabel] = useState("");

  function refresh() {
    setRefreshing(true);
    setTimeout(() => {
      setData(generateMockData());
      setLastRefreshLabel(new Date().toLocaleTimeString());
      setRefreshing(false);
    }, 600);
  }

  // Set initial timestamp on mount + auto-refresh every 30s
  useEffect(() => {
    // Initial update via timeout to avoid synchronous setState inside effect warning
    setTimeout(() => setLastRefreshLabel(new Date().toLocaleTimeString()), 0);
    const interval = setInterval(refresh, 30000);
    return () => clearInterval(interval);
  }, []);

  const overallStatus: HealthStatus = data.services.some(s => s.status === "down")
    ? "down"
    : data.services.some(s => s.status === "degraded")
      ? "degraded"
      : "healthy";

  const statusLabel = { healthy: "All Systems Operational", degraded: "Partial Degradation", down: "Service Disruption" }[overallStatus];
  const statusColor = { healthy: "text-emerald-400 border-emerald-500/30 bg-emerald-500/10", degraded: "text-amber-400 border-amber-500/30 bg-amber-500/10", down: "text-rose-400 border-rose-500/30 bg-rose-500/10" }[overallStatus];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3">
        <div>
          <Breadcrumb className="mb-3">
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink href="/simulator">Simulator</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Operations</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <h1 className="text-2xl font-bold text-white tracking-tight">Operations</h1>
          <p className="text-sm text-gray-500 mt-1">Cross-domain queue health and worker status.</p>
        </div>
        <div className="flex items-center gap-3 shrink-0">
          <span className="text-[11px] text-gray-600">
            {lastRefreshLabel && `Updated ${lastRefreshLabel}`}
          </span>
          <Button
            onClick={refresh}
            variant="outline"
            size="sm"
            disabled={refreshing}
            className="gap-2 border-white/[0.08] text-gray-400 hover:text-white"
            aria-label="Refresh dashboard data"
          >
            <RefreshCw size={14} className={cn(refreshing && "animate-spin")} />
            Refresh
          </Button>
        </div>
      </div>

      {/* Overall Status Banner */}
      <Badge variant="outline" className={cn("flex items-center gap-3 px-4 py-3 rounded-xl w-full justify-start", statusColor)}>
        <StatusDot status={overallStatus} />
        <span className="text-sm font-medium">{statusLabel}</span>
        <span className="text-xs opacity-60 ml-auto hidden sm:inline">Mock data · Live backend integration coming soon</span>
      </Badge>

      {/* Service Health Cards */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Service Health</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
          {data.services.map(service => (
            <Card
              key={service.name}
              className="border-white/[0.06] bg-white/[0.02] hover:bg-white/[0.04] transition-colors"
            >
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2.5">
                    <div className="p-2 rounded-lg bg-white/[0.05] text-gray-400">{service.icon}</div>
                    <span className="text-sm font-semibold text-white">{service.name}</span>
                  </div>
                  <StatusIcon status={service.status} />
                </div>
                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <div className="text-[10px] text-gray-600 uppercase tracking-wider">Latency</div>
                    <div className="text-sm font-mono text-gray-300 tabular-nums">{service.latency}ms</div>
                  </div>
                  <div>
                    <div className="text-[10px] text-gray-600 uppercase tracking-wider">Uptime</div>
                    <div className="text-sm font-mono text-gray-300 tabular-nums">{service.uptime}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Queue Monitor */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Queue Monitor</h2>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
          {data.queues.map(queue => (
            <Card
              key={queue.domain}
              className="border-white/[0.06] bg-white/[0.02]"
            >
              <CardContent className="p-5 space-y-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <DomainIcon domain={queue.domain} />
                    <span className="text-sm font-semibold text-white">{queue.domain}</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <TrendIcon trend={queue.trend} />
                    <span className="text-xs font-mono text-gray-400 tabular-nums">{queue.throughput}</span>
                  </div>
                </div>

                <div className="grid grid-cols-4 gap-2">
                  {[
                    { label: "Pending", value: queue.pending, color: "text-amber-400" },
                    { label: "Active", value: queue.processing, color: "text-cyan-400" },
                    { label: "Done", value: queue.completed, color: "text-emerald-400" },
                    { label: "Failed", value: queue.failed, color: queue.failed > 0 ? "text-rose-400" : "text-gray-600" },
                  ].map(m => (
                    <div key={m.label}>
                      <div className="text-[10px] text-gray-600 uppercase tracking-wider">{m.label}</div>
                      <div className={cn("text-sm font-semibold font-mono tabular-nums", m.color)}>{m.value.toLocaleString()}</div>
                    </div>
                  ))}
                </div>

                <MiniBar
                  values={[queue.pending, queue.processing, queue.completed, queue.failed]}
                  colors={["bg-amber-500", "bg-cyan-500", "bg-emerald-500", "bg-rose-500"]}
                />
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Worker Table */}
      <div>
        <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Worker Pool</h2>
        <Card className="border-white/[0.06] overflow-hidden">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-white/[0.06] bg-white/[0.02]">
                  <TableHead className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Worker</TableHead>
                  <TableHead className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Domain</TableHead>
                  <TableHead className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider">Status</TableHead>
                  <TableHead className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Uptime</TableHead>
                  <TableHead className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider hidden sm:table-cell">Heartbeat</TableHead>
                  <TableHead className="text-[10px] font-semibold text-gray-500 uppercase tracking-wider text-right">Processed</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {data.workers.map(worker => (
                  <TableRow key={worker.id} className="border-b border-white/[0.03] hover:bg-white/[0.02] transition-colors">
                    <TableCell className="font-mono text-xs text-gray-300">{worker.id}</TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <DomainIcon domain={worker.domain} />
                        <span className="text-gray-400 text-xs">{worker.domain}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-1.5">
                        <StatusDot status={worker.status} />
                        <span className={cn(
                          "text-xs capitalize",
                          worker.status === "active" ? "text-emerald-400" : worker.status === "idle" ? "text-amber-400" : "text-rose-400"
                        )}>
                          {worker.status}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-xs text-gray-500 font-mono hidden sm:table-cell">{worker.uptime}</TableCell>
                    <TableCell className="hidden sm:table-cell">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-gray-600" />
                        <span className="text-xs text-gray-500">{worker.lastHeartbeat}</span>
                      </div>
                    </TableCell>
                    <TableCell className="text-right font-mono text-xs text-gray-300 tabular-nums">{worker.processed.toLocaleString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </Card>
      </div>

      {/* Cross-Domain Summary */}
      <Card className="border-white/[0.06] bg-white/[0.02]">
        <CardContent className="p-5">
          <div className="flex items-center gap-2 mb-4">
            <Activity size={16} className="text-cyan-400" />
            <h3 className="text-sm font-semibold text-white">Cross-Domain Overview</h3>
            <Badge variant="outline" className="ml-auto text-[10px] text-gray-600 border-white/10">Mock data</Badge>
          </div>
          <p className="text-xs text-gray-500 mb-4">
            This dashboard will connect to the live Reux backend to display real-time queue depth, worker health, and cross-domain throughput once the operations API is available.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {[
              { label: "Total Processed", value: "3,226", color: "text-emerald-400" },
              { label: "Active Workers", value: "4 / 6", color: "text-cyan-400" },
              { label: "Failed Jobs", value: "3", color: "text-rose-400" },
              { label: "Avg Latency", value: "22ms", color: "text-gray-300" },
            ].map(stat => (
              <div key={stat.label}>
                <div className="text-[10px] text-gray-600 uppercase tracking-wider mb-1">{stat.label}</div>
                <div className={cn("text-lg font-bold font-mono tabular-nums", stat.color)}>{stat.value}</div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
