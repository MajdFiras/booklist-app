export function calcPagesPerDay(book: {
  totalPages: number | null;
  startDate: Date | null;
  targetEndDate: Date | null;
}): number | null {
  if (!book.totalPages || !book.targetEndDate) return null;

  const start = book.startDate ? new Date(book.startDate) : new Date();
  const totalDays = Math.ceil(
    (new Date(book.targetEndDate).getTime() - start.getTime()) /
      (1000 * 60 * 60 * 24)
  );

  if (totalDays <= 0) return null;

  return Math.ceil(book.totalPages / totalDays);
}
