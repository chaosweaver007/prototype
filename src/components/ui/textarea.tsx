import { type TextareaHTMLAttributes, forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Textarea = forwardRef<
  HTMLTextAreaElement,
  TextareaHTMLAttributes<HTMLTextAreaElement>
>(({ className, ...props }, ref) => (
  <textarea
    ref={ref}
    className={cn(
      "flex min-h-24 w-full rounded-lg bg-secondary px-3 py-3 text-sm text-foreground shadow-[var(--shadow-border)] outline-none placeholder:text-muted-foreground/70 focus-visible:ring-2 focus-visible:ring-ring/70",
      className,
    )}
    {...props}
  />
));
Textarea.displayName = "Textarea";
