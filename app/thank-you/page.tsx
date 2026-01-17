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
  clerkId: string | null,
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

    if (order) {
      // For guest orders (no userId), return the order
      if (!order.userId) {
        return order;
      }
      // For authenticated orders, verify ownership
      if (clerkId && order.user?.clerkId === clerkId) {
        return order;
      }
      // Order belongs to a different user, don't return it
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

    // Verify the session belongs to the current user via pending checkout
    const pendingCheckout = await prisma.pendingCheckout.findUnique({
      where: { id: pendingCheckoutId },
      include: { items: true },
    });

    // If pending checkout exists, verify ownership:
    // - Guest checkout (no clerkId in pending): allow if current user is also guest
    // - Authenticated checkout: must match current user's clerkId
    if (pendingCheckout) {
      const isGuestCheckout = !pendingCheckout.clerkId;
      const isCurrentUserGuest = !clerkId;

      if (!isGuestCheckout && pendingCheckout.clerkId !== clerkId) {
        // Authenticated checkout that doesn't belong to current user
        redirect(COMMON_REDIRECT);
      }
      if (isGuestCheckout && !isCurrentUserGuest) {
        // Guest checkout but user is now logged in - allow it (they may have logged in after)
        // This is permissive but reasonable UX
      }
    }

    // Try to fetch the order from the database (webhook should have created it)
    const order = await waitForOrder(sessionId, clerkId);

    const isGuestOrder = order ? !order.userId : !pendingCheckout?.clerkId;

    if (order) {
      // Order found in database - show order details
      // Hide personal info for guest orders
      return (
        <ThankYouClient
          firstName={isGuestOrder ? undefined : order.shippingFirstName}
          location={isGuestOrder ? undefined : `${order.shippingAddress}, ${order.shippingCity}`}
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
      // Hide personal info for guest orders
      return (
        <ThankYouClient
          firstName={isGuestOrder ? undefined : pendingCheckout.shippingFirstName}
          location={isGuestOrder ? undefined : `${pendingCheckout.shippingAddress}, ${pendingCheckout.shippingCity}`}
        />
      );
    }

    // No order and no pending checkout - something went wrong
    return <ThankYouClient />;
  } catch (error) {
    console.error("Error retrieving order:", error);
    redirect(COMMON_REDIRECT);
  }
}
