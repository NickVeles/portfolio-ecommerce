import { SignUpForm } from "@/components/SignUpForm"
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { COMMON_REDIRECT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sign Up",
  description: "Create a new account",
};

export default async function SignUpPage() {
  const { userId } = await auth();

  if (userId) {
    redirect(COMMON_REDIRECT);
  }

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full max-w-sm">
        <SignUpForm />
      </div>
    </div>
  )
}
