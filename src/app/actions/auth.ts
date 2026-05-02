"use server";

import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";
import { redirect } from "next/navigation";

export async function signUp(formData: FormData) {
  const name = formData.get("name") as string;
  const email = formData.get("email") as string;
  const password = formData.get("password") as string;

  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  if (password.length < 8) throw new Error("Password must be at least 8 characters");
  if (!/[A-Z]/.test(password)) throw new Error("Password must contain at least one uppercase letter");
  if (!/[a-z]/.test(password)) throw new Error("Password must contain at least one lowercase letter");
  if (!/[0-9]/.test(password)) throw new Error("Password must contain at least one number");
  if (!/[^A-Za-z0-9]/.test(password)) throw new Error("Password must contain at least one special character");

  const existing = await prisma.user.findUnique({ where: { email } });
  if (existing) {
    throw new Error("An account with this email already exists");
  }

  const hashed = await bcrypt.hash(password, 12);

  await prisma.user.create({
    data: { name, email, password: hashed },
  });

  redirect("/signin?registered=true");
}
