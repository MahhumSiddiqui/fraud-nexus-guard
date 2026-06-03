import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/panel";
import { useState } from "react";
import { Play } from "lucide-react";

export const Route = createFileRoute("/simulation")({
  head: () => ({ meta: [{ title: "Simulation Lab — AFIOS" }] }),
  component: SimulationPage,
});

function SimulationPage() {
  const [threshold, setThreshold] = useState(75);
  const [velocity, setVelocity] = useState(4);
  const [geo, setGeo] = useState(true);

  const captureRate = Math.min(99, 60 + (95 - threshold) * 0.6 + (velocity - 1) * 4 + (geo ? 6 : 0));
  const fpRate = Math.max(0.1, (95 - threshold) * 0.04 + (velocity - 1) * 0.18 + (geo ? 0.4 : 0));
  const revImpact = -((velocity - 1) * 1.2 + (geo ? 0.8 : 0) + (95 - threshold) * 0.05);
  const opsCost = 200 + (95 - threshold) * 8 + velocity * 60 + (geo ? 120 : 0);

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Counterfactual Engineering"
        title="Fraud Simulation Lab"
        description="Test rules, models, thresholds, and policies against the last 90 days of traffic before promoting to production."
      />

      <div className="grid grid-cols-1 lg:grid-cols-[400px_1fr] gap-4">
        <Panel title="Policy under test">
          <div className="space-y-5">
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[12px]">Risk threshold</label>
                <span className="mono tabular text-primary">{threshold}</span>
              </div>
              <input type="range" min={40} max={95} value={threshold} onChange={e => setThreshold(+e.target.value)} className="w-full accent-primary" />
            </div>
            <div>
              <div className="flex items-center justify-between mb-1">
                <label className="text-[12px]">Velocity gate · txns / hour</label>
                <span className="mono tabular text-primary">{velocity}</span>
              </div>
              <input type="range" min={1} max={10} value={velocity} onChange={e => setVelocity(+e.target.value)} className="w-full accent-primary" />
            </div>
            <label className="flex items-center gap-2 text-[12.5px] cursor-pointer">
              <input type="checkbox" checked={geo} onChange={e => setGeo(e.target.checked)} className="accent-primary h-4 w-4" />
              Enable geo-impossible-travel rule
            </label>
            <div className="pt-3 border-t border-border">
              <div className="text-[10px] mono uppercase tracking-widest text-muted-foreground mb-2">Backtest window</div>
              <div className="grid grid-cols-3 gap-1.5 text-[11px] mono">
                {["30d", "60d", "90d"].map((w, i) => (
                  <button key={w} className={`py-1.5 rounded ${i === 2 ? "bg-primary text-primary-foreground" : "bg-surface-2"}`}>{w}</button>
                ))}
              </div>
            </div>
            <button className="w-full h-10 rounded-md bg-primary text-primary-foreground font-medium inline-flex items-center justify-center gap-2">
              <Play className="h-4 w-4" /> Run simulation
            </button>
          </div>
        </Panel>

        <div className="grid grid-cols-2 gap-4">
          <Impact label="Fraud capture rate" value={captureRate.toFixed(1) + "%"} tone="good" sub="+8.2 pts vs current" />
          <Impact label="False-positive rate" value={fpRate.toFixed(2) + "%"} tone="warn" sub="+0.14 pts vs current" />
          <Impact label="Revenue impact" value={revImpact.toFixed(2) + "%"} tone="warn" sub="annualized" />
          <Impact label="Operational cost" value={"$" + Math.round(opsCost).toLocaleString() + "/d"} tone="neutral" sub="incremental analyst load" />
          <Panel title="Per-segment fraud capture" className="col-span-2" dense>
            <ul>
              {[
                { s: "Card-not-present · US", v: "+12.4%" },
                { s: "Wire · EU", v: "+6.8%" },
                { s: "Wallet · LATAM", v: "+18.1%" },
                { s: "ACH · US", v: "+3.2%" },
                { s: "Card-present · global", v: "+1.4%" },
              ].map(s => (
                <li key={s.s} className="px-4 py-2.5 border-b border-border/60 flex justify-between text-[13px]">
                  <span>{s.s}</span><span className="mono tabular text-status-clear">{s.v}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Impact({ label, value, tone, sub }: { label: string; value: string; tone: "good" | "warn" | "neutral"; sub: string }) {
  const c = tone === "good" ? "text-status-clear" : tone === "warn" ? "text-risk-high" : "text-foreground";
  return (
    <div className="surface-panel p-5">
      <div className="text-[10px] mono uppercase tracking-widest text-muted-foreground">{label}</div>
      <div className={`mt-2 text-3xl font-semibold tabular ${c}`}>{value}</div>
      <div className="text-[11px] mono text-muted-foreground mt-1">{sub}</div>
    </div>
  );
}
