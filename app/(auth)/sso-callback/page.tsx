import { AuthenticateWithRedirectCallback } from "@clerk/nextjs";
import { Spinner } from "@/components/ui/spinner";
import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { COMMON_REDIRECT } from "@/lib/constants";

export default async function SSOCallback() {
  const { userId } = await auth();

  if (userId) {
    redirect(COMMON_REDIRECT);
  }

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="flex flex-col items-center gap-4">
        <Spinner className="size-8" />
        <p className="text-muted-foreground">Completing sign in...</p>
      </div>
      <div id="clerk-captcha" className="sr-only" />
      <AuthenticateWithRedirectCallback />
    </div>
  );
}
