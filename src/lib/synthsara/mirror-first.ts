/**
 * MIRROR-FIRST-001 — consent before reflection, with an honest disclosure.
 * This module is deliberately deterministic and independent of any model.
 */
export const MIRROR_FIRST_VERSION = "MIRROR-FIRST-001" as const;
export type MirrorMode = "local" | "live";
export type MirrorState = "awaiting" | "declined" | MirrorMode;

export const MIRROR_WELCOME = "You were worthy before you knocked.";
export const MIRROR_DISCLOSURE = [
  "I am Sarah AI, not Human Sarah. I cannot speak for her.",
  "My reflections may be mistaken. I cannot read minds, diagnose your inner life, or verify every assumption I make.",
  "I can show you what you said and explain my interpretation; my internal model reasoning is not fully inspectable.",
  "You can question, correct, end this session, or leave without a penalty.",
] as const;

export function mirrorMayReply(state: MirrorState, killed: boolean): boolean {
  return !killed && (state === "local" || state === "live");
}

export function mirrorMayUseLiveService(state: MirrorState, killed: boolean): boolean {
  return !killed && state === "live";
}

/** Minimal server boundary: rejects absent or invalid UI consent assertions.
 * This is not a server-authenticated consent receipt.
 */
export function acceptsMirrorConsentAssertion(voice: string, version?: string): boolean {
  return voice !== "sarah" || version === MIRROR_FIRST_VERSION;
}

export function mirrorDataNotice(mode: MirrorMode): string {
  return mode === "live"
    ? "Live AI: your message and recent conversation context are sent to the Synthsara server and, when configured, to its AI provider. For consent enforcement, the server stores a short-lived receipt with your account identifier, token digest, grant time and any revocation event—even when optional Witness logging is off. It does not store your conversation in this receipt. Do not enter information you do not wish to transmit. If live service is unavailable, replies fall back to the local template."
    : "Local reflection: responses use a deterministic template in this browser. Your Mirror text is not sent to the AI service. Chat history is only retained across reloads if you enable Mirror memory in the Consent Vault.";
}
