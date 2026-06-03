import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/panel";
import { Download, FileCheck, ShieldCheck } from "lucide-react";

export const Route = createFileRoute("/compliance")({
  head: () => ({ meta: [{ title: "Compliance Center — AFIOS" }] }),
  component: CompliancePage,
});

function CompliancePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Governance · Audit-grade"
        title="Compliance Center"
        description="Immutable audit trail, regulator-ready exports, and full decision lineage from raw signal to final outcome."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { l: "SARs filed YTD", v: "1,284" },
          { l: "CTRs filed YTD", v: "4,402" },
          { l: "Audit events / day", v: "8.2M" },
          { l: "Avg time-to-file", v: "2.4 days" },
        ].map(k => (
          <div key={k.l} className="surface-panel p-4">
            <div className="text-[10px] mono uppercase tracking-widest text-muted-foreground">{k.l}</div>
            <div className="mt-1.5 text-2xl font-semibold tabular">{k.v}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel title="Regulatory exports" className="lg:col-span-1">
          <ul className="space-y-2">
            {["FinCEN SAR Pack · Q3", "FCA STR Bundle · Q3", "BaFin Audit · 30d", "MAS Tier-2 Report", "AUSTRAC Monthly"].map(e => (
              <li key={e} className="flex items-center gap-2.5 px-3 py-2.5 surface-panel bg-surface-2/40 cursor-pointer hover:border-border-strong">
                <FileCheck className="h-3.5 w-3.5 text-primary" />
                <span className="flex-1 text-[12.5px]">{e}</span>
                <Download className="h-3.5 w-3.5 text-muted-foreground" />
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Audit trail · last 24h" subtitle="Tamper-evident · hash-chained" className="lg:col-span-2" dense>
          <ul>
            {[
              { t: "15:18:31", u: "AI Copilot", a: "SAR draft generated · CASE-4421", h: "0x8f3a…" },
              { t: "15:04:48", u: "M. Schultz", a: "Added evidence to CASE-4421", h: "0x21b9…" },
              { t: "14:51:10", u: "GRAPHSENSE", a: "Cluster G-88 detected", h: "0x4cee…" },
              { t: "14:46:22", u: "A. Okafor", a: "Opened case from TX-DEXTR", h: "0x9d10…" },
              { t: "14:42:08", u: "Auto-Triage", a: "Routed to Tier-3 queue", h: "0x5a02…" },
              { t: "14:42:01", u: "FALCON-NEO v4.2", a: "Alert raised · risk 94", h: "0x7e11…" },
            ].map((e, i) => (
              <li key={i} className="grid grid-cols-12 px-4 py-2 border-b border-border/60 text-[12px]">
                <div className="col-span-2 mono text-muted-foreground">{e.t}</div>
                <div className="col-span-3 mono">{e.u}</div>
                <div className="col-span-5">{e.a}</div>
                <div className="col-span-2 mono text-muted-foreground text-right">{e.h}</div>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Decision lineage · CASE-4421" subtitle="Full provenance — signal → feature → model → decision">
        <div className="flex items-center gap-2 overflow-x-auto pb-2">
          {["Stream ingest", "Feature store", "FALCON-NEO v4.2", "GRAPHSENSE v2.1", "Triage policy", "Human review", "Outcome · Confirmed fraud"].map((s, i, a) => (
            <div key={s} className="flex items-center gap-2 shrink-0">
              <div className="surface-panel px-3 py-2 bg-surface-2/40 text-[12px] flex items-center gap-2">
                <ShieldCheck className="h-3.5 w-3.5 text-primary" />{s}
              </div>
              {i < a.length - 1 && <span className="text-muted-foreground">→</span>}
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
