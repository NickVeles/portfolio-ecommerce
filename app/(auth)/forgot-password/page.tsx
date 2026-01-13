import { ForgotPasswordForm } from "@/components/ForgotPasswordForm";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function ForgotPasswordPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/");
  }

  return (
    <div className="w-full flex justify-center items-center">
      <div className="w-full max-w-sm">
        <ForgotPasswordForm />
      </div>
    </div>
  );
}
