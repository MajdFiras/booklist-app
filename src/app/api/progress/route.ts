import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const progress = await prisma.userProgress.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, treeStage: 0, waterBucket: 0, totalPages: 0 },
    update: {},
  });

  return NextResponse.json({
    treeStage: progress.treeStage,
    waterBucket: progress.waterBucket,
    totalPages: progress.totalPages,
  });
}
