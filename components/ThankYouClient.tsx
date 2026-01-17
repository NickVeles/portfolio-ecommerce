"use client";

import { useEffect } from "react";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import Link from "next/link";
import { Heart } from "lucide-react";
import { OrderItemsList } from "@/components/OrderItemsList";

type OrderItem = {
  id: string;
  stripeProductId: string;
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
            Your payment has been successful. We&apos;re working to ship your package
            to {location}.
          </p>

          <div className="pt-8 space-y-4">
            <p className="text-sm text-muted-foreground">
              You will receive an email confirmation shortly with your order
              details and tracking information.
            </p>
            <Button asChild variant="default">
              <Link href="/">Go Back to Store</Link>
            </Button>
          </div>

          {order && (
            <div className="text-left mt-6">
              <h2 className="text-lg font-semibold mb-2">Order Summary</h2>
              <p className="text-sm text-muted-foreground mb-4">
                Order ID: {order.id}
              </p>
              <OrderItemsList items={order.items} totalInCents={order.totalInCents} />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
