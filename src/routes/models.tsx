import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/panel";
import { models } from "@/lib/mock-data";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/models")({
  head: () => ({ meta: [{ title: "Model Intelligence — AFIOS" }] }),
  component: ModelsPage,
});

const features = [
  { f: "device_unseen", v: 0.18 },
  { f: "amount_zscore", v: 0.15 },
  { f: "merchant_velocity", v: 0.13 },
  { f: "geo_impossible_travel", v: 0.11 },
  { f: "ip_asn_risk", v: 0.09 },
  { f: "mcc_unusual", v: 0.07 },
  { f: "card_age_days", v: 0.06 },
  { f: "channel_mix_shift", v: 0.05 },
];

function ModelsPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="MLOps · Production observability"
        title="Model Intelligence Center"
        description="Active models, accuracy, drift, SHAP monitoring, feature importance, and version history."
      />

      <Panel title="Active models" dense>
        <div className="grid grid-cols-12 px-4 py-2 text-[10px] mono uppercase tracking-widest text-muted-foreground border-b border-border">
          <div className="col-span-3">Model</div>
          <div className="col-span-2">Type</div>
          <div className="col-span-1 text-right">Acc</div>
          <div className="col-span-1 text-right">Prec</div>
          <div className="col-span-1 text-right">Recall</div>
          <div className="col-span-1 text-right">F1</div>
          <div className="col-span-2">Drift</div>
          <div className="col-span-1 text-right">Status</div>
        </div>
        <ul>
          {models.map(m => {
            const driftPct = Math.min(1, m.drift / 0.4);
            return (
              <li key={m.name} className="grid grid-cols-12 px-4 py-3 border-b border-border/60 text-[12.5px] items-center hover:bg-surface-2/40 cursor-pointer">
                <div className="col-span-3 mono">{m.name}</div>
                <div className="col-span-2 text-muted-foreground">{m.type}</div>
                <div className="col-span-1 text-right mono tabular">{m.accuracy}</div>
                <div className="col-span-1 text-right mono tabular">{m.precision}</div>
                <div className="col-span-1 text-right mono tabular">{m.recall}</div>
                <div className="col-span-1 text-right mono tabular">{m.f1}</div>
                <div className="col-span-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{
                      width: `${driftPct * 100}%`,
                      background: m.drift > 0.2 ? "var(--risk-high)" : "var(--status-clear)",
                    }} />
                  </div>
                  <span className="mono tabular text-[11px]">{m.drift.toFixed(2)}</span>
                </div>
                <div className="col-span-1 text-right">
                  <span className={`mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                    m.status === "active" ? "bg-status-clear/15 text-status-clear" :
                    m.status === "shadow" ? "bg-primary/15 text-primary" :
                    "bg-risk-medium/15 text-risk-medium"
                  }`}>{m.status}</span>
                </div>
              </li>
            );
          })}
        </ul>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Global feature importance · FALCON-NEO v4.2">
          <div className="h-[280px]">
            <ResponsiveContainer>
              <BarChart data={features} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" horizontal={false} />
                <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <YAxis type="category" dataKey="f" width={170} tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <Bar dataKey="v" radius={[0, 2, 2, 0]} fill="var(--primary)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
        <Panel title="Recent model versions" dense>
          <ul>
            {[
              { v: "v4.2", s: "PROD", d: "promoted 4d ago", a: "+0.4% recall, -0.1% FPR" },
              { v: "v4.1", s: "ARCHIVED", d: "21d ago", a: "+1.1% recall" },
              { v: "v4.0", s: "ARCHIVED", d: "48d ago", a: "GNN features added" },
              { v: "v3.9", s: "ROLLED-BACK", d: "70d ago", a: "drift > 0.3 within 9d" },
            ].map(v => (
              <li key={v.v} className="px-4 py-3 border-b border-border/60">
                <div className="flex items-center gap-2">
                  <span className="mono">{v.v}</span>
                  <span className={`mono text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider ${
                    v.s === "PROD" ? "bg-status-clear/15 text-status-clear" :
                    v.s === "ROLLED-BACK" ? "bg-risk-critical/15 text-risk-critical" :
                    "bg-muted text-muted-foreground"
                  }`}>{v.s}</span>
                  <span className="ml-auto text-[11px] mono text-muted-foreground">{v.d}</span>
                </div>
                <div className="text-[12px] text-muted-foreground mt-1">{v.a}</div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
