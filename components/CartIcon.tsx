"use client";

import Link from "next/link";
import { ShoppingCart } from "lucide-react";
import { createCartStore } from "@/store/cart-store";
import { useEffect, useState } from "react";

export function CartIcon() {
  const totalQuantity = createCartStore((state) => state.getTotalQuantity());
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <Link href="/cart" className="relative hover:text-secondary">
      <ShoppingCart className="size-6" aria-label="Cart" />
      {mounted && totalQuantity > 0 && (
        <span className="absolute -top-7 -right-7 rounded-full px-0.5 bg-card text-xs font-semibold flex items-center justify-center">
          {totalQuantity}
        </span>
      )}
    </Link>
  );
}
