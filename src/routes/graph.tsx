import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/panel";
import { useMemo, useState } from "react";
import { motion } from "framer-motion";

export const Route = createFileRoute("/graph")({
  head: () => ({ meta: [{ title: "Fraud Graph — AFIOS" }] }),
  component: GraphPage,
});

type N = { id: string; label: string; type: "customer" | "device" | "ip" | "merchant" | "card" | "country"; x: number; y: number; risk: number };
type E = { a: string; b: string; w: number };

function GraphPage() {
  const { nodes, edges } = useMemo(() => buildCluster(), []);
  const [active, setActive] = useState<N | null>(nodes[0]);

  const typeColor: Record<N["type"], string> = {
    customer: "var(--chart-2)", device: "var(--chart-3)", ip: "var(--chart-4)",
    merchant: "var(--primary)", card: "var(--chart-6)", country: "var(--chart-5)",
  };

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Network Intelligence"
        title="Fraud Graph"
        description="Interactive entity-link graph. Nodes are customers, devices, IPs, merchants, cards, countries. Clusters surface organized rings."
      />
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_340px] gap-4">
        <Panel
          title="Cluster G-88 · Synthetic-ID Ring"
          subtitle="12 entities · 19 edges · network risk 0.92"
          action={<div className="flex gap-2 text-[11px] mono">
            {Object.entries(typeColor).map(([k, v]) => (
              <span key={k} className="inline-flex items-center gap-1.5 text-muted-foreground"><span className="h-2 w-2 rounded-full" style={{ background: v }} />{k}</span>
            ))}
          </div>}
        >
          <div className="relative h-[560px] rounded-md bg-surface-2/40 border border-border overflow-hidden">
            <div className="absolute inset-0 opacity-30"
              style={{ backgroundImage: "radial-gradient(circle at 1px 1px, var(--border-strong) 1px, transparent 0)", backgroundSize: "24px 24px" }} />
            <svg className="absolute inset-0 w-full h-full" viewBox="0 0 800 560">
              {edges.map((e, i) => {
                const a = nodes.find(n => n.id === e.a)!;
                const b = nodes.find(n => n.id === e.b)!;
                return (
                  <line key={i} x1={a.x} y1={a.y} x2={b.x} y2={b.y}
                    stroke="var(--border-strong)" strokeWidth={1 + e.w * 2} strokeOpacity={0.5} />
                );
              })}
              {nodes.map(n => {
                const isActive = active?.id === n.id;
                return (
                  <g key={n.id} onClick={() => setActive(n)} className="cursor-pointer">
                    {isActive && <circle cx={n.x} cy={n.y} r={28} fill={typeColor[n.type]} opacity={0.15} />}
                    <motion.circle
                      cx={n.x} cy={n.y} r={isActive ? 14 : 10}
                      fill={typeColor[n.type]} stroke="var(--background)" strokeWidth={2}
                      animate={{ r: isActive ? 14 : 10 }}
                    />
                    <text x={n.x} y={n.y + 26} textAnchor="middle" fontSize={10} fill="var(--muted-foreground)" fontFamily="var(--font-mono)">
                      {n.label}
                    </text>
                  </g>
                );
              })}
            </svg>
            <div className="absolute bottom-3 left-3 surface-panel px-3 py-1.5 text-[11px] mono text-muted-foreground">
              path analysis · 3 shared devices · 2 shared IPs
            </div>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Node Inspector">
            {active && (
              <div className="space-y-3 text-[12.5px]">
                <div>
                  <div className="text-[10px] mono uppercase tracking-widest text-muted-foreground">Entity</div>
                  <div className="mono text-foreground">{active.label}</div>
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <Field l="Type" v={active.type} />
                  <Field l="Risk" v={active.risk.toFixed(2)} accent />
                  <Field l="Cluster" v="G-88" />
                  <Field l="Degree" v={String(edges.filter(e => e.a === active.id || e.b === active.id).length)} />
                </div>
                <div className="surface-panel p-2.5 bg-primary/5 border-primary/30">
                  <div className="text-[10px] mono uppercase tracking-widest text-primary">Insight</div>
                  <p className="text-[12.5px] mt-1">Connected to 3 customers via device <span className="mono text-primary">dev_a8f2</span> created within 11 minutes — strong synthetic-ID indicator.</p>
                </div>
              </div>
            )}
          </Panel>

          <Panel title="Detected Rings" dense>
            <ul>
              {[
                { id: "G-88", n: "Synthetic-ID · LATAM", r: 0.92 },
                { id: "G-71", n: "Mule funnel · SE Asia", r: 0.81 },
                { id: "G-66", n: "Card testing · global", r: 0.74 },
                { id: "G-42", n: "Refund abuse · US", r: 0.61 },
              ].map(g => (
                <li key={g.id} className="px-3 py-2.5 border-b border-border/60 flex items-center gap-3 cursor-pointer hover:bg-surface-2/40">
                  <span className="mono text-[11px] text-muted-foreground">{g.id}</span>
                  <span className="flex-1 text-[12.5px]">{g.n}</span>
                  <span className="mono tabular text-risk-high text-[12px]">{g.r.toFixed(2)}</span>
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Field({ l, v, accent }: { l: string; v: string; accent?: boolean }) {
  return (
    <div>
      <div className="text-[10px] mono uppercase tracking-widest text-muted-foreground">{l}</div>
      <div className={`mt-0.5 mono tabular ${accent ? "text-risk-high" : ""}`}>{v}</div>
    </div>
  );
}

function buildCluster(): { nodes: N[]; edges: E[] } {
  const nodes: N[] = [
    { id: "c1", label: "CUS-48201", type: "customer", x: 200, y: 140, risk: 0.94 },
    { id: "c2", label: "CUS-48220", type: "customer", x: 360, y: 90, risk: 0.88 },
    { id: "c3", label: "CUS-48244", type: "customer", x: 540, y: 160, risk: 0.79 },
    { id: "d1", label: "dev_a8f2", type: "device", x: 280, y: 280, risk: 0.96 },
    { id: "d2", label: "dev_b14e", type: "device", x: 480, y: 290, risk: 0.71 },
    { id: "i1", label: "104.22.x.x", type: "ip", x: 140, y: 360, risk: 0.82 },
    { id: "i2", label: "185.7.x.x", type: "ip", x: 620, y: 360, risk: 0.78 },
    { id: "m1", label: "Coinbase", type: "merchant", x: 380, y: 430, risk: 0.55 },
    { id: "m2", label: "Wise FX", type: "merchant", x: 580, y: 470, risk: 0.49 },
    { id: "card1", label: "**** 4811", type: "card", x: 100, y: 220, risk: 0.86 },
    { id: "card2", label: "**** 9304", type: "card", x: 700, y: 220, risk: 0.74 },
    { id: "co1", label: "BR", type: "country", x: 400, y: 510, risk: 0.62 },
  ];
  const edges: E[] = [
    { a: "c1", b: "d1", w: 1 }, { a: "c2", b: "d1", w: 1 }, { a: "c3", b: "d2", w: 1 },
    { a: "c1", b: "card1", w: 1 }, { a: "c3", b: "card2", w: 1 },
    { a: "d1", b: "i1", w: 0.8 }, { a: "d2", b: "i2", w: 0.7 },
    { a: "c1", b: "m1", w: 0.6 }, { a: "c2", b: "m1", w: 0.6 }, { a: "c3", b: "m2", w: 0.5 },
    { a: "m1", b: "co1", w: 0.5 }, { a: "m2", b: "co1", w: 0.4 },
    { a: "c2", b: "d2", w: 0.3 }, { a: "card1", b: "i1", w: 0.4 }, { a: "card2", b: "i2", w: 0.4 },
    { a: "c1", b: "c2", w: 0.2 }, { a: "c2", b: "c3", w: 0.2 },
  ];
  return { nodes, edges };
}
