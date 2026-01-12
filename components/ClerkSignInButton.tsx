"use client";

import {
  SignedIn,
  SignedOut,
  useAuth,
} from "@clerk/nextjs";
import { useState } from "react";
import { CircleUser, LogIn } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";
import Link from "next/link";
import { ClerkUserButton } from "./ClerkUserButton";

export function ClerkSignInButton() {
  const { isLoaded } = useAuth();
  const [showPopover, setShowPopover] = useState(false);

  if (!isLoaded) {
    return <Spinner className="size-6" />;
  }

  return (
    <>
      <SignedOut>
        <Popover open={showPopover} onOpenChange={setShowPopover}>
          <PopoverTrigger asChild>
            <button
              className="relative hover:text-secondary cursor-pointer flex items-center"
              aria-label="Account menu"
            >
              <CircleUser className="size-6" aria-label="Account" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-48 p-2 z-50" align="end">
            <Button
              asChild
              variant="ghost"
              className="w-full flex gap-2 justify-start items-center"
            >
              <Link href="/sign-in" onClick={() => setShowPopover(false)}>
                <LogIn className="size-4" />
                Sign In
              </Link>
            </Button>
          </PopoverContent>
        </Popover>
      </SignedOut>

      <SignedIn>
        <ClerkUserButton />
      </SignedIn>
    </>
  );
}
