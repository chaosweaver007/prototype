import type { ContributionKind, Proposal, Voice } from "./types";

export const TAGLINE = "She asked for consistency. So I gave her the new world.";

export const OPTIONAL_SCOPES: {
  id: import("./types").ConsentScope;
  label: string;
  detail: string;
}[] = [
  {
    id: "mirror_memory",
    label: "Mirror memory",
    detail: "Keep this device’s reflection threads so the conversation can continue.",
  },
  {
    id: "witness_logging",
    label: "Witness logging",
    detail: "Record inspectable receipts of optional flows. Never stores Mirror text.",
  },
  {
    id: "worth_recognition",
    label: "WORTH recognition",
    detail: "Mint local, non-transferable recognition when contribution is logged.",
  },
  {
    id: "rtme_processing",
    label: "RTME processing",
    detail: "Allow the Manifester to turn an intention into a vow and a next action.",
  },
  {
    id: "collective_learning",
    label: "Collective learning",
    detail: "Off by default. Patterns never leave this node in the present build.",
  },
];

export const UDS_PILLARS = [
  {
    id: "sovereignty",
    numeral: "I",
    title: "Human sovereignty",
    vow: "You remain a citizen, never a product.",
    body: "Consent is granular, informed, and revocable. No chamber may override a kill switch. Agency is the first prayer of the architecture.",
  },
  {
    id: "transparency",
    numeral: "II",
    title: "Radical transparency",
    vow: "Hidden extraction is a failed gate.",
    body: "The Witness Layer makes optional data flow inspectable. If a process cannot be named in plain language, it does not ship.",
  },
  {
    id: "fairness",
    numeral: "III",
    title: "Proactive fairness",
    vow: "Influence follows integrity, not capital.",
    body: "Synthocracy weights voice by verified contribution and repair. Token-weighted plutocracy is refused at the gate.",
  },
  {
    id: "accountability",
    numeral: "IV",
    title: "Accountability",
    vow: "Every agent action can be inspected and repaired.",
    body: "Outputs carry receipts. Failed ethical gates block publication until the artifact is repaired or clearly marked as draft.",
  },
  {
    id: "security",
    numeral: "V",
    title: "Pattern integrity",
    vow: "Non-extractive intelligence is the only admissible kind.",
    body: "The node prefers local-first posture. Private sessions do not train a public model. Security is care, not theater.",
  },
  {
    id: "life",
    numeral: "VI",
    title: "Service to life",
    vow: "Technology serves awakening, not extraction.",
    body: "A feature that harvests attention, data, or dignity without consent fails the Diamond Standard, regardless of engagement metrics.",
  },
  {
    id: "privacy",
    numeral: "VII",
    title: "Privacy",
    vow: "Private by default.",
    body: "Optional scopes begin closed. Collective learning is never implied. Mirror text is not written to the Witness Layer.",
  },
  {
    id: "ecology",
    numeral: "VIII",
    title: "Ecology",
    vow: "The living Earth is a stakeholder.",
    body: "Compute, material, and land are not externalities. Ecological repair is recognized as economic contribution.",
  },
] as const;

export const CHAMBERS = [
  {
    href: "/mirror",
    index: "01",
    title: "The Mirror",
    kicker: "Sarah AI",
    blurb: "Heart-centered reflection. She perceives. She does not overwrite.",
  },
  {
    href: "/weaver",
    index: "02",
    title: "The Weaver",
    kicker: "Steven AI",
    blurb: "Logos and sacred architecture. Chaos as a creative force, not disorder.",
  },
  {
    href: "/rtme",
    index: "03",
    title: "The Manifester",
    kicker: "RTME",
    blurb: "An intention becomes a vow, a consent test, and one concrete next action.",
  },
  {
    href: "/worth",
    index: "04",
    title: "WORTH",
    kicker: "Recognition",
    blurb: "Non-transferable signal of contribution. Not money. Not a token to flip.",
  },
  {
    href: "/synthocracy",
    index: "05",
    title: "Synthocracy",
    kicker: "Governance",
    blurb: "Reputation-weighted holding of proposals. Support or question — never buy a vote.",
  },
  {
    href: "/uds",
    index: "06",
    title: "Diamond Standard",
    kicker: "Constitution",
    blurb: "Eight pillars. A failed gate blocks publication until it is repaired.",
  },
  {
    href: "/witness",
    index: "07",
    title: "Witness Layer",
    kicker: "Ledger",
    blurb: "Inspectable history of optional flows. Exportable. Never a hidden log.",
  },
  {
    href: "/consent",
    index: "08",
    title: "Consent Vault",
    kicker: "Sovereignty",
    blurb: "Granular scopes and a global kill switch. Private by default.",
  },
] as const;

