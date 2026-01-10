"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { createCartStore } from "@/store/cart-store";
import { CartItem } from "./CartItem";
import { CartSummary } from "./CartSummary";

export function CartSheet() {
  const [mounted, setMounted] = useState(false);
  const isOpen = createCartStore((state) => state.isSheetOpen);
  const setIsOpen = createCartStore((state) => state.setSheetOpen);
  const items = createCartStore((state) => state.items);
  const updateItemQuantity = createCartStore(
    (state) => state.updateItemQuantity
  );
  const removeItem = createCartStore((state) => state.removeItem);
  const getTotalPrice = createCartStore((state) => state.getTotalPrice);
  const getTotalQuantity = createCartStore((state) => state.getTotalQuantity);

  const totalPrice = getTotalPrice();
  const totalQuantity = getTotalQuantity();

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateItemQuantity(itemId, newQuantity);
    }
  };

  if (!mounted) {
    return null;
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg gap-0">
        <SheetHeader>
          <SheetTitle>Your Cart</SheetTitle>
          <SheetDescription>
            {totalQuantity === 0
              ? "Your cart is empty"
              : `${totalQuantity} ${
                  totalQuantity === 1 ? "item" : "items"
                } in your cart${totalQuantity >= 99 ? " (MAX)" : ""} `}
          </SheetDescription>
        </SheetHeader>

        {items.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground">
            <p>Add items to your cart to get started!</p>
            <Button variant="link" className="mt-4" asChild>
              <Link href="/products" onClick={() => setIsOpen(false)}>
                Shop Now
              </Link>
            </Button>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto py-4">
              <div className="space-y-4 px-4">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    totalQuantity={totalQuantity}
                    onQuantityChange={handleQuantityChange}
                    onRemove={removeItem}
                    onLinkClick={() => setIsOpen(false)}
                  />
                ))}
              </div>
            </div>

            <div className="border-t">
              <CartSummary
                totalPrice={totalPrice}
                onLinkClick={() => setIsOpen(false)}
                showViewCart={true}
              />
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
