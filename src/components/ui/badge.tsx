import { cn } from "@/lib/utils";

export function Badge({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full px-2.5 py-1 text-[11px] font-medium tracking-wide text-muted-foreground shadow-[var(--shadow-border)]",
        className,
      )}
    >
      {children}
    </span>
  );
}
