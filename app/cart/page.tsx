import CartPageClient from "@/components/CartPageClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping Cart",
  description:
    "Review your shopping cart items and proceed to checkout. Manage quantities and view your order summary before completing your purchase.",
  openGraph: {
    title: "Shopping Cart - Velbuy",
    description: "Review your cart and proceed to secure checkout.",
  },
};

export default function CartPage() {
  return <CartPageClient />;
}
