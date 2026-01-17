import ThankYouClient from "@/components/ThankYouClient";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

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

// Helper to wait and retry for order (webhook might take a moment to process)
async function waitForOrder(sessionId: string, maxAttempts = 5, delayMs = 1000) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const order = await prisma.order.findUnique({
      where: { stripeCheckoutSessionId: sessionId },
      include: {
        items: true,
      },
    });

    if (order) {
      return order;
    }

    // Wait before retrying (except on last attempt)
    if (attempt < maxAttempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return null;
}

export default async function ThankYou({ searchParams }: ThankYouProps) {
  const params = await searchParams;
  const sessionId = params.session_id;

  // Redirect if no session_id is provided
  if (!sessionId) {
    redirect("/");
  }

  try {
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify the session was successful
    if (session.payment_status !== "paid") {
      redirect("/");
    }

    // Try to fetch the order from the database (webhook should have created it)
    const order = await waitForOrder(sessionId);

    if (order) {
      // Order found in database - show full order details
      const location = `${order.shippingAddress}, ${order.shippingCity}`;

      return (
        <ThankYouClient
          firstName={order.shippingFirstName}
          location={location}
          order={{
            id: order.id,
            totalInCents: order.totalInCents,
            currency: order.currency,
            items: order.items.map((item) => ({
              id: item.id,
              name: item.productName,
              priceInCents: item.priceInCents,
              quantity: item.quantity,
              imageUrl: item.imageUrl,
            })),
          }}
        />
      );
    }

    // Fallback: order not in database yet, use Stripe metadata
    const firstName = session.metadata?.shippingFirstName || "Customer";
    const address = session.metadata?.shippingAddress || "";
    const city = session.metadata?.shippingCity || "";
    const location = address && city ? `${address}, ${city}` : "your location";

    return <ThankYouClient firstName={firstName} location={location} />;
  } catch (error) {
    console.error("Error retrieving order:", error);
    redirect("/");
  }
}
