import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  Outlet,
  createRootRouteWithContext,
  useRouter,
  HeadContent,
  Scripts,
} from "@tanstack/react-router";
import { useEffect, useState, type ReactNode } from "react";

import appCss from "../styles.css?url";
import { reportLovableError } from "../lib/lovable-error-reporting";
import { AppSidebar } from "@/components/app-sidebar";
import { TopBar } from "@/components/top-bar";
import { CommandPalette } from "@/components/command-palette";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="surface-panel p-8 max-w-md text-center">
        <div className="text-[10px] mono uppercase tracking-widest text-primary">Error · 404</div>
        <h1 className="mt-2 text-2xl font-semibold">Route not found</h1>
        <p className="mt-2 text-sm text-muted-foreground">The requested intelligence surface does not exist.</p>
        <a href="/" className="inline-block mt-5 text-[12px] mono uppercase tracking-wider text-primary hover:underline">← Return to Executive</a>
      </div>
    </div>
  );
}

function ErrorComponent({ error, reset }: { error: Error; reset: () => void }) {
  const router = useRouter();
  useEffect(() => { reportLovableError(error, { boundary: "tanstack_root_error_component" }); }, [error]);
  return (
    <div className="flex min-h-screen items-center justify-center px-4">
      <div className="surface-panel p-8 max-w-md text-center">
        <div className="text-[10px] mono uppercase tracking-widest text-destructive">System Fault</div>
        <h1 className="mt-2 text-xl font-semibold">A module failed to load</h1>
        <p className="mt-2 text-sm text-muted-foreground">{error.message}</p>
        <button
          onClick={() => { router.invalidate(); reset(); }}
          className="mt-5 inline-flex items-center gap-2 h-9 px-4 rounded-md bg-primary text-primary-foreground text-sm font-medium hover:opacity-90"
        >Retry</button>
      </div>
    </div>
  );
}

export const Route = createRootRouteWithContext<{ queryClient: QueryClient }>()({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "AFIOS — Agentic Fraud Intelligence Operating System" },
      { name: "description", content: "Enterprise fraud detection, investigation, graph analysis, and AI-driven intelligence for financial institutions." },
      { property: "og:title", content: "AFIOS — Agentic Fraud Intelligence Operating System" },
      { name: "twitter:title", content: "AFIOS — Agentic Fraud Intelligence Operating System" },
      { property: "og:description", content: "Enterprise fraud detection, investigation, graph analysis, and AI-driven intelligence for financial institutions." },
      { name: "twitter:description", content: "Enterprise fraud detection, investigation, graph analysis, and AI-driven intelligence for financial institutions." },
      { property: "og:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e761f0ec-7afd-4f31-b5ed-57583e98bbbd/id-preview-d3ac0870--83d43f88-f22d-4452-ba0a-49c8d2860306.lovable.app-1781660341310.png" },
      { name: "twitter:image", content: "https://pub-bb2e103a32db4e198524a2e9ed8f35b4.r2.dev/e761f0ec-7afd-4f31-b5ed-57583e98bbbd/id-preview-d3ac0870--83d43f88-f22d-4452-ba0a-49c8d2860306.lovable.app-1781660341310.png" },
      { name: "twitter:card", content: "summary_large_image" },
      { property: "og:type", content: "website" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
  errorComponent: ErrorComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className="dark">
      <head><HeadContent /></head>
      <body>{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  const { queryClient } = Route.useRouteContext();
  const [paletteOpen, setPaletteOpen] = useState(false);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setPaletteOpen(o => !o);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className="flex h-dvh w-full overflow-hidden">
        <AppSidebar />
        <div className="flex-1 flex flex-col min-w-0 relative">
          <TopBar onOpenPalette={() => setPaletteOpen(true)} />
          <main className="flex-1 overflow-y-auto relative">
            <div className="relative z-[1] p-6 max-w-[1800px] mx-auto">
              <Outlet />
            </div>
          </main>
        </div>
        <CommandPalette open={paletteOpen} onOpenChange={setPaletteOpen} />
      </div>
    </QueryClientProvider>
  );
}
