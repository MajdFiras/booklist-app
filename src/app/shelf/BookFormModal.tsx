"use client";

import { createBook, updateBook } from "@/app/actions/books";
import { Book } from "@/generated/prisma/client";
import { useState } from "react";

type Props = {
  book?: Book;
  onClose: () => void;
};

function toDateInput(date: Date | null | undefined) {
  if (!date) return "";
  return new Date(date).toISOString().split("T")[0];
}

export default function BookFormModal({ book, onClose }: Props) {
  const isEdit = !!book;
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(formData: FormData) {
    setError("");
    setLoading(true);
    try {
      if (isEdit) {
        await updateBook(formData);
      } else {
        await createBook(formData);
      }
      onClose();
    } catch (e) {
      setError((e as Error).message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      <div className="relative w-full max-w-md bg-white dark:bg-stone-900 rounded-2xl shadow-xl p-6">
        <h2 className="text-lg font-semibold text-stone-900 dark:text-stone-100 mb-5">
          {isEdit ? "Edit book" : "Add a book"}
        </h2>

        {error && (
          <p className="mb-4 rounded-lg bg-red-50 px-4 py-3 text-sm text-red-700 dark:bg-red-900/20 dark:text-red-400">
            {error}
          </p>
        )}

        <form action={handleSubmit} className="flex flex-col gap-4">
          {isEdit && <input type="hidden" name="id" value={book.id} />}

          <div className="flex flex-col gap-1.5">
            <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
              Title <span className="text-red-500">*</span>
            </label>
            <input
              name="title"
              type="text"
              required
              defaultValue={book?.title ?? ""}
              placeholder="Book title"
              className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 outline-none focus:ring-2 focus:ring-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-50 dark:focus:ring-stone-100"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                Total pages
              </label>
              <input
                name="totalPages"
                type="number"
                min={1}
                defaultValue={book?.totalPages ?? ""}
                placeholder="e.g. 320"
                className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 outline-none focus:ring-2 focus:ring-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-50 dark:focus:ring-stone-100"
              />
            </div>
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                Current page
              </label>
              <input
                name="currentPage"
                type="number"
                min={0}
                defaultValue={book?.currentPage ?? ""}
                placeholder="e.g. 45"
                className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 outline-none focus:ring-2 focus:ring-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-50 dark:focus:ring-stone-100"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                Status
              </label>
              <select
                name="status"
                defaultValue={book?.status ?? "WANT_TO_READ"}
                className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 outline-none focus:ring-2 focus:ring-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-50 dark:focus:ring-stone-100"
              >
                <option value="WANT_TO_READ">Want to Read</option>
                <option value="READING">Reading</option>
                <option value="PAUSED">Paused</option>
                <option value="FINISHED">Finished</option>
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                Priority
              </label>
              <select
                name="priority"
                defaultValue={book?.priority ?? "MEDIUM"}
                className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 outline-none focus:ring-2 focus:ring-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-50 dark:focus:ring-stone-100"
              >
                <option value="HIGH">High</option>
                <option value="MEDIUM">Medium</option>
                <option value="LOW">Low</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                Start date
              </label>
              <input
                name="startDate"
                type="date"
                defaultValue={toDateInput(book?.startDate ?? new Date())}
                className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 outline-none focus:ring-2 focus:ring-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-50 dark:focus:ring-stone-100"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className="text-sm font-medium text-stone-700 dark:text-stone-300">
                Target end date
              </label>
              <input
                name="targetEndDate"
                type="date"
                defaultValue={toDateInput(book?.targetEndDate ?? null)}
                className="rounded-lg border border-stone-200 bg-stone-50 px-3 py-2 text-sm text-stone-900 outline-none focus:ring-2 focus:ring-stone-900 dark:border-stone-700 dark:bg-stone-800 dark:text-stone-50 dark:focus:ring-stone-100"
              />
            </div>
          </div>

          <div className="flex gap-3 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 rounded-lg border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 dark:border-stone-700 dark:text-stone-300 dark:hover:bg-stone-800 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 rounded-lg bg-stone-900 px-4 py-2.5 text-sm font-medium text-white hover:bg-stone-700 disabled:opacity-50 dark:bg-stone-100 dark:text-stone-900 dark:hover:bg-stone-300 transition-colors"
            >
              {loading ? "Saving…" : isEdit ? "Save changes" : "Add book"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
