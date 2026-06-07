import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/panel";
import { Activity, Building2, Database, Key, Plug, Server, Shield, Users } from "lucide-react";

export const Route = createFileRoute("/enterprise")({
  head: () => ({ meta: [{ title: "Enterprise Administration — AFIOS" }] }),
  component: EnterprisePage,
});

const SERVICES = [
  { n: "Ingestion · Kafka", st: "ok", v: "2,184 msg/s", lat: "4ms" },
  { n: "Feature Store", st: "ok", v: "184 features hydrated/req", lat: "11ms" },
  { n: "Scoring · FALCON-NEO", st: "ok", v: "p50 17ms", lat: "—" },
  { n: "Graph DB · Neo4j", st: "warn", v: "memory 81%", lat: "32ms" },
  { n: "Postgres · primary", st: "ok", v: "conn 412/1000", lat: "2ms" },
  { n: "Postgres · replica", st: "ok", v: "lag 80ms", lat: "—" },
  { n: "Workflow · Temporal", st: "ok", v: "queue 184", lat: "—" },
  { n: "Search · OpenSearch", st: "ok", v: "shard 18/18", lat: "8ms" },
];

const TENANTS = [
  { o: "Acme Bank — Group", dept: "Fraud Ops", teams: 6, users: 184 },
  { o: "Acme Bank — Group", dept: "Compliance", teams: 3, users: 42 },
  { o: "Acme Securities", dept: "AML", teams: 2, users: 21 },
  { o: "Acme Cards", dept: "Risk", teams: 4, users: 64 },
];

const INTEGRATIONS = [
  { n: "Core Banking — Temenos T24", st: "live" },
  { n: "Payment Gateway — Stripe", st: "live" },
  { n: "Payment Gateway — Adyen", st: "live" },
  { n: "CRM — Salesforce Financial Cloud", st: "live" },
  { n: "Fraud Feed — Threat Metrix", st: "live" },
  { n: "Fraud Feed — FinCEN 314(b)", st: "live" },
  { n: "Card Network — Visa CyberSource", st: "degraded" },
  { n: "AML — Refinitiv WorldCheck", st: "live" },
];

function EnterprisePage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Platform Operations"
        title="Enterprise Administration Center"
        description="Security posture, multi-tenant management, service health, audit, and integration control plane — all from one console."
      />

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { i: Users, l: "Total users", v: "311" },
          { i: Building2, l: "Tenants / depts", v: "4 / 12" },
          { i: Shield, l: "MFA coverage", v: "98.4%" },
          { i: Plug, l: "Integrations live", v: "7 / 8" },
        ].map((k, i) => (
          <div key={i} className="surface-panel p-4 flex items-center gap-3">
            <div className="h-9 w-9 rounded-md bg-primary/15 text-primary grid place-items-center"><k.i className="h-4 w-4" /></div>
            <div>
              <div className="text-[10px] mono uppercase tracking-widest text-muted-foreground">{k.l}</div>
              <div className="text-xl font-semibold tabular">{k.v}</div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Security configuration">
          <ul className="space-y-3 text-[13px]">
            {[
              { i: Shield, l: "RBAC", v: "18 roles · 412 grants", a: "Manage" },
              { i: Key, l: "API keys", v: "42 active · 6 expiring in 30d", a: "Rotate" },
              { i: Shield, l: "MFA", v: "TOTP + WebAuthn · enforced", a: "Policy" },
              { i: Shield, l: "SSO", v: "Okta SAML + AzureAD OIDC", a: "Configure" },
            ].map((r, i) => (
              <li key={i} className="flex items-center gap-3 surface-panel p-3">
                <div className="h-8 w-8 rounded-md bg-primary/15 text-primary grid place-items-center"><r.i className="h-4 w-4" /></div>
                <div className="flex-1"><div className="font-medium">{r.l}</div><div className="text-[11px] mono text-muted-foreground">{r.v}</div></div>
                <button className="h-7 px-2.5 surface-panel text-[11px] mono uppercase tracking-wider">{r.a}</button>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="System health" subtitle="Real-time service telemetry">
          <ul className="space-y-2 text-[12.5px]">
            {SERVICES.map(s => (
              <li key={s.n} className="flex items-center gap-3 px-3 py-2 rounded-md hover:bg-surface-2/40">
                <span className={`h-2 w-2 rounded-full ${s.st === "ok" ? "bg-status-clear" : s.st === "warn" ? "bg-risk-medium" : "bg-risk-critical"}`} />
                <span className="flex-1 mono">{s.n}</span>
                <span className="text-muted-foreground text-[11.5px]">{s.v}</span>
                <span className="mono tabular text-[11px] w-12 text-right">{s.lat}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>

      <Panel title="Tenant management" subtitle="Organizations · departments · teams" dense>
        <div className="grid grid-cols-12 px-4 py-2 text-[10px] mono uppercase tracking-widest text-muted-foreground border-b border-border">
          <div className="col-span-5">Organization</div>
          <div className="col-span-3">Department</div>
          <div className="col-span-2 text-right">Teams</div>
          <div className="col-span-2 text-right">Users</div>
        </div>
        <ul>
          {TENANTS.map((t, i) => (
            <li key={i} className="grid grid-cols-12 px-4 py-2.5 border-b border-border/60 text-[12.5px] items-center hover:bg-surface-2/40">
              <div className="col-span-5">{t.o}</div>
              <div className="col-span-3 text-muted-foreground">{t.dept}</div>
              <div className="col-span-2 text-right mono tabular">{t.teams}</div>
              <div className="col-span-2 text-right mono tabular">{t.users}</div>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Integrations" subtitle="Core banking · payments · CRM · feeds">
          <ul className="space-y-2 text-[12.5px]">
            {INTEGRATIONS.map(i => (
              <li key={i.n} className="flex items-center gap-3 surface-panel p-3">
                <Plug className="h-4 w-4 text-primary" />
                <span className="flex-1">{i.n}</span>
                <span className={`mono text-[10px] uppercase tracking-wider px-1.5 py-0.5 rounded ${i.st === "live" ? "bg-status-clear/15 text-status-clear" : "bg-risk-medium/15 text-risk-medium"}`}>{i.st}</span>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel title="Audit monitoring" subtitle="User activity · security events · access">
          <ul className="text-[12.5px] mono space-y-1.5">
            {[
              { c: <Activity className="h-3.5 w-3.5 text-primary" />, l: "[09:14:02] A.Okafor exported CASE-4441 to PDF" },
              { c: <Shield className="h-3.5 w-3.5 text-risk-medium" />, l: "[09:11:48] Failed MFA · s.ivanova@bank.com · 1 attempt" },
              { c: <Database className="h-3.5 w-3.5 text-primary" />, l: "[08:54:22] C.Nguyen ran ad-hoc query · 412 rows" },
              { c: <Server className="h-3.5 w-3.5 text-primary" />, l: "[08:30:11] Kafka consumer rebalanced · 0 drops" },
              { c: <Key className="h-3.5 w-3.5 text-risk-medium" />, l: "[07:14:00] API key svc.fraud.prod rotated · R.Patel" },
            ].map((r, i) => <li key={i} className="flex items-center gap-2"><span>{r.c}</span><span className="text-foreground">{r.l}</span></li>)}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
