import ThankYouClient from "@/components/ThankYouClient";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";
import { auth } from "@clerk/nextjs/server";
import { COMMON_REDIRECT } from "@/lib/constants";

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
async function waitForOrder(
  sessionId: string,
  userId: string,
  maxAttempts = 5,
  delayMs = 1000
) {
  for (let attempt = 0; attempt < maxAttempts; attempt++) {
    const order = await prisma.order.findUnique({
      where: { stripeCheckoutSessionId: sessionId },
      include: {
        items: true,
        user: true,
      },
    });

    // Only return order if it belongs to the authenticated user
    if (order && order.user.clerkId === userId) {
      return order;
    }

    // If order exists but belongs to different user, don't retry
    if (order) {
      return null;
    }

    // Wait before retrying (except on last attempt)
    if (attempt < maxAttempts - 1) {
      await new Promise((resolve) => setTimeout(resolve, delayMs));
    }
  }

  return null;
}

export default async function ThankYou({ searchParams }: ThankYouProps) {
  const { userId: clerkId } = await auth();

  // Must be authenticated
  if (!clerkId) {
    redirect(COMMON_REDIRECT);
  }

  const params = await searchParams;
  const sessionId = params.session_id;

  // Redirect if no session_id is provided
  if (!sessionId) {
    redirect(COMMON_REDIRECT);
  }

  try {
    // Retrieve the checkout session from Stripe
    const session = await stripe.checkout.sessions.retrieve(sessionId);

    // Verify the session was successful
    if (session.payment_status !== "paid") {
      redirect(COMMON_REDIRECT);
    }

    // Get pendingCheckoutId from metadata to verify ownership
    const pendingCheckoutId = session.metadata?.pendingCheckoutId;
    if (!pendingCheckoutId) {
      redirect(COMMON_REDIRECT);
    }

    // Verify the session belongs to the authenticated user via pending checkout
    const pendingCheckout = await prisma.pendingCheckout.findUnique({
      where: { id: pendingCheckoutId },
      include: { items: true },
    });

    // If pending checkout exists, verify it belongs to this user
    // (It may have been deleted by the webhook after order creation)
    if (pendingCheckout && pendingCheckout.clerkId !== clerkId) {
      redirect(COMMON_REDIRECT);
    }

    // Try to fetch the order from the database (webhook should have created it)
    const order = await waitForOrder(sessionId, clerkId);

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
              stripeProductId: item.stripeProductId,
              name: item.productName,
              priceInCents: item.priceInCents,
              quantity: item.quantity,
              imageUrl: item.imageUrl,
            })),
          }}
        />
      );
    }

    // Fallback: order not in database yet, use pending checkout data
    if (pendingCheckout) {
      const location = `${pendingCheckout.shippingAddress}, ${pendingCheckout.shippingCity}`;
      return (
        <ThankYouClient
          firstName={pendingCheckout.shippingFirstName}
          location={location}
        />
      );
    }

    // No order and no pending checkout - something went wrong
    return <ThankYouClient firstName="Customer" location="your location" />;
  } catch (error) {
    console.error("Error retrieving order:", error);
    redirect(COMMON_REDIRECT);
  }
}
