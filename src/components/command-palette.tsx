import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { useNavigate } from "@tanstack/react-router";
import {
  Activity, AlertTriangle, Bot, Boxes, Brain, Building2, Cpu, Database,
  FileSearch, Fingerprint, Gauge, GitBranch, LayoutDashboard, Radar, Rocket,
  ShieldCheck, Sparkles, TrendingUp, Workflow,
} from "lucide-react";

const QUICK = [
  { to: "/command", label: "Fraud Command Center", icon: Rocket },
  { to: "/", label: "Executive Dashboard", icon: LayoutDashboard },
  { to: "/monitoring", label: "Real-Time Monitoring", icon: Activity },
  { to: "/transactions", label: "Transactions", icon: Boxes },
  { to: "/alerts", label: "Alerts", icon: AlertTriangle },
  { to: "/investigations", label: "Investigations", icon: FileSearch },
  { to: "/graph", label: "Fraud Graph", icon: GitBranch },
  { to: "/dna", label: "Fraud DNA Profiles", icon: Fingerprint },
  { to: "/copilot", label: "AI Copilot", icon: Bot },
  { to: "/forecasting", label: "Forecasting Center", icon: TrendingUp },
  { to: "/simulation", label: "Simulation Lab", icon: Radar },
  { to: "/risk", label: "Risk Orchestration", icon: Workflow },
  { to: "/features", label: "Feature Intelligence", icon: Database },
  { to: "/models", label: "Model Intelligence", icon: Cpu },
  { to: "/governance", label: "Model Governance", icon: Gauge },
  { to: "/feedback", label: "Feedback Learning", icon: Brain },
  { to: "/compliance", label: "Compliance Center", icon: ShieldCheck },
  { to: "/enterprise", label: "Enterprise Administration", icon: Building2 },
];

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const navigate = useNavigate();
  const go = (to: string) => { onOpenChange(false); navigate({ to }); };
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search transactions, customers, alerts, cases, models, rules…" />
      <CommandList>
        <CommandEmpty>No matches.</CommandEmpty>
        <CommandGroup heading="Quick actions">
          <CommandItem onSelect={() => go("/copilot")}><Sparkles className="h-4 w-4 mr-2 text-primary" /> Ask AI Copilot</CommandItem>
          <CommandItem onSelect={() => go("/investigations")}><FileSearch className="h-4 w-4 mr-2 text-muted-foreground" /> Open new case</CommandItem>
          <CommandItem onSelect={() => go("/simulation")}><Radar className="h-4 w-4 mr-2 text-muted-foreground" /> Run simulation</CommandItem>
          <CommandItem onSelect={() => go("/alerts")}><AlertTriangle className="h-4 w-4 mr-2 text-muted-foreground" /> Create alert</CommandItem>
          <CommandItem onSelect={() => go("/compliance")}><ShieldCheck className="h-4 w-4 mr-2 text-muted-foreground" /> Generate SAR draft</CommandItem>
          <CommandItem onSelect={() => go("/risk")}><Workflow className="h-4 w-4 mr-2 text-muted-foreground" /> Explain a risk decision</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigate">
          {QUICK.map(q => (
            <CommandItem key={q.to} onSelect={() => go(q.to)}>
              <q.icon className="h-4 w-4 mr-2 text-muted-foreground" /> {q.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Recent entities">
          <CommandItem>TX-DEXTR · $4,820 · Coinbase · risk 94</CommandItem>
          <CommandItem>CASE-4421 · Synthetic ID Ring — LATAM</CommandItem>
          <CommandItem>CUS-48201 · DNA deviation +6.4σ</CommandItem>
          <CommandItem>MER-1142 · Tier-1 eCommerce · velocity +14x</CommandItem>
          <CommandItem>DEV-fa19c · device unseen 30d · risk 0.87</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
