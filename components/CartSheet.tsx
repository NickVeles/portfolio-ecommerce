"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "./ui/sheet";
import { createCartStore } from "@/store/cart-store";
import { Minus, Plus, Trash2 } from "lucide-react";

export function CartSheet() {
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

  const handleQuantityChange = (itemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(itemId);
    } else {
      updateItemQuantity(itemId, newQuantity);
    }
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetContent className="flex flex-col w-full sm:max-w-lg">
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
              <div className="space-y-4 p-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="flex gap-4 py-4 border-b last:border-b-0"
                  >
                    {item.imageUrl && (
                      <div className="relative size-20 rounded-md overflow-hidden bg-muted shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                        />
                      </div>
                    )}
                    <div className="flex-1 flex flex-col gap-2">
                      <div className="flex justify-between items-start gap-2">
                        <h4 className="font-medium line-clamp-2">
                          {item.name}
                        </h4>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="mt-1"
                          onClick={() => removeItem(item.id)}
                          aria-label="Remove item"
                        >
                          <Trash2 className="size-6" />
                        </Button>
                      </div>
                      <div className="flex items-center justify-between gap-2">
                        <div className="flex items-center">
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-8 rounded-r-none"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity - 1)
                            }
                            aria-label="Decrease quantity"
                          >
                            <Minus className="size-4" />
                          </Button>
                          <span className="flex items-center justify-center text-sm font-medium h-8 w-10 text-center border border-input border-x-0">
                            {item.quantity}
                          </span>
                          <Button
                            variant="outline"
                            size="icon"
                            className="size-8 rounded-l-none"
                            onClick={() =>
                              handleQuantityChange(item.id, item.quantity + 1)
                            }
                            disabled={totalQuantity >= 99}
                            aria-label="Increase quantity"
                          >
                            <Plus className="size-4" />
                          </Button>
                        </div>
                        <p className="font-semibold text-lg">
                          &euro;{(item.price * item.quantity).toFixed(2)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="border-t pt-4 space-y-4 p-4">
              <div className="flex justify-between items-center text-xl font-semibold">
                <span>Total</span>
                <span>&euro;{totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex flex-col gap-2">
                <Button asChild className="w-full">
                  <Link href="/checkout" onClick={() => setIsOpen(false)}>
                    Checkout
                  </Link>
                </Button>
                <Button asChild variant="outline" className="w-full">
                  <Link href="/cart" onClick={() => setIsOpen(false)}>
                    View Full Cart
                  </Link>
                </Button>
              </div>
            </div>
          </>
        )}
      </SheetContent>
    </Sheet>
  );
}
