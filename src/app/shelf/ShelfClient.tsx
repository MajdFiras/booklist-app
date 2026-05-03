"use client";

import { useState } from "react";
import { Book } from "@/generated/prisma/client";
import { ProgressResult } from "@/lib/progress";
import BookCard from "./BookCard";
import BookFormModal from "./BookFormModal";
import SignOutButton from "./SignOutButton";
import TreeCanvas from "@/app/tree/TreeCanvas";

type ModalState = { mode: "create" } | { mode: "edit"; book: Book } | null;

type ReadingLogEntry = { date: string; pages: number };

type Props = {
  books: Book[];
  userName: string;
  initialStage: number;
  initialBucket: number;
  initialTotal: number;
  readingLogs: ReadingLogEntry[];
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

/* ── Analytics Modal ───────────────────────────────────────────────────── */

const DAY_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function AnalyticsModal({
  logs,
  totalPages,
  onClose,
}: {
  logs: ReadingLogEntry[];
  totalPages: number;
  onClose: () => void;
}) {
  // Build chart data for last 30 days
  const chartData = Array.from({ length: 30 }, (_, i) => {
    const d = new Date();
    d.setUTCHours(0, 0, 0, 0);
    d.setDate(d.getDate() - (29 - i));
    const iso = d.toISOString().slice(0, 10);
    const log = logs.find(l => l.date.slice(0, 10) === iso);
    return { label: DAY_LABELS[d.getUTCDay()], pages: log?.pages ?? 0, isToday: i === 29 };
  });

  const maxPages   = Math.max(...chartData.map(d => d.pages), 1);
  const totalWeek  = chartData.slice(7).reduce((s, d) => s + d.pages, 0);
  const bestDay    = Math.max(...chartData.map(d => d.pages));
  const activeDays = chartData.filter(d => d.pages > 0).length;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="relative bg-white rounded-3xl shadow-xl p-6 w-full max-w-lg">

        {/* Header */}
        <div className="flex items-center justify-between mb-5">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Reading Analytics</h2>
            <p className="text-xs text-stone-400 mt-0.5">Last 30 days</p>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full hover:bg-stone-100 flex items-center justify-center text-stone-400 hover:text-stone-600 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Bar chart */}
        <div className="bg-stone-50 rounded-2xl p-4 mb-5">
          <div className="flex items-end gap-px" style={{ height: "9rem" }}>
            {chartData.map((day, i) => {
              const heightPct = (day.pages / maxPages) * 100;
              return (
                <div key={i} className="flex-1 flex flex-col items-center gap-0.5">
                  {/* Bar track */}
                  <div className="w-full flex-1 bg-stone-200 rounded-t-sm flex items-end overflow-hidden">
                    <div
                      className={`w-full rounded-t-sm transition-all duration-500 ${
                        day.isToday ? "bg-emerald-500" : "bg-emerald-400/80"
                      }`}
                      style={{ height: `${heightPct}%`, minHeight: day.pages > 0 ? "3px" : "0" }}
                    />
                  </div>
                  {/* Vertical day label */}
                  <span
                    className={`text-[7px] font-medium leading-none ${day.isToday ? "text-emerald-600" : "text-stone-400"}`}
                    style={{ writingMode: "vertical-lr", transform: "rotate(180deg)" }}
                  >
                    {day.label}
                  </span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <StatCard label="Total pages" value={totalPages.toLocaleString()} color="text-stone-900" />
          <StatCard label="This week" value={totalWeek.toString()} color="text-emerald-600" />
          <StatCard label="Best day" value={`${bestDay} pg`} color="text-sky-600" />
          <StatCard label="Active days" value={`${activeDays} / 30`} color="text-amber-600" />
        </div>

      </div>
    </div>
  );
}

function StatCard({ label, value, color }: { label: string; value: string; color: string }) {
  return (
    <div className="bg-stone-50 rounded-2xl p-3 flex flex-col gap-0.5">
      <p className="text-[10px] text-stone-400 font-medium uppercase tracking-wide">{label}</p>
      <p className={`text-lg font-black ${color}`}>{value}</p>
    </div>
  );
}

export default function ShelfClient({ books, userName, initialStage, initialBucket, initialTotal, readingLogs }: Props) {
  const [modal, setModal] = useState<ModalState>(null);

  // Tree state — updated optimistically when pages are logged
  const [treeStage,   setTreeStage]   = useState(initialStage);
  const [waterBucket, setWaterBucket] = useState(initialBucket);
  const [totalPages,  setTotalPages]  = useState(initialTotal);
  const [levelingUp,  setLevelingUp]  = useState(false);
  const [showBurst,   setShowBurst]   = useState(false);
  const [showInfo,      setShowInfo]      = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);

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
        <div className="relative bg-white rounded-3xl border border-stone-100 shadow-sm overflow-hidden flex flex-col sm:flex-row">

          {/* Top-right action buttons */}
          <div className="absolute top-3 right-3 z-10 flex items-center gap-1.5">
            {/* Analytics icon */}
            <button
              onClick={() => setShowAnalytics(true)}
              className="w-7 h-7 rounded-full border border-stone-200 bg-white hover:bg-stone-100 text-stone-400 hover:text-stone-600 flex items-center justify-center transition-colors shadow-sm"
              aria-label="Analytics"
            >
              <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </button>
            {/* Info ? button */}
            <button
              onClick={() => setShowInfo(true)}
              className="w-7 h-7 rounded-full border border-stone-200 bg-white hover:bg-stone-100 text-stone-400 hover:text-stone-600 flex items-center justify-center text-xs font-bold transition-colors shadow-sm"
              aria-label="What is the Knowledge Tree?"
            >
              ?
            </button>
          </div>

          {/* Tree panel — centered on all screen sizes */}
          <div className="bg-[#f0f7ec] flex items-center justify-center p-6 sm:w-52 sm:flex-shrink-0">
            <div className="w-36 sm:w-40">
              <TreeCanvas stage={treeStage} />
            </div>
          </div>

          {/* Stage info + water bar */}
          <div className="flex-1 flex flex-col justify-center gap-3 p-6">

            {/* Stage label */}
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

      {/* ── Analytics Modal ──────────────────────────────────────── */}
      {showAnalytics && (
        <AnalyticsModal
          logs={readingLogs}
          totalPages={totalPages}
          onClose={() => setShowAnalytics(false)}
        />
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
