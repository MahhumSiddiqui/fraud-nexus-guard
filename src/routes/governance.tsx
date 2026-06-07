import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/panel";
import { CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { CheckCircle2, Clock, RotateCcw, ShieldAlert, XCircle } from "lucide-react";

export const Route = createFileRoute("/governance")({
  head: () => ({ meta: [{ title: "Model Governance — AFIOS" }] }),
  component: GovernancePage,
});

const APPROVALS = [
  { v: "FALCON-NEO v4.3", st: "pending", own: "C. Nguyen", req: "2d ago", note: "+0.6% recall, GNN feature pack v3" },
  { v: "SYNTHID-DETECT v1.0", st: "pending", own: "R. Patel", req: "5h ago", note: "Promotion from shadow → prod" },
  { v: "GRAPHSENSE v2.2", st: "approved", own: "M. Schultz", req: "1d ago", note: "Approved by CRO" },
  { v: "DNA-PROFILER v1.7", st: "rejected", own: "A. Okafor", req: "3d ago", note: "Drift > 0.30 in shadow" },
];

const PERF = Array.from({ length: 14 }, (_, i) => ({
  d: `D-${14 - i}`,
  precision: 92 + Math.sin(i / 2) * 1.5 + (i > 9 ? -1.2 : 0),
  recall: 90 + Math.cos(i / 2) * 1.8,
  drift: 0.04 + i * 0.012,
}));

function GovernancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="MLOps · Governance & Compliance"
        title="Model Governance Center"
        description="End-to-end model accountability — versions, drift, approvals, deployment history, and audit trail required for regulatory review."
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { l: "Active models", v: "14" },
          { l: "In shadow", v: "3" },
          { l: "Pending approval", v: "2", tone: "warn" as const },
          { l: "Drifting", v: "1", tone: "warn" as const },
          { l: "Audit coverage", v: "100%" },
        ].map(k => (
          <div key={k.l} className="surface-panel p-4">
            <div className="text-[10px] mono uppercase tracking-widest text-muted-foreground">{k.l}</div>
            <div className={`mt-2 text-2xl font-semibold tabular ${k.tone === "warn" ? "text-risk-high" : ""}`}>{k.v}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-2" title="FALCON-NEO v4.2 · performance & drift" subtitle="14-day rolling window">
          <div className="h-[280px]">
            <ResponsiveContainer>
              <LineChart data={PERF} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="d" tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <YAxis yAxisId="l" tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} domain={[80, 100]} />
                <YAxis yAxisId="r" orientation="right" tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} domain={[0, 0.4]} />
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", fontSize: 11 }} />
                <Line yAxisId="l" type="monotone" dataKey="precision" stroke="var(--chart-1)" strokeWidth={1.5} dot={false} />
                <Line yAxisId="l" type="monotone" dataKey="recall" stroke="var(--chart-2)" strokeWidth={1.5} dot={false} />
                <Line yAxisId="r" type="monotone" dataKey="drift" stroke="var(--risk-high)" strokeWidth={1.5} strokeDasharray="4 3" dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Drift detection" subtitle="Data · concept · prediction">
          <ul className="space-y-3 text-[13px]">
            {[
              { l: "Data drift", v: 0.07, st: "ok" },
              { l: "Concept drift", v: 0.12, st: "ok" },
              { l: "Prediction drift", v: 0.28, st: "warn" },
            ].map(r => (
              <li key={r.l}>
                <div className="flex items-center justify-between">
                  <span>{r.l}</span>
                  <span className={`mono tabular text-[12px] ${r.st === "warn" ? "text-risk-high" : "text-status-clear"}`}>{r.v.toFixed(2)}</span>
                </div>
                <div className="mt-1.5 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${(r.v / 0.4) * 100}%`, background: r.st === "warn" ? "var(--risk-high)" : "var(--status-clear)" }} />
                </div>
              </li>
            ))}
            <li className="surface-panel p-3 bg-risk-high/5 border-risk-high/30 mt-2">
              <div className="flex items-start gap-2"><ShieldAlert className="h-4 w-4 text-risk-high mt-0.5" />
                <div className="text-[12px]"><span className="font-medium">Prediction drift trending up.</span> Recommend shadow-promoting v4.3 within 72h.</div>
              </div>
            </li>
          </ul>
        </Panel>
      </div>

      <Panel title="Approval workflow" subtitle="Production gates · CRO + Model Risk Committee" dense>
        <div className="grid grid-cols-12 px-4 py-2 text-[10px] mono uppercase tracking-widest text-muted-foreground border-b border-border">
          <div className="col-span-3">Version</div>
          <div className="col-span-3">Owner</div>
          <div className="col-span-3">Notes</div>
          <div className="col-span-1">Requested</div>
          <div className="col-span-2 text-right">Status / Action</div>
        </div>
        <ul>
          {APPROVALS.map(a => (
            <li key={a.v} className="grid grid-cols-12 px-4 py-3 border-b border-border/60 items-center text-[12.5px]">
              <div className="col-span-3 mono">{a.v}</div>
              <div className="col-span-3 text-muted-foreground">{a.own}</div>
              <div className="col-span-3 text-muted-foreground">{a.note}</div>
              <div className="col-span-1 mono text-[11px] text-muted-foreground">{a.req}</div>
              <div className="col-span-2 flex items-center justify-end gap-2">
                {a.st === "pending" && <span className="inline-flex items-center gap-1 text-risk-medium mono text-[10px] uppercase tracking-wider"><Clock className="h-3 w-3" />Pending</span>}
                {a.st === "approved" && <span className="inline-flex items-center gap-1 text-status-clear mono text-[10px] uppercase tracking-wider"><CheckCircle2 className="h-3 w-3" />Approved</span>}
                {a.st === "rejected" && <span className="inline-flex items-center gap-1 text-risk-critical mono text-[10px] uppercase tracking-wider"><XCircle className="h-3 w-3" />Rejected</span>}
                {a.st === "pending" && <button className="h-7 px-2 surface-panel text-[11px]">Review</button>}
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Deployment history">
          <ol className="space-y-3 text-[12.5px]">
            {[
              { v: "FALCON-NEO v4.2", who: "C. Nguyen", when: "4 days ago", why: "Recall improvement +0.4%", ok: true },
              { v: "GRAPHSENSE v2.1", who: "M. Schultz", when: "12 days ago", why: "GNN feature pack v2", ok: true },
              { v: "VELOCITY-X v3.0", who: "R. Patel", when: "21 days ago", why: "Reduce FPR on EU corridor", ok: true },
              { v: "DNA-PROFILER v1.5 → ROLLED BACK", who: "A. Okafor", when: "70 days ago", why: "Drift > 0.30 within 9d", ok: false },
            ].map((d, i) => (
              <li key={i} className="flex items-start gap-3">
                <span className={`h-2 w-2 mt-1.5 rounded-full ${d.ok ? "bg-status-clear" : "bg-risk-critical"}`} />
                <div className="flex-1">
                  <div className="mono">{d.v}</div>
                  <div className="text-[11px] text-muted-foreground">{d.who} · {d.when} · {d.why}</div>
                </div>
                {!d.ok && <button className="h-7 px-2 surface-panel text-[11px] inline-flex items-center gap-1"><RotateCcw className="h-3 w-3" />Restore</button>}
              </li>
            ))}
          </ol>
        </Panel>

        <Panel title="Audit log" subtitle="Tamper-evident · streamed to compliance vault">
          <ul className="text-[12.5px] space-y-2 mono">
            {[
              "[2026-06-07 09:14:02] C.Nguyen requested promotion FALCON-NEO v4.3",
              "[2026-06-07 08:02:11] CRO M.Schultz approved GRAPHSENSE v2.2",
              "[2026-06-06 22:45:00] AUTO drift alert prediction>0.25 model=FALCON-NEO v4.2",
              "[2026-06-06 11:00:00] R.Patel rotated API key svc.fraud.prod",
              "[2026-06-05 18:30:00] A.Okafor exported SAR-2026-0412 to FinCEN bundle",
            ].map((l, i) => <li key={i} className="text-muted-foreground"><span className="text-foreground">{l}</span></li>)}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
