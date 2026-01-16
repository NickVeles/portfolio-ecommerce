"use client";

import { useUser, useClerk } from "@clerk/nextjs";
import { useState } from "react";
import { ShoppingBag, Settings, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart-store";

export function ClerkUserButton() {
  const { user } = useUser();
  const { signOut } = useClerk();
  const router = useRouter();
  const clearLocalCart = useCartStore((state) => state.clearLocalCart);
  const setAuthenticated = useCartStore((state) => state.setAuthenticated);
  const [open, setOpen] = useState(false);

  if (!user) {
    return null;
  }

  const handleNavigation = (path: string) => {
    setOpen(false);
    router.push(path);
  };

  const handleSignOut = () => {
    setOpen(false);
    setAuthenticated(false);
    clearLocalCart();
    signOut();
  };

  const userInitials =
    `${user.firstName?.[0] || ""}${user.lastName?.[0] || ""}`.toUpperCase() ||
    user.emailAddresses[0]?.emailAddress[0]?.toUpperCase() ||
    "U";

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          className="relative focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1 rounded-md"
          aria-label="User menu"
        >
          <Avatar className="size-6 cursor-pointer hover:opacity-80 transition-opacity rounded-md">
            <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
            <AvatarFallback>{userInitials}</AvatarFallback>
          </Avatar>
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-64 p-0 z-45" align="end">
        <div className="flex flex-col">
          {/* User Info Section */}
          <div className="flex items-center gap-3 p-4">
            <Avatar className="size-10 rounded-md">
              <AvatarImage src={user.imageUrl} alt={user.fullName || "User"} />
              <AvatarFallback>{userInitials}</AvatarFallback>
            </Avatar>
            <div className="flex flex-col overflow-hidden">
              <p className="text-sm font-medium truncate">
                {user.fullName || "User"}
              </p>
              <p className="text-xs text-muted-foreground truncate inline-flex items-center">
                {user.primaryEmailAddress?.emailAddress}
              </p>
            </div>
          </div>

          <Separator />

          {/* Menu Items */}
          <div className="p-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 h-10"
              onClick={() => handleNavigation("/orders")}
            >
              <ShoppingBag className="size-4" />
              Order History
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 h-10"
              onClick={() => handleNavigation("/settings")}
            >
              <Settings className="size-4" />
              User Settings
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start gap-2 h-10 text-destructive!"
              onClick={handleSignOut}
            >
              <LogOut className="size-4" />
              Sign Out
            </Button>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
