import { SignInForm } from "@/components/signin-form";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";

export default async function SignInPage() {
  const { userId } = await auth();

  if (userId) {
    redirect("/");
  }
  
  return (
    <div className="w-full flex justify-center items-center py-10 md:py-20">
      <div className="w-full max-w-sm md:max-w-4xl">
        <SignInForm />
      </div>
    </div>
  );
}
