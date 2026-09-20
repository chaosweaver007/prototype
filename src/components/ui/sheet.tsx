import * as Dialog from "@radix-ui/react-dialog";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";

export const Sheet = Dialog.Root;
export const SheetTrigger = Dialog.Trigger;
export const SheetClose = Dialog.Close;

export function SheetContent({
  children,
  className,
  title,
}: {
  children: React.ReactNode;
  className?: string;
  title: string;
}) {
  return (
    <Dialog.Portal>
      <Dialog.Overlay className="fixed inset-0 z-50 bg-background/70" />
      <Dialog.Content
        className={cn(
          "fixed inset-x-0 bottom-0 z-50 max-h-[86dvh] overflow-y-auto rounded-t-xl bg-card p-5 pb-[max(1.5rem,env(safe-area-inset-bottom))] shadow-[var(--shadow-border)] outline-none md:inset-y-0 md:right-0 md:left-auto md:h-full md:w-[min(100%,380px)] md:rounded-none md:rounded-l-xl",
          className,
        )}
      >
        <div className="mb-5 flex items-center justify-between gap-3">
          <Dialog.Title className="font-display text-xl font-medium tracking-tight">
            {title}
          </Dialog.Title>
          <Dialog.Close
            className="inline-flex size-11 items-center justify-center rounded-md text-muted-foreground hover:bg-secondary hover:text-foreground"
            aria-label="Close"
          >
            <X className="size-4" />
          </Dialog.Close>
        </div>
        {children}
      </Dialog.Content>
    </Dialog.Portal>
  );
}
