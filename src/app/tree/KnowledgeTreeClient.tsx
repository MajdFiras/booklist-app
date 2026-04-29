"use client";

import { useState, useTransition, useCallback } from "react";
import Link from "next/link";
import TreeCanvas from "./TreeCanvas";
import WaterBar from "./WaterBar";
import TreeStageLabel from "./TreeStageLabel";

type Props = {
  initialStage: number;
  initialBucket: number;
  initialTotal: number;
};

export default function KnowledgeTreeClient({ initialStage, initialBucket, initialTotal }: Props) {
  const [stage, setStage] = useState(initialStage);
  const [bucket, setBucket] = useState(initialBucket);
  const [total, setTotal] = useState(initialTotal);

  const [levelingUp, setLevelingUp] = useState(false);
  const [transitioning, setTransitioning] = useState(false);
  const [showBurst, setShowBurst] = useState(false);
  const [isPending, startTransition] = useTransition();

  const addPage = useCallback(async () => {
    if (isPending || levelingUp) return;

    startTransition(async () => {
      try {
        const res = await fetch("/api/progress/add-page", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ count: 1 }),
        });
        if (!res.ok) return;

        const data = await res.json();

        if (data.leveledUp) {
          // 1. Animate bar filling to top
          setLevelingUp(true);
          setBucket(100);

          await delay(700);

          // 2. Flash burst
          setShowBurst(true);

          // 3. Fade tree out
          setTransitioning(true);

          await delay(400);

          // 4. Update stage + reset bar
          setStage(data.treeStage);
          setBucket(data.waterBucket);
          setTotal(data.totalPages);
          setLevelingUp(false);

          await delay(100);

          // 5. Fade tree back in
          setTransitioning(false);

          await delay(600);
          setShowBurst(false);
        } else {
          setBucket(data.waterBucket);
          setTotal(data.totalPages);
        }
      } catch {
        // silent
      }
    });
  }, [isPending, levelingUp]);

  return (
    <div className="min-h-screen flex flex-col" style={{ background: "#0c1008" }}>

      {/* Level-up burst overlay */}
      {showBurst && (
        <div
          className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
          style={{ animation: "level-burst 1s ease-out forwards" }}
        >
          <div className="w-96 h-96 rounded-full border-4 border-yellow-400/60 shadow-[0_0_120px_40px_rgba(251,191,36,0.3)]" />
        </div>
      )}

      {/* Navbar */}
      <nav className="flex items-center justify-between px-6 py-4 border-b border-white/5">
        <Link
          href="/shelf"
          className="flex items-center gap-2 text-white/50 hover:text-white/80 text-sm font-medium transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Shelf
        </Link>
        <span className="text-white/20 text-xs font-semibold uppercase tracking-widest">
          Knowledge Tree
        </span>
        <div className="w-24" />
      </nav>

      {/* Main content */}
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-10 gap-10">

        {/* Stage label */}
        <TreeStageLabel stage={stage} totalPages={total} />

        {/* Tree + Water bar row */}
        <div className="flex items-end gap-8 sm:gap-14">
          {/* Water bar */}
          <WaterBar current={bucket} levelingUp={levelingUp} />

          {/* Tree */}
          <div className="flex-1 max-w-sm flex items-center justify-center">
            <TreeCanvas stage={stage} transitioning={transitioning} />
          </div>

          {/* Spacer to balance water bar */}
          <div className="w-10 hidden sm:block" />
        </div>

        {/* + Page button */}
        <div className="flex flex-col items-center gap-3 mt-2">
          {stage === 0 && bucket === 0 && total === 0 && (
            <p className="text-white/30 text-sm italic text-center max-w-xs">
              Start reading to bring your tree to life
            </p>
          )}
          <button
            onClick={addPage}
            disabled={isPending || levelingUp}
            className="relative flex items-center gap-2 bg-sky-600 hover:bg-sky-500 disabled:opacity-50 disabled:cursor-not-allowed
              text-white font-semibold px-6 py-3 rounded-full text-sm transition-all active:scale-95 shadow-lg shadow-sky-900/40"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
            </svg>
            {isPending ? "Logging…" : "+ 1 page read"}
          </button>
          <p className="text-white/20 text-xs text-center">
            Or log reading on your shelf — pages count toward your tree
          </p>
        </div>
      </div>
    </div>
  );
}

function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}
