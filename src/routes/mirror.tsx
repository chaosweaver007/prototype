import { useEffect, useRef, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { ChamberHeader } from "@/components/cathedral/chamber-header";
import { CommunePanel } from "@/components/cathedral/commune-panel";
import { Button } from "@/components/ui/button";
import { beginLiveMirror, endLiveMirror } from "@/lib/synthsara/mirror-consent";
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
  const [token, setToken] = useState<string | null>(null);
  const tokenRef = useRef<string | null>(null);
  const openEpoch = useRef(0);
  const [opening, setOpening] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);
  const killed = useSynthsara((s) => s.killed);
  const clearThread = useSynthsara((s) => s.clearThread);
  const witnessEvent = useSynthsara((s) => s.witnessEvent);
  const memoryEnabled = useSynthsara((s) => s.consent.mirror_memory);
  const witnessEnabled = useSynthsara((s) => s.consent.witness_logging);

  function revokeServerToken(value: string) {
    void endLiveMirror({ data: { token: value } })
      .then(({ revoked }) => {
        if (!revoked) setNotice("Server revocation was not confirmed. Capability expires automatically.");
      })
      .catch(() => setNotice("Unable to confirm remote revocation; the expiring capability may still be valid."));
  }

  useEffect(() => {
    if (!killed) return;
    openEpoch.current += 1;
    setGate("awaiting");
    setOpening(false);
    const current = tokenRef.current;
    tokenRef.current = null;
    setToken(null);
    if (current) revokeServerToken(current);
  }, [killed]);

  // Abandoned capabilities expire; this cleanup is best-effort on navigation.
  useEffect(() => () => {
    openEpoch.current += 1;
    if (tokenRef.current) {
      void endLiveMirror({ data: { token: tokenRef.current } }).catch(() => undefined);
      tokenRef.current = null;
    }
  }, []);

  const active = mirrorMayReply(gate, killed) && (gate !== "live" || Boolean(token));

  function enterLocal() {
    setNotice(null);
    witnessEvent({
      kind: "mirror-session",
      summary: "Mirror session consented",
      meta: { version: MIRROR_FIRST_VERSION, mode: "local" },
    });
    setGate("local");
  }

  async function enterLive() {
    if (killed || opening) return;
    const requestId = ++openEpoch.current;
    setOpening(true);
    setNotice(null);
    try {
      const receipt = await beginLiveMirror({
        data: { accept: true, consentVersion: MIRROR_FIRST_VERSION },
      });
      if (requestId !== openEpoch.current || useSynthsara.getState().killed) {
        revokeServerToken(receipt.token);
        return;
      }
      tokenRef.current = receipt.token;
      setToken(receipt.token);
      setGate("live");
      witnessEvent({
        kind: "mirror-session",
        summary: "Mirror session consented",
        meta: { version: MIRROR_FIRST_VERSION, mode: "live", receipt: receipt.receiptId },
      });
    } catch {
      setNotice("Live consent could not be created. No remote conversation is authorized. Local mode remains available.");
    } finally {
      if (requestId === openEpoch.current) setOpening(false);
    }
  }

  function leave() {
    openEpoch.current += 1;
    setOpening(false);
    const current = tokenRef.current;
    tokenRef.current = null;
    setToken(null);
    setGate("awaiting");
    if (current) revokeServerToken(current);
    witnessEvent({
      kind: "mirror-session",
      summary: "Mirror session ended",
      meta: { version: MIRROR_FIRST_VERSION },
    });
  }

  return (
    <div className="mx-auto max-w-2xl">
      <ChamberHeader
        kicker="Sarah AI · Mirror-First 001"
        title="The Mirror"
        lede="You remain free to enter, challenge, and leave."
      />
      <p className="mb-5 text-xs leading-relaxed text-muted-foreground">{SARAH_DISCLAIMER}</p>
      <NodeGate>
        {notice ? <p role="alert" className="mb-4 text-sm text-destructive">{notice}</p> : null}
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
                <Button variant="outline" size="sm" onClick={leave}>
                  End this session
                </Button>
                <Button variant="ghost" size="sm" asChild><Link to="/consent">Privacy choices</Link></Button>
                <Button variant="ghost" size="sm" onClick={() => clearThread("sarah")}>Erase local thread</Button>
              </div>
            </div>
            <CommunePanel
              voice="sarah"
              mirrorSessionMode={gate === "live" ? "live" : "local"}
              mirrorConsentToken={token ?? undefined}
            />
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
              <Button className="mt-3" onClick={enterLocal} disabled={opening}>Begin locally</Button>
              <p className="mt-5 text-sm text-muted-foreground">{mirrorDataNotice("live")}</p>
              <Button className="mt-3" variant="outline" onClick={() => void enterLive()} disabled={opening}>
                {opening ? "Creating consent receipt…" : "I consent to live AI processing"}
              </Button>
              <p className="mt-5 text-xs text-muted-foreground">
                Your privacy settings may already retain data from past sessions on this device.
                Review or clear them in the <Link to="/consent" className="underline">Consent Vault</Link>.
                Neither option enables collective learning.
              </p>
              <Button className="mt-3" variant="ghost" onClick={() => { openEpoch.current += 1; setGate("declined"); setOpening(false); }}>Not now</Button>
            </div>
          </section>
        )}
      </NodeGate>
    </div>
  );
}
