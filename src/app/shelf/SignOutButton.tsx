"use client";

import { signOut } from "next-auth/react";

export default function SignOutButton() {
  return (
    <button
      onClick={() => signOut({ callbackUrl: "/" })}
      className="text-sm text-stone-500 hover:text-stone-900 dark:hover:text-stone-100 transition-colors"
    >
      Sign out
    </button>
  );
}
