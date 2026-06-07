import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/panel";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Database, Search, Sparkles, TrendingDown } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/features")({
  head: () => ({ meta: [{ title: "Feature Intelligence — AFIOS" }] }),
  component: FeaturesPage,
});

const CATS = [
  { k: "Customer", n: 412, drift: 0.04 },
  { k: "Device", n: 268, drift: 0.18 },
  { k: "Merchant", n: 184, drift: 0.07 },
  { k: "Transaction", n: 521, drift: 0.11 },
  { k: "Behavioral", n: 296, drift: 0.22 },
  { k: "Graph", n: 142, drift: 0.31 },
];

const TOP = [
  { f: "device_unseen_30d", imp: 0.184, use: 98, drift: 0.04, cat: "Device", health: "ok" },
  { f: "amount_zscore_customer", imp: 0.152, use: 99, drift: 0.06, cat: "Transaction", health: "ok" },
  { f: "merchant_velocity_1h", imp: 0.137, use: 96, drift: 0.09, cat: "Merchant", health: "ok" },
  { f: "graph_cluster_risk", imp: 0.121, use: 88, drift: 0.27, cat: "Graph", health: "warn" },
  { f: "behavior_session_entropy", imp: 0.108, use: 91, drift: 0.31, cat: "Behavioral", health: "warn" },
  { f: "geo_impossible_travel", imp: 0.094, use: 84, drift: 0.05, cat: "Customer", health: "ok" },
  { f: "ip_asn_risk_score", imp: 0.087, use: 79, drift: 0.12, cat: "Device", health: "ok" },
  { f: "mcc_unusual_for_customer", imp: 0.071, use: 76, drift: 0.18, cat: "Transaction", health: "ok" },
  { f: "card_age_days", imp: 0.063, use: 71, drift: 0.02, cat: "Customer", health: "ok" },
  { f: "channel_mix_shift_7d", imp: 0.054, use: 68, drift: 0.41, cat: "Behavioral", health: "crit" },
];

const DRIFT_SERIES = Array.from({ length: 24 }, (_, i) => ({
  h: `${i}h`,
  device: 0.04 + Math.sin(i / 3) * 0.02,
  behavior: 0.12 + Math.sin(i / 2) * 0.06 + i * 0.005,
  graph: 0.18 + Math.cos(i / 4) * 0.05 + i * 0.004,
}));

