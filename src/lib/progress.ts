import { prisma } from "@/lib/prisma";
import { Book } from "@/generated/prisma/client";
import { calcPagesPerDay } from "@/lib/bookUtils";

export type ProgressResult = {
  treeStage: number;
  waterBucket: number;
  totalPages: number;
  leveledUp: boolean;
};

// UTC midnight for a given date — used to compare calendar days
function utcDay(date: Date): Date {
  return new Date(Date.UTC(date.getUTCFullYear(), date.getUTCMonth(), date.getUTCDate()));
}

function diffDays(a: Date, b: Date): number {
  return Math.round((a.getTime() - b.getTime()) / 86_400_000);
}

export async function updateUserProgress(userId: string, pagesAdded: number) {
  if (pagesAdded <= 0) return;

  const current = await prisma.userProgress.upsert({
    where: { userId },
    create: { userId, treeStage: 0, waterBucket: 0, totalPages: 0 },
    update: {},
  });

  let waterBucket = current.waterBucket + pagesAdded;
  let treeStage = current.treeStage;
  let leveledUp = false;

  while (waterBucket >= 100 && treeStage < 10) {
    waterBucket -= 100;
    treeStage += 1;
    leveledUp = true;
  }

  if (treeStage >= 10) waterBucket = Math.min(waterBucket, 99);

  await prisma.userProgress.update({
    where: { userId },
    data: {
      waterBucket,
      treeStage,
      totalPages: current.totalPages + pagesAdded,
      lastReadDate: utcDay(new Date()),
    },
  });

  return { treeStage, waterBucket, totalPages: current.totalPages + pagesAdded, leveledUp };
}

/**
 * Called on every shelf page load.
 * - Creates UserProgress if missing.
 * - Checks how many calendar days were missed since the last reading log.
 * - Drains waterBucket by (maxPagesPerDay × missedDays), floored at 0.
 * - Updates lastReadDate to today so repeated page loads don't drain again.
 */
export async function applyDailyDecay(userId: string, activeBooks: Book[]) {
  const today = utcDay(new Date());
  const yesterday = new Date(today.getTime() - 86_400_000);

  const progress = await prisma.userProgress.upsert({
    where: { userId },
    create: {
      userId,
      treeStage: 0,
      waterBucket: 0,
      totalPages: 0,
      lastReadDate: today,
    },
    update: {},
  });

  // First visit ever — just set today and return
  if (!progress.lastReadDate) {
    await prisma.userProgress.update({
      where: { userId },
      data: { lastReadDate: today },
    });
    return { treeStage: progress.treeStage, waterBucket: progress.waterBucket, totalPages: progress.totalPages };
  }

  const lastRead = utcDay(progress.lastReadDate);

  // missedDays = full calendar days skipped BEFORE today
  // e.g. lastRead = Monday, today = Thursday → yesterday = Wednesday
  //       Wed - Mon = 2 → missed Tue + Wed
  const missedDays = Math.max(0, diffDays(yesterday, lastRead));

  if (missedDays === 0) {
    return { treeStage: progress.treeStage, waterBucket: progress.waterBucket, totalPages: progress.totalPages };
  }

  // Highest pagesPerDay across books that have a calculable daily goal
  const dailyGoals = activeBooks.map(b => calcPagesPerDay(b) ?? 0).filter(p => p > 0);
  const maxPerDay = dailyGoals.length > 0 ? Math.max(...dailyGoals) : 0;

  const decay = maxPerDay * missedDays;

  let newBucket = progress.waterBucket - decay;
  let newStage  = progress.treeStage;

  if (newBucket < 0 && newStage > 0) {
    // Drop one stage, reset bucket to 100 (full bar of the lower stage)
    newStage  -= 1;
    newBucket  = 100;
  } else {
    // Already at stage 0 — just floor the bucket at 0
    newBucket = Math.max(0, newBucket);
  }

  await prisma.userProgress.update({
    where: { userId },
    data: {
      treeStage:    newStage,
      waterBucket:  newBucket,
      lastReadDate: today,
    },
  });

  return { treeStage: newStage, waterBucket: newBucket, totalPages: progress.totalPages };
}
