import { getServerSession } from "next-auth";
import { redirect } from "next/navigation";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import KnowledgeTreeClient from "./KnowledgeTreeClient";

export default async function TreePage() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) redirect("/signin");

  const progress = await prisma.userProgress.upsert({
    where: { userId: session.user.id },
    create: { userId: session.user.id, treeStage: 0, waterBucket: 0, totalPages: 0 },
    update: {},
  });

  return (
    <KnowledgeTreeClient
      initialStage={progress.treeStage}
      initialBucket={progress.waterBucket}
      initialTotal={progress.totalPages}
    />
  );
}
