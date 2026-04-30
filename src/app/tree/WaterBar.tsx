"use client";

type Props = {
  current: number;   // 0–99
  levelingUp?: boolean;
};

export default function WaterBar({ current, levelingUp }: Props) {
  const pct = Math.min(100, Math.max(0, current));
  const fillHeight = levelingUp ? 100 : pct;

  return (
    <div className="flex flex-col items-center gap-3">
      {/* Label top */}
      <p className="text-xs font-semibold tracking-widest uppercase text-sky-300/70">
        Water
      </p>

      {/* Bar container */}
      <div className="relative w-10 h-[280px] rounded-full bg-white/5 border border-white/10 overflow-hidden shadow-inner">
        {/* Fill */}
        <div
          className="absolute bottom-0 left-0 right-0 rounded-full transition-all duration-700 ease-out"
          style={{
            height: `${fillHeight}%`,
            background: levelingUp
              ? "linear-gradient(to top, #fbbf24, #fef08a)"
              : "linear-gradient(to top, #0ea5e9, #38bdf8, #7dd3fc)",
          }}
        >
          {/* Shimmer stripe */}
          <div
            className="shimmer-bar absolute inset-y-0 w-4 bg-white/25 rounded-full"
            style={{ top: 0, bottom: 0 }}
          />
          {/* Wave top edge */}
          <div className="absolute top-0 left-0 right-0 h-2 bg-sky-300/30 rounded-full blur-sm" />
        </div>

        {/* Tick marks */}
        {[25, 50, 75].map(tick => (
          <div
            key={tick}
            className="absolute left-0 right-0 border-t border-white/10"
            style={{ bottom: `${tick}%` }}
          />
        ))}
      </div>

      {/* Numeric label */}
      <div className="text-center">
        <p className="text-lg font-bold tabular-nums" style={{ color: levelingUp ? "#fbbf24" : "#7dd3fc" }}>
          {current}
        </p>
        <p className="text-xs text-white/30">/ 100</p>
      </div>
    </div>
  );
}
