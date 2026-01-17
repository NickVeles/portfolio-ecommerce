import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import type { Metadata } from "next";
import { COMMON_REDIRECT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Forgot Password",
  description: "Reset your account password",
};

export default async function ForgotPasswordPage() {
  const { userId } = await auth();

  if (userId) {
    redirect(COMMON_REDIRECT);
  }

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
