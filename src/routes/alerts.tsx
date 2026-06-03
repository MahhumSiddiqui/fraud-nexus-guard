import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/panel";
import { RiskBadge } from "@/components/risk-badge";
import { cases } from "@/lib/mock-data";
import { useState } from "react";
import { CheckSquare, ChevronUp, UserPlus } from "lucide-react";

export const Route = createFileRoute("/alerts")({
  head: () => ({ meta: [{ title: "Alerts — AFIOS" }] }),
  component: AlertsPage,
});

const QUEUES = ["New", "In Review", "Escalated", "Confirmed Fraud", "False Positive", "Closed"] as const;
const COUNTS = [284, 412, 88, 1240, 522, 9810];

function AlertsPage() {
  const [q, setQ] = useState<typeof QUEUES[number]>("New");
  const [sel, setSel] = useState<Set<string>>(new Set());

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workflow"
        title="Alert Management Center"
        description="Queue-based triage with bulk actions, assignment, and SLA-aware prioritization."
      />

      <div className="surface-panel p-1 flex flex-wrap gap-1">
        {QUEUES.map((qq, i) => (
          <button
            key={qq}
            onClick={() => setQ(qq)}
            className={`px-3 py-1.5 rounded-md text-[12px] inline-flex items-center gap-2 transition-colors ${q === qq ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-surface-2 hover:text-foreground"}`}
          >
            {qq}
            <span className={`mono text-[10px] tabular ${q === qq ? "text-primary-foreground/80" : "text-muted-foreground"}`}>{COUNTS[i].toLocaleString()}</span>
          </button>
        ))}
      </div>

      {sel.size > 0 && (
        <div className="surface-panel px-4 py-2.5 flex items-center gap-3 bg-primary/8 border-primary/30">
          <span className="mono text-[12px] text-primary">{sel.size} selected</span>
          <div className="ml-auto flex gap-2">
            <ActionBtn icon={UserPlus}>Assign</ActionBtn>
            <ActionBtn icon={ChevronUp}>Escalate</ActionBtn>
            <ActionBtn icon={CheckSquare}>Resolve</ActionBtn>
          </div>
        </div>
      )}

      <Panel title={`${q} · Queue`} dense>
        <div className="grid grid-cols-12 px-4 py-2 text-[10px] mono uppercase tracking-widest text-muted-foreground border-b border-border">
          <div className="col-span-1"></div>
          <div className="col-span-2">Case ID</div>
          <div className="col-span-4">Title</div>
          <div className="col-span-2">Analyst</div>
          <div className="col-span-1">Age</div>
          <div className="col-span-2 text-right">Exposure</div>
        </div>
        <ul>
          {cases.map(c => {
            const checked = sel.has(c.id);
            return (
              <li key={c.id} className={`grid grid-cols-12 items-center px-4 py-2.5 border-b border-border/60 text-[12.5px] cursor-pointer ${checked ? "bg-primary/8" : "hover:bg-surface-2/40"}`}>
                <div className="col-span-1">
                  <input
                    type="checkbox" checked={checked}
                    onChange={() => setSel(s => { const n = new Set(s); n.has(c.id) ? n.delete(c.id) : n.add(c.id); return n; })}
                    className="h-3.5 w-3.5 accent-primary"
                  />
                </div>
                <div className="col-span-2 mono">{c.id}</div>
                <div className="col-span-4">
                  <div className="flex items-center gap-2">
                    <RiskBadge level={c.priority} />
                    <span className="truncate">{c.title}</span>
                  </div>
                </div>
                <div className="col-span-2 text-[12px]">{c.analyst}</div>
                <div className="col-span-1 mono text-muted-foreground">{c.age}</div>
                <div className="col-span-2 text-right mono tabular">${c.exposure.toLocaleString()}</div>
              </li>
            );
          })}
        </ul>
      </Panel>
    </div>
  );
}

function ActionBtn({ icon: Icon, children }: { icon: any; children: React.ReactNode }) {
  return (
    <button className="h-8 px-3 rounded-md bg-surface-2 hover:bg-surface-3 text-[12px] inline-flex items-center gap-1.5">
      <Icon className="h-3.5 w-3.5" />{children}
    </button>
  );
}
