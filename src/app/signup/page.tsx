import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import SignUpForm from "./SignUpForm";

export default async function SignUpPage() {
  const session = await getServerSession(authOptions);

  if (session) redirect("/");

  return <SignUpForm />;
}
