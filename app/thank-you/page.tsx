"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { CheckCircle2 } from "lucide-react";

export default function ThankYou() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { clearCart } = useCartStore();

  const bought = searchParams.get("bought");
  const firstName = searchParams.get("firstName");
  const location = searchParams.get("location");

  useEffect(() => {
    // Redirect if bought is false or undefined
    if (bought !== "true") {
      router.push("/products");
      return;
    }

    // Clear cart on successful purchase
    clearCart();
  }, [bought, router, clearCart]);

  // Don't render anything if redirecting
  if (bought !== "true") {
    return null;
  }

  return (
    <div className="container mx-auto px-4 py-16">
      <div className="max-w-2xl mx-auto text-center space-y-6">
        <div className="flex justify-center">
          <CheckCircle2 className="size-12 text-primary" />
        </div>

        <h1 className="text-3xl font-bold">Payment Successful!</h1>

        <p className="text-xl text-muted-foreground">
          Thank you for your purchase, {firstName}!
        </p>
        <p>We're working to ship your package to {location}.</p>

        <div className="pt-8 space-y-4">
          <p className="text-sm text-muted-foreground">
            You will receive an email confirmation shortly with your order
            details and tracking information.
          </p>
          <Button asChild variant="default">
            <Link href="/products">Go Back to Store</Link>
          </Button>
        </div>
      </div>
    </div>
  );
}
