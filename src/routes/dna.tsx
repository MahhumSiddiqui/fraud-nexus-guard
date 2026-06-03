import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/panel";
import { PolarAngleAxis, PolarGrid, Radar, RadarChart, ResponsiveContainer } from "recharts";

export const Route = createFileRoute("/dna")({
  head: () => ({ meta: [{ title: "Fraud DNA Profiles — AFIOS" }] }),
  component: DnaPage,
});

const dna = [
  { axis: "Spending", baseline: 70, current: 92 },
  { axis: "Merchant", baseline: 60, current: 85 },
  { axis: "Device", baseline: 80, current: 30 },
  { axis: "Time", baseline: 65, current: 40 },
  { axis: "Travel", baseline: 50, current: 90 },
  { axis: "Channel", baseline: 70, current: 55 },
];

function DnaPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Behavioral Fingerprinting"
        title="Fraud DNA Profiles"
        description="Each entity has a multi-dimensional behavioral fingerprint. Drift across DNA strands is the earliest leading indicator."
      />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel title="DNA Helix · CUS-48201" subtitle="Baseline vs current — deviation 6.4σ" className="lg:col-span-2">
          <div className="h-[420px]">
            <ResponsiveContainer>
              <RadarChart data={dna} outerRadius="78%">
                <PolarGrid stroke="var(--border)" />
                <PolarAngleAxis dataKey="axis" tick={{ fill: "var(--muted-foreground)", fontSize: 11, fontFamily: "var(--font-mono)" }} />
                <Radar dataKey="baseline" stroke="var(--chart-2)" fill="var(--chart-2)" fillOpacity={0.18} strokeWidth={1.5} />
                <Radar dataKey="current" stroke="var(--risk-critical)" fill="var(--risk-critical)" fillOpacity={0.22} strokeWidth={1.5} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <div className="space-y-4">
          {[
            { strand: "Spending DNA", v: "+ $580 vs baseline $90", risk: 92 },
            { strand: "Merchant DNA", v: "Coinbase · first transaction ever", risk: 85 },
            { strand: "Device DNA", v: "Unseen Win device · 11m old", risk: 96 },
            { strand: "Time DNA", v: "03:42 GMT-5 · outside normal window", risk: 78 },
            { strand: "Travel DNA", v: "Impossible travel: NY → SP in 18m", risk: 99 },
          ].map(s => (
            <div key={s.strand} className="surface-panel p-3.5">
              <div className="flex items-center justify-between">
                <div className="text-[11px] mono uppercase tracking-widest text-muted-foreground">{s.strand}</div>
                <span className={`mono tabular text-[12px] ${s.risk > 85 ? "text-risk-critical" : "text-risk-high"}`}>{s.risk}</span>
              </div>
              <div className="text-[13px] mt-1.5">{s.v}</div>
              <div className="mt-2 h-1 rounded-full bg-surface-3 overflow-hidden">
                <div className="h-full rounded-full" style={{
                  width: `${s.risk}%`,
                  background: s.risk > 85 ? "var(--risk-critical)" : "var(--risk-high)",
                }} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