function FeaturesPage() {
  const [q, setQ] = useState("");
  const rows = TOP.filter(r => r.f.includes(q.toLowerCase()));
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Feature Store · MLOps"
        title="Feature Intelligence Center"
        description="Live visibility into the feature engineering layer — health, drift, importance, and lineage across the production feature store."
        action={
          <div className="flex items-center gap-2">
            <span className="surface-panel inline-flex items-center gap-2 h-9 px-3 text-[12px]">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              <span className="mono uppercase tracking-wider text-muted-foreground">AI insight</span>
              <span>3 features drifting beyond tolerance — auto-tuning candidates ready.</span>
            </span>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        {[
          { l: "Total features", v: "1,823", s: "across 6 domains" },
          { l: "Active", v: "1,694", s: "in production" },
          { l: "Deprecated", v: "129", s: "scheduled removal" },
          { l: "Drifting", v: "47", s: "above 0.20 threshold", tone: "warn" as const },
          { l: "Avg health", v: "94.2%", s: "weighted by usage" },
        ].map(k => (
          <div key={k.l} className="surface-panel p-4">
            <div className="text-[10px] mono uppercase tracking-widest text-muted-foreground">{k.l}</div>
            <div className={`mt-2 text-2xl font-semibold tabular ${k.tone === "warn" ? "text-risk-high" : ""}`}>{k.v}</div>
            <div className="text-[11px] mono text-muted-foreground mt-0.5">{k.s}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel title="Feature categories" subtitle="Population & average drift per domain" className="lg:col-span-2">
          <div className="h-[260px]">
            <ResponsiveContainer>
              <BarChart data={CATS} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="k" tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "var(--surface-2)" }} contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", fontSize: 11 }} />
                <Bar dataKey="n" radius={[3, 3, 0, 0]}>
                  {CATS.map((c, i) => <Cell key={i} fill={c.drift > 0.2 ? "var(--risk-high)" : "var(--chart-1)"} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Drift over time" subtitle="Rolling 24h · top categories">
          <div className="h-[260px]">
            <ResponsiveContainer>
              <LineChart data={DRIFT_SERIES} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="h" tick={{ fill: "var(--muted-foreground)", fontSize: 9, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 9, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", fontSize: 11 }} />
                <Line type="monotone" dataKey="device" stroke="var(--chart-1)" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="behavior" stroke="var(--chart-3)" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="graph" stroke="var(--risk-high)" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel
        title="Top contributing features"
        subtitle="Ranked by SHAP impact · production"
        action={
          <div className="surface-panel inline-flex items-center gap-2 h-8 px-2.5 text-[12px]">
            <Search className="h-3.5 w-3.5 text-muted-foreground" />
            <input value={q} onChange={e => setQ(e.target.value)} placeholder="Search features…" className="bg-transparent outline-none w-56 text-[12px]" />
          </div>
        }
        dense
      >
        <div className="grid grid-cols-12 px-4 py-2 text-[10px] mono uppercase tracking-widest text-muted-foreground border-b border-border">
          <div className="col-span-4">Feature</div>
          <div className="col-span-2">Category</div>
          <div className="col-span-2">Importance</div>
          <div className="col-span-1 text-right">Usage</div>
          <div className="col-span-2">Drift</div>
          <div className="col-span-1 text-right">Health</div>
        </div>
        <ul>
          {rows.map(r => (
            <li key={r.f} className="grid grid-cols-12 px-4 py-2.5 border-b border-border/60 text-[12.5px] items-center hover:bg-surface-2/40 cursor-pointer">
              <div className="col-span-4 mono">{r.f}</div>
              <div className="col-span-2 text-muted-foreground">{r.cat}</div>
              <div className="col-span-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                  <div className="h-full bg-primary rounded-full" style={{ width: `${r.imp * 400}%` }} />
                </div>
                <span className="mono tabular text-[11px]">{r.imp.toFixed(3)}</span>
              </div>
              <div className="col-span-1 text-right mono tabular">{r.use}%</div>
              <div className="col-span-2 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                  <div className="h-full rounded-full" style={{ width: `${Math.min(1, r.drift / 0.5) * 100}%`, background: r.drift > 0.3 ? "var(--risk-critical)" : r.drift > 0.15 ? "var(--risk-high)" : "var(--status-clear)" }} />
                </div>
                <span className="mono tabular text-[11px]">{r.drift.toFixed(2)}</span>
              </div>
              <div className="col-span-1 text-right">
                <span className={`mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${
                  r.health === "ok" ? "bg-status-clear/15 text-status-clear" :
                  r.health === "warn" ? "bg-risk-medium/15 text-risk-medium" :
                  "bg-risk-critical/15 text-risk-critical"
                }`}>{r.health}</span>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Feature lineage" subtitle="device_unseen_30d · upstream → downstream">
          <ol className="text-[12.5px] space-y-2">
            {[
              { s: "raw.events.device_fp", t: "Source · Kafka" },
              { s: "stg.device_seen_history", t: "dbt staging · 7d window" },
              { s: "feat.device_unseen_30d", t: "Feature · Materialized hourly" },
              { s: "model.FALCON-NEO v4.2", t: "Consumer · live" },
              { s: "model.GRAPHSENSE v2.1", t: "Consumer · live" },
            ].map((s, i, a) => (
              <li key={s.s} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className="h-2 w-2 rounded-full bg-primary" />
                  {i < a.length - 1 && <div className="w-px flex-1 bg-border my-1" style={{ minHeight: 16 }} />}
                </div>
                <div className="pb-2">
                  <div className="mono">{s.s}</div>
                  <div className="text-[11px] text-muted-foreground">{s.t}</div>
                </div>
              </li>
            ))}
          </ol>
        </Panel>
        <Panel title="AI recommendations" subtitle="Generated by Feature Copilot">
          <ul className="space-y-3 text-[13px]">
            {[
              { i: TrendingDown, t: "Retire channel_mix_shift_7d", d: "Drift exceeds 0.40 for 18h. Replace with shift_14d_robust (shadow A/B already +0.3% recall)." },
              { i: Sparkles, t: "Promote graph_cluster_risk_v2", d: "Shadow feature outperforms v1 by 6.2% precision on synthetic-ID cohort." },
              { i: Database, t: "Backfill merchant_chargeback_velocity", d: "Missing rate 4.2% on EU traffic. Reprocess last 30d windows." },
            ].map((r, i) => (
              <li key={i} className="surface-panel p-3 flex items-start gap-3">
                <div className="h-8 w-8 rounded-md bg-primary/15 text-primary grid place-items-center shrink-0"><r.i className="h-4 w-4" /></div>
                <div>
                  <div className="font-medium">{r.t}</div>
                  <div className="text-[12px] text-muted-foreground mt-0.5">{r.d}</div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
