import CheckoutClient from "@/components/CheckoutClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Checkout",
  description:
    "Complete your purchase with our secure checkout process. Enter your shipping information and proceed to payment. Fast and safe transactions guaranteed.",
  openGraph: {
    title: "Secure Checkout - Velbuy",
    description: "Complete your purchase with secure payment processing.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function Checkout() {
  return <CheckoutClient />;
}