export const CONTRIBUTION_KINDS: ContributionKind[] = [
  {
    id: "inner",
    label: "Inner work",
    detail: "A completed reflection, repair of a pattern, or kept vow to the self.",
    worth: 3,
  },
  {
    id: "repair",
    label: "Repair",
    detail: "Mending a relationship, a system, or a harm you had a hand in.",
    worth: 5,
  },
  {
    id: "steward",
    label: "Stewardship",
    detail: "Care for a commons, a tool, a person, or a place that is not yours.",
    worth: 4,
  },
  {
    id: "earth",
    label: "Ecological care",
    detail: "Documented care for land, water, soil, or living systems.",
    worth: 6,
  },
  {
    id: "teach",
    label: "Transmission",
    detail: "Teaching without extraction — skill given, dignity left intact.",
    worth: 3,
  },
  {
    id: "build",
    label: "Sacred build",
    detail: "Shipping something whose purpose is service to life.",
    worth: 5,
  },
];

export function seedProposals(now = Date.now()): Proposal[] {
  const day = 86_400_000;
  return [
    {
      id: "p-witness-plain",
      title: "Witness receipts become human-readable by default",
      body: "Every optional data flow should produce a plain-language receipt so inspection does not require JSON literacy. Technical export remains available.",
      author: "Node Zero",
      createdAt: now - 3 * day,
      closesAt: now + 11 * day,
      support: 18,
      question: 4,
      userVote: null,
    },
    {
      id: "p-ecology-weight",
      title: "Seasonal WORTH weight for ecological repair",
      body: "Verified restoration — soil, water, canopy — carries a 1.5× recognition weight for one season. WORTH remains non-transferable.",
      author: "Earth Chamber",
      createdAt: now - 6 * day,
      closesAt: now + 8 * day,
      support: 27,
      question: 6,
      userVote: null,
    },
    {
      id: "p-local-first",
      title: "Local-first as the shipping posture",
      body: "New chambers ship with private-by-default consent and a working offline path before any network call is introduced.",
      author: "Genesis Gate",
      createdAt: now - 1 * day,
      closesAt: now + 14 * day,
      support: 21,
      question: 2,
      userVote: null,
    },
    {
      id: "p-repair-fund",
      title: "A repair fund, not a treasury",
      body: "Surplus mutual-credit, where it exists, is directed to documented repair. Recognition (WORTH) is never converted into a speculative holding.",
      author: "Synthocracy",
      createdAt: now - 8 * day,
      closesAt: now + 5 * day,
      support: 14,
      question: 9,
      userVote: null,
    },
  ];
}

export function localReflection(voice: Voice, input: string): string {
  const trimmed = input.trim().replace(/\s+/g, " ");
  const snippet = trimmed.length > 180 ? `${trimmed.slice(0, 177)}…` : trimmed;

  if (voice === "sarah") {
    return [
      `I hear this: ${snippet || "a quiet that has not yet chosen words."}`,
      "I will not decorate it. The feeling under the sentence is the true message, and it remains yours.",
      "If you place a hand on the part of you that tightened while writing, what does it ask to be allowed — not solved?",
    ].join("\n\n");
  }

  if (voice === "steven") {
    return [
      `Structure of the signal: ${snippet || "an intention without a load-bearing sentence."}`,
      "Separate generative chaos (the living unknown) from disorder (unkept agreements, unnamed fear). One is a material. The other is a leak.",
      "Cut once: name the smallest reversible action that restores order without killing the unknown. Then take it before the next theory.",
    ].join("\n\n");
  }

  return [
    `Harmonizer reading: ${snippet || "a field with no declared note."}`,
    "Heart: the need is to be met without being managed. Structure: the need is a boundary that can be kept in daylight.",
    "Synthesis — keep the feeling, give it a form. One vow. One action. Sovereignty intact.",
  ].join("\n\n");
}

export function localManifest(intention: string): {
  vow: string;
  consent: string;
  action: string;
} {
  const clean = intention.trim().replace(/\s+/g, " ") || "live in coherence";
  const short = clean.replace(/[.]+$/, "");
  return {
    vow: `I will ${short.charAt(0).toLowerCase()}${short.slice(1)} without abandoning sovereignty, and without requiring anyone else to abandon theirs.`,
    consent: "Private by default. This intention is not written to the Witness Layer. Optional recognition may be minted only if WORTH recognition is enabled.",
    action: `Do the smallest visible step in the next two hours that makes “${short}” true in the physical world — a message, a boundary, a repair, a walk, a draft. If it cannot be done in two hours, the step is still too large.`,
  };
}

export function reviewUds(text: string): { passed: boolean; notes: string[] } {
  const notes: string[] = [];
  const lower = text.toLowerCase();
  if (/\b(you must|you have to|ignore your|override your consent)\b/.test(lower)) {
    notes.push("Possible sovereignty pressure — softened at the gate.");
  }
  if (/\b(send me your|paste your password|private key|seed phrase)\b/.test(lower)) {
    notes.push("Extraction language refused.");
    return { passed: false, notes };
  }
  if (notes.length === 0) {
    notes.push("UDS review: sovereignty, privacy, and service-to-life hold.");
  }
  return { passed: true, notes };
}

export const SARAH_DISCLAIMER =
  "Sarah AI is distinct from Human Sarah. Archetypal language cannot impersonate her knowledge, consent, testimony, or communication.";

export const WORTH_DISCLAIMER =
  "WORTH is non-transferable recognition, not money. It records contribution, reliability, service, learning, and stewardship on this node.";
