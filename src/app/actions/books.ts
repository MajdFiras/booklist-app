"use server";

import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { revalidatePath } from "next/cache";
import { BookStatus, Priority } from "@/generated/prisma/client";

async function getUserId() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) throw new Error("Unauthorized");
  return session.user.id;
}

export async function createBook(formData: FormData) {
  const userId = await getUserId();

  const title = (formData.get("title") as string)?.trim();
  if (!title) throw new Error("Title is required");

  const status = formData.get("status") as BookStatus;
  const priority = formData.get("priority") as Priority;
  const totalPages = formData.get("totalPages") as string;
  const currentPage = formData.get("currentPage") as string;
  const startDate = formData.get("startDate") as string;
  const targetEndDate = formData.get("targetEndDate") as string;

  await prisma.book.create({
    data: {
      title,
      status,
      priority,
      totalPages: totalPages ? parseInt(totalPages) : null,
      currentPage: currentPage ? parseInt(currentPage) : null,
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

  const status = formData.get("status") as BookStatus;
  const priority = formData.get("priority") as Priority;
  const totalPages = formData.get("totalPages") as string;
  const currentPage = formData.get("currentPage") as string;
  const startDate = formData.get("startDate") as string;
  const targetEndDate = formData.get("targetEndDate") as string;

  const existing = await prisma.book.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("Book not found");

  await prisma.book.update({
    where: { id },
    data: {
      title,
      status,
      priority,
      totalPages: totalPages ? parseInt(totalPages) : null,
      currentPage: currentPage ? parseInt(currentPage) : null,
      startDate: startDate ? new Date(startDate) : null,
      targetEndDate: targetEndDate ? new Date(targetEndDate) : null,
    },
  });

  revalidatePath("/shelf");
}

export async function deleteBook(id: string) {
  const userId = await getUserId();

  const existing = await prisma.book.findFirst({ where: { id, userId } });
  if (!existing) throw new Error("Book not found");

  await prisma.book.delete({ where: { id } });

  revalidatePath("/shelf");
}
