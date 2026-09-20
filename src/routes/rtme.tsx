import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChamberHeader } from "@/components/cathedral/chamber-header";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { commune } from "@/lib/synthsara/commune";
import { localManifest } from "@/lib/synthsara/content";
import { useSynthsara } from "@/lib/synthsara/store";
import { NodeGate } from "@/lib/synthsara/use-hydrated";
import { formatWhen } from "@/lib/utils";

export const Route = createFileRoute("/rtme")({ component: RtmePage });

function parseManifest(text: string, intention: string) {
  const grab = (label: string) => {
    const re = new RegExp(`${label}:\\s*([\\s\\S]*?)(?=\\n(?:VOW|CONSENT|ACTION|WITNESS):|$)`, "i");
    return text.match(re)?.[1]?.trim() ?? "";
  };
  const fallback = localManifest(intention);
  return {
    vow: grab("VOW") || fallback.vow,
    consent: grab("CONSENT") || fallback.consent,
    action: grab("ACTION") || fallback.action,
  };
}

function RtmePage() {
  const enabled = useSynthsara((s) => s.consent.rtme_processing);
  const manifestations = useSynthsara((s) => s.manifestations);
  const addManifest = useSynthsara((s) => s.addManifest);
  const keepVow = useSynthsara((s) => s.keepVow);
  const [intention, setIntention] = useState("");
  const [busy, setBusy] = useState(false);
  const [notice, setNotice] = useState<string | null>(null);

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!enabled || busy) return;
    const raw = intention.trim();
    if (!raw) return;
    setBusy(true);
    setNotice(null);
    let parsed = localManifest(raw);
    try {
      const result = await commune({
        data: {
          voice: "rtme",
          messages: [{ role: "user", content: raw }],
          intention: raw,
        },
      });
      if (result.ok) parsed = parseManifest(result.text, raw);
      else setNotice("Live engine unavailable. A local vow was formed instead.");
    } catch {
      setNotice("Live engine unavailable. A local vow was formed instead.");
    }
    addManifest({ intention: raw, ...parsed });
    setIntention("");
    setBusy(false);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <ChamberHeader
        kicker="Real-Time Manifesting Engine"
        title="The Manifester"
        lede="The intention is not stored. It is transmuted: a vow you can keep, a consent test, and one action small enough to finish before the feeling cools."
      />

      <NodeGate>
      {!enabled ? (
        <p className="mb-8 rounded-xl bg-card px-4 py-4 text-sm text-muted-foreground shadow-[var(--shadow-border)]">
          RTME processing is closed in the Consent Vault. Open it to form a vow.
        </p>
      ) : null}

      <form onSubmit={onSubmit} className="mb-12 space-y-3">
        <label htmlFor="intention" className="text-xs tracking-[0.16em] text-muted-foreground uppercase">
          Intention
        </label>
        <Textarea
          id="intention"
          value={intention}
          onChange={(e) => setIntention(e.target.value)}
          placeholder="Name what wants to become real — without performing it."
          maxLength={1200}
          disabled={!enabled || busy}
          rows={4}
        />
        {notice ? <p className="text-xs text-muted-foreground">{notice}</p> : null}
        <div className="flex justify-end">
          <Button type="submit" disabled={!enabled || busy || intention.trim().length === 0}>
            {busy ? "Forming…" : "Form the vow"}
          </Button>
        </div>
      </form>

      <div className="space-y-4">
        {manifestations.length === 0 ? (
          <p className="text-sm text-muted-foreground">No vows on this node yet.</p>
        ) : (
          manifestations.map((m) => (
            <article key={m.id} className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
              <p className="text-[11px] tracking-[0.16em] text-muted-foreground uppercase">
                {m.status === "kept" ? "Kept" : "Open"} · {formatWhen(m.at)}
              </p>
              <h2 className="mt-2 font-display text-2xl leading-snug">{m.vow}</h2>
              <p className="mt-3 text-sm text-muted-foreground">
                <span className="text-foreground">Consent. </span>
                {m.consent}
              </p>
              <p className="mt-2 text-sm text-muted-foreground">
                <span className="text-foreground">Action. </span>
                {m.action}
              </p>
              {m.status === "open" ? (
                <Button className="mt-4" size="sm" onClick={() => keepVow(m.id)}>
                  Mark the vow kept
                </Button>
              ) : (
                <p className="mt-4 text-xs tracking-[0.14em] text-muted-foreground uppercase">
                  Recognition minted
                </p>
              )}
            </article>
          ))
        )}
      </div>
      </NodeGate>
    </div>
  );
}
