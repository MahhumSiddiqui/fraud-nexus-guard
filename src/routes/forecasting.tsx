import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/panel";
import { Area, AreaChart, CartesianGrid, Line, ResponsiveContainer, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/forecasting")({
  head: () => ({ meta: [{ title: "Forecasting Center — AFIOS" }] }),
  component: ForecastingPage,
});

const fc = Array.from({ length: 28 }, (_, i) => ({
  d: `W${i + 1}`,
  actual: i < 18 ? 220 + Math.sin(i / 2) * 60 + i * 4 : undefined,
  forecast: i >= 16 ? 280 + Math.sin(i / 2) * 50 + (i - 16) * 12 : undefined,
  upper: i >= 16 ? 320 + (i - 16) * 18 : undefined,
  lower: i >= 16 ? 240 + (i - 16) * 6 : undefined,
}));

function ForecastingPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Predictive Intelligence"
        title="Forecasting Center"
        description="ARIMA + transformer ensemble forecasts of fraud volume, loss, geo concentration, and emerging pattern clusters."
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { l: "Forecasted weekly fraud (W+4)", v: "612 events", d: "+18%" },
          { l: "Predicted loss exposure", v: "$2.4M", d: "+22%" },
          { l: "Hot region", v: "LATAM", d: "↑ 38%" },
          { l: "Emerging clusters", v: "7", d: "+3 vs W-1" },
        ].map(k => (
          <div key={k.l} className="surface-panel p-4">
            <div className="text-[10px] mono uppercase tracking-widest text-muted-foreground">{k.l}</div>
            <div className="mt-1.5 text-2xl font-semibold tabular">{k.v}</div>
            <div className="text-[11px] mono text-risk-high mt-0.5">{k.d}</div>
          </div>
        ))}
      </div>

      <Panel title="Fraud volume forecast · 12-week horizon" subtitle="Actuals + ARIMA/transformer ensemble · 80% confidence band">
        <div className="h-[340px]">
          <ResponsiveContainer>
            <AreaChart data={fc} margin={{ top: 10, right: 8, left: -16, bottom: 0 }}>
              <defs>
                <linearGradient id="ci" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="var(--primary)" stopOpacity={0.25} />
                  <stop offset="95%" stopColor="var(--primary)" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
              <XAxis dataKey="d" tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
              <Area dataKey="upper" stroke="transparent" fill="url(#ci)" />
              <Area dataKey="lower" stroke="transparent" fill="var(--background)" />
              <Line dataKey="actual" stroke="var(--chart-1)" strokeWidth={2} dot={false} />
              <Line dataKey="forecast" stroke="var(--primary)" strokeWidth={2} strokeDasharray="4 3" dot={false} />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Geographic forecast (W+4)" dense>
          <ul>
            {[["LATAM","↑ 38%","high"],["EMEA","↑ 12%","medium"],["APAC","↓ 4%","low"],["NA","↑ 6%","medium"]].map(([r,d,t]) => (
              <li key={r} className="px-4 py-2.5 border-b border-border/60 flex items-center gap-3 text-[13px]">
                <span className="flex-1">{r}</span>
                <span className={`mono tabular ${t === "high" ? "text-risk-high" : "text-foreground"}`}>{d}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Predicted emerging clusters" dense>
          <ul>
            {[
              { id: "F-103", l: "QR-code phishing on transit cards", p: "0.86" },
              { id: "F-104", l: "BNPL stack-loan fraud", p: "0.78" },
              { id: "F-105", l: "AI-voice cloned wire requests", p: "0.91" },
              { id: "F-106", l: "Stablecoin off-ramp via DeFi mixers", p: "0.74" },
            ].map(c => (
              <li key={c.id} className="px-4 py-2.5 border-b border-border/60 flex items-center gap-3 text-[13px]">
                <span className="mono text-[11px] text-muted-foreground">{c.id}</span>
                <span className="flex-1">{c.l}</span>
                <span className="mono tabular text-risk-high">{c.p}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
