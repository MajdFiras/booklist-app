"use client";

import { Book } from "@/generated/prisma/client";
import { deleteBook, incrementCurrentPage, markBookFinished } from "@/app/actions/books";
import { calcPagesPerDay } from "@/lib/bookUtils";
import { useState } from "react";

const COVER_GRADIENTS = [
  "from-violet-500 to-purple-700",
  "from-sky-500 to-blue-700",
  "from-emerald-500 to-teal-700",
  "from-amber-400 to-orange-600",
  "from-pink-500 to-rose-700",
  "from-cyan-500 to-sky-700",
  "from-indigo-500 to-violet-700",
  "from-teal-500 to-emerald-700",
];

function getCoverGradient(id: string) {
  let hash = 0;
  for (let i = 0; i < id.length; i++) hash = (hash * 31 + id.charCodeAt(i)) | 0;
  return COVER_GRADIENTS[Math.abs(hash) % COVER_GRADIENTS.length];
}

const PRIORITY_CONFIG = {
  HIGH:   { label: "High",   bg: "bg-red-100",    text: "text-red-600" },
  MEDIUM: { label: "Medium", bg: "bg-amber-100",  text: "text-amber-600" },
  LOW:    { label: "Low",    bg: "bg-emerald-100", text: "text-emerald-600" },
};

function formatDate(date: Date | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-GB", {
    day: "numeric", month: "short", year: "numeric",
  });
}

type Props = {
  book: Book;
  onEdit: () => void;
};

export default function BookCard({ book, onEdit }: Props) {
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  const priority = PRIORITY_CONFIG[book.priority];
  const pagesPerDay = calcPagesPerDay(book);

  const currentPage = book.currentPage ?? 0;
  const progress = book.totalPages
    ? Math.min(100, Math.round((currentPage / book.totalPages) * 100))
    : 0;

  const willComplete = !!(
    book.totalPages &&
    pagesPerDay &&
    currentPage + pagesPerDay >= book.totalPages
  );

  const isFinished = book.status === "FINISHED";
  const coverGradient = getCoverGradient(book.id);
  const initial = book.title.trim()[0]?.toUpperCase() ?? "B";

  async function handleConfirm() {
    setLoading(true);
    if (willComplete) {
      await markBookFinished(book.id);
    } else {
      await incrementCurrentPage(book.id);
    }
    setConfirming(false);
    setLoading(false);
  }

  async function handleDelete() {
    if (!confirm(`Remove "${book.title}" from your shelf?`)) return;
    await deleteBook(book.id);
  }

  return (
    <>
      <div className="flex flex-col bg-white rounded-2xl shadow-sm border border-stone-100 overflow-hidden hover:shadow-md transition-shadow duration-200">

        {/* Book cover */}
        <div className={`relative bg-gradient-to-br ${coverGradient} h-28 flex items-center justify-center`}>
          <span className="text-5xl font-black text-white/90 select-none" style={{ textShadow: "0 2px 8px rgba(0,0,0,0.18)" }}>
            {initial}
          </span>

          {/* Priority badge */}
          <span className={`absolute top-3 left-3 text-xs font-semibold px-2 py-0.5 rounded-full ${priority.bg} ${priority.text}`}>
            {priority.label}
          </span>

          {/* Edit / delete — top-right */}
          {!isFinished && (
            <div className="absolute top-2 right-2 flex items-center gap-1">
              <button
                onClick={onEdit}
                className="p-1.5 rounded-lg bg-white/20 hover:bg-white/40 text-white transition-colors backdrop-blur-sm"
                aria-label="Edit"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button
                onClick={handleDelete}
                className="p-1.5 rounded-lg bg-white/20 hover:bg-red-500/70 text-white transition-colors backdrop-blur-sm"
                aria-label="Delete"
              >
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </div>
          )}

          {/* Finished checkmark */}
          {isFinished && (
            <div className="absolute top-3 right-3 w-7 h-7 rounded-full bg-white/30 backdrop-blur-sm flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </div>
          )}
        </div>

        {/* Body */}
        <div className="flex flex-col gap-3 p-4">

          {/* Title */}
          <h3 className="font-semibold text-stone-900 leading-snug text-sm line-clamp-2">
            {book.title}
          </h3>

          {/* Progress bar */}
          {book.totalPages ? (
            <div className="flex flex-col gap-1">
              <div className="flex justify-between text-xs text-stone-400">
                <span>Page {currentPage} / {book.totalPages}</span>
                <span className="font-medium text-stone-600">{progress}%</span>
              </div>
              <div className="w-full bg-stone-100 rounded-full h-1.5">
                <div
                  className="bg-gradient-to-r from-amber-400 to-amber-500 h-1.5 rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : null}

          {/* Dates */}
          {(book.startDate || book.targetEndDate) && (
            <div className="flex flex-col gap-0.5">
              {book.startDate && (
                <p className="text-xs text-stone-400">Started: {formatDate(book.startDate)}</p>
              )}
              {book.targetEndDate && (
                <p className="text-xs text-stone-400">Target: {formatDate(book.targetEndDate)}</p>
              )}
            </div>
          )}

          {/* Daily log button */}
          {pagesPerDay && !isFinished && (
            <button
              onClick={() => setConfirming(true)}
              className="mt-1 w-full flex items-center justify-center gap-2 bg-emerald-500 hover:bg-emerald-400 active:scale-[0.98] text-white rounded-xl py-2.5 text-sm font-semibold shadow-sm hover:shadow transition-all duration-150"
            >
              <span className="text-base font-black">{pagesPerDay}</span>
              <span className="opacity-90">pages today</span>
              <svg className="w-4 h-4 opacity-80" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
              </svg>
            </button>
          )}
        </div>
      </div>

      {/* Confirmation popup */}
      {confirming && pagesPerDay && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setConfirming(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">

            {willComplete ? (
              <>
                <div className="text-5xl mb-4">🎉</div>
                <h2 className="text-xl font-semibold text-stone-900 mb-2">
                  You finished it!
                </h2>
                <p className="text-sm text-stone-500 mb-6">
                  Congratulations on finishing{" "}
                  <span className="font-medium text-stone-700">{book.title}</span>. Mark it as complete?
                </p>
              </>
            ) : (
              <>
                <div className={`w-16 h-16 rounded-full bg-gradient-to-br ${coverGradient} text-white font-bold text-2xl flex items-center justify-center mx-auto mb-4 shadow-md`}>
                  {pagesPerDay}
                </div>
                <h2 className="text-lg font-semibold text-stone-900 mb-1">
                  Log today&apos;s reading?
                </h2>
                <p className="text-sm text-stone-500 mb-6">
                  Mark{" "}
                  <span className="font-medium text-stone-700">{pagesPerDay} pages</span>{" "}
                  as read for{" "}
                  <span className="font-medium text-stone-700">{book.title}</span>.
                </p>
              </>
            )}

            <div className="flex gap-3">
              <button
                onClick={() => setConfirming(false)}
                className="flex-1 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleConfirm}
                disabled={loading}
                className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50 transition-colors ${
                  willComplete
                    ? "bg-amber-500 hover:bg-amber-600"
                    : "bg-emerald-500 hover:bg-emerald-600"
                }`}
              >
                {loading ? "Saving…" : willComplete ? "Yes, I finished it! 🎉" : "Yes, I read it"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
