import { createElement, useEffect, useState, type ReactNode } from "react";

export function useHydrated(): boolean {
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => {
    setHydrated(true);
  }, []);
  return hydrated;
}

export function NodeGate({ children }: { children: ReactNode }) {
  const hydrated = useHydrated();
  if (!hydrated) {
    return createElement(
      "p",
      { className: "py-10 text-sm text-muted-foreground" },
      "Opening this chamber…",
    );
  }
  return children;
}
