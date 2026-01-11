"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart-store";
import { CartItem } from "@/components/CartItem";
import { CartSummary } from "@/components/CartSummary";
import { ArrowLeft } from "lucide-react";

export default function CartPageClient() {
  const [mounted, setMounted] = useState(false);

  const {
    items,
    updateItemQuantity,
    removeItem,
    getTotalPrice,
    getTotalQuantity,
  } = useCartStore();

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
    return (
      <div className="max-w-4xl mx-auto">
        <div className="mb-6">
          <Button variant="ghost" size="sm" asChild className="mb-4">
            <Link href="/products">
              <ArrowLeft className="size-4 mr-2" />
              Continue Shopping
            </Link>
          </Button>
          <h1 className="text-3xl font-bold">Shopping Cart</h1>
          <p className="text-muted-foreground mt-2">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-6">
        <Button variant="ghost" size="sm" asChild className="mb-4">
          <Link href="/products">
            <ArrowLeft className="size-4 mr-2" />
            Continue Shopping
          </Link>
        </Button>
        <h1 className="text-3xl font-bold">Shopping Cart</h1>
        <p className="text-muted-foreground mt-2">
          {totalQuantity === 0
            ? "Your cart is empty"
            : `${totalQuantity} ${
                totalQuantity === 1 ? "item" : "items"
              } in your cart${totalQuantity >= 99 ? " (MAX)" : ""}`}
        </p>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <p className="text-muted-foreground text-lg mb-6">
            Your cart is empty. Start shopping to add items!
          </p>
          <Button asChild size="lg">
            <Link href="/products">Browse Products</Link>
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <div className="bg-card rounded-lg border p-6">
              <div className="space-y-4">
                {items.map((item) => (
                  <CartItem
                    key={item.id}
                    item={item}
                    totalQuantity={totalQuantity}
                    onQuantityChange={handleQuantityChange}
                    onRemove={removeItem}
                  />
                ))}
              </div>
            </div>
          </div>

          <div className="lg:col-span-1">
            <div className="bg-card rounded-lg border sticky top-4">
              <CartSummary totalPrice={totalPrice} showViewCart={false} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
