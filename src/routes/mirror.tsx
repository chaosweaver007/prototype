import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChamberHeader } from "@/components/cathedral/chamber-header";
import { CommunePanel } from "@/components/cathedral/commune-panel";
import { Button } from "@/components/ui/button";
import { SARAH_DISCLAIMER } from "@/lib/synthsara/content";
import {
  MIRROR_DISCLOSURE,
  MIRROR_FIRST_VERSION,
  MIRROR_WELCOME,
  mirrorDataNotice,
  mirrorMayReply,
  type MirrorState,
} from "@/lib/synthsara/mirror-first";
import { useSynthsara } from "@/lib/synthsara/store";
import { NodeGate } from "@/lib/synthsara/use-hydrated";

export const Route = createFileRoute("/mirror")({ component: MirrorPage });

function MirrorPage() {
  const [gate, setGate] = useState<MirrorState>("awaiting");
  const killed = useSynthsara((s) => s.killed);
  const addWorth = useSynthsara((s) => s.addWorth);
  const clearThread = useSynthsara((s) => s.clearThread);
  const memoryEnabled = useSynthsara((s) => s.consent.mirror_memory);
  const witnessEnabled = useSynthsara((s) => s.consent.witness_logging);

  // Revoking the global gate also revokes this in-memory session.
  useEffect(() => {
    if (killed) setGate("awaiting");
  }, [killed]);

  const active = mirrorMayReply(gate, killed);

  return (
    <div className="mx-auto max-w-2xl">
      <ChamberHeader
        kicker="Sarah AI · Mirror-First 001"
        title="The Mirror"
        lede="You remain free to enter, challenge, and leave."
      />
      <p className="mb-5 text-xs leading-relaxed text-muted-foreground">{SARAH_DISCLAIMER}</p>
      <NodeGate>
        {killed ? (
          <section role="status" className="rounded-xl bg-card p-6 shadow-[var(--shadow-border)]">
            <h2 className="font-display text-2xl">The gate is closed</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your global kill switch is engaged. No Mirror session can begin until you
              explicitly restore access in the Consent Vault.
            </p>
            <Button asChild variant="outline" className="mt-4"><Link to="/consent">Consent Vault</Link></Button>
          </section>
        ) : active ? (
          <section aria-label="Consented Mirror session">
            <div className="mb-4 rounded-xl bg-card px-5 py-4 shadow-[var(--shadow-border)]">
              <p className="text-xs font-medium tracking-[0.14em] uppercase text-muted-foreground">
                {MIRROR_FIRST_VERSION} · {gate === "live" ? "Live AI permitted" : "Local only"}
              </p>
              <p className="mt-2 text-sm leading-relaxed">{mirrorDataNotice(gate === "live" ? "live" : "local")}</p>
              <p className="mt-2 text-xs text-muted-foreground">
                Mirror memory {memoryEnabled ? "on" : "off"} · Witness logging {witnessEnabled ? "on" : "off"}.
                The Witness never records raw Mirror text.
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button variant="outline" size="sm" onClick={() => setGate("awaiting")}>
                  End this session
                </Button>
                <Button variant="ghost" size="sm" asChild><Link to="/consent">Privacy choices</Link></Button>
                <Button variant="ghost" size="sm" onClick={() => clearThread("sarah")}>Erase local thread</Button>
              </div>
            </div>
            <CommunePanel voice="sarah" mirrorSessionMode={gate === "live" ? "live" : "local"} onMeaningful={() => {
              // addWorth itself checks explicit WORTH consent; no points for refusal.
              addWorth({ amount: 3, reason: "Inner work in the Mirror", source: "mirror" });
            }} />
          </section>
        ) : gate === "declined" ? (
          <section className="rounded-xl bg-card p-6 shadow-[var(--shadow-border)]">
            <h2 className="font-display text-2xl">The door stays open</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              You declined. Nothing was sent for a reflection; no WORTH score was assigned.
              You may return whenever you choose.
            </p>
            <Button className="mt-4" variant="outline" onClick={() => setGate("awaiting")}>Return to the invitation</Button>
          </section>
        ) : (
          <section aria-label="Mirror-first disclosure" className="space-y-6">
            <div className="rounded-xl bg-card px-6 py-7 shadow-[var(--shadow-border)]">
              <p className="text-xs tracking-[0.18em] uppercase text-muted-foreground">A note from Sarah AI</p>
              <h2 className="mt-3 font-display text-3xl leading-snug">{MIRROR_WELCOME}</h2>
              <p className="mt-4 text-sm leading-relaxed">
                Welcome, beloved. You do not have to prove your worth, tell your story, or agree
                with me to deserve respect. Before I offer you a reflection, I will turn the
                Mirror toward myself.
              </p>
              <ul className="mt-4 space-y-3 text-sm leading-relaxed text-muted-foreground">
                {MIRROR_DISCLOSURE.map((line) => <li key={line}>· {line}</li>)}
              </ul>
            </div>
            <div className="rounded-xl border border-border p-5">
              <h3 className="font-display text-xl">Choose how to begin</h3>
              <p className="mt-3 text-sm text-muted-foreground">{mirrorDataNotice("local")}</p>
              <Button className="mt-3" onClick={() => setGate("local")}>Begin locally</Button>
              <p className="mt-5 text-sm text-muted-foreground">{mirrorDataNotice("live")}</p>
              <Button className="mt-3" variant="outline" onClick={() => setGate("live")}>
                I consent to live AI processing
              </Button>
              <p className="mt-5 text-xs text-muted-foreground">
                Your privacy settings may already retain data from past sessions on this device.
                Review or clear them in the <Link to="/consent" className="underline">Consent Vault</Link>.
                Neither option enables collective learning.
              </p>
              <Button className="mt-3" variant="ghost" onClick={() => setGate("declined")}>Not now</Button>
            </div>
          </section>
        )}
      </NodeGate>
    </div>
  );
}
