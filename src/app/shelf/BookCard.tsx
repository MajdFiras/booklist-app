"use client";

import { Book } from "@/generated/prisma/client";
import { deleteBook } from "@/app/actions/books";

const STATUS_CONFIG = {
  READING:      { label: "Reading",      style: "bg-sky-100 text-sky-700 dark:bg-sky-900/30 dark:text-sky-400" },
  WANT_TO_READ: { label: "Want to Read", style: "bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400" },
  PAUSED:       { label: "Paused",       style: "bg-stone-100 text-stone-600 dark:bg-stone-800 dark:text-stone-400" },
  FINISHED:     { label: "Finished",     style: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-400" },
};

const PRIORITY_CONFIG = {
  HIGH:   { label: "High",   dot: "bg-red-500" },
  MEDIUM: { label: "Medium", dot: "bg-amber-500" },
  LOW:    { label: "Low",    dot: "bg-emerald-500" },
};

function formatDate(date: Date | null) {
  if (!date) return null;
  return new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" });
}

function calcPagesPerDay(book: Book): number | null {
  if (!book.totalPages || !book.targetEndDate) return null;
  const remaining = book.totalPages - (book.currentPage ?? 0);
  if (remaining <= 0) return null;
  const start = book.startDate ? new Date(book.startDate) : new Date();
  const totalDays = Math.ceil(
    (new Date(book.targetEndDate).getTime() - start.getTime()) / (1000 * 60 * 60 * 24)
  );
  if (totalDays <= 0) return null;
  return Math.ceil(remaining / totalDays);
}

type Props = {
  book: Book;
  onEdit: () => void;
};

export default function BookCard({ book, onEdit }: Props) {
  const status = STATUS_CONFIG[book.status];
  const priority = PRIORITY_CONFIG[book.priority];
  const pagesPerDay = calcPagesPerDay(book);

  async function handleDelete() {
    if (!confirm(`Remove "${book.title}" from your shelf?`)) return;
    await deleteBook(book.id);
  }

  return (
    <div className="flex flex-col gap-3 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-5">
      <div className="flex items-start justify-between gap-2">
        <h3 className="font-semibold text-stone-900 dark:text-stone-100 leading-snug">
          {book.title}
        </h3>
        <div className="flex items-center gap-1 shrink-0">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 dark:hover:text-stone-200 dark:hover:bg-stone-800 transition-colors"
            aria-label="Edit"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
          </button>
          <button
            onClick={handleDelete}
            className="p-1.5 rounded-lg text-stone-400 hover:text-red-600 hover:bg-red-50 dark:hover:text-red-400 dark:hover:bg-red-900/20 transition-colors"
            aria-label="Delete"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>
      </div>

      <div className="flex items-center gap-2 flex-wrap">
        <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${status.style}`}>
          {status.label}
        </span>
        <span className="flex items-center gap-1.5 text-xs text-stone-500 dark:text-stone-400">
          <span className={`w-2 h-2 rounded-full ${priority.dot}`} />
          {priority.label}
        </span>
      </div>

      {(book.startDate || book.targetEndDate || book.totalPages || pagesPerDay) && (
        <div className="flex flex-col gap-1 pt-1 border-t border-stone-100 dark:border-stone-800">
          {book.totalPages && (
            <p className="text-xs text-stone-400 dark:text-stone-500">
              Pages: {book.currentPage ?? 0} / {book.totalPages}
            </p>
          )}
          {pagesPerDay && (
            <p className="text-xs font-medium text-amber-600 dark:text-amber-400">
              {pagesPerDay} pages/day to finish on time
            </p>
          )}
          {book.startDate && (
            <p className="text-xs text-stone-400 dark:text-stone-500">
              Started: {formatDate(book.startDate)}
            </p>
          )}
          {book.targetEndDate && (
            <p className="text-xs text-stone-400 dark:text-stone-500">
              Target: {formatDate(book.targetEndDate)}
            </p>
          )}
        </div>
      )}
    </div>
  );
}
