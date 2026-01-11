"use client";

import { ShoppingCart } from "lucide-react";
import { useCartStore } from "@/store/cart-store";
import { useEffect, useState } from "react";

export function CartIcon() {
  const totalQuantity = useCartStore((state) => state.getTotalQuantity());
  const setSheetOpen = useCartStore((state) => state.setSheetOpen);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <button
      onClick={() => setSheetOpen(true)}
      className="relative hover:text-secondary cursor-pointer flex items-center"
      aria-label="Open cart"
    >
      <ShoppingCart className="size-6" aria-label="Cart" />
      {mounted && totalQuantity > 0 && (
        <span className="absolute -top-1 -right-1 rounded-full px-0.5 bg-card text-xs font-semibold flex items-center justify-center">
          {totalQuantity}
        </span>
      )}
    </button>
  );
}
