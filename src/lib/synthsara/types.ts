export type Voice = "sarah" | "steven" | "unified";

export type ConsentScope =
  | "mirror_memory"
  | "witness_logging"
  | "worth_recognition"
  | "collective_learning"
  | "rtme_processing";

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  at: number;
  uds?: { passed: boolean; notes: string[] };
  receiptId?: string;
};

export type WorthEntry = {
  id: string;
  amount: number;
  reason: string;
  source: "mirror" | "rtme" | "vote" | "contribution" | "uds" | "stewardship";
  at: number;
};

export type ProposalVote = "support" | "question";

export type Proposal = {
  id: string;
  title: string;
  body: string;
  author: string;
  createdAt: number;
  closesAt: number;
  support: number;
  question: number;
  userVote: ProposalVote | null;
};

export type Manifestation = {
  id: string;
  intention: string;
  vow: string;
  consent: string;
  action: string;
  status: "open" | "kept";
  at: number;
};

export type WitnessEvent = {
  id: string;
  kind: string;
  summary: string;
  at: number;
  meta?: Record<string, string>;
};

export type ContributionKind = {
  id: string;
  label: string;
  detail: string;
  worth: number;
};
