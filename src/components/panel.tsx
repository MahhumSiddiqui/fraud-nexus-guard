import { cn } from "@/lib/utils";
import { ReactNode } from "react";

export function Panel({
  title, subtitle, action, className, children, dense,
}: {
  title?: ReactNode;
  subtitle?: ReactNode;
  action?: ReactNode;
  className?: string;
  children: ReactNode;
  dense?: boolean;
}) {
  return (
    <section className={cn("surface-panel overflow-hidden", className)}>
      {(title || action) && (
        <header className="flex items-center gap-3 px-4 py-2.5 border-b border-border">
          <div className="min-w-0">
            {title && <h3 className="text-[12px] mono uppercase tracking-widest text-muted-foreground">{title}</h3>}
            {subtitle && <div className="text-[13px] text-foreground mt-0.5 truncate">{subtitle}</div>}
          </div>
          {action && <div className="ml-auto">{action}</div>}
        </header>
      )}
      <div className={cn(dense ? "" : "p-4")}>{children}</div>
    </section>
  );
}

export function PageHeader({ eyebrow, title, description, action }: {
  eyebrow?: string; title: string; description?: string; action?: ReactNode;
}) {
  return (
    <div className="flex items-end justify-between gap-6 mb-5">
      <div>
        {eyebrow && <div className="text-[10px] mono uppercase tracking-widest text-primary mb-1.5">{eyebrow}</div>}
        <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
        {description && <p className="text-[13px] text-muted-foreground mt-1 max-w-2xl">{description}</p>}
      </div>
      {action}
    </div>
  );
}
