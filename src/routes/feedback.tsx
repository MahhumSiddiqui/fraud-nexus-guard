import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/panel";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { Brain, Sparkles, ThumbsDown, ThumbsUp } from "lucide-react";

export const Route = createFileRoute("/feedback")({
  head: () => ({ meta: [{ title: "Human Feedback Learning — AFIOS" }] }),
  component: FeedbackPage,
});

const TREND = Array.from({ length: 30 }, (_, i) => ({
  d: `D-${30 - i}`,
  fp: Math.round(420 - i * 8 + Math.sin(i / 3) * 30),
  cf: Math.round(180 + i * 4 + Math.cos(i / 4) * 20),
}));

const LEARNING = Array.from({ length: 12 }, (_, i) => ({
  w: `W-${12 - i}`,
  recall: 88 + i * 0.4 + Math.sin(i) * 0.3,
  precision: 91 + i * 0.25,
}));

const ANALYSTS = [
  { n: "A. Okafor", r: 412, d: 398, fb: 184, acc: 96.2 },
  { n: "M. Schultz", r: 388, d: 372, fb: 162, acc: 94.8 },
  { n: "R. Patel", r: 301, d: 290, fb: 141, acc: 95.1 },
  { n: "C. Nguyen", r: 276, d: 262, fb: 128, acc: 93.4 },
  { n: "S. Ivanova", r: 244, d: 230, fb: 112, acc: 92.7 },
];

function FeedbackPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Continuous Learning · Human-in-the-loop"
        title="Human Feedback Learning Center"
        description="How analyst decisions flow back into models — measuring how human judgement makes the system smarter over time."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { i: ThumbsUp, l: "Confirmed fraud", v: "1,284", s: "last 30d" },
          { i: ThumbsDown, l: "False positives", v: "412", s: "down 28% MoM", tone: "good" as const },
          { i: Sparkles, l: "Feedback utilization", v: "94.1%", s: "into next retrain" },
          { i: Brain, l: "Model lift from feedback", v: "+3.2%", s: "recall, last quarter" },
        ].map((k, i) => (
          <div key={i} className="surface-panel p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-primary/15 text-primary grid place-items-center"><k.i className="h-4 w-4" /></div>
            <div>
              <div className="text-[10px] mono uppercase tracking-widest text-muted-foreground">{k.l}</div>
              <div className={`text-xl font-semibold tabular ${k.tone === "good" ? "text-status-clear" : ""}`}>{k.v}</div>
              <div className="text-[11px] mono text-muted-foreground">{k.s}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Panel className="lg:col-span-2" title="Feedback trends" subtitle="False positives ↓ · confirmed fraud ↑ — 30d">
          <div className="h-[260px]">
            <ResponsiveContainer>
              <AreaChart data={TREND} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <defs>
                  <linearGradient id="fp" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--risk-high)" stopOpacity={0.4} /><stop offset="100%" stopColor="var(--risk-high)" stopOpacity={0} /></linearGradient>
                  <linearGradient id="cf" x1="0" y1="0" x2="0" y2="1"><stop offset="0%" stopColor="var(--chart-1)" stopOpacity={0.4} /><stop offset="100%" stopColor="var(--chart-1)" stopOpacity={0} /></linearGradient>
                </defs>
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="d" tick={{ fill: "var(--muted-foreground)", fontSize: 9, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 9, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", fontSize: 11 }} />
                <Area type="monotone" dataKey="fp" stroke="var(--risk-high)" fill="url(#fp)" strokeWidth={1.5} />
                <Area type="monotone" dataKey="cf" stroke="var(--chart-1)" fill="url(#cf)" strokeWidth={1.5} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </Panel>

        <Panel title="Learning curve" subtitle="Model recall & precision · driven by feedback">
          <div className="h-[260px]">
            <ResponsiveContainer>
              <LineChart data={LEARNING} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="w" tick={{ fill: "var(--muted-foreground)", fontSize: 9, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <YAxis domain={[85, 100]} tick={{ fill: "var(--muted-foreground)", fontSize: 9, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", fontSize: 11 }} />
                <Line type="monotone" dataKey="recall" stroke="var(--chart-1)" strokeWidth={1.5} dot={false} />
                <Line type="monotone" dataKey="precision" stroke="var(--chart-2)" strokeWidth={1.5} dot={false} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>

      <Panel title="Analyst contribution" subtitle="Volume · accuracy · feedback impact" dense>
        <div className="grid grid-cols-12 px-4 py-2 text-[10px] mono uppercase tracking-widest text-muted-foreground border-b border-border">
          <div className="col-span-3">Analyst</div>
          <div className="col-span-2 text-right">Cases reviewed</div>
          <div className="col-span-2 text-right">Decisions</div>
          <div className="col-span-2 text-right">Feedback submitted</div>
          <div className="col-span-3">Accuracy</div>
        </div>
        <ul>
          {ANALYSTS.map(a => (
            <li key={a.n} className="grid grid-cols-12 px-4 py-2.5 border-b border-border/60 text-[12.5px] items-center hover:bg-surface-2/40">
              <div className="col-span-3">{a.n}</div>
              <div className="col-span-2 text-right mono tabular">{a.r}</div>
              <div className="col-span-2 text-right mono tabular">{a.d}</div>
              <div className="col-span-2 text-right mono tabular">{a.fb}</div>
              <div className="col-span-3 flex items-center gap-2">
                <div className="flex-1 h-1.5 bg-surface-3 rounded-full overflow-hidden">
                  <div className="h-full bg-status-clear rounded-full" style={{ width: `${a.acc}%` }} />
                </div>
                <span className="mono tabular text-[11px] w-12 text-right">{a.acc}%</span>
              </div>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Retraining insights" subtitle="AI-suggested model improvements">
          <ul className="space-y-3 text-[13px]">
            {[
              { t: "Retrain FALCON-NEO with 1,284 confirmed fraud cases", d: "Estimated lift: +0.7% recall, -0.2% FPR. Eligible from Friday's freeze window." },
              { t: "Rebalance training set — EU corridor underrepresented", d: "Analyst feedback shows 18% of new FPs originate from EU SEPA flows." },
              { t: "Promote rule R-441 from shadow to production", d: "12 analysts upvoted; 0 false positives across 14d." },
            ].map((r, i) => (
              <li key={i} className="surface-panel p-3 bg-primary/5 border-primary/30">
                <div className="font-medium">{r.t}</div>
                <div className="text-[12px] text-muted-foreground mt-0.5">{r.d}</div>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="Feedback impact distribution" subtitle="Where feedback changed outcomes">
          <div className="h-[220px]">
            <ResponsiveContainer>
              <BarChart data={[
                { k: "Model retraining", v: 412 },
                { k: "Rule changes", v: 218 },
                { k: "DNA updates", v: 184 },
                { k: "Graph cluster relabel", v: 122 },
                { k: "Feature deprecation", v: 64 },
              ]} margin={{ top: 8, right: 8, left: -16, bottom: 0 }}>
                <CartesianGrid stroke="var(--border)" strokeDasharray="2 4" vertical={false} />
                <XAxis dataKey="k" tick={{ fill: "var(--muted-foreground)", fontSize: 9, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fill: "var(--muted-foreground)", fontSize: 9, fontFamily: "var(--font-mono)" }} axisLine={false} tickLine={false} />
                <Tooltip cursor={{ fill: "var(--surface-2)" }} contentStyle={{ background: "var(--surface)", border: "1px solid var(--border)", fontSize: 11 }} />
                <Bar dataKey="v" radius={[3, 3, 0, 0]} fill="var(--chart-2)" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </Panel>
      </div>
    </div>
  );
}
