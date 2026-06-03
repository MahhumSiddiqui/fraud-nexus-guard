import { Bell, Command, Globe2, Search, Sun, Moon } from "lucide-react";
import { useEffect, useState } from "react";

export function TopBar({ onOpenPalette }: { onOpenPalette: () => void }) {
  const [dark, setDark] = useState(true);
  useEffect(() => {
    document.documentElement.classList.toggle("light", !dark);
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <header className="h-14 shrink-0 border-b bg-background/80 backdrop-blur flex items-center gap-3 px-4 relative z-10">
      <button
        onClick={onOpenPalette}
        className="group flex items-center gap-2 h-9 px-3 rounded-md bg-surface border border-border hover:border-border-strong w-[420px] text-left text-muted-foreground hover:text-foreground transition-colors"
      >
        <Search className="h-3.5 w-3.5" />
        <span className="text-[13px] flex-1">Search entities, transactions, cases, models…</span>
        <span className="hidden lg:inline-flex items-center gap-1 text-[10px] mono border border-border rounded px-1.5 py-0.5">
          <Command className="h-2.5 w-2.5" /> K
        </span>
      </button>

      <div className="hidden xl:flex items-center gap-4 ml-2 text-[11px] mono uppercase tracking-wider">
        <Stat label="TPS" value="2,184" tone="ok" />
        <Stat label="P50" value="11ms" tone="ok" />
        <Stat label="Models" value="14/14" tone="ok" />
        <Stat label="Threats" value="3 CRIT" tone="warn" />
      </div>

      <div className="ml-auto flex items-center gap-1.5">
        <IconBtn><Globe2 className="h-4 w-4" /></IconBtn>
        <IconBtn onClick={() => setDark(d => !d)}>
          {dark ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </IconBtn>
        <IconBtn>
          <Bell className="h-4 w-4" />
          <span className="absolute top-1.5 right-1.5 h-1.5 w-1.5 rounded-full bg-risk-critical pulse-critical" />
        </IconBtn>
        <div className="ml-2 h-8 pl-2 border-l border-border flex items-center gap-2">
          <div className="h-7 w-7 rounded-full bg-gradient-to-br from-chart-2 to-primary grid place-items-center text-[11px] font-semibold text-primary-foreground">AO</div>
          <div className="hidden lg:block leading-tight">
            <div className="text-[12px] font-medium">A. Okafor</div>
            <div className="text-[10px] mono uppercase tracking-wider text-muted-foreground">Lead Analyst · TIER-3</div>
          </div>
        </div>
      </div>
    </header>
  );
}

function Stat({ label, value, tone }: { label: string; value: string; tone: "ok" | "warn" | "crit" }) {
  const c = tone === "ok" ? "text-status-clear" : tone === "warn" ? "text-risk-high" : "text-risk-critical";
  return (
    <div className="flex items-center gap-1.5">
      <span className="text-muted-foreground">{label}</span>
      <span className={c + " tabular"}>{value}</span>
    </div>
  );
}

function IconBtn({ children, onClick }: { children: React.ReactNode; onClick?: () => void }) {
  return (
    <button
      onClick={onClick}
      className="relative h-9 w-9 grid place-items-center rounded-md text-muted-foreground hover:text-foreground hover:bg-surface transition-colors"
    >
      {children}
    </button>
  );
}
