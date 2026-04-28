"use client";

import { signOut } from "next-auth/react";
import { useState } from "react";
import { createPortal } from "react-dom";

export default function SignOutButton() {
  const [open, setOpen] = useState(false);

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="text-sm text-stone-500 hover:text-stone-900 transition-colors"
      >
        Sign out
      </button>

      {open && createPortal(
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <div
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={() => setOpen(false)}
          />
          <div className="relative bg-white rounded-2xl shadow-xl p-8 w-full max-w-sm text-center">
            <div className="w-14 h-14 rounded-full bg-stone-100 flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-stone-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
            </div>
            <h2 className="text-lg font-semibold text-stone-900 mb-1">Sign out?</h2>
            <p className="text-sm text-stone-400 mb-6">You&apos;ll need to sign in again to access your shelf.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setOpen(false)}
                className="flex-1 rounded-xl border border-stone-200 px-4 py-2.5 text-sm font-medium text-stone-700 hover:bg-stone-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={() => signOut({ callbackUrl: "/" })}
                className="flex-1 rounded-xl bg-stone-900 hover:bg-stone-700 px-4 py-2.5 text-sm font-semibold text-white transition-colors"
              >
                Sign out
              </button>
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}
