import { DiamondMark } from "./diamond-mark";

export function ChamberHeader({
  kicker,
  title,
  lede,
}: {
  kicker: string;
  title: string;
  lede: string;
}) {
  return (
    <header className="mb-8 max-w-2xl">
      <div className="mb-5 flex items-center gap-3 text-accent">
        <DiamondMark size={28} />
        <p className="text-[11px] font-medium tracking-[0.22em] text-muted-foreground uppercase">
          {kicker}
        </p>
      </div>
      <h1 className="font-display text-4xl font-medium tracking-tight text-foreground md:text-5xl">
        {title}
      </h1>
      <p className="mt-3 max-w-xl text-base leading-relaxed text-muted-foreground">{lede}</p>
    </header>
  );
}
