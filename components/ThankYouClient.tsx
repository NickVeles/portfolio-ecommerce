"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import Image from "next/image";
import { Heart } from "lucide-react";
import { slugifyProduct } from "@/lib/utils";

type OrderItem = {
  id: string;
  name: string;
  priceInCents: number;
  quantity: number;
  imageUrl: string | null;
};

type Order = {
  id: string;
  totalInCents: number;
  currency: string;
  items: OrderItem[];
};

type ThankYouClientProps = {
  firstName: string;
  location: string;
  order?: Order;
};

export default function ThankYouClient({
  firstName,
  location,
  order,
}: ThankYouClientProps) {
  const { clearLocalCart } = useCartStore();

  useEffect(() => {
    // Clear cart on successful purchase
    clearLocalCart();
  }, [clearLocalCart]);

  const formatPrice = (cents: number) => {
    return (cents / 100).toFixed(2);
  };

  return (
    <div className="container mx-auto py-16 px-4">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="text-center space-y-6 pt-6">
          <div className="flex justify-center">
            <Heart className="size-18 text-primary" />
          </div>

          <h1 className="text-3xl font-bold">
            Thank you for your purchase, {firstName}!
          </h1>

          <p className="text-xl text-muted-foreground">
            Your payment has been successful. We're working to ship your package
            to {location}.
          </p>

          <div className="pt-8 space-y-4">
            <p className="text-sm text-muted-foreground">
              You will receive an email confirmation shortly with your order
              details and tracking information.
            </p>
            <Button asChild variant="default">
              <Link href="/products">Go Back to Store</Link>
            </Button>
          </div>

          

          {order && (
            <div className="text-left border rounded-lg p-4 mt-6">
              <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Order ID: {order.id}
              </p>

              <div className="space-y-4 mb-4">
                {order.items.map((item) => (
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
                      <Link
                        href={`/products/${slugifyProduct({ id: item.id, name: item.name })}`}
                        className="font-medium line-clamp-2 hover:text-secondary"
                      >
                        {item.name}
                      </Link>
                      <div className="flex items-center justify-between gap-2">
                        <span className="text-sm text-muted-foreground">
                          Qty: {item.quantity}
                        </span>
                        <p className="font-semibold text-lg">
                          &euro;
                          {formatPrice(item.priceInCents * item.quantity)}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="border-t pt-4">
                <div className="flex justify-between items-center text-xl font-semibold">
                  <span>Total</span>
                  <span>&euro;{formatPrice(order.totalInCents)}</span>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
