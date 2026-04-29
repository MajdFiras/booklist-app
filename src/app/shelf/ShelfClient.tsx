"use client";

import { useState } from "react";
import { Book } from "@/generated/prisma/client";
import { ProgressResult } from "@/lib/progress";
import BookCard from "./BookCard";
import BookFormModal from "./BookFormModal";
import SignOutButton from "./SignOutButton";
import TreeCanvas from "@/app/tree/TreeCanvas";

type ModalState = { mode: "create" } | { mode: "edit"; book: Book } | null;

type Props = {
  books: Book[];
  userName: string;
  initialStage: number;
  initialBucket: number;
  initialTotal: number;
};

const STAGE_NAMES = [
  "Barren", "First Breath", "Awakening", "Sprout", "Sapling",
  "Growing", "Flourishing", "Ancient", "Radiant", "Enchanted", "Legendary",
];

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const SECTIONS = [
  { priority: "HIGH",   label: "High Priority",   dot: "bg-red-500",     badge: "bg-red-50 text-red-600" },
  { priority: "MEDIUM", label: "Medium Priority",  dot: "bg-amber-500",   badge: "bg-amber-50 text-amber-600" },
  { priority: "LOW",    label: "Low Priority",     dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-600" },
] as const;

function delay(ms: number) {
  return new Promise(res => setTimeout(res, ms));
}

export default function ShelfClient({ books, userName, initialStage, initialBucket, initialTotal }: Props) {
  const [modal, setModal] = useState<ModalState>(null);

  // Tree state — updated optimistically when pages are logged
  const [treeStage,   setTreeStage]   = useState(initialStage);
  const [waterBucket, setWaterBucket] = useState(initialBucket);
  const [totalPages,  setTotalPages]  = useState(initialTotal);
  const [levelingUp,  setLevelingUp]  = useState(false);
  const [showBurst,   setShowBurst]   = useState(false);
  const [showInfo,    setShowInfo]    = useState(false);

  const active   = books.filter(b => b.status !== "FINISHED");
  const finished = books.filter(b => b.status === "FINISHED");
  const grouped  = {
    HIGH:   active.filter(b => b.priority === "HIGH"),
    MEDIUM: active.filter(b => b.priority === "MEDIUM"),
    LOW:    active.filter(b => b.priority === "LOW"),
  };
  const readingCount  = books.filter(b => b.status === "READING").length;
  const finishedCount = books.filter(b => b.status === "FINISHED").length;

  async function handlePagesLogged(result: ProgressResult) {
    if (result.leveledUp) {
      setWaterBucket(100);
      setLevelingUp(true);
      await delay(650);
      setShowBurst(true);
      await delay(700);
      setTreeStage(result.treeStage);
      setWaterBucket(result.waterBucket);
      setTotalPages(result.totalPages);
      setLevelingUp(false);
      await delay(800);
      setShowBurst(false);
    } else {
      setWaterBucket(result.waterBucket);
      setTotalPages(result.totalPages);
    }
  }

  const bucketPct = levelingUp ? 100 : Math.min(100, waterBucket);

  return (
    <div className="min-h-full bg-[#f6f4f0]">

      {/* Level-up burst overlay */}
      {showBurst && (
        <div
          className="fixed inset-0 z-50 pointer-events-none flex items-center justify-center"
          style={{ animation: "level-burst 1s ease-out forwards" }}
        >
          <div className="w-80 h-80 rounded-full border-4 border-emerald-400/50 shadow-[0_0_80px_20px_rgba(52,211,153,0.2)]" />
        </div>
      )}

      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-bold text-stone-900 tracking-tight text-lg">Shelf</span>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setModal({ mode: "create" })}
              className="flex items-center gap-1.5 bg-stone-900 hover:bg-stone-700 text-white px-4 py-2 rounded-full text-sm font-medium transition-colors"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M12 4v16m8-8H4" />
              </svg>
              Add book
            </button>
            <SignOutButton />
          </div>
        </div>
      </nav>

      {/* Header */}
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-6">
        <div className="mb-8">
          <p className="text-xs font-medium tracking-widest uppercase text-stone-400 mb-2">
            {getGreeting()}
          </p>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            {userName}&apos;s shelf
          </h1>
        </div>

        {/* Stats */}
        {books.length > 0 && (
          <div className="grid grid-cols-3 gap-3">
            <div className="relative overflow-hidden bg-stone-900 rounded-2xl p-4 flex flex-col gap-1">
              <p className="text-3xl font-black text-white leading-none">{books.length}</p>
              <p className="text-xs font-medium text-stone-400 uppercase tracking-wide">Total books</p>
              <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-white/5" />
            </div>
            <div className="relative overflow-hidden bg-sky-500 rounded-2xl p-4 flex flex-col gap-1">
              <p className="text-3xl font-black text-white leading-none">{readingCount}</p>
              <p className="text-xs font-medium text-sky-100 uppercase tracking-wide">Reading</p>
              <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-white/10" />
            </div>
            <div className="relative overflow-hidden bg-emerald-500 rounded-2xl p-4 flex flex-col gap-1">
              <p className="text-3xl font-black text-white leading-none">{finishedCount}</p>
              <p className="text-xs font-medium text-emerald-100 uppercase tracking-wide">Finished</p>
              <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-white/10" />
            </div>
          </div>
        )}
      </div>

      {/* ── Knowledge Tree Widget ─────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 pb-10">
        <div className="bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden flex flex-col sm:flex-row items-stretch">

          {/* Mini tree */}
          <div className="flex-shrink-0 flex items-end justify-center bg-[#f0f7ec] px-6 pt-5 pb-0 sm:pb-5 sm:pr-2">
            <div className="w-28">
              <TreeCanvas stage={treeStage} />
            </div>
          </div>

          {/* Stage info + water bar */}
          <div className="flex-1 flex flex-col justify-center gap-3 px-6 py-5">

            {/* Header row: label + ? button */}
            <div className="flex items-start justify-between gap-2">
              <div>
                <p className="text-[10px] font-semibold tracking-[0.18em] uppercase text-stone-400 mb-0.5">
                  Knowledge Tree · Stage {treeStage}
                </p>
                <h3 className="text-xl font-bold tracking-tight text-stone-900">
                  {STAGE_NAMES[treeStage]}
                  {treeStage === 10 && (
                    <span className="ml-2 text-sm font-semibold text-amber-500"> ✦ Legendary</span>
                  )}
                </h3>
              </div>
              <button
                onClick={() => setShowInfo(true)}
                className="flex-shrink-0 w-6 h-6 rounded-full border border-stone-200 bg-stone-50 hover:bg-stone-100 text-stone-400 hover:text-stone-600 flex items-center justify-center text-xs font-bold transition-colors mt-0.5"
                aria-label="What is the Knowledge Tree?"
              >
                ?
              </button>
            </div>

            {/* Water bar — hidden at max level */}
            {treeStage < 10 ? (
              <div className="flex flex-col gap-1.5">
                <div className="flex items-center justify-between text-xs">
                  <span className="text-stone-400 font-medium">Water</span>
                  <span
                    className="tabular-nums font-bold transition-colors duration-300"
                    style={{ color: levelingUp ? "#d97706" : "#0ea5e9" }}
                  >
                    {bucketPct} / 100
                  </span>
                </div>
                <div className="relative h-3 rounded-full bg-stone-100 overflow-hidden">
                  <div
                    className="absolute left-0 top-0 bottom-0 rounded-full transition-all duration-700 ease-out overflow-hidden"
                    style={{
                      width: `${bucketPct}%`,
                      background: levelingUp
                        ? "linear-gradient(to right, #f59e0b, #fbbf24)"
                        : "linear-gradient(to right, #0ea5e9, #38bdf8)",
                    }}
                  >
                    <div className="shimmer-bar absolute inset-0 rounded-full" />
                  </div>
                </div>
                <p className="text-[11px] text-stone-400">
                  {totalPages.toLocaleString()} pages read
                  {` · ${100 - (waterBucket % 100 === 0 && waterBucket > 0 ? 100 : waterBucket % 100)} pages to next stage`}
                </p>
              </div>
            ) : (
              <p className="text-sm text-amber-600 font-medium">
                Your tree has reached its final, legendary form. {totalPages.toLocaleString()} pages read.
              </p>
            )}

            {treeStage === 0 && waterBucket === 0 && (
              <p className="text-[11px] italic text-stone-300">
                Log reading below to bring your tree to life
              </p>
            )}
          </div>
        </div>
      </div>

      {/* ── Knowledge Tree Info Modal ─────────────────────────────── */}
      {showInfo && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/30 backdrop-blur-sm"
            onClick={() => setShowInfo(false)}
          />
          <div className="relative bg-white rounded-3xl shadow-xl p-8 w-full max-w-sm">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-2xl bg-[#f0f7ec] flex items-center justify-center text-xl">
                🌳
              </div>
              <h2 className="text-lg font-bold text-stone-900">Knowledge Tree</h2>
            </div>

            <div className="flex flex-col gap-3 text-sm text-stone-600 leading-relaxed">
              <p>
                Your Knowledge Tree grows as you read. Every page you log on the shelf fills your
                <span className="font-semibold text-sky-600"> water bar</span>.
              </p>
              <div className="bg-stone-50 rounded-2xl p-4 flex flex-col gap-2 text-[13px]">
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs font-bold flex-shrink-0">1</span>
                  <span>Click <strong>&quot;X pages today&quot;</strong> on a book card and confirm.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-sky-100 text-sky-600 flex items-center justify-center text-xs font-bold flex-shrink-0">2</span>
                  <span>The water bar fills by the number of pages read.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center text-xs font-bold flex-shrink-0">3</span>
                  <span>Every <strong>100 pages</strong>, your tree advances one stage.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-600 flex items-center justify-center text-xs font-bold flex-shrink-0">✦</span>
                  <span>Reach <strong>1,000 pages</strong> to unlock the Legendary tree.</span>
                </div>
              </div>
              <p className="text-stone-400 text-xs">
                There are 10 stages in total. Each one looks more alive, magical, and rewarding than the last.
              </p>
            </div>

            <button
              onClick={() => setShowInfo(false)}
              className="mt-6 w-full bg-stone-900 hover:bg-stone-700 text-white rounded-2xl py-2.5 text-sm font-semibold transition-colors"
            >
              Got it
            </button>
          </div>
        </div>
      )}

      {/* ── Books ────────────────────────────────────────────────── */}
      <div className="max-w-5xl mx-auto px-6 pb-16 flex flex-col gap-12">
        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-3xl bg-white shadow-sm border border-stone-100 flex items-center justify-center text-4xl mb-5">
              📚
            </div>
            <h2 className="text-xl font-semibold text-stone-900 mb-2">Your shelf is empty</h2>
            <p className="text-sm text-stone-400 mb-6 max-w-xs leading-relaxed">
              Start tracking your reading by adding your first book.
            </p>
            <button
              onClick={() => setModal({ mode: "create" })}
              className="bg-stone-900 hover:bg-stone-700 text-white px-6 py-2.5 rounded-full text-sm font-medium transition-colors"
            >
              Add your first book
            </button>
          </div>
        ) : (
          <>
            {SECTIONS.map(section => {
              const sectionBooks = grouped[section.priority];
              if (sectionBooks.length === 0) return null;
              return (
                <div key={section.priority}>
                  <div className="flex items-center gap-2.5 mb-5">
                    <span className={`w-2.5 h-2.5 rounded-full ${section.dot}`} />
                    <h2 className="font-semibold text-stone-900 text-base tracking-tight">{section.label}</h2>
                    <span className={`text-xs font-medium rounded-full px-2 py-0.5 ${section.badge}`}>
                      {sectionBooks.length}
                    </span>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {sectionBooks.map(book => (
                      <BookCard
                        key={book.id}
                        book={book}
                        onEdit={() => setModal({ mode: "edit", book })}
                        onPagesLogged={handlePagesLogged}
                      />
                    ))}
                  </div>
                </div>
              );
            })}

            {finished.length > 0 && (
              <div>
                <div className="flex items-center gap-2.5 mb-5">
                  <span className="w-2.5 h-2.5 rounded-full bg-stone-400" />
                  <h2 className="font-semibold text-stone-900 text-base tracking-tight">Finished</h2>
                  <span className="text-xs font-medium rounded-full px-2 py-0.5 bg-stone-100 text-stone-500">
                    {finished.length}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {finished.map(book => (
                    <BookCard
                      key={book.id}
                      book={book}
                      onEdit={() => setModal({ mode: "edit", book })}
                      onPagesLogged={handlePagesLogged}
                    />
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </div>

      {modal && (
        <BookFormModal
          book={modal.mode === "edit" ? modal.book : undefined}
          onClose={() => setModal(null)}
        />
      )}
    </div>
  );
}
