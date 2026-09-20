import { createFileRoute } from "@tanstack/react-router";
import { ChamberHeader } from "@/components/cathedral/chamber-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Switch } from "@/components/ui/switch";
import { OPTIONAL_SCOPES } from "@/lib/synthsara/content";
import { useSynthsara } from "@/lib/synthsara/store";
import { NodeGate } from "@/lib/synthsara/use-hydrated";

export const Route = createFileRoute("/consent")({ component: ConsentPage });

function ConsentPage() {
  const handle = useSynthsara((s) => s.handle);
  const setHandle = useSynthsara((s) => s.setHandle);
  const consent = useSynthsara((s) => s.consent);
  const killed = useSynthsara((s) => s.killed);
  const setScope = useSynthsara((s) => s.setScope);
  const killSwitch = useSynthsara((s) => s.killSwitch);
  const restoreDefaults = useSynthsara((s) => s.restoreDefaults);

  return (
    <div className="mx-auto max-w-2xl">
      <ChamberHeader
        kicker="Sovereignty"
        title="Consent Vault"
        lede="Private by default. Every optional scope is granular and revocable. The kill switch closes them all. Nothing here leaves this device."
      />

      <NodeGate>
      <label className="mb-8 block">
        <span className="mb-2 block text-xs tracking-[0.16em] text-muted-foreground uppercase">
          Local handle
        </span>
        <Input
          value={handle}
          onChange={(e) => setHandle(e.target.value)}
          placeholder="A name this node may use on proposals"
          maxLength={40}
        />
      </label>

      {killed ? (
        <p className="mb-6 rounded-xl bg-card px-4 py-4 text-sm text-destructive shadow-[var(--shadow-border)]">
          Kill switch is engaged. Optional scopes cannot be reopened until you restore the default
          posture.
        </p>
      ) : null}

      <ul className="mb-10 space-y-2">
        {OPTIONAL_SCOPES.map((scope) => (
          <li
            key={scope.id}
            className="flex items-start justify-between gap-4 rounded-xl bg-card p-4 shadow-[var(--shadow-border)]"
          >
            <div className="min-w-0">
              <p className="text-sm text-foreground">{scope.label}</p>
              <p className="mt-1 text-sm text-muted-foreground">{scope.detail}</p>
            </div>
            <Switch
              id={scope.id}
              checked={consent[scope.id]}
              onCheckedChange={(v) => setScope(scope.id, v)}
              disabled={killed}
            />
          </li>
        ))}
      </ul>

      <div className="flex flex-wrap gap-2">
        <Button variant="destructive" onClick={killSwitch} disabled={killed}>
          Kill switch
        </Button>
        <Button variant="outline" onClick={restoreDefaults}>
          Restore defaults
        </Button>
      </div>
      </NodeGate>
    </div>
  );
}
