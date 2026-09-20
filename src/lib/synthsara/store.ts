import { create } from "zustand";
import { persist } from "zustand/middleware";
import { uid } from "@/lib/utils";
import {
  OPTIONAL_SCOPES,
  seedProposals,
} from "./content";
import type {
  ChatMessage,
  ConsentScope,
  Manifestation,
  Proposal,
  ProposalVote,
  Voice,
  WitnessEvent,
  WorthEntry,
} from "./types";

type ConsentState = Record<ConsentScope, boolean>;

type State = {
  handle: string;
  consent: ConsentState;
  killed: boolean;
  worth: WorthEntry[];
  proposals: Proposal[];
  manifestations: Manifestation[];
  witness: WitnessEvent[];
  studied: string[];
  threads: Record<Voice, ChatMessage[]>;
};

type Actions = {
  setHandle: (handle: string) => void;
  setScope: (scope: ConsentScope, value: boolean) => void;
  killSwitch: () => void;
  restoreDefaults: () => void;
  addWorth: (entry: Omit<WorthEntry, "id" | "at"> & { at?: number }) => void;
  logContribution: (kindId: string, label: string, amount: number) => void;
  vote: (proposalId: string, vote: ProposalVote) => void;
  addProposal: (title: string, body: string) => void;
  addManifest: (m: Omit<Manifestation, "id" | "at" | "status">) => Manifestation;
  keepVow: (id: string) => void;
  studyPillar: (id: string) => void;
  appendMessage: (voice: Voice, message: Omit<ChatMessage, "id" | "at"> & { at?: number }) => ChatMessage;
  clearThread: (voice: Voice) => void;
  witnessEvent: (event: Omit<WitnessEvent, "id" | "at"> & { at?: number }) => void;
  clearWitness: () => void;
};

const defaultConsent = (): ConsentState => ({
  mirror_memory: true,
  witness_logging: true,
  worth_recognition: true,
  collective_learning: false,
  rtme_processing: true,
});

function emptyThreads(): Record<Voice, ChatMessage[]> {
  return { sarah: [], steven: [], unified: [] };
}

