import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/shelf");

  return (
    <div className="flex flex-col min-h-full bg-stone-50 dark:bg-stone-950">
      <header className="flex items-center justify-between px-6 py-5 max-w-4xl mx-auto w-full">
        <span className="text-stone-900 dark:text-stone-100 font-semibold tracking-tight">
          Shelf
        </span>
        <div className="flex items-center gap-4">
          <Link
            href="/signin"
            className="text-sm text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
          >
            Sign in
          </Link>
          <Link
            href="/signup"
            className="text-sm bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 px-4 py-2 rounded-full hover:bg-stone-700 dark:hover:bg-stone-300 transition-colors"
          >
            Get started
          </Link>
        </div>
      </header>

      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <h1 className="text-4xl sm:text-5xl md:text-6xl font-semibold text-stone-900 dark:text-stone-100 leading-tight max-w-2xl mb-6">
          Finally finish every book{" "}
          <span className="text-amber-500 dark:text-amber-400">
            you start.
          </span>
        </h1>

        <p className="text-lg text-stone-500 dark:text-stone-400 max-w-lg mb-10 leading-relaxed">
          Shelf keeps your reading list organised, tracks your progress, and
          sends you gentle streak reminders — so the books you start are the
          books you finish.
        </p>

        <Link
          href="/signup"
          className="bg-stone-900 text-white dark:bg-stone-100 dark:text-stone-900 px-8 py-3.5 rounded-full text-sm font-medium hover:bg-stone-700 dark:hover:bg-stone-300 transition-colors"
        >
          Start your shelf — it&apos;s free
        </Link>
      </main>

      <section className="max-w-4xl mx-auto w-full px-6 pb-24 grid grid-cols-1 sm:grid-cols-3 gap-6">
        <div className="group flex flex-col gap-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 dark:bg-amber-900/20 border border-amber-100 dark:border-amber-800/30 flex items-center justify-center text-2xl">
            📈
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-1.5">
              Track your progress
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
              See how far you&apos;ve come in each book. A visual progress bar
              keeps you motivated and excited to reach the next page.
            </p>
          </div>
        </div>

        <div className="group flex flex-col gap-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="w-12 h-12 rounded-2xl bg-sky-50 dark:bg-sky-900/20 border border-sky-100 dark:border-sky-800/30 flex items-center justify-center text-2xl">
            🔥
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-1.5">
              Streak reminders
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
              Build a reading habit with daily streak reminders that nudge you
              back to where you left off — keeping momentum alive.
            </p>
          </div>
        </div>

        <div className="group flex flex-col gap-4 bg-white dark:bg-stone-900 border border-stone-200 dark:border-stone-800 rounded-2xl p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
          <div className="w-12 h-12 rounded-2xl bg-violet-50 dark:bg-violet-900/20 border border-violet-100 dark:border-violet-800/30 flex items-center justify-center text-2xl">
            📚
          </div>
          <div>
            <h3 className="font-semibold text-stone-900 dark:text-stone-100 mb-1.5">
              Your personal shelf
            </h3>
            <p className="text-sm text-stone-500 dark:text-stone-400 leading-relaxed">
              Organise every book you&apos;re reading, finished, or want to read
              next. Your shelf is private, personal, and always in sync.
            </p>
          </div>
        </div>
      </section>

      <footer className="border-t border-stone-200 dark:border-stone-800 py-8 px-6">
        <p className="text-center text-sm text-stone-400 dark:text-stone-500">
          Shelf — read more, finish more
        </p>
      </footer>
    </div>
  );
}
