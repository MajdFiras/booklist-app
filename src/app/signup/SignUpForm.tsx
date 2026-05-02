"use client";

import { signUp } from "@/app/actions/auth";
import Link from "next/link";
import { useActionState, useState } from "react";

const REQUIREMENTS = [
  { label: "At least 8 characters",       test: (p: string) => p.length >= 8 },
  { label: "One uppercase letter (A–Z)",   test: (p: string) => /[A-Z]/.test(p) },
  { label: "One lowercase letter (a–z)",   test: (p: string) => /[a-z]/.test(p) },
  { label: "One number (0–9)",             test: (p: string) => /[0-9]/.test(p) },
  { label: "One special character (!@#…)", test: (p: string) => /[^A-Za-z0-9]/.test(p) },
];

export default function SignUpForm() {
  const [password, setPassword] = useState("");
  const [touched, setTouched] = useState(false);

  const [error, action, pending] = useActionState(
    async (_prev: string, formData: FormData) => {
      try {
        await signUp(formData);
        return "";
      } catch (e) {
        return (e as Error).message;
      }
    },
    ""
  );

  const allPassed = REQUIREMENTS.every(r => r.test(password));

  return (
    <div className="min-h-screen bg-[#f6f4f0] flex items-center justify-center px-4">
      <div className="w-full max-w-md">

        {/* Card */}
        <div className="bg-white rounded-3xl shadow-sm border border-stone-100 p-8">

          {/* Logo / brand */}
          <div className="flex flex-col items-center mb-8">
            <div className="w-12 h-12 rounded-2xl bg-stone-900 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 tracking-tight">Create your shelf</h1>
            <p className="text-sm text-stone-400 mt-1">Start tracking your reading today</p>
          </div>

          {error && (
            <div className="mb-5 flex items-center gap-3 rounded-xl bg-red-50 border border-red-100 px-4 py-3">
              <svg className="w-4 h-4 text-red-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          )}

          <form action={action} className="flex flex-col gap-4">
            <div className="flex flex-col gap-1.5">
              <label htmlFor="name" className="text-sm font-medium text-stone-700">
                Name
              </label>
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                placeholder="Your name"
                className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all placeholder:text-stone-300"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-stone-700">
                Email
              </label>
              <input
                id="email"
                name="email"
                type="email"
                required
                autoComplete="email"
                placeholder="you@example.com"
                className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all placeholder:text-stone-300"
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="password" className="text-sm font-medium text-stone-700">
                Password
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                autoComplete="new-password"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onBlur={() => setTouched(true)}
                className="rounded-xl border border-stone-200 bg-stone-50 px-4 py-2.5 text-sm text-stone-900 outline-none focus:ring-2 focus:ring-stone-900 focus:border-transparent transition-all placeholder:text-stone-300"
              />

              {/* Requirements checklist — shown once user starts typing */}
              {touched && password.length > 0 && (
                <ul className="mt-1 flex flex-col gap-1">
                  {REQUIREMENTS.map(req => {
                    const passed = req.test(password);
                    return (
                      <li key={req.label} className={`flex items-center gap-2 text-xs ${passed ? "text-emerald-600" : "text-stone-400"}`}>
                        <svg className="w-3.5 h-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          {passed
                            ? <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                            : <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                          }
                        </svg>
                        {req.label}
                      </li>
                    );
                  })}
                </ul>
              )}
            </div>

            <button
              type="submit"
              disabled={pending || (touched && !allPassed)}
              className="mt-1 w-full rounded-xl bg-stone-900 hover:bg-stone-700 active:scale-[0.98] px-4 py-3 text-sm font-semibold text-white transition-all disabled:opacity-50"
            >
              {pending ? "Creating account…" : "Create account"}
            </button>
          </form>
        </div>

        <p className="mt-5 text-center text-sm text-stone-400">
          Already have an account?{" "}
          <Link href="/signin" className="font-semibold text-stone-900 hover:underline underline-offset-4">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
