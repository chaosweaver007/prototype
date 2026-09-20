import { type InputHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef<HTMLInputElement, InputHTMLAttributes<HTMLInputElement>>(
  ({ className, ...props }, ref) => (
    <input
      ref={ref}
      className={cn(
        "flex h-11 w-full rounded-md bg-secondary px-3 text-sm text-foreground shadow-[var(--shadow-border)] outline-none placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring/70",
        className,
      )}
      {...props}
    />
  ),
);
Input.displayName = "Input";
