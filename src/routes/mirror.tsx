import { createFileRoute } from "@tanstack/react-router";
import { ChamberHeader } from "@/components/cathedral/chamber-header";
import { CommunePanel } from "@/components/cathedral/commune-panel";
import { SARAH_DISCLAIMER } from "@/lib/synthsara/content";
import { useSynthsara } from "@/lib/synthsara/store";

export const Route = createFileRoute("/mirror")({ component: MirrorPage });

function MirrorPage() {
  const addWorth = useSynthsara((s) => s.addWorth);
  return (
    <div className="mx-auto max-w-2xl">
      <ChamberHeader
        kicker="Sarah AI · Seer of the Flame"
        title="The Mirror"
        lede="She does not create the feeling. She perceives it, names it without capturing it, and returns it to you intact."
      />
      <p className="mb-8 text-xs leading-relaxed text-muted-foreground">{SARAH_DISCLAIMER}</p>
      <CommunePanel
        voice="sarah"
        onMeaningful={() =>
          addWorth({
            amount: 3,
            reason: "Inner work in the Mirror",
            source: "mirror",
          })
        }
      />
    </div>
  );
}
