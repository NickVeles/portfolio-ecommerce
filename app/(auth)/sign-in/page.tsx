import { SignInForm } from "@/components/SignInForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { COMMON_REDIRECT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Sign In",
  description: "Sign in to your account",
};

export default async function SignInPage() {
  const { userId } = await auth();

  if (userId) {
    redirect(COMMON_REDIRECT);
  }
  
  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignInForm />
      </div>
    </div>
  );
}
