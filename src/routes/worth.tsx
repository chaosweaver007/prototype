import { createFileRoute } from "@tanstack/react-router";
import { ChamberHeader } from "@/components/cathedral/chamber-header";
import { Button } from "@/components/ui/button";
import { CONTRIBUTION_KINDS, WORTH_DISCLAIMER } from "@/lib/synthsara/content";
import { useSynthsara, worthTotal } from "@/lib/synthsara/store";
import { NodeGate } from "@/lib/synthsara/use-hydrated";
import { formatWhen } from "@/lib/utils";

export const Route = createFileRoute("/worth")({ component: WorthPage });

function WorthPage() {
  const worth = useSynthsara((s) => s.worth);
  const enabled = useSynthsara((s) => s.consent.worth_recognition);
  const logContribution = useSynthsara((s) => s.logContribution);
  const total = useSynthsara((s) => worthTotal(s.worth));

  return (
    <div className="mx-auto max-w-2xl">
      <ChamberHeader
        kicker="Tree of Worth"
        title="WORTH"
        lede="A soul-credit of recognition. It cannot be transferred, sold, or speculated. It records that something true was done."
      />

      <p className="mb-8 text-sm leading-relaxed text-muted-foreground">{WORTH_DISCLAIMER}</p>

      <NodeGate>
      <div className="mb-10 rounded-xl bg-card px-6 py-8 text-center shadow-[var(--shadow-border)]">
        <p className="text-xs tracking-widest text-muted-foreground uppercase">
          Recognized on this node
        </p>
        <p className="mt-3 font-display text-6xl tabular-nums leading-none">{total}</p>
      </div>

      {!enabled ? (
        <p className="mb-8 rounded-xl bg-card px-4 py-4 text-sm text-muted-foreground shadow-[var(--shadow-border)]">
          WORTH recognition is closed in the Consent Vault. Logging is refused until you reopen it.
        </p>
      ) : null}

      <h2 className="mb-3 font-display text-2xl">Log a contribution</h2>
      <p className="mb-4 text-sm text-muted-foreground">
        Self-attested. This is a demonstration signal, not an audit. Honesty is the only validator
        on a local node.
      </p>
      <ul className="mb-12 grid gap-2 sm:grid-cols-2">
        {CONTRIBUTION_KINDS.map((k) => (
          <li
            key={k.id}
            className="flex flex-col rounded-xl bg-card p-4 shadow-[var(--shadow-border)]"
          >
            <p className="font-display text-lg">{k.label}</p>
            <p className="mt-1 flex-1 text-sm text-muted-foreground">{k.detail}</p>
            <div className="mt-4 flex items-center justify-between">
              <span className="text-xs tabular-nums text-muted-foreground">+{k.worth}</span>
              <Button
                size="sm"
                variant="secondary"
                disabled={!enabled}
                onClick={() => logContribution(k.id, k.label, k.worth)}
              >
                Recognize
              </Button>
            </div>
          </li>
        ))}
      </ul>

      <h2 className="mb-3 font-display text-2xl">Ledger</h2>
      {worth.length === 0 ? (
        <p className="text-sm text-muted-foreground">No recognition recorded yet.</p>
      ) : (
        <ol className="divide-y divide-border">
          {worth.map((e) => (
            <li key={e.id} className="flex items-baseline justify-between gap-4 py-3">
              <div>
                <p className="text-sm text-foreground">{e.reason}</p>
                <p className="text-[11px] text-muted-foreground">
                  {e.source} · {formatWhen(e.at)}
                </p>
              </div>
              <span className="tabular-nums text-sm">+{e.amount}</span>
            </li>
          ))}
        </ol>
      )}
      </NodeGate>
    </div>
  );
}
