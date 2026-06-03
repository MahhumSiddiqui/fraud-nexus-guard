import { CommandDialog, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList, CommandSeparator } from "@/components/ui/command";
import { useNavigate } from "@tanstack/react-router";
import { Activity, AlertTriangle, Bot, Boxes, Cpu, FileSearch, Fingerprint, GitBranch, LayoutDashboard, Radar, ShieldCheck, TrendingUp } from "lucide-react";

const QUICK = [
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
  { to: "/compliance", label: "Compliance Center", icon: ShieldCheck },
  { to: "/models", label: "Model Intelligence", icon: Cpu },
];

export function CommandPalette({ open, onOpenChange }: { open: boolean; onOpenChange: (o: boolean) => void }) {
  const navigate = useNavigate();
  return (
    <CommandDialog open={open} onOpenChange={onOpenChange}>
      <CommandInput placeholder="Search anything — TX-, CASE-, CUS-, models, threats…" />
      <CommandList>
        <CommandEmpty>No matches.</CommandEmpty>
        <CommandGroup heading="Suggested actions">
          <CommandItem onSelect={() => { onOpenChange(false); navigate({ to: "/copilot" }); }}>Ask AI Copilot</CommandItem>
          <CommandItem onSelect={() => { onOpenChange(false); navigate({ to: "/simulation" }); }}>Simulate new rule</CommandItem>
          <CommandItem onSelect={() => { onOpenChange(false); navigate({ to: "/compliance" }); }}>Generate SAR draft</CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Navigate">
          {QUICK.map(q => (
            <CommandItem key={q.to} onSelect={() => { onOpenChange(false); navigate({ to: q.to }); }}>
              <q.icon className="h-4 w-4 mr-2 text-muted-foreground" /> {q.label}
            </CommandItem>
          ))}
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Entities">
          <CommandItem>TX-DEXTR · $4,820 · Coinbase · risk 94</CommandItem>
          <CommandItem>CASE-4421 · Synthetic ID Ring — LATAM</CommandItem>
          <CommandItem>CUS-48201 · DNA deviation +6.4σ</CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  );
}