export const useSynthsara = create<State & Actions>()(
  persist(
    (set, get) => ({
      handle: "",
      consent: defaultConsent(),
      killed: false,
      worth: [],
      proposals: seedProposals(),
      manifestations: [],
      witness: [],
      studied: [],
      threads: emptyThreads(),

      setHandle: (handle) => set({ handle: handle.slice(0, 40) }),

      setScope: (scope, value) => {
        if (get().killed && value) return;
        set((s) => ({ consent: { ...s.consent, [scope]: value } }));
        get().witnessEvent({
          kind: "consent",
          summary: `${OPTIONAL_SCOPES.find((x) => x.id === scope)?.label ?? scope} ${value ? "granted" : "revoked"}`,
          meta: { scope, value: String(value) },
        });
      },

      killSwitch: () => {
        const closed = Object.fromEntries(
          OPTIONAL_SCOPES.map((s) => [s.id, false]),
        ) as ConsentState;
        set({ consent: closed, killed: true });
        get().witnessEvent({
          kind: "consent",
          summary: "Global kill switch — all optional scopes revoked",
        });
      },

      restoreDefaults: () => {
        set({ consent: defaultConsent(), killed: false });
        get().witnessEvent({
          kind: "consent",
          summary: "Consent restored to private-by-default posture",
        });
      },

      addWorth: (entry) => {
        if (!get().consent.worth_recognition) return;
        const row: WorthEntry = {
          id: uid(),
          at: entry.at ?? Date.now(),
          amount: entry.amount,
          reason: entry.reason,
          source: entry.source,
        };
        set((s) => ({ worth: [row, ...s.worth].slice(0, 200) }));
        get().witnessEvent({
          kind: "worth",
          summary: `WORTH +${row.amount} — ${row.reason}`,
          meta: { source: row.source },
        });
      },

      logContribution: (kindId, label, amount) => {
        get().addWorth({
          amount,
          reason: label,
          source: kindId === "steward" ? "stewardship" : "contribution",
        });
      },

      vote: (proposalId, vote) => {
        const current = get().proposals.find((p) => p.id === proposalId);
        if (!current) return;
        set((s) => ({
          proposals: s.proposals.map((p) => {
            if (p.id !== proposalId) return p;
            let support = p.support;
            let question = p.question;
            if (p.userVote === "support") support -= 1;
            if (p.userVote === "question") question -= 1;
            if (p.userVote === vote) {
              return { ...p, support, question, userVote: null };
            }
            if (vote === "support") support += 1;
            else question += 1;
            return { ...p, support, question, userVote: vote };
          }),
        }));
        const next = get().proposals.find((p) => p.id === proposalId);
        if (next?.userVote && !current.userVote) {
          get().addWorth({
            amount: 1,
            reason: `Held a proposal: ${current.title}`,
            source: "vote",
          });
        }
        get().witnessEvent({
          kind: "governance",
          summary:
            next?.userVote == null
              ? `Withdrew a hold on “${current.title}”`
              : `${next.userVote === "support" ? "Supported" : "Questioned"} “${current.title}”`,
        });
      },

      addProposal: (title, body) => {
        const now = Date.now();
        const row: Proposal = {
          id: uid(),
          title: title.trim().slice(0, 120),
          body: body.trim().slice(0, 800),
          author: get().handle.trim() || "Local node",
          createdAt: now,
          closesAt: now + 14 * 86_400_000,
          support: 1,
          question: 0,
          userVote: "support",
        };
        set((s) => ({ proposals: [row, ...s.proposals] }));
        get().witnessEvent({
          kind: "governance",
          summary: `Opened proposal “${row.title}”`,
        });
      },

      addManifest: (m) => {
        const row: Manifestation = {
          ...m,
          id: uid(),
          at: Date.now(),
          status: "open",
        };
        set((s) => ({ manifestations: [row, ...s.manifestations].slice(0, 80) }));
        get().witnessEvent({
          kind: "rtme",
          summary: "A vow was formed from an intention",
        });
        return row;
      },

      keepVow: (id) => {
        const item = get().manifestations.find((m) => m.id === id);
        if (!item || item.status === "kept") return;
        set((s) => ({
          manifestations: s.manifestations.map((m) =>
            m.id === id ? { ...m, status: "kept" } : m,
          ),
        }));
        get().addWorth({
          amount: 5,
          reason: "A vow was kept",
          source: "rtme",
        });
      },

      studyPillar: (id) => {
        if (get().studied.includes(id)) return;
        set((s) => ({ studied: [...s.studied, id] }));
        get().addWorth({
          amount: 1,
          reason: "Studied a Diamond Standard pillar",
          source: "uds",
        });
      },

      appendMessage: (voice, message) => {
        const row: ChatMessage = {
          id: uid(),
          at: message.at ?? Date.now(),
          role: message.role,
          content: message.content,
          uds: message.uds,
          receiptId: message.receiptId,
        };
        set((s) => ({
          threads: {
            ...s.threads,
            [voice]: [...s.threads[voice], row].slice(-80),
          },
        }));
        return row;
      },

      clearThread: (voice) => {
        set((s) => ({ threads: { ...s.threads, [voice]: [] } }));
      },

      witnessEvent: (event) => {
        if (!get().consent.witness_logging && event.kind !== "consent") return;
        const row: WitnessEvent = {
          id: uid(),
          at: event.at ?? Date.now(),
          kind: event.kind,
          summary: event.summary,
          meta: event.meta,
        };
        set((s) => ({ witness: [row, ...s.witness].slice(0, 300) }));
      },

      clearWitness: () => set({ witness: [] }),
    }),
    {
      name: "synthsara-node-zero",
      version: 1,
      partialize: (s) => ({
        handle: s.handle,
        consent: s.consent,
        killed: s.killed,
        worth: s.worth,
        proposals: s.proposals,
        manifestations: s.manifestations,
        witness: s.witness,
        studied: s.studied,
        threads: s.consent.mirror_memory ? s.threads : emptyThreads(),
      }),
    },
  ),
);

export function worthTotal(entries: WorthEntry[]): number {
  return entries.reduce((sum, e) => sum + e.amount, 0);
}
