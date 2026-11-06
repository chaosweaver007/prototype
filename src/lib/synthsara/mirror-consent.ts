/** Public server-function facade: server-only DB and crypto modules never enter the client bundle. */
import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import { authMiddleware } from "../auth/middleware";

export const beginLiveMirror = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) =>
    z.object({ accept: z.literal(true), consentVersion: z.literal("MIRROR-FIRST-001") }).parse(input),
  )
  .handler(async ({ context }) => {
    const { issueLiveMirrorConsent } = await import("./mirror-consent.server");
    return issueLiveMirrorConsent(context.userId);
  });

export const endLiveMirror = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: unknown) => z.object({ token: z.string().max(200) }).parse(input))
  .handler(async ({ data, context }) => {
    const { revokeLiveMirrorConsent } = await import("./mirror-consent.server");
    return { revoked: await revokeLiveMirrorConsent(data.token, context.userId) };
  });

export const liveMirrorReceipts = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const { listLiveMirrorConsentEvents } = await import("./mirror-consent.server");
    return listLiveMirrorConsentEvents(context.userId);
  });
