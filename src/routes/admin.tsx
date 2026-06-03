import { createFileRoute } from "@tanstack/react-router";
import { PageHeader, Panel } from "@/components/panel";
import { Key, Plug, ShieldCheck, Users } from "lucide-react";

export const Route = createFileRoute("/admin")({
  head: () => ({ meta: [{ title: "Administration — AFIOS" }] }),
  component: AdminPage,
});

const USERS = [
  { n: "A. Okafor", e: "a.okafor@bank.com", r: "Lead Analyst · T-3", mfa: true, sso: "OKTA" },
  { n: "M. Schultz", e: "m.schultz@bank.com", r: "Analyst · T-2", mfa: true, sso: "OKTA" },
  { n: "R. Patel", e: "r.patel@bank.com", r: "Compliance Officer", mfa: true, sso: "AzureAD" },
  { n: "C. Nguyen", e: "c.nguyen@bank.com", r: "Data Scientist", mfa: true, sso: "OKTA" },
  { n: "S. Ivanova", e: "s.ivanova@bank.com", r: "Investigator · T-2", mfa: false, sso: "OKTA" },
];

function AdminPage() {
  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Platform Administration"
        title="Administration"
        description="Users, roles (RBAC), SSO/MFA posture, API keys, integrations, and full audit log."
      />
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
        {[
          { i: Users, l: "Active users", v: "184" },
          { i: ShieldCheck, l: "MFA coverage", v: "98.4%" },
          { i: Key, l: "API keys issued", v: "42" },
          { i: Plug, l: "Integrations", v: "12 / 14" },
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

      <Panel title="Users & Roles" dense>
        <div className="grid grid-cols-12 px-4 py-2 text-[10px] mono uppercase tracking-widest text-muted-foreground border-b border-border">
          <div className="col-span-3">User</div>
          <div className="col-span-3">Email</div>
          <div className="col-span-3">Role</div>
          <div className="col-span-1">MFA</div>
          <div className="col-span-2">SSO</div>
        </div>
        <ul>
          {USERS.map(u => (
            <li key={u.e} className="grid grid-cols-12 px-4 py-2.5 border-b border-border/60 text-[12.5px] items-center hover:bg-surface-2/40">
              <div className="col-span-3 flex items-center gap-2.5">
                <div className="h-7 w-7 rounded-full bg-gradient-to-br from-chart-2 to-primary grid place-items-center text-[11px] font-semibold text-primary-foreground">{u.n.split(" ").map(s => s[0]).join("")}</div>
                {u.n}
              </div>
              <div className="col-span-3 mono text-muted-foreground">{u.e}</div>
              <div className="col-span-3">{u.r}</div>
              <div className="col-span-1">
                <span className={`mono text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider ${u.mfa ? "bg-status-clear/15 text-status-clear" : "bg-risk-critical/15 text-risk-critical"}`}>{u.mfa ? "ON" : "OFF"}</span>
              </div>
              <div className="col-span-2 mono text-muted-foreground">{u.sso}</div>
            </li>
          ))}
        </ul>
      </Panel>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Panel title="Integrations" dense>
          <ul>
            {[
              ["Kafka · transactions stream", "connected"],
              ["Snowflake · feature store", "connected"],
              ["Splunk · audit sink", "connected"],
              ["Salesforce · case sync", "connected"],
              ["Slack · alert channel", "degraded"],
              ["S3 · evidence vault", "connected"],
            ].map(([n, s]) => (
              <li key={n} className="px-4 py-2.5 border-b border-border/60 flex items-center gap-3 text-[13px]">
                <Plug className="h-3.5 w-3.5 text-primary" />
                <span className="flex-1">{n}</span>
                <span className={`mono text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider ${s === "connected" ? "bg-status-clear/15 text-status-clear" : "bg-risk-medium/15 text-risk-medium"}`}>{s}</span>
              </li>
            ))}
          </ul>
        </Panel>
        <Panel title="API keys" dense>
          <ul>
            {[
              { n: "core-ingest", s: "active", l: "11m ago" },
              { n: "investigation-app", s: "active", l: "2h ago" },
              { n: "ml-promote", s: "active", l: "1d ago" },
              { n: "legacy-export", s: "rotate-now", l: "62d ago" },
            ].map(k => (
              <li key={k.n} className="px-4 py-2.5 border-b border-border/60 flex items-center gap-3 text-[13px]">
                <Key className="h-3.5 w-3.5 text-primary" />
                <span className="flex-1 mono">{k.n}</span>
                <span className="text-[11px] mono text-muted-foreground">last used {k.l}</span>
                <span className={`mono text-[10px] px-1.5 py-0.5 rounded uppercase tracking-wider ${k.s === "active" ? "bg-status-clear/15 text-status-clear" : "bg-risk-critical/15 text-risk-critical"}`}>{k.s}</span>
              </li>
            ))}
          </ul>
        </Panel>
      </div>
    </div>
  );
}
