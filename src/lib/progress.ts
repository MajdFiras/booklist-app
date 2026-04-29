import { prisma } from "@/lib/prisma";

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

  // If already at max stage, still clamp bucket
  if (treeStage >= 10) waterBucket = Math.min(waterBucket, 99);

  await prisma.userProgress.update({
    where: { userId },
    data: {
      waterBucket,
      treeStage,
      totalPages: current.totalPages + pagesAdded,
    },
  });

  return { treeStage, waterBucket, totalPages: current.totalPages + pagesAdded, leveledUp };
}
