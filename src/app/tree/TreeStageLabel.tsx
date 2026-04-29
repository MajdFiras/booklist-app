const STAGE_NAMES = [
  "Barren",
  "First Breath",
  "Awakening",
  "Sprout",
  "Sapling",
  "Growing",
  "Flourishing",
  "Ancient",
  "Radiant",
  "Enchanted",
  "Legendary",
];

type Props = { stage: number; totalPages: number };

export default function TreeStageLabel({ stage, totalPages }: Props) {
  const s = Math.max(0, Math.min(10, stage));
  const name = STAGE_NAMES[s];

  return (
    <div className="text-center">
      <p className="text-xs font-semibold tracking-widest uppercase text-white/30 mb-1">
        Stage {s}
      </p>
      <h2 className="text-2xl font-bold tracking-tight text-white">
        {name}
      </h2>
      <p className="mt-1 text-sm text-white/40">
        {totalPages.toLocaleString()} pages read
      </p>
      {s < 10 && (
        <p className="mt-0.5 text-xs text-white/25">
          {(s + 1) * 100 - totalPages % ((s + 1) * 100) > 0
            ? `${100 - (totalPages % 100)} pages to next stage`
            : ""}
        </p>
      )}
      {s === 10 && (
        <p className="mt-1 text-xs font-semibold text-yellow-400/80 tracking-wide uppercase">
          ✦ Legendary — max level reached ✦
        </p>
      )}
    </div>
  );
}
