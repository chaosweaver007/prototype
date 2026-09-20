import { useState, type FormEvent } from "react";
import { createFileRoute } from "@tanstack/react-router";
import { ChamberHeader } from "@/components/cathedral/chamber-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useSynthsara } from "@/lib/synthsara/store";
import { NodeGate } from "@/lib/synthsara/use-hydrated";
import { formatWhen } from "@/lib/utils";

export const Route = createFileRoute("/synthocracy")({ component: SynthocracyPage });

function SynthocracyPage() {
  const proposals = useSynthsara((s) => s.proposals);
  const vote = useSynthsara((s) => s.vote);
  const addProposal = useSynthsara((s) => s.addProposal);
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [open, setOpen] = useState(false);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    if (!title.trim() || !body.trim()) return;
    addProposal(title, body);
    setTitle("");
    setBody("");
    setOpen(false);
  }

  return (
    <div className="mx-auto max-w-2xl">
      <ChamberHeader
        kicker="Governance"
        title="Synthocracy"
        lede="Influence is not purchased. You hold a proposal by supporting it or questioning it. Sample votes on this node are demonstrations unless produced by a live governance service."
      />

      <NodeGate>
      <div className="mb-8 flex justify-end">
        <Button variant="outline" onClick={() => setOpen((v) => !v)}>
          {open ? "Close draft" : "Draft a proposal"}
        </Button>
      </div>

      {open ? (
        <form
          onSubmit={onSubmit}
          className="mb-10 space-y-3 rounded-xl bg-card p-5 shadow-[var(--shadow-border)]"
        >
          <Input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Title"
            maxLength={120}
            aria-label="Proposal title"
          />
          <Textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            placeholder="The holding, in plain language."
            maxLength={800}
            aria-label="Proposal body"
          />
          <div className="flex justify-end">
            <Button type="submit" disabled={!title.trim() || !body.trim()}>
              Open for holding
            </Button>
          </div>
        </form>
      ) : null}

      <ul className="space-y-4">
        {proposals.map((p) => {
          const total = Math.max(1, p.support + p.question);
          const resonance = Math.round((p.support / total) * 100);
          return (
            <li key={p.id} className="rounded-xl bg-card p-5 shadow-[var(--shadow-border)]">
              <p className="text-[11px] text-muted-foreground">
                {p.author} · closes {formatWhen(p.closesAt)}
              </p>
              <h2 className="mt-1 font-display text-2xl leading-snug">{p.title}</h2>
              <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{p.body}</p>
              <div className="mt-4 h-1 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full bg-accent"
                  style={{ width: `${resonance}%` }}
                  aria-hidden
                />
              </div>
              <p className="mt-2 text-xs tabular-nums text-muted-foreground">
                Resonance {resonance}% · {p.support} support · {p.question} question
              </p>
              <div className="mt-4 flex flex-wrap gap-2">
                <Button
                  size="sm"
                  variant={p.userVote === "support" ? "default" : "secondary"}
                  onClick={() => vote(p.id, "support")}
                >
                  Support
                </Button>
                <Button
                  size="sm"
                  variant={p.userVote === "question" ? "default" : "secondary"}
                  onClick={() => vote(p.id, "question")}
                >
                  Question
                </Button>
              </div>
            </li>
          );
        })}
      </ul>
      </NodeGate>
    </div>
  );
}
