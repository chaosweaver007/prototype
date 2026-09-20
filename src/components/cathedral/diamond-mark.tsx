import { cn } from "@/lib/utils";

export function DiamondMark({
  className,
  size = 72,
  breathe = false,
}: {
  className?: string;
  size?: number;
  breathe?: boolean;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 80 80"
      fill="none"
      aria-hidden="true"
      className={cn("text-accent", breathe && "mark-breathe", className)}
    >
      <path d="M40 4 L76 40 L40 76 L4 40 Z" stroke="currentColor" strokeWidth="0.8" />
      <path d="M40 16 L64 40 L40 64 L16 40 Z" stroke="currentColor" strokeWidth="0.8" />
      <path d="M4 40 H76 M40 4 V76" stroke="currentColor" strokeWidth="0.4" opacity="0.7" />
      <circle cx="40" cy="40" r="2.2" fill="currentColor" />
    </svg>
  );
}
