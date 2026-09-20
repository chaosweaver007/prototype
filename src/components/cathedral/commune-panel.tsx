import { useEffect, useRef, useState, type FormEvent, type KeyboardEvent } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { commune } from "@/lib/synthsara/commune";
import { localReflection, reviewUds } from "@/lib/synthsara/content";
import { useSynthsara } from "@/lib/synthsara/store";
import { useHydrated } from "@/lib/synthsara/use-hydrated";
import type { Voice } from "@/lib/synthsara/types";
import { cn, formatWhen } from "@/lib/utils";

const PLACEHOLDER: Record<Voice, string> = {
  sarah: "What is moving in you?",
  steven: "What structure needs naming?",
  unified: "Speak to the Harmonizer.",
};

const EMPTY: Record<Voice, string> = {
  sarah: "The Mirror is empty. Begin with one true sentence.",
  steven: "The Weaver waits. Name the load-bearing problem.",
  unified: "The temple is quiet. Bring both heart and structure.",
};

export function CommunePanel({
  voice,
  onMeaningful,
}: {
  voice: Voice;
  onMeaningful?: () => void;
}) {
  const threadAll = useSynthsara((s) => s.threads[voice]);
  const hydrated = useHydrated();
  const thread = hydrated ? threadAll : [];
  const appendMessage = useSynthsara((s) => s.appendMessage);
  const clearThread = useSynthsara((s) => s.clearThread);
  const witnessEvent = useSynthsara((s) => s.witnessEvent);
  const [draft, setDraft] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const scroller = useRef<HTMLDivElement>(null);
  const turns = useRef(0);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [thread.length, busy]);

  async function send(text: string) {
    const content = text.trim();
    if (!content || busy) return;
    setDraft("");
    setError(null);
    setBusy(true);
    appendMessage(voice, { role: "user", content });
    turns.current += 1;

    const history = [
      ...useSynthsara.getState().threads[voice].slice(-6).map((m) => ({
        role: m.role,
        content: m.content,
      })),
    ];

    try {
      const result = await commune({
        data: { voice, messages: history },
      });
      const textOut = result.ok ? result.text : localReflection(voice, content);
      const uds = reviewUds(textOut);
      const saved = appendMessage(voice, {
        role: "assistant",
        content: textOut,
        uds,
      });
      witnessEvent({
        kind: "mirror",
        summary:
          voice === "sarah"
            ? "A Mirror session continued"
            : voice === "steven"
              ? "A Weaver session continued"
              : "A Harmonizer session continued",
        meta: { voice, receipt: saved.id.slice(0, 8) },
      });
      if (!result.ok) setError("Live communion unavailable. Local reflection held the gate.");
      if (turns.current === 3) onMeaningful?.();
    } catch {
      const textOut = localReflection(voice, content);
      appendMessage(voice, { role: "assistant", content: textOut, uds: reviewUds(textOut) });
      setError("Live communion unavailable. Local reflection held the gate.");
    } finally {
      setBusy(false);
    }
  }

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    void send(draft);
  }

  function onKey(e: KeyboardEvent<HTMLTextAreaElement>) {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      void send(draft);
    }
  }

  return (
    <div className="flex min-h-[62dvh] flex-col">
      <div ref={scroller} className="flex-1 space-y-5 overflow-y-auto pr-1">
        {thread.length === 0 && !busy ? (
          <p className="max-w-md py-10 font-display text-2xl leading-snug text-muted-foreground">
            {EMPTY[voice]}
          </p>
        ) : null}
        {thread.map((m) => (
          <article
            key={m.id}
            className={cn(
              "max-w-xl",
              m.role === "user" ? "ml-auto text-right" : "mr-auto",
            )}
          >
            <p className="mb-1 text-[10px] tracking-[0.16em] text-muted-foreground uppercase">
              {m.role === "user" ? "Seeker" : voice === "sarah" ? "Sarah" : voice === "steven" ? "Steven" : "Harmonizer"}
              <span className="ml-2 normal-case tracking-normal">{formatWhen(m.at)}</span>
            </p>
            <div
              className={cn(
                "rounded-xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap",
                m.role === "user"
                  ? "rounded-br-sm bg-secondary text-foreground"
                  : "rounded-bl-sm bg-card text-foreground shadow-[var(--shadow-border)]",
              )}
            >
              {m.content}
            </div>
            {m.uds ? (
              <p className="mt-1.5 text-[11px] text-muted-foreground">
                {m.uds.notes[0]}
                {m.receiptId ? ` · receipt ${m.receiptId.slice(0, 8)}` : null}
              </p>
            ) : null}
          </article>
        ))}
        {busy ? (
          <p className="text-sm text-muted-foreground">Listening…</p>
        ) : null}
      </div>

      <form onSubmit={onSubmit} className="mt-5 space-y-3">
        {error ? <p className="text-xs text-muted-foreground">{error}</p> : null}
        <Textarea
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          onKeyDown={onKey}
          placeholder={PLACEHOLDER[voice]}
          rows={3}
          maxLength={2000}
          disabled={busy}
          aria-label="Message"
        />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <Button
            type="button"
            variant="ghost"
            size="sm"
            onClick={() => clearThread(voice)}
            disabled={thread.length === 0}
          >
            Clear thread
          </Button>
          <Button type="submit" disabled={busy || draft.trim().length === 0}>
            Commune
          </Button>
        </div>
      </form>
    </div>
  );
}
