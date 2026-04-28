import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export default async function Home() {
  const session = await getServerSession(authOptions);
  if (session) redirect("/shelf");

  return (
    <div className="min-h-screen bg-[#f6f4f0] flex flex-col">

      {/* Navbar */}
      <nav className="sticky top-0 z-30 bg-white/80 backdrop-blur-md border-b border-stone-200">
        <div className="max-w-5xl mx-auto px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-stone-900 flex items-center justify-center">
              <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <span className="font-bold text-stone-900 tracking-tight">Shelf</span>
          </div>
          <div className="flex items-center gap-2">
            <Link
              href="/signin"
              className="text-sm text-stone-500 hover:text-stone-900 transition-colors px-3 py-2"
            >
              Sign in
            </Link>
            <Link
              href="/signup"
              className="text-sm bg-stone-900 hover:bg-stone-700 text-white px-4 py-2 rounded-full font-medium transition-colors"
            >
              Get started
            </Link>
          </div>
        </div>
      </nav>

      {/* Hero */}
      <main className="flex-1 flex flex-col items-center justify-center px-6 py-24 text-center">
        <div className="inline-flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full mb-6 tracking-wide uppercase">
          <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          Your reading companion
        </div>

        <h1 className="text-5xl sm:text-6xl font-extrabold text-stone-900 tracking-tight leading-[1.1] max-w-2xl mb-6">
          Finally finish every book{" "}
          <span className="text-amber-500">you start.</span>
        </h1>

        <p className="text-lg text-stone-500 max-w-md mb-10 leading-relaxed">
          Shelf tracks your progress, tells you exactly how many pages to read
          each day, and keeps every book you care about in one place.
        </p>

        <div className="flex flex-col sm:flex-row items-center gap-3">
          <Link
            href="/signup"
            className="bg-stone-900 hover:bg-stone-700 active:scale-[0.98] text-white px-8 py-3.5 rounded-full text-sm font-semibold transition-all shadow-sm"
          >
            Start your shelf — it&apos;s free
          </Link>
          <Link
            href="/signin"
            className="text-sm text-stone-500 hover:text-stone-800 transition-colors px-4 py-3.5"
          >
            Already have an account →
          </Link>
        </div>
      </main>

      {/* Feature cards */}
      <section className="max-w-5xl mx-auto w-full px-6 pb-24">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="w-11 h-11 rounded-xl bg-amber-50 border border-amber-100 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h3 className="font-semibold text-stone-900 mb-1.5">Daily page goal</h3>
            <p className="text-sm text-stone-500 leading-relaxed">
              Set a target end date and Shelf tells you exactly how many pages to read each day to finish on time.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="w-11 h-11 rounded-xl bg-sky-50 border border-sky-100 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-sky-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
            <h3 className="font-semibold text-stone-900 mb-1.5">Track your progress</h3>
            <p className="text-sm text-stone-500 leading-relaxed">
              Log your reading with one tap. Watch the progress bar fill up as you get closer to the last page.
            </p>
          </div>

          <div className="bg-white rounded-2xl border border-stone-100 p-6 shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200">
            <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center mb-4">
              <svg className="w-5 h-5 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
              </svg>
            </div>
            <h3 className="font-semibold text-stone-900 mb-1.5">Prioritise what matters</h3>
            <p className="text-sm text-stone-500 leading-relaxed">
              Mark books as High, Medium, or Low priority so you always know what to pick up next.
            </p>
          </div>

        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-stone-200 py-6 px-6">
        <p className="text-center text-xs text-stone-400 tracking-wide">
          Shelf — read more, finish more
        </p>
      </footer>

    </div>
  );
}
