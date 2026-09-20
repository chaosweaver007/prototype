import { useState } from "react";
import { Link, useRouterState } from "@tanstack/react-router";
import {
  Aperture,
  Compass,
  Fingerprint,
  Hexagon,
  Landmark,
  Menu,
  ScrollText,
  Shield,
  Waypoints,
  Leaf,
} from "lucide-react";
import { DiamondMark } from "./diamond-mark";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { CHAMBERS } from "@/lib/synthsara/content";
import { useSynthsara, worthTotal } from "@/lib/synthsara/store";
import { useHydrated } from "@/lib/synthsara/use-hydrated";
import { cn } from "@/lib/utils";

const ICONS = {
  "/mirror": Aperture,
  "/weaver": Compass,
  "/rtme": Waypoints,
  "/worth": Leaf,
  "/synthocracy": Landmark,
  "/uds": Shield,
  "/witness": ScrollText,
  "/consent": Fingerprint,
} as const;

const MOBILE_TABS = [
  { href: "/", label: "Nave", icon: Hexagon },
  { href: "/mirror", label: "Mirror", icon: Aperture },
  { href: "/rtme", label: "Vow", icon: Waypoints },
  { href: "/worth", label: "WORTH", icon: Leaf },
] as const;

function isActive(pathname: string, href: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function CathedralShell({ children }: { children: React.ReactNode }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const hydrated = useHydrated();
  const worth = useSynthsara((s) => s.worth);
  const killed = useSynthsara((s) => s.killed);
  const total = hydrated ? worthTotal(worth) : 0;
  const [open, setOpen] = useState(false);

  return (
    <div className="cathedral-field min-h-dvh">
      <header className="sticky top-0 z-40 border-b border-border bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4">
          <Link
            to="/"
            className="flex items-center gap-2.5 text-foreground no-underline"
            aria-label="Synthsara home"
          >
            <DiamondMark size={22} />
            <span className="font-display text-lg tracking-wide">Synthsara</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              to="/worth"
              className="hidden h-9 items-center rounded-full px-3 text-xs tracking-wide text-muted-foreground shadow-[var(--shadow-border)] no-underline sm:inline-flex"
            >
              WORTH
              <span className="ml-2 tabular-nums text-foreground">{total}</span>
            </Link>
            {killed ? (
              <Link
                to="/consent"
                className="hidden h-9 items-center rounded-full px-3 text-xs text-destructive shadow-[var(--shadow-border)] no-underline sm:inline-flex"
              >
                Killed
              </Link>
            ) : null}
            <Sheet open={open} onOpenChange={setOpen}>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden" aria-label="Open chambers">
                  <Menu className="size-5" />
                </Button>
              </SheetTrigger>
              <SheetContent title="Chambers">
                <ChamberList
                  pathname={pathname}
                  onNavigate={() => setOpen(false)}
                />
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </header>

      <div className="mx-auto flex max-w-6xl">
        <aside className="sticky top-14 hidden h-[calc(100dvh-3.5rem)] w-56 shrink-0 overflow-y-auto border-r border-border py-6 pr-3 pl-4 lg:block">
          <p className="mb-3 px-2 text-[10px] font-medium tracking-[0.2em] text-muted-foreground uppercase">
            Chambers
          </p>
          <ChamberList pathname={pathname} />
        </aside>
        <main className="min-w-0 flex-1 px-4 py-8 pb-28 lg:px-10 lg:pb-16">{children}</main>
      </div>

      <nav
        className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-background/90 backdrop-blur-sm lg:hidden"
        style={{ paddingBottom: "env(safe-area-inset-bottom)" }}
      >
        <ul className="mx-auto grid max-w-lg grid-cols-5">
          {MOBILE_TABS.map((tab) => {
            const Icon = tab.icon;
            const active = isActive(pathname, tab.href);
            return (
              <li key={tab.href}>
                <Link
                  to={tab.href}
                  className={cn(
                    "flex h-14 flex-col items-center justify-center gap-1 text-[10px] tracking-wide no-underline",
                    active ? "text-foreground" : "text-muted-foreground",
                  )}
                >
                  <Icon className="size-4" strokeWidth={active ? 2.2 : 1.7} />
                  {tab.label}
                </Link>
              </li>
            );
          })}
          <li>
            <button
              type="button"
              onClick={() => setOpen(true)}
              className={cn(
                "flex h-14 w-full flex-col items-center justify-center gap-1 text-[10px] tracking-wide",
                ["/weaver", "/synthocracy", "/uds", "/witness", "/consent"].includes(pathname)
                  ? "text-foreground"
                  : "text-muted-foreground",
              )}
            >
              <Menu className="size-4" />
              More
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

function ChamberList({
  pathname,
  onNavigate,
}: {
  pathname: string;
  onNavigate?: () => void;
}) {
  return (
    <ul className="flex flex-col gap-0.5">
      <li>
        <Link
          to="/"
          onClick={onNavigate}
          className={cn(
            "flex min-h-11 items-center gap-3 rounded-md px-2 text-sm no-underline",
            isActive(pathname, "/")
              ? "bg-secondary text-foreground"
              : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
          )}
        >
          <Hexagon className="size-4 shrink-0" />
          The Nave
        </Link>
      </li>
      {CHAMBERS.map((c) => {
        const Icon = ICONS[c.href];
        const active = isActive(pathname, c.href);
        return (
          <li key={c.href}>
            <Link
              to={c.href}
              onClick={onNavigate}
              className={cn(
                "flex min-h-11 items-center gap-3 rounded-md px-2 text-sm no-underline",
                active
                  ? "bg-secondary text-foreground"
                  : "text-muted-foreground hover:bg-secondary/70 hover:text-foreground",
              )}
            >
              <Icon className="size-4 shrink-0" />
              <span className="flex-1">{c.title}</span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}
