import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/panel";
import { useState } from "react";
import { Bot, Sparkles, Send, FileText, Brain, Shield } from "lucide-react";

export const Route = createFileRoute("/copilot")({
  head: () => ({ meta: [{ title: "AI Copilot — AFIOS" }] }),
  component: CopilotPage,
});

const SAMPLES = [
  "Why was TX-DEXTR flagged?",
  "Show similar cases to CASE-4421",
  "Explain model decision for CUS-48201",
  "Generate case summary for CASE-4421",
  "Recommend actions for this cluster",
  "Generate a SAR draft for compliance",
];

type Msg = { role: "user" | "ai"; text: string; refs?: string[] };

function CopilotPage() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "I'm your fraud intelligence copilot. I can explain decisions, pull related cases, draft narratives, and recommend actions. Try a suggestion below." },
  ]);
  const [input, setInput] = useState("");

  function ask(q: string) {
    const reply = generateReply(q);
    setMsgs(m => [...m, { role: "user", text: q }, reply]);
    setInput("");
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Agentic Reasoning"
        title="AI Fraud Copilot"
        description="Context-aware enterprise assistant grounded in your transactions, cases, graph, and models. Every answer cites source evidence."
      />
      <div className="grid grid-cols-1 xl:grid-cols-[1fr_320px] gap-4">
        <Panel
          title="Conversation"
          subtitle="Grounded in 24M transactions · 412 cases · 14 active models"
          dense
        >
          <div className="flex flex-col h-[640px]">
            <ul className="flex-1 overflow-y-auto p-4 space-y-4">
              {msgs.map((m, i) => (
                <li key={i} className={m.role === "user" ? "flex justify-end" : ""}>
                  {m.role === "ai" ? (
                    <div className="flex gap-3 max-w-[88%]">
                      <div className="h-7 w-7 shrink-0 rounded-md bg-gradient-to-br from-primary to-chart-2 grid place-items-center">
                        <Sparkles className="h-3.5 w-3.5 text-primary-foreground" />
                      </div>
                      <div className="surface-panel p-3.5 bg-surface-2/40">
                        <div className="text-[13px] leading-relaxed whitespace-pre-line">{m.text}</div>
                        {m.refs && (
                          <div className="mt-3 flex flex-wrap gap-1.5">
                            {m.refs.map(r => (
                              <span key={r} className="text-[10px] mono px-1.5 py-0.5 rounded bg-primary/15 text-primary border border-primary/30">{r}</span>
                            ))}
                          </div>
                        )}
                      </div>
                    </div>
                  ) : (
                    <div className="bg-primary text-primary-foreground px-3.5 py-2 rounded-md text-[13px] max-w-[80%]">{m.text}</div>
                  )}
                </li>
              ))}
            </ul>
            <div className="border-t border-border p-3">
              <div className="flex flex-wrap gap-1.5 mb-2">
                {SAMPLES.slice(0, 4).map(s => (
                  <button key={s} onClick={() => ask(s)} className="text-[11px] px-2 py-1 rounded bg-surface-2 hover:bg-surface-3 text-foreground/90">{s}</button>
                ))}
              </div>
              <form onSubmit={e => { e.preventDefault(); if (input.trim()) ask(input.trim()); }} className="flex gap-2">
                <input
                  value={input} onChange={e => setInput(e.target.value)}
                  placeholder="Ask the copilot…"
                  className="flex-1 h-10 bg-surface border border-border rounded-md px-3 text-[13px] focus:outline-none focus:border-primary"
                />
                <button className="h-10 px-4 rounded-md bg-primary text-primary-foreground text-[13px] font-medium inline-flex items-center gap-2">
                  <Send className="h-3.5 w-3.5" /> Send
                </button>
              </form>
            </div>
          </div>
        </Panel>

        <div className="space-y-4">
          <Panel title="Suggested actions" dense>
            <ul>
              {[
                { i: Shield, l: "Block CUS-48201 card", s: "high confidence · 0.94" },
                { i: FileText, l: "File SAR (draft ready)", s: "compliance · 1,840 chars" },
                { i: Brain, l: "Retrain on cluster G-88", s: "shadow · 3 features new" },
                { i: Bot, l: "Open Tier-3 case", s: "auto-route · A. Okafor" },
              ].map((a, i) => (
                <li key={i} className="px-3 py-2.5 border-b border-border/60 flex items-center gap-2.5 hover:bg-surface-2/40 cursor-pointer">
                  <a.i className="h-3.5 w-3.5 text-primary" />
                  <div className="flex-1">
                    <div className="text-[12.5px]">{a.l}</div>
                    <div className="text-[10px] mono text-muted-foreground">{a.s}</div>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>
          <Panel title="Source evidence">
            <ul className="space-y-2 text-[12.5px]">
              <li className="mono text-muted-foreground">→ TX-DEXTR · 14:42:01</li>
              <li className="mono text-muted-foreground">→ CASE-4421 · open</li>
              <li className="mono text-muted-foreground">→ Cluster G-88 · 12 nodes</li>
              <li className="mono text-muted-foreground">→ Model FALCON-NEO v4.2</li>
            </ul>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function generateReply(q: string): Msg {
  if (q.toLowerCase().includes("why") || q.toLowerCase().includes("flag")) {
    return {
      role: "ai",
      text: "TX-DEXTR was flagged at risk 94 because:\n• Amount 6.4× the customer's 90-day baseline\n• Device first seen 11 minutes prior to the transaction\n• Merchant velocity in last hour exceeds 4σ\n• IP belongs to an ASN observed in two recent rings\n\nThe contributing model is FALCON-NEO v4.2 with confidence 0.92. I recommend step-up authentication and opening a Tier-3 case.",
      refs: ["TX-DEXTR", "FALCON-NEO v4.2", "Cluster G-88"],
    };
  }
  if (q.toLowerCase().includes("similar")) {
    return { role: "ai", text: "Found 7 cases with overlapping signatures:\n• CASE-4310 (cosine 0.91)\n• CASE-4377 (0.88)\n• CASE-4399 (0.82)\nAll share the synthetic-ID device fingerprint and BR geo. Two resulted in confirmed fraud.", refs: ["CASE-4310", "CASE-4377", "CASE-4399"] };
  }
  if (q.toLowerCase().includes("sar") || q.toLowerCase().includes("compliance")) {
    return { role: "ai", text: "SAR draft (1,840 chars) prepared. Suspect activity involves rapid funding of a newly-created account, immediate off-ramp via crypto merchant, and device fingerprint linkage to a known ring (G-88). Ready for compliance review.", refs: ["CASE-4421", "G-88", "Compliance Pack v2"] };
  }
  return { role: "ai", text: "I reviewed the related entities and pulled the corresponding evidence. Want me to open a case, generate a narrative, or draft a recommended decision?", refs: ["CASE-4421"] };
}
