import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/panel";
import { RiskBadge } from "@/components/risk-badge";
import { Cell, Pie, PieChart, PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";
import { ArrowRight, Brain, GitBranch, Network, Shield, Sparkles, Workflow } from "lucide-react";

export const Route = createFileRoute("/risk")({
  head: () => ({ meta: [{ title: "Risk Orchestration — AFIOS" }] }),
  component: RiskPage,
});

const COMPONENTS = [
  { k: "ML", v: 92, w: 0.32, c: "var(--chart-1)" },
  { k: "Behavioral", v: 81, w: 0.18, c: "var(--chart-2)" },
  { k: "Graph", v: 88, w: 0.18, c: "var(--chart-3)" },
  { k: "Rules", v: 74, w: 0.12, c: "var(--chart-4)" },
  { k: "Historical", v: 66, w: 0.10, c: "var(--chart-5)" },
  { k: "Fraud DNA", v: 90, w: 0.10, c: "var(--primary)" },
];

const FINAL = Math.round(COMPONENTS.reduce((s, c) => s + c.v * c.w, 0));

const PIPELINE = [
  { i: Workflow, k: "Transaction", v: "TX-DEXTR · $4,820" },
  { i: Sparkles, k: "Features", v: "184 features · 11ms" },
  { i: Brain, k: "Models", v: "FALCON-NEO + GRAPHSENSE" },
  { i: Shield, k: "Rules", v: "12 of 312 fired" },
  { i: Network, k: "Graph", v: "cluster #88 · risk 0.91" },
  { i: GitBranch, k: "Behavior", v: "DNA deviation +6.4σ" },
];

const TIMELINE = [
  { t: "T+0ms", e: "Transaction ingested via Kafka", c: "neutral" },
  { t: "T+8ms", e: "184 features hydrated from Feature Store", c: "neutral" },
  { t: "T+11ms", e: "FALCON-NEO score: 0.92 (critical)", c: "warn" },
  { t: "T+13ms", e: "GRAPHSENSE: cluster #88 match — mule funnel", c: "warn" },
  { t: "T+15ms", e: "Behavior: DNA deviation +6.4σ", c: "warn" },
  { t: "T+17ms", e: "Decision: DECLINE · case auto-opened CASE-4441", c: "crit" },
];

function RiskPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Risk Orchestration · Transaction TX-DEXTR"
        title="Risk Orchestration Center"
        description="Complete transparency into how the enterprise risk score is composed, weighted, and decided — for every transaction."
        action={
          <div className="flex items-center gap-2">
            <button className="h-9 px-3 surface-panel text-[12px]">Previous TX</button>
            <button className="h-9 px-3 bg-primary text-primary-foreground rounded-md text-[12px]">Open case</button>
          </div>
        }
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel title="Final risk score" subtitle="Weighted composite · live">
          <div className="flex items-center gap-6">
            <div className="relative h-36 w-36 shrink-0">
              <ResponsiveContainer>
                <PieChart>
                  <Pie data={[{ v: FINAL }, { v: 100 - FINAL }]} dataKey="v" innerRadius={52} outerRadius={68} startAngle={90} endAngle={-270} strokeWidth={0}>
                    <Cell fill="var(--risk-critical)" />
                    <Cell fill="var(--surface-3)" />
                  </Pie>
                </PieChart>
              </ResponsiveContainer>
              <div className="absolute inset-0 grid place-items-center">
                <div className="text-center">
                  <div className="text-4xl font-semibold tabular">{FINAL}</div>
                  <div className="text-[10px] mono uppercase tracking-widest text-muted-foreground">of 100</div>
                </div>
              </div>
            </div>
            <div className="space-y-2 text-[12.5px]">
              <div className="flex items-center gap-2"><span className="text-muted-foreground w-24">Tier</span><RiskBadge level="critical" /></div>
              <div className="flex items-center gap-2"><span className="text-muted-foreground w-24">Confidence</span><span className="mono tabular">94.2%</span></div>
              <div className="flex items-center gap-2"><span className="text-muted-foreground w-24">Decision</span><span className="mono text-risk-critical uppercase tracking-wider">Decline + case</span></div>
              <div className="flex items-center gap-2"><span className="text-muted-foreground w-24">Latency</span><span className="mono tabular">17ms</span></div>
            </div>
          </div>
        </Panel>

        <Panel title="Risk composition" subtitle="Score per signal · weighted" className="lg:col-span-2">
          <div className="grid grid-cols-2 gap-6 items-center">
            <div className="h-[220px]">
              <ResponsiveContainer>
                <RadarChart data={COMPONENTS} outerRadius="80%">
                  <PolarGrid stroke="var(--border)" />
                  <PolarAngleAxis dataKey="k" tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }} />
                  <Radar dataKey="v" stroke="var(--primary)" fill="var(--primary)" fillOpacity={0.25} />
                </RadarChart>
              </ResponsiveContainer>
            </div>
            <ul className="space-y-2 text-[12.5px]">
              {COMPONENTS.map(c => (
                <li key={c.k} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-full" style={{ background: c.c }} />
                  <span className="w-24 text-muted-foreground">{c.k}</span>
                  <div className="flex-1 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                    <div className="h-full rounded-full" style={{ width: `${c.v}%`, background: c.c }} />
                  </div>
                  <span className="mono tabular w-10 text-right">{c.v}</span>
                  <span className="mono tabular text-[10px] text-muted-foreground w-12 text-right">×{c.w.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>

      <Panel title="Decision flow" subtitle="End-to-end lineage of this risk decision">
        <div className="flex items-center gap-2 overflow-x-auto pb-1">
          {PIPELINE.map((p, i) => (
            <div key={p.k} className="flex items-center gap-2 shrink-0">
              <div className="surface-panel px-3 py-2.5 min-w-[180px]">
                <div className="flex items-center gap-2 text-[10px] mono uppercase tracking-widest text-primary"><p.i className="h-3.5 w-3.5" />{p.k}</div>
                <div className="text-[12.5px] mt-1">{p.v}</div>
              </div>
              {i < PIPELINE.length - 1 && <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />}
            </div>
          ))}
          <ArrowRight className="h-4 w-4 text-muted-foreground shrink-0" />
          <div className="shrink-0 px-3 py-2.5 rounded-md bg-risk-critical/15 text-risk-critical border border-risk-critical/30 min-w-[180px]">
            <div className="text-[10px] mono uppercase tracking-widest">Decision</div>
            <div className="text-[13px] font-semibold mt-1">DECLINE + CASE</div>
          </div>
        </div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Decision timeline" subtitle="Ordered events for this transaction">
          <ol className="space-y-3">
            {TIMELINE.map((t, i) => (
              <li key={i} className="flex items-start gap-3 text-[12.5px]">
                <span className="mono tabular text-[11px] text-muted-foreground w-14 shrink-0 pt-0.5">{t.t}</span>
                <span className={`h-2 w-2 rounded-full mt-1.5 shrink-0 ${t.c === "crit" ? "bg-risk-critical" : t.c === "warn" ? "bg-risk-high" : "bg-primary"}`} />
                <span>{t.e}</span>
              </li>
            ))}
          </ol>
        </Panel>
        <Panel title="AI explanation" subtitle="Why this decision · plain language">
          <div className="space-y-3 text-[13px] leading-relaxed">
            <p>The transaction was declined because the <span className="text-foreground font-medium">behavioral signature deviates 6.4σ</span> from the customer's 90-day fraud DNA, combined with a high-confidence match (0.91) to <span className="text-foreground font-medium">graph cluster #88</span> — a known mule funnel cleared in CASE-4319.</p>
            <p className="text-muted-foreground">Top three contributing features: <span className="mono text-foreground">graph_cluster_risk (0.23)</span>, <span className="mono text-foreground">behavior_session_entropy (0.19)</span>, <span className="mono text-foreground">device_unseen_30d (0.14)</span>.</p>
            <div className="surface-panel p-3 bg-primary/5 border-primary/30">
              <div className="text-[10px] mono uppercase tracking-widest text-primary mb-1">Recommended next action</div>
              <div>Escalate CASE-4441 to Tier-3 and freeze related accounts within cluster #88 (12 entities).</div>
            </div>
          </div>
        </Panel>
      </div>
    </div>
  );
}
