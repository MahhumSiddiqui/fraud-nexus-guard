import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/panel";
import { RiskBadge, StatusPill } from "@/components/risk-badge";
import { generateTransactions } from "@/lib/mock-data";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Activity, MapPin, Pause, Play } from "lucide-react";

export const Route = createFileRoute("/monitoring")({
  head: () => ({ meta: [{ title: "Real-Time Monitoring — AFIOS" }] }),
  component: MonitoringPage,
});

function MonitoringPage() {
  const [feed, setFeed] = useState(() => generateTransactions(40));
  const [paused, setPaused] = useState(false);
  const [query, setQuery] = useState("");

  useEffect(() => {
    if (paused) return;
    const id = setInterval(() => {
      const tx = generateTransactions(1)[0];
      tx.id = `TX-${Math.random().toString(36).slice(2, 8).toUpperCase()}`;
      tx.ts = new Date().toISOString();
      setFeed(f => [tx, ...f].slice(0, 50));
    }, 1400);
    return () => clearInterval(id);
  }, [paused]);

  const filtered = feed.filter(t =>
    !query || t.id.toLowerCase().includes(query.toLowerCase()) || t.merchant.toLowerCase().includes(query.toLowerCase()) || t.country.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Streaming · sub-15ms decisioning"
        title="Real-Time Monitoring"
        description="Live transaction feed across all rails. Risk and confidence are computed in-flight."
        action={
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 text-[11px] mono uppercase tracking-wider text-status-clear">
              <span className="h-1.5 w-1.5 rounded-full bg-status-clear pulse-critical" /> Live · 2,184 TPS
            </span>
            <button onClick={() => setPaused(p => !p)} className="h-9 px-3 surface-panel text-[12px] inline-flex items-center gap-2">
              {paused ? <Play className="h-3.5 w-3.5" /> : <Pause className="h-3.5 w-3.5" />}
              {paused ? "Resume" : "Pause"}
            </button>
          </div>
        }
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        <MiniStat label="In-flight" value="2,184/s" color="status-clear" />
        <MiniStat label="Decisioned p50" value="11 ms" color="primary" />
        <MiniStat label="Velocity flags" value="38" color="risk-medium" />
        <MiniStat label="Geo anomalies" value="12" color="risk-high" />
      </div>

      <Panel
        title="Live Transaction Feed"
        action={
          <input
            value={query} onChange={e => setQuery(e.target.value)}
            placeholder="Filter TX, merchant, country…"
            className="h-8 w-72 bg-surface border border-border rounded-md px-2.5 text-[12px] mono focus:outline-none focus:border-primary"
          />
        }
        dense
      >
        <div className="grid grid-cols-12 px-4 py-2 text-[10px] mono uppercase tracking-widest text-muted-foreground border-b border-border">
          <div className="col-span-2">TX ID · Time</div>
          <div className="col-span-2">Customer · Device</div>
          <div className="col-span-2">Merchant · MCC</div>
          <div className="col-span-1">Geo</div>
          <div className="col-span-2 text-right">Amount</div>
          <div className="col-span-2">Risk · Confidence</div>
          <div className="col-span-1 text-right">Status</div>
        </div>
        <ul className="max-h-[560px] overflow-y-auto">
          <AnimatePresence initial={false}>
            {filtered.map(t => (
              <motion.li
                key={t.id}
                initial={{ opacity: 0, y: -6, backgroundColor: "color-mix(in oklch, var(--primary) 12%, transparent)" }}
                animate={{ opacity: 1, y: 0, backgroundColor: "rgba(0,0,0,0)" }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-12 items-center px-4 py-2 border-b border-border/60 text-[12px] hover:bg-surface-2/40"
              >
                <div className="col-span-2 mono">
                  <div className="text-foreground">{t.id}</div>
                  <div className="text-[10px] text-muted-foreground">{new Date(t.ts).toLocaleTimeString()}</div>
                </div>
                <div className="col-span-2 mono">
                  <div>{t.customer}</div>
                  <div className="text-[10px] text-muted-foreground">{t.device}</div>
                </div>
                <div className="col-span-2">
                  <div>{t.merchant}</div>
                  <div className="text-[10px] mono text-muted-foreground">MCC {t.mcc} · {t.channel}</div>
                </div>
                <div className="col-span-1 inline-flex items-center gap-1 text-[11px] mono">
                  <MapPin className="h-3 w-3 text-muted-foreground" />{t.country}
                </div>
                <div className="col-span-2 text-right mono tabular">
                  {t.currency} {t.amount.toLocaleString()}
                </div>
                <div className="col-span-2 flex items-center gap-2">
                  <RiskMeter value={t.risk} />
                  <span className="text-[10px] mono text-muted-foreground tabular">{t.confidence}%</span>
                </div>
                <div className="col-span-1 text-right"><StatusPill status={t.status} /></div>
              </motion.li>
            ))}
          </AnimatePresence>
        </ul>
      </Panel>
    </div>
  );
}

function RiskMeter({ value }: { value: number }) {
  const color = value > 85 ? "var(--risk-critical)" : value > 65 ? "var(--risk-high)" : value > 40 ? "var(--risk-medium)" : "var(--risk-safe)";
  return (
    <div className="flex items-center gap-1.5 w-full">
      <div className="flex-1 h-1.5 rounded-full bg-surface-3 overflow-hidden">
        <div className="h-full rounded-full" style={{ width: `${value}%`, background: color }} />
      </div>
      <span className="text-[11px] mono tabular w-7 text-right" style={{ color }}>{value}</span>
    </div>
  );
}

function MiniStat({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="surface-panel p-3 flex items-center gap-3">
      <Activity className={`h-4 w-4 text-${color}`} />
      <div>
        <div className="text-[10px] mono uppercase tracking-widest text-muted-foreground">{label}</div>
        <div className="text-lg font-semibold tabular">{value}</div>
      </div>
    </div>
  );
}
