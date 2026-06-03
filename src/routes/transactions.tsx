import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/panel";
import { StatusPill } from "@/components/risk-badge";
import { generateTransactions } from "@/lib/mock-data";
import { useMemo, useState } from "react";
import { Brain, ChevronRight, Filter, MapPin, Shield, Sparkles } from "lucide-react";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

export const Route = createFileRoute("/transactions")({
  head: () => ({ meta: [{ title: "Transactions — AFIOS" }] }),
  component: TransactionsPage,
});

function TransactionsPage() {
  const txns = useMemo(() => generateTransactions(60), []);
  const [selected, setSelected] = useState(txns[0]);

  const shap = [
    { f: "amount_zscore", v: 0.42 },
    { f: "device_unseen", v: 0.31 },
    { f: "merchant_velocity_1h", v: 0.18 },
    { f: "geo_distance_24h", v: 0.14 },
    { f: "mcc_unusual_for_customer", v: 0.09 },
    { f: "ip_asn_risk", v: 0.06 },
    { f: "time_of_day_anomaly", v: -0.04 },
    { f: "card_age_days", v: -0.07 },
  ];

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Investigation Surface"
        title="Transactions"
        description="Drill into any transaction. SHAP-explained decisions, entity links, and AI narratives."
      />

      <div className="grid grid-cols-1 xl:grid-cols-[1fr_540px] gap-4">
        <Panel
          title="All Transactions"
          subtitle={`${txns.length} records · filterable`}
          action={
            <button className="h-8 px-2.5 surface-panel text-[11px] inline-flex items-center gap-1.5">
              <Filter className="h-3 w-3" /> Filters
            </button>
          }
          dense
        >
          <div className="grid grid-cols-12 px-4 py-2 text-[10px] mono uppercase tracking-widest text-muted-foreground border-b border-border">
            <div className="col-span-3">TX · Customer</div>
            <div className="col-span-3">Merchant</div>
            <div className="col-span-2 text-right">Amount</div>
            <div className="col-span-2">Risk</div>
            <div className="col-span-2 text-right">Status</div>
          </div>
          <ul className="max-h-[640px] overflow-y-auto">
            {txns.map(t => (
              <li
                key={t.id}
                onClick={() => setSelected(t)}
                className={`grid grid-cols-12 items-center px-4 py-2.5 border-b border-border/60 text-[12px] cursor-pointer ${selected.id === t.id ? "bg-primary/8" : "hover:bg-surface-2/40"}`}
              >
                <div className="col-span-3 mono">
                  <div>{t.id}</div>
                  <div className="text-[10px] text-muted-foreground">{t.customer}</div>
                </div>
                <div className="col-span-3">
                  <div>{t.merchant}</div>
                  <div className="text-[10px] mono text-muted-foreground"><MapPin className="h-2.5 w-2.5 inline" /> {t.country} · MCC {t.mcc}</div>
                </div>
                <div className="col-span-2 text-right mono tabular">{t.currency} {t.amount.toLocaleString()}</div>
                <div className="col-span-2 mono tabular">
                  <span className={t.risk > 85 ? "text-risk-critical" : t.risk > 65 ? "text-risk-high" : t.risk > 40 ? "text-risk-medium" : "text-risk-safe"}>{t.risk}</span>
                  <span className="text-muted-foreground"> / {t.confidence}%</span>
                </div>
                <div className="col-span-2 text-right"><StatusPill status={t.status} /></div>
              </li>
            ))}
          </ul>
        </Panel>

        <div className="space-y-4">
          <Panel
            title="Investigation Detail"
            subtitle={selected.id}
            action={<StatusPill status={selected.status} />}
          >
            <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-[12px]">
              <Field label="Customer" value={selected.customer} mono />
              <Field label="Channel" value={selected.channel.toUpperCase()} mono />
              <Field label="Amount" value={`${selected.currency} ${selected.amount.toLocaleString()}`} />
              <Field label="Geo · IP" value={`${selected.country} · ${selected.ip}`} mono />
              <Field label="Merchant" value={selected.merchant} />
              <Field label="MCC" value={selected.mcc} mono />
              <Field label="Device" value={selected.device} mono />
              <Field label="Confidence" value={`${selected.confidence}%`} />
            </dl>

            <div className="mt-4 surface-panel p-3 bg-primary/5 border-primary/30">
              <div className="flex items-center gap-2 text-[10px] mono uppercase tracking-widest text-primary">
                <Sparkles className="h-3 w-3" /> AI Investigation Narrative
              </div>
              <p className="mt-2 text-[12.5px] leading-relaxed text-foreground/90">
                Transaction exceeds the customer's typical spending behavior by <b className="text-primary">6.4×</b> and originates from a device first seen <b>11 minutes</b> ago.
                The merchant has elevated card-testing velocity in the last hour. Combined with an ASN flagged in two prior fraud rings,
                <b className="text-risk-high"> aggregate risk = {selected.risk}</b>. Recommend <b>step-up authentication</b> before settlement.
              </p>
              <div className="mt-2 flex gap-1.5">
                <Chip>Hold for review</Chip>
                <Chip>Open case</Chip>
                <Chip>Add to graph</Chip>
              </div>
            </div>
          </Panel>

          <Panel title="SHAP — Feature Attribution" subtitle="Why the model decided this">
            <div className="h-[220px]">
              <ResponsiveContainer>
                <BarChart data={shap} layout="vertical" margin={{ left: 8, right: 16, top: 4, bottom: 0 }}>
                  <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" horizontal={false} />
                  <XAxis type="number" tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                  <YAxis type="category" dataKey="f" width={170} tick={{ fill: "var(--muted-foreground)", fontSize: 10, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                  <Bar dataKey="v" radius={[0, 2, 2, 0]}>
                    {shap.map((s, i) => <rect key={i} fill={s.v >= 0 ? "var(--risk-high)" : "var(--risk-safe)"} />)}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>
          </Panel>

          <Panel title="Related Entities" dense>
            <ul className="divide-y divide-border">
              {[
                { i: Brain, l: "DNA Profile · CUS-48201", s: "Deviation +6.4σ from baseline" },
                { i: Shield, l: "Case CASE-4421", s: "Open · Synthetic ID Ring — LATAM" },
                { i: ChevronRight, l: "Graph cluster G-88", s: "12 nodes · 3 shared devices" },
              ].map((r, i) => (
                <li key={i} className="px-4 py-2.5 flex items-center gap-2.5 hover:bg-surface-2/40 cursor-pointer">
                  <r.i className="h-3.5 w-3.5 text-primary" />
                  <div className="flex-1">
                    <div className="text-[12.5px]">{r.l}</div>
                    <div className="text-[11px] mono text-muted-foreground">{r.s}</div>
                  </div>
                  <ChevronRight className="h-3.5 w-3.5 text-muted-foreground" />
                </li>
              ))}
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function Field({ label, value, mono }: { label: string; value: string; mono?: boolean }) {
  return (
    <div>
      <dt className="text-[10px] mono uppercase tracking-widest text-muted-foreground">{label}</dt>
      <dd className={`mt-0.5 ${mono ? "mono" : ""} tabular`}>{value}</dd>
    </div>
  );
}
function Chip({ children }: { children: React.ReactNode }) {
  return <button className="text-[11px] mono uppercase tracking-wider px-2 py-1 rounded bg-surface-2 hover:bg-surface-3 text-foreground/90">{children}</button>;
}
