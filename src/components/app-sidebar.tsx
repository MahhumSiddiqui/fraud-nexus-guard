import { Link, useRouterState } from "@tanstack/react-router";
import {
  Activity, AlertTriangle, BarChart3, Bot, Boxes, Briefcase,
  Building2, Cpu, FileSearch, Fingerprint, GitBranch, LayoutDashboard,
  LineChart, Radar, Settings, ShieldCheck, Sparkles, TrendingUp,
} from "lucide-react";
import { cn } from "@/lib/utils";

const NAV = [
  { group: "Intelligence", items: [
    { to: "/", label: "Executive", icon: LayoutDashboard, exact: true },
    { to: "/monitoring", label: "Real-Time Monitoring", icon: Activity, badge: "LIVE" },
    { to: "/transactions", label: "Transactions", icon: Boxes },
    { to: "/alerts", label: "Alerts", icon: AlertTriangle, badge: "284" },
  ]},
  { group: "Investigation", items: [
    { to: "/investigations", label: "Investigations", icon: FileSearch },
    { to: "/graph", label: "Fraud Graph", icon: GitBranch },
    { to: "/memory", label: "Memory Engine", icon: Briefcase },
    { to: "/dna", label: "Fraud DNA", icon: Fingerprint },
  ]},
  { group: "AI Ops", items: [
    { to: "/copilot", label: "AI Copilot", icon: Bot },
    { to: "/forecasting", label: "Forecasting", icon: TrendingUp },
    { to: "/simulation", label: "Simulation Lab", icon: Radar },
  ]},
  { group: "Governance", items: [
    { to: "/compliance", label: "Compliance", icon: ShieldCheck },
    { to: "/models", label: "Model Intelligence", icon: Cpu },
    { to: "/admin", label: "Administration", icon: Settings },
  ]},
] as const;

export function AppSidebar() {
  const path = useRouterState({ select: s => s.location.pathname });
  return (
    <aside className="hidden md:flex w-64 shrink-0 flex-col border-r bg-sidebar text-sidebar-foreground relative z-10">
      <div className="h-14 flex items-center gap-2.5 px-4 border-b border-sidebar-border">
        <div className="relative h-8 w-8 rounded-md bg-gradient-to-br from-primary to-chart-2 grid place-items-center">
          <Sparkles className="h-4 w-4 text-primary-foreground" />
          <span className="absolute -bottom-0.5 -right-0.5 h-2 w-2 rounded-full bg-status-clear ring-2 ring-sidebar pulse-critical" />
        </div>
        <div className="leading-tight">
          <div className="text-[13px] font-semibold tracking-tight">AFIOS</div>
          <div className="text-[10px] mono text-muted-foreground uppercase tracking-widest">Fraud Intel OS</div>
        </div>
      </div>
      <nav className="flex-1 overflow-y-auto py-3 px-2 space-y-4">
        {NAV.map(group => (
          <div key={group.group}>
            <div className="px-3 mb-1.5 text-[10px] mono uppercase tracking-widest text-muted-foreground">{group.group}</div>
            <ul className="space-y-0.5">
              {group.items.map(item => {
                const Icon = item.icon;
                const active = item.exact ? path === item.to : path.startsWith(item.to);
                return (
                  <li key={item.to}>
                    <Link
                      to={item.to}
                      className={cn(
                        "group flex items-center gap-2.5 px-3 py-2 rounded-md text-[13px] transition-colors relative",
                        active
                          ? "bg-sidebar-accent text-sidebar-accent-foreground"
                          : "text-sidebar-foreground/75 hover:bg-sidebar-accent/60 hover:text-sidebar-foreground",
                      )}
                    >
                      {active && <span className="absolute left-0 top-1.5 bottom-1.5 w-0.5 rounded-r bg-primary" />}
                      <Icon className={cn("h-4 w-4 shrink-0", active && "text-primary")} />
                      <span className="flex-1 truncate">{item.label}</span>
                      {"badge" in item && item.badge && (
                        <span className={cn(
                          "text-[9px] mono px-1.5 py-0.5 rounded uppercase tracking-wider",
                          item.badge === "LIVE" ? "bg-status-clear/15 text-status-clear" : "bg-risk-high/15 text-risk-high",
                        )}>{item.badge}</span>
                      )}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
      <div className="border-t border-sidebar-border p-3">
        <div className="surface-panel p-2.5 bg-sidebar-accent/40">
          <div className="flex items-center justify-between text-[10px] mono uppercase tracking-wider text-muted-foreground">
            <span>System Load</span>
            <span className="text-status-clear">NOMINAL</span>
          </div>
          <div className="mt-1.5 grid grid-cols-3 gap-1 text-[10px] mono tabular">
            <div><div className="text-foreground">42%</div><div className="text-muted-foreground">CPU</div></div>
            <div><div className="text-foreground">2.1k/s</div><div className="text-muted-foreground">TPS</div></div>
            <div><div className="text-foreground">11ms</div><div className="text-muted-foreground">P50</div></div>
          </div>
        </div>
      </div>
    </aside>
  );
}
