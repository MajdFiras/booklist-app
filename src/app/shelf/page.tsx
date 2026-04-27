import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignOutButton from "./SignOutButton";

export default async function ShelfPage() {
  const session = await getServerSession(authOptions);
  if (!session) redirect("/signin");

  return (
    <div className="min-h-full bg-stone-50 dark:bg-stone-950 px-6 py-10">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center justify-between mb-2">
          <h1 className="text-2xl font-semibold text-stone-900 dark:text-stone-100">
            Your shelf
          </h1>
          <SignOutButton />
        </div>
        <p className="text-stone-500 dark:text-stone-400 text-sm">
          Welcome back, {session.user?.name ?? session.user?.email}.
        </p>
      </div>
    </div>
  );
}
