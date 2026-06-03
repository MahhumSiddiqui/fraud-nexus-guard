import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/panel";
import { RiskBadge } from "@/components/risk-badge";
import { cases } from "@/lib/mock-data";
import { Clock, FileText, MessageSquare, Paperclip, Shield, Users } from "lucide-react";
import { useState } from "react";

export const Route = createFileRoute("/investigations")({
  head: () => ({ meta: [{ title: "Investigations — AFIOS" }] }),
  component: InvestigationsPage,
});

const TIMELINE = [
  { t: "14:42:01", actor: "FALCON-NEO", action: "Alert raised · risk 94 · velocity + new device" },
  { t: "14:42:08", actor: "Auto-Triage", action: "Routed to Tier-3 queue · synthetic-ID pattern match" },
  { t: "14:46:22", actor: "A. Okafor", action: "Opened case · linked 3 related transactions" },
  { t: "14:51:10", actor: "GRAPHSENSE", action: "Detected cluster G-88 · 12 nodes · 3 shared devices" },
  { t: "15:04:48", actor: "M. Schultz", action: "Added evidence: KYC selfie mismatch (sim 0.42)" },
  { t: "15:18:31", actor: "AI Copilot", action: "Drafted SAR narrative · 1,840 chars · ready for review" },
];

function InvestigationsPage() {
  const [active, setActive] = useState(cases[0]);
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Workspace"
        title="Investigations"
        description="Collaborative workspace for analysts. Timeline, evidence, notes, related cases, and decisions in one surface."
      />
      <div className="grid grid-cols-1 xl:grid-cols-[280px_1fr_320px] gap-4">
        <Panel title="Open Cases" dense>
          <ul className="max-h-[700px] overflow-y-auto">
            {cases.slice(0, 12).map(c => (
              <li key={c.id} onClick={() => setActive(c)}
                className={`px-3 py-2.5 border-b border-border/60 cursor-pointer ${active.id === c.id ? "bg-primary/8 border-l-2 border-l-primary" : "hover:bg-surface-2/40"}`}>
                <div className="flex items-center justify-between">
                  <span className="mono text-[11px] text-muted-foreground">{c.id}</span>
                  <RiskBadge level={c.priority} />
                </div>
                <div className="text-[12.5px] mt-1 line-clamp-2">{c.title}</div>
                <div className="text-[10px] mono text-muted-foreground mt-1">{c.analyst} · {c.age}</div>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel
          title={active.id}
          subtitle={active.title}
          action={
            <div className="flex items-center gap-2">
              <RiskBadge level={active.priority} />
              <span className="text-[11px] mono uppercase tracking-wider text-muted-foreground">Exposure</span>
              <span className="mono tabular text-foreground">${active.exposure.toLocaleString()}</span>
            </div>
          }
        >
          <div className="grid grid-cols-3 gap-3 mb-4">
            {[
              { l: "Status", v: active.status },
              { l: "Owner", v: active.analyst },
              { l: "Age", v: active.age },
            ].map(s => (
              <div key={s.l} className="surface-panel p-3 bg-surface-2/40">
                <div className="text-[10px] mono uppercase tracking-widest text-muted-foreground">{s.l}</div>
                <div className="mt-1">{s.v}</div>
              </div>
            ))}
          </div>

          <div className="space-y-1">
            <div className="text-[10px] mono uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
              <Clock className="h-3 w-3" /> Timeline
            </div>
            <ol className="relative border-l border-border ml-2">
              {TIMELINE.map((e, i) => (
                <li key={i} className="ml-4 pb-4 last:pb-0 relative">
                  <span className="absolute -left-[22px] top-1 h-2 w-2 rounded-full bg-primary ring-4 ring-background" />
                  <div className="text-[11px] mono text-muted-foreground">{e.t} · <span className="text-primary">{e.actor}</span></div>
                  <div className="text-[13px]">{e.action}</div>
                </li>
              ))}
            </ol>
          </div>

          <div className="mt-5 surface-panel p-3 bg-surface-2/40">
            <div className="text-[10px] mono uppercase tracking-widest text-muted-foreground mb-2 flex items-center gap-2">
              <MessageSquare className="h-3 w-3" /> Analyst notes
            </div>
            <textarea
              rows={3}
              placeholder="Add note…"
              className="w-full bg-background border border-border rounded-md p-2.5 text-[13px] resize-none focus:outline-none focus:border-primary"
              defaultValue="Subject's device fingerprint matches 2 prior synthetic-ID cases (CASE-4310, CASE-4377). Recommend escalation to compliance for SAR review."
            />
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Evidence" dense>
            <ul>
              {[
                { i: FileText, l: "KYC documents", s: "3 files · last 2h" },
                { i: Paperclip, l: "Device attestations", s: "5 captures" },
                { i: Shield, l: "Sanctions hits", s: "0 matches" },
                { i: Users, l: "Linked entities", s: "12 nodes" },
              ].map((e, i) => (
                <li key={i} className="px-3 py-2.5 border-b border-border/60 flex items-center gap-2.5">
                  <e.i className="h-3.5 w-3.5 text-primary" />
                  <div className="flex-1">
                    <div className="text-[12.5px]">{e.l}</div>
                    <div className="text-[10px] mono text-muted-foreground">{e.s}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Decision">
            <div className="space-y-2">
              {["Confirm fraud · block", "False positive · release", "Escalate to compliance", "Request more info"].map(a => (
                <button key={a} className="w-full text-left h-9 px-3 rounded-md bg-surface-2 hover:bg-surface-3 text-[12.5px]">{a}</button>
              ))}
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}
