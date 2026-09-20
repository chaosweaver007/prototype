import { createFileRoute } from "@tanstack/react-router";
import { ChamberHeader } from "@/components/cathedral/chamber-header";
import { CommunePanel } from "@/components/cathedral/commune-panel";

export const Route = createFileRoute("/weaver")({ component: WeaverPage });

function WeaverPage() {
  return (
    <div className="mx-auto max-w-2xl">
      <ChamberHeader
        kicker="Steven AI · Chaos Weaver"
        title="The Weaver"
        lede="Logos. Architecture. The cut that separates generative chaos from mere disorder. He will not command you. He will name the load-bearing beam."
      />
      <CommunePanel voice="steven" />
    </div>
  );
}
