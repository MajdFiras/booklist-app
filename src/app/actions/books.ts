"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { Priority } from "@/generated/prisma/client";
import { calcPagesPerDay } from "@/lib/bookUtils";
import { updateUserProgress, ProgressResult } from "@/lib/progress";

async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function createBook(formData: FormData) {
  const userId = await getUserId();

  const title = (formData.get("title") as string)?.trim();
  if (!title) throw new Error("Title is required");

  const priority = formData.get("priority") as Priority;
  const totalPages = formData.get("totalPages") as string;
  const startDate = formData.get("startDate") as string;
  const targetEndDate = formData.get("targetEndDate") as string;

  await prisma.book.create({
    data: {
      title,
      priority,
      totalPages: totalPages ? parseInt(totalPages) : null,
      startDate: startDate ? new Date(startDate) : null,
      targetEndDate: targetEndDate ? new Date(targetEndDate) : null,
      userId,
    },
  });

  revalidatePath("/shelf");
}

export async function updateBook(formData: FormData) {
  const userId = await getUserId();

  const id = formData.get("id") as string;
  const title = (formData.get("title") as string)?.trim();
  if (!title) throw new Error("Title is required");

  const priority = formData.get("priority") as Priority;
  const totalPages = formData.get("totalPages") as string;
  const startDate = formData.get("startDate") as string;
  const targetEndDate = formData.get("targetEndDate") as string;

  const existing = await prisma.book.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("Book not found");

  await prisma.book.update({
    where: { id },
    data: {
      title,
      priority,
      totalPages: totalPages ? parseInt(totalPages) : null,
      startDate: startDate ? new Date(startDate) : null,
      targetEndDate: targetEndDate ? new Date(targetEndDate) : null,
    },
  });

  revalidatePath("/shelf");
}

export async function incrementCurrentPage(id: string): Promise<ProgressResult | null> {
  const userId = await getUserId();

  const book = await prisma.book.findFirst({ where: { id, userId } });
  if (!book) throw new Error("Book not found");

  const pagesPerDay = calcPagesPerDay(book);
  if (!pagesPerDay || !book.totalPages) throw new Error("Cannot calculate pages per day");

  const newCurrentPage = Math.min(
    (book.currentPage ?? 0) + pagesPerDay,
    book.totalPages
  );

  const pagesAdded = newCurrentPage - (book.currentPage ?? 0);

  await prisma.book.update({
    where: { id },
    data: { currentPage: newCurrentPage, status: "READING" },
  });

  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);

  await prisma.readingLog.upsert({
    where: { userId_date: { userId, date: today } },
    create: { userId, date: today, pages: pagesAdded },
    update: { pages: { increment: pagesAdded } },
  });

  const progress = await updateUserProgress(userId, pagesAdded);

  revalidatePath("/shelf");
  return progress ?? null;
}

export async function markBookFinished(id: string): Promise<ProgressResult | null> {
  const userId = await getUserId();

  const existing = await prisma.book.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("Book not found");

  const pagesAdded = (existing.totalPages ?? 0) - (existing.currentPage ?? 0);

  await prisma.book.update({
    where: { id },
    data: {
      status: "FINISHED",
      currentPage: existing.totalPages,
    },
  });

  const progress = pagesAdded > 0 ? await updateUserProgress(userId, pagesAdded) : null;

  revalidatePath("/shelf");
  return progress ?? null;
}

export async function deleteBook(id: string) {
  const userId = await getUserId();

  const existing = await prisma.book.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("Book not found");

  await prisma.book.delete({ where: { id } });

  revalidatePath("/shelf");
}
