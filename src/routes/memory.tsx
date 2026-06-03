import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/panel";
import { Area, AreaChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/memory")({
  head: () => ({ meta: [{ title: "Fraud Memory Engine — AFIOS" }] }),
  component: MemoryPage,
});

const spending = Array.from({ length: 60 }, (_, i) => ({
  d: i, amt: 80 + Math.sin(i / 5) * 30 + (i > 52 ? 380 : 0),
  baseline: 100,
}));

function MemoryPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Persistent Behavioral Memory"
        title="Fraud Memory Engine"
        description="Long-term behavioral profile per entity. Detects evolution, drift, and silent compromises that point-in-time rules miss."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[320px_1fr] gap-4">
        <Panel title="Subject" subtitle="CUS-48201 · Tier-2 retail customer">
          <div className="space-y-3 text-[12.5px]">
            <Row l="Account age" v="4y 2m" />
            <Row l="Lifetime spend" v="$184,402" />
            <Row l="Avg ticket" v="$92.40" />
            <Row l="Active devices" v="2 known · 1 new (11m)" warn />
            <Row l="Typical hours" v="07:00 – 21:00 GMT-5" />
            <Row l="Top merchants" v="Amazon, Whole Foods, Uber" />
            <Row l="Risk evolution" v="0.12 → 0.71 (last 24h)" warn />
          </div>
          <div className="mt-4 surface-panel p-3 bg-risk-high/8 border-risk-high/30">
            <div className="text-[10px] mono uppercase tracking-widest text-risk-high">Memory Alert</div>
            <p className="text-[12.5px] mt-1">Behavior now <b>3.2σ</b> outside long-term envelope. New device + new geo + 6× normal ticket — coherent ATO signature.</p>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Spending Envelope · 60d" subtitle="Live vs persistent baseline">
            <div className="h-[260px]">
              <ResponsiveContainer>
                <AreaChart data={spending} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                  <defs>
                    <linearGradient id="m1" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.45} />
                      <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                  <XAxis dataKey="d" tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                  <Area dataKey="baseline" stroke="var(--muted-foreground)" strokeDasharray="3 3" fill="transparent" />
                  <Area dataKey="amt" stroke="var(--primary)" strokeWidth={1.5} fill="url(#m1)" />
                </AreaChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[
              { t: "Device history", items: ["MacBook Pro · 4y", "iPhone 14 · 2y", "Unknown Win · 11m ago"] },
              { t: "Geo history", items: ["Brooklyn, US · 96%", "Boston, US · 3%", "São Paulo, BR · 1m ago"] },
              { t: "Merchant history", items: ["Amazon · 38%", "Whole Foods · 14%", "Coinbase · first today"] },
            ].map(b => (
              <Panel key={b.t} title={b.t} dense>
                <ul>
                  {b.items.map((it, i) => (
                    <li key={i} className={`px-3 py-2.5 border-b border-border/60 text-[12.5px] last:border-0 ${i === 2 ? "text-risk-high" : ""}`}>{it}</li>
                  ))}
                </ul>
              </Panel>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

function Row({ l, v, warn }: { l: string; v: string; warn?: boolean }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <span className="text-[11px] mono uppercase tracking-widest text-muted-foreground">{l}</span>
      <span className={`mono tabular ${warn ? "text-risk-high" : ""}`}>{v}</span>
    </div>
  );
}
