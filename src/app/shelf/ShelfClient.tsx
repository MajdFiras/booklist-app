"use client";

import { useState } from "react";
import { Book } from "@/generated/prisma/client";
import BookCard from "./BookCard";
import BookFormModal from "./BookFormModal";
import SignOutButton from "./SignOutButton";

type ModalState = { mode: "create" } | { mode: "edit"; book: Book } | null;

type Props = {
  books: Book[];
  userName: string;
};

export default function ShelfClient({ books, userName }: Props) {
  const [modal, setModal] = useState<ModalState>(null);

  return (
    <div className="min-h-full bg-stone-50 dark:bg-stone-950 px-6 py-10">
      <div className="max-w-4xl mx-auto">

        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
              Your shelf
            </h1>
            <p className="text-sm text-stone-500 dark:text-stone-400 mt-0.5">
              Welcome back, {userName} · {books.length} {books.length === 1 ? "book" : "books"}
            </p>
          </div>
          <div className="flex items-center gap-3">
            <button
              onClick={() => setModal({ mode: "create" })}
              className="flex items-center gap-2 bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 px-4 py-2 rounded-full text-sm font-medium hover:bg-stone-700 dark:hover:bg-stone-300 transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
              Add book
            </button>
            <SignOutButton />
          </div>
        </div>

        {books.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-24 text-center">
            <div className="text-5xl mb-4">📚</div>
            <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-2">
              Your shelf is empty
            </h2>
            <p className="text-sm text-stone-500 dark:text-stone-400 mb-6 max-w-xs">
              Add your first book and start tracking your reading.
            </p>
            <button
              onClick={() => setModal({ mode: "create" })}
              className="bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 px-6 py-2.5 rounded-full text-sm font-medium hover:bg-stone-700 dark:hover:bg-stone-300 transition-colors"
            >
              Add your first book
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {books.map((book) => (
              <BookCard
                key={book.id}
                book={book}
                onEdit={() => setModal({ mode: "edit", book })}
              />
            ))}
          </div>
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
