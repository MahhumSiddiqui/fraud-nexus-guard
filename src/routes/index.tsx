import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/panel";
import { RiskBadge } from "@/components/risk-badge";
import { countryHeat, emergingThreats, fraudTrend, kpis, riskDistribution } from "@/lib/mock-data";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Cell, Line, Pie, PieChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { ArrowDownRight, ArrowUpRight, Download, Shield } from "lucide-react";
import { ReactNode } from "react";

export const Route = createFileRoute("/")({
  head: () => ({ meta: [{ title: "Executive Intelligence — AFIOS" }] }),
  component: ExecutivePage,
});

function ExecutivePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Command · Tier-3 Clearance"
        title="Executive Fraud Intelligence"
        description="Real-time posture across the institution. Updated every 4 seconds from streaming pipelines."
        action={
          <div className="flex items-center gap-2">
            <span className="text-[11px] mono uppercase tracking-wider text-muted-foreground">Window</span>
            <div className="surface-panel flex p-0.5 text-[11px] mono">
              {["24H", "7D", "30D", "QTD", "YTD"].map((p, i) => (
                <button key={p} className={`px-2.5 py-1 rounded ${i === 1 ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"}`}>{p}</button>
              ))}
            </div>
            <button className="ml-2 h-9 px-3 surface-panel text-[12px] inline-flex items-center gap-2 hover:border-border-strong">
              <Download className="h-3.5 w-3.5" /> Export brief
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <Kpi label="Transactions" value={fmtN(kpis.txnVolume.value)} delta={kpis.txnVolume.delta} hint="last 7d" />
        <Kpi label="Fraud Volume" value={fmtN(kpis.fraudVolume.value)} delta={kpis.fraudVolume.delta} hint="confirmed" tone="warn" />
        <Kpi label="Fraud Rate" value={(kpis.fraudRate.value * 100).toFixed(3) + "%"} delta={kpis.fraudRate.delta * 100} unit="bps" />
        <Kpi label="Loss Prevented" value={"$" + fmtN(kpis.lossPrevented.value)} delta={kpis.lossPrevented.delta} tone="good" />
        <Kpi label="Active Cases" value={fmtN(kpis.activeCases.value)} delta={kpis.activeCases.delta} unit="cases" />
        <Kpi label="Open Alerts" value={fmtN(kpis.openAlerts.value)} delta={kpis.openAlerts.delta} unit="alerts" />
        <Kpi label="Analyst Productivity" value={kpis.analystProd.value + "%"} delta={kpis.analystProd.delta} hint="SLA met" />
        <Kpi label="Mean Time to Investigate" value={kpis.mttiMinutes.value + "m"} delta={kpis.mttiMinutes.delta} unit="min" tone="good" inverse />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel
          className="lg:col-span-2"
          title="Fraud Trend & Forecast"
          subtitle="Confirmed fraud · Prevented loss · 7-day ARIMA forecast"
          action={<Legend dots={[["Fraud", "chart-5"], ["Prevented", "chart-1"], ["Forecast", "primary"]]} />}
        >
          <div className="h-[280px]">
            <ResponsiveContainer>
              <AreaChart data={fraudTrend} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="g1" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-5)" stopOpacity={0.55} />
                    <stop offset="95%" stopColor="var(--chart-5)" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="g2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--chart-1)" stopOpacity={0.4} />
                    <stop offset="95%" stopColor="var(--chart-1)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="day" tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Area type="monotone" dataKey="fraud" stroke="var(--chart-5)" strokeWidth={1.5} fill="url(#g1)" />
                <Area type="monotone" dataKey="prevented" stroke="var(--chart-1)" strokeWidth={1.5} fill="url(#g2)" />
                <Line type="monotone" dataKey="forecast" stroke="var(--primary)" strokeWidth={2} strokeDasharray="4 3" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Risk Distribution" subtitle="Population across risk tiers · last 24h">
          <div className="h-[280px] grid grid-cols-2 items-center gap-2">
            <ResponsiveContainer>
              <PieChart>
                <Pie data={riskDistribution} dataKey="value" innerRadius={48} outerRadius={80} strokeWidth={0}>
                  {riskDistribution.map((s) => <Cell key={s.name} fill={s.color} />)}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <ul className="space-y-1.5 text-[12px]">
              {riskDistribution.map(r => (
                <li key={r.name} className="flex items-center gap-2">
                  <span className="h-2 w-2 rounded-sm" style={{ background: r.color }} />
                  <span className="text-muted-foreground flex-1">{r.name}</span>
                  <span className="mono tabular">{fmtN(r.value)}</span>
                </li>
              ))}
            </ul>
          </div>
        </Panel>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel title="Global Threat Map" subtitle="Volume of fraud signals by geography" className="lg:col-span-2">
          <div className="grid grid-cols-6 sm:grid-cols-12 gap-1.5">
            {countryHeat.map((c) => {
              const intensity = Math.min(1, c.v / 8500);
              return (
                <div key={c.c} className="aspect-square rounded grid place-items-center text-[10px] mono"
                  style={{
                    background: `color-mix(in oklch, var(--risk-critical) ${Math.round(intensity * 80)}%, var(--surface-2))`,
                    color: intensity > 0.5 ? "white" : "var(--muted-foreground)",
                  }}
                  title={`${c.c}: ${c.v}`}
                >{c.c}</div>
              );
            })}
          </div>
          <div className="mt-4 h-[160px]">
            <ResponsiveContainer>
              <BarChart data={countryHeat} margin={{ top: 8, right: 0, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="c" tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <Tooltip content={<ChartTip />} />
                <Bar dataKey="v" radius={[2, 2, 0, 0]} fill="var(--chart-1)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Top Emerging Threats" subtitle="Last 48 hours · AI-classified">
          <ul className="divide-y divide-border -m-4">
            {emergingThreats.map(t => (
              <li key={t.id} className="px-4 py-3 hover:bg-surface-2/40 transition-colors cursor-pointer">
                <div className="flex items-start gap-2">
                  <Shield className="h-3.5 w-3.5 mt-0.5 text-primary" />
                  <div className="flex-1 min-w-0">
                    <div className="text-[13px] font-medium truncate">{t.name}</div>
                    <div className="text-[11px] mono text-muted-foreground mt-0.5">{t.id} · {t.region}</div>
                  </div>
                  <div className="text-right">
                    <RiskBadge level={t.severity as any} />
                    <div className="mt-1 text-[11px] mono tabular text-risk-high">+{t.delta}%</div>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}

function Kpi({ label, value, delta, hint, unit, tone = "neutral", inverse }: {
  label: string; value: ReactNode; delta: number; hint?: string; unit?: string;
  tone?: "good" | "warn" | "neutral"; inverse?: boolean;
}) {
  const good = inverse ? delta < 0 : delta > 0;
  const color = tone === "warn" ? "text-risk-high" : good ? "text-status-clear" : "text-risk-high";
  const Arrow = good ? ArrowUpRight : ArrowDownRight;
  return (
    <div className="surface-panel p-4 hover:border-border-strong transition-colors group">
      <div className="flex items-center justify-between">
        <span className="text-[10px] mono uppercase tracking-widest text-muted-foreground">{label}</span>
        <span className={`text-[11px] mono tabular inline-flex items-center gap-0.5 ${color}`}>
          <Arrow className="h-3 w-3" />{Math.abs(delta).toFixed(delta % 1 ? 1 : 0)}{unit === "bps" ? " bps" : "%"}
        </span>
      </div>
      <div className="mt-2 text-2xl font-semibold tracking-tight tabular">{value}</div>
      <div className="text-[11px] mono text-muted-foreground mt-0.5">{hint ?? unit ?? "vs prior period"}</div>
      <div className="mt-3 h-1 rounded-full bg-surface-3 overflow-hidden">
        <div className="h-full bg-gradient-to-r from-primary to-chart-2" style={{ width: `${40 + Math.abs(delta) * 3}%` }} />
      </div>
    </div>
  );
}

function Legend({ dots }: { dots: [string, string][] }) {
  return (
    <div className="flex items-center gap-3 text-[11px] mono uppercase tracking-wider text-muted-foreground">
      {dots.map(([l, c]) => (
        <span key={l} className="inline-flex items-center gap-1.5">
          <span className="h-2 w-2 rounded-full" style={{ background: `var(--${c})` }} />{l}
        </span>
      ))}
    </div>
  );
}

function ChartTip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="surface-panel px-2.5 py-1.5 text-[11px] mono shadow-xl">
      <div className="text-muted-foreground uppercase tracking-wider mb-1">{label}</div>
      {payload.map((p: any) => (
        <div key={p.dataKey} className="flex items-center gap-2">
          <span className="h-2 w-2 rounded-full" style={{ background: p.color }} />
          <span className="text-muted-foreground">{p.dataKey}</span>
          <span className="ml-auto tabular">{fmtN(p.value)}</span>
        </div>
      ))}
    </div>
  );
}

function fmtN(n: number) {
  if (Math.abs(n) >= 1_000_000) return (n / 1_000_000).toFixed(2) + "M";
  if (Math.abs(n) >= 1_000) return (n / 1_000).toFixed(1) + "k";
  return n.toLocaleString();
}
