import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { updateUserProgress } from "@/lib/progress";

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await req.json().catch(() => ({}));
  const count = typeof body.count === "number" && body.count > 0 ? body.count : 1;

  const result = await updateUserProgress(session.user.id, count);

  return NextResponse.json(result);
}
