import { cn } from "@/lib/utils";

export function RiskBadge({ level, value }: { level: "critical" | "high" | "medium" | "low" | "safe"; value?: number }) {
  const map = {
    critical: "bg-risk-critical/15 text-risk-critical border-risk-critical/30",
    high: "bg-risk-high/15 text-risk-high border-risk-high/30",
    medium: "bg-risk-medium/15 text-risk-medium border-risk-medium/30",
    low: "bg-risk-low/15 text-risk-low border-risk-low/30",
    safe: "bg-risk-safe/15 text-risk-safe border-risk-safe/30",
  };
  return (
    <span className={cn("inline-flex items-center gap-1.5 mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded border", map[level])}>
      <span className="h-1.5 w-1.5 rounded-full bg-current" />
      {level}{value !== undefined && <span className="tabular">·{value}</span>}
    </span>
  );
}

export function StatusPill({ status }: { status: "fraud" | "suspicious" | "review" | "clear" }) {
  const map = {
    fraud: "bg-status-fraud/15 text-status-fraud",
    suspicious: "bg-status-suspicious/15 text-status-suspicious",
    review: "bg-status-review/15 text-status-review",
    clear: "bg-status-clear/15 text-status-clear",
  };
  return <span className={cn("mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded", map[status])}>{status}</span>;
}
