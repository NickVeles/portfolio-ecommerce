import ThankYouClient from "@/components/ThankYouClient";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";

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

type ThankYouProps = {
  searchParams: Promise<{ session_id?: string }>;
};

export default async function ThankYou({ searchParams }: ThankYouProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  // Redirect if no session_id is provided
  if (!sessionId) {
    redirect("/products");
  }

  try {
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify the session was successful
    if (session.payment_status !== "paid") {
      redirect("/products");
    }

    // Extract customer data from metadata
    const firstName = session.metadata?.firstName || "Customer";
    const location = session.metadata?.location || "your location";

    return <ThankYouClient firstName={firstName} location={location} />;
  } catch (error) {
    console.error("Error retrieving Stripe session:", error);
    redirect("/products");
  }
}
