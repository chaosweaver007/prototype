import { createFileRoute } from "@tanstack/react-router";
import { ChamberHeader } from "@/components/cathedral/chamber-header";
import { Button } from "@/components/ui/button";
import { UDS_PILLARS } from "@/lib/synthsara/content";
import { useSynthsara } from "@/lib/synthsara/store";
import { NodeGate } from "@/lib/synthsara/use-hydrated";

export const Route = createFileRoute("/uds")({ component: UdsPage });

function UdsPage() {
  const studied = useSynthsara((s) => s.studied);
  const studyPillar = useSynthsara((s) => s.studyPillar);

  return (
    <div className="mx-auto max-w-2xl">
      <ChamberHeader
        kicker="Constitution"
        title="Universal Diamond Standard"
        lede="Eight pillars. A failed gate blocks publication until the artifact is repaired or clearly retained as an unresolved draft. UDS Tier D1 is a public promise and a repair pathway — not a certification."
      />

      <NodeGate>
      <ol className="space-y-4">
        {UDS_PILLARS.map((p) => {
          const done = studied.includes(p.id);
          return (
            <li key={p.id} className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
              <p className="text-[11px] tracking-[0.2em] text-muted-foreground uppercase">
                Pillar {p.numeral}
              </p>
              <h2 className="mt-1 font-display text-2xl">{p.title}</h2>
              <p className="mt-2 font-display text-lg italic text-muted-foreground">{p.vow}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              <div className="mt-4">
                {done ? (
                  <p className="text-xs tracking-[0.14em] text-muted-foreground uppercase">
                    Studied on this node
                  </p>
                ) : (
                  <Button size="sm" variant="secondary" onClick={() => studyPillar(p.id)}>
                    Mark as studied
                  </Button>
                )}
              </div>
            </li>
          );
        })}
      </ol>
      </NodeGate>
    </div>
  );
}
