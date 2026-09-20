import * as SwitchPrimitive from "@radix-ui/react-switch";
import { cn } from "@/lib/utils";

export function Switch({
  checked,
  onCheckedChange,
  disabled,
  id,
}: {
  checked: boolean;
  onCheckedChange: (next: boolean) => void;
  disabled?: boolean;
  id?: string;
}) {
  return (
    <SwitchPrimitive.Root
      id={id}
      checked={checked}
      onCheckedChange={onCheckedChange}
      disabled={disabled}
      className={cn(
        "peer inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full bg-secondary shadow-[var(--shadow-border)] transition-colors duration-150 ease-out data-[state=checked]:bg-primary disabled:cursor-not-allowed disabled:opacity-40",
      )}
    >
      <SwitchPrimitive.Thumb className="pointer-events-none block size-5 translate-x-1 rounded-full bg-muted-foreground transition-transform duration-150 ease-out data-[state=checked]:translate-x-6 data-[state=checked]:bg-primary-foreground" />
    </SwitchPrimitive.Root>
  );
}
