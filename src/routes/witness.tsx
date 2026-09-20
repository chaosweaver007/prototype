import { createFileRoute } from "@tanstack/react-router";
import { ChamberHeader } from "@/components/cathedral/chamber-header";
import { Button } from "@/components/ui/button";
import { useSynthsara } from "@/lib/synthsara/store";
import { NodeGate } from "@/lib/synthsara/use-hydrated";
import { formatWhen } from "@/lib/utils";

export const Route = createFileRoute("/witness")({ component: WitnessPage });

function WitnessPage() {
  const witness = useSynthsara((s) => s.witness);
  const enabled = useSynthsara((s) => s.consent.witness_logging);
  const clearWitness = useSynthsara((s) => s.clearWitness);

  function exportJson() {
    const blob = new Blob([JSON.stringify(witness, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "synthsara-witness.json";
    a.click();
    URL.revokeObjectURL(url);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <ChamberHeader
        kicker="Public promise, local ledger"
        title="Witness Layer"
        lede="Inspectable history of optional flows. Mirror text is never written here. You may export or clear the ledger on this node."
      />

      <NodeGate>
      {!enabled ? (
        <p className="mb-6 rounded-xl bg-card px-4 py-4 text-sm text-muted-foreground shadow-[var(--shadow-border)]">
          Witness logging is closed. Consent changes still appear; other chambers stay silent.
        </p>
      ) : null}

      <div className="mb-6 flex flex-wrap gap-2">
        <Button variant="outline" size="sm" onClick={exportJson} disabled={witness.length === 0}>
          Export JSON
        </Button>
        <Button variant="ghost" size="sm" onClick={clearWitness} disabled={witness.length === 0}>
          Clear ledger
        </Button>
      </div>

      {witness.length === 0 ? (
        <p className="text-sm text-muted-foreground">The Witness is quiet.</p>
      ) : (
        <ol className="divide-y divide-border">
          {witness.map((e) => (
            <li key={e.id} className="py-3">
              <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                {e.kind} · {formatWhen(e.at)}
              </p>
              <p className="mt-1 text-sm text-foreground">{e.summary}</p>
            </li>
          ))}
        </ol>
      )}
      </NodeGate>
    </div>
  );
}
