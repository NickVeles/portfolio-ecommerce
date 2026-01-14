"use client";

import { usePathname } from "next/navigation";
import { useClerk } from "@clerk/nextjs";
import { ShoppingBag, Settings, LogOut } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";

const navigationItems = [
  {
    title: "Order History",
    href: "/orders",
    icon: ShoppingBag,
  },
  {
    title: "User Settings",
    href: "/settings",
    icon: Settings,
  },
];

export function DashboardSidebar() {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const clearCart = useCartStore((state) => state.clearCart);

  const handleSignOut = () => {
    signOut();
    clearCart();
  };

  return (
    <div className="hidden md:flex md:flex-col border-r w-64 shrink-0 p-4 gap-2">
        <h2 className="text-lg font-semibold">Dashboard</h2>
      <div className="flex-1">
        <nav className="space-y-1 *:h-10">
          {navigationItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Button
                key={item.href}
                variant="ghost"
                asChild
                className={cn(
                  "w-full justify-start gap-3",
                  isActive && "bg-accent text-accent-foreground"
                )}
              >
                <Link href={item.href}>
                  <item.icon className="size-4" />
                  <span>{item.title}</span>
                </Link>
              </Button>
            );
          })}
        </nav>
      </div>
        <Button
          variant="ghost"
          onClick={handleSignOut}
          className="h-10 w-full justify-start gap-3 text-destructive!"
        >
          <LogOut className="size-4" />
          <span>Sign Out</span>
        </Button>
    </div>
  );
}
