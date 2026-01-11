import ThankYouClient from "@/components/ThankYouClient";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Thank You",
  description:
    "Thank you for your purchase! Your order has been confirmed and will be shipped soon. Check your email for order details and tracking information.",
  openGraph: {
    title: "Thank You for Your Purchase - Velbuy",
    description: "Your order has been confirmed successfully.",
  },
  robots: {
    index: false,
    follow: false,
  },
};

export default function ThankYou() {
  return <ThankYouClient />;
}
