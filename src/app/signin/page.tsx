import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import SignInForm from "./SignInForm";

export default async function SignInPage() {
  const session = await getServerSession(authOptions);

  if (session) redirect("/");

  return (
    <Suspense>
      <SignInForm />
    </Suspense>
  );
}
