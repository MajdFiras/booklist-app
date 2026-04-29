import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { applyDailyDecay } from "@/lib/progress";
import ShelfClient from "./ShelfClient";

export default async function ShelfPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  const books = await prisma.book.findMany({
    where: { userId: session.user.id },
    orderBy: { createdAt: "desc" },
  });

  const activeBooks = books.filter(b => b.status !== "FINISHED");
  const progress = await applyDailyDecay(session.user.id, activeBooks);

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
