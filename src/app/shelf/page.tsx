import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import ShelfClient from "./ShelfClient";

export default async function ShelfPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  const [books, progress] = await Promise.all([
    prisma.book.findMany({
      where: { userId: session.user.id },
      orderBy: { createdAt: "desc" },
    }),
    prisma.userProgress.upsert({
      where: { userId: session.user.id },
      create: { userId: session.user.id, treeStage: 0, waterBucket: 0, totalPages: 0 },
      update: {},
    }),
  ]);

  return (
    <ShelfClient
      books={books}
      userName={session.user.name ?? session.user.email ?? "there"}
      initialStage={progress.treeStage}
      initialBucket={progress.waterBucket}
      initialTotal={progress.totalPages}
    />
  );
}
