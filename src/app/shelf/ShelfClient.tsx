"use client";

import { useState } from "react";
import Link from "next/link";
import { Book } from "@/generated/prisma/client";
import BookCard from "./BookCard";
import BookFormModal from "./BookFormModal";
import SignOutButton from "./SignOutButton";

type ModalState = { mode: "create" } | { mode: "edit"; book: Book } | null;

type Props = {
  books: Book[];
  userName: string;
};

function getGreeting() {
  const h = new Date().getHours();
  if (h < 12) return "Good morning";
  if (h < 17) return "Good afternoon";
  return "Good evening";
}

const SECTIONS = [
  {
    priority: "HIGH",
    label: "High Priority",
    dot: "bg-red-500",
    ring: "ring-red-100",
    badge: "bg-red-50 text-red-600",
  },
  {
    priority: "MEDIUM",
    label: "Medium Priority",
    dot: "bg-amber-500",
    ring: "ring-amber-100",
    badge: "bg-amber-50 text-amber-600",
  },
  {
    priority: "LOW",
    label: "Low Priority",
    dot: "bg-emerald-500",
    ring: "ring-emerald-100",
    badge: "bg-emerald-50 text-emerald-600",
  },
] as const;

export default function ShelfClient({ books, userName }: Props) {
  const [modal, setModal] = useState<ModalState>(null);

  const active = books.filter(b => b.status !== "FINISHED");
  const finished = books.filter(b => b.status === "FINISHED");

  const grouped = {
    HIGH:   active.filter(b => b.priority === "HIGH"),
    MEDIUM: active.filter(b => b.priority === "MEDIUM"),
    LOW:    active.filter(b => b.priority === "LOW"),
  };

  const readingCount  = books.filter(b => b.status === "READING").length;
  const finishedCount = books.filter(b => b.status === "FINISHED").length;

  return (
    <div className="min-h-full bg-[#f6f4f0]">

      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <span className="font-bold text-stone-900 tracking-tight text-lg">Shelf</span>
          <div className="flex items-center gap-2">
            <Link
              href="/tree"
              className="flex items-center gap-1.5 text-stone-600 hover:text-stone-900 hover:bg-stone-100 px-3 py-2 rounded-full text-sm font-medium transition-colors"
            >
              🌳 My Tree
            </Link>
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
      <div className="max-w-5xl mx-auto px-6 pt-10 pb-10">
        {/* Greeting + title */}
        <div className="mb-8">
          <p className="text-xs font-medium tracking-widest uppercase text-stone-400 mb-2">
            {getGreeting()}
          </p>
          <h1 className="text-3xl font-extrabold text-stone-900 tracking-tight">
            {userName}&apos;s shelf
          </h1>
        </div>

        {/* Stats row */}
        {books.length > 0 && (
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-3">
            {/* Total */}
            <div className="relative overflow-hidden bg-stone-900 rounded-2xl p-4 flex flex-col gap-1">
              <p className="text-3xl font-black text-white leading-none">{books.length}</p>
              <p className="text-xs font-medium text-stone-400 uppercase tracking-wide">Total books</p>
              <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-white/5" />
            </div>

            {/* Reading */}
            <div className="relative overflow-hidden bg-sky-500 rounded-2xl p-4 flex flex-col gap-1">
              <p className="text-3xl font-black text-white leading-none">{readingCount}</p>
              <p className="text-xs font-medium text-sky-100 uppercase tracking-wide">Reading</p>
              <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-white/10" />
            </div>

            {/* Finished */}
            <div className="relative overflow-hidden bg-emerald-500 rounded-2xl p-4 flex flex-col gap-1">
              <p className="text-3xl font-black text-white leading-none">{finishedCount}</p>
              <p className="text-xs font-medium text-emerald-100 uppercase tracking-wide">Finished</p>
              <div className="absolute -bottom-3 -right-3 w-16 h-16 rounded-full bg-white/10" />
            </div>
          </div>
        )}
      </div>

      {/* Content */}
      <div className="max-w-5xl mx-auto px-6 pb-16 flex flex-col gap-12">
        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="w-20 h-20 rounded-3xl bg-white shadow-sm border border-stone-100 flex items-center justify-center text-4xl mb-5">
              📚
            </div>
            <h2 className="text-xl font-semibold text-stone-900 mb-2">
              Your shelf is empty
            </h2>
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
                    <h2 className="font-semibold text-stone-900 text-base tracking-tight">
                      {section.label}
                    </h2>
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
                  <h2 className="font-semibold text-stone-900 text-base tracking-tight">
                    Finished
                  </h2>
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
