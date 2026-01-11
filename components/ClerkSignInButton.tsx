"use client";

import { SignedIn, SignedOut, SignIn, UserButton } from "@clerk/nextjs";
import { useState } from "react";
import { CircleUser, LogIn } from "lucide-react";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "./ui/button";
import { Spinner } from "./ui/spinner";

export function ClerkSignInButton() {
  const [showPopover, setShowPopover] = useState(false);
  const [showSignIn, setShowSignIn] = useState(false);

  const handleSignInClick = () => {
    setShowPopover(false);
    setShowSignIn(true);
  };

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
              onClick={handleSignInClick}
              variant="ghost"
              className="w-full flex gap-2 justify-start items-center"
            >
              <LogIn className="size-4" />
              Sign In
            </Button>
          </PopoverContent>
        </Popover>

        {showSignIn && (
          <div
            className="fixed inset-0 bg-black/50 flex items-center justify-center z-100"
            onClick={() => setShowSignIn(false)}
          >
            <div onClick={(e) => e.stopPropagation()}>
              <SignIn routing="virtual" />
            </div>
          </div>
        )}
      </SignedOut>

      <SignedIn>
        <UserButton
          fallback={<Spinner className="size-7" />}
          appearance={{
            elements: {
              avatarBox: "size-7",
            },
          }}
        />
      </SignedIn>
    </>
  );
}
