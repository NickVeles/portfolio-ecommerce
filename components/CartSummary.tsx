"use client";

import Link from "next/link";
import { Button } from "./ui/button";

interface CartSummaryProps {
  totalPrice: number;
  onLinkClick?: () => void;
  showViewCart?: boolean;
}

export function CartSummary({
  totalPrice,
  onLinkClick,
  showViewCart = false,
}: CartSummaryProps) {
  return (
    <div className="space-y-4 p-4">
      <div className="flex justify-between items-center text-xl font-semibold">
        <span>Total</span>
        <span>&euro;{totalPrice.toFixed(2)}</span>
      </div>
      <div className="flex flex-col gap-2">
        <Button asChild className="w-full">
          <Link href="/checkout" onClick={onLinkClick}>
            Checkout
          </Link>
        </Button>
        {showViewCart && (
          <Button asChild variant="outline" className="w-full">
            <Link href="/cart" onClick={onLinkClick}>
              View Full Cart
            </Link>
          </Button>
        )}
      </div>
    </div>
  );
}
