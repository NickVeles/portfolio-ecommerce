import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

interface PendingCheckoutItem {
  stripeProductId: string;
  productName: string;
  priceInCents: number;
  quantity: number;
  imageUrl: string | null;
}

export async function POST(req: Request) {
  const body = await req.text();
  const headerPayload = await headers();
  const signature = headerPayload.get("stripe-signature");

  if (!signature) {
    return NextResponse.json(
      { error: "Missing stripe-signature header" },
      { status: 400 }
    );
  }

  const WEBHOOK_SECRET = process.env.STRIPE_WEBHOOK_SECRET;

  if (!WEBHOOK_SECRET) {
    console.error("Missing STRIPE_WEBHOOK_SECRET environment variable");
    return NextResponse.json(
      { error: "Webhook secret not configured" },
      { status: 500 }
    );
  }

  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(body, signature, WEBHOOK_SECRET);
  } catch (err) {
    console.error("Webhook signature verification failed:", err);
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (event.type === "checkout.session.completed") {
    const session = event.data.object as Stripe.Checkout.Session;

    try {
      await handleCheckoutSessionCompleted(session);
    } catch (err) {
      console.error("Error processing checkout.session.completed:", err);
      return NextResponse.json(
        { error: "Error processing webhook" },
        { status: 500 }
      );
    }
  }

  return NextResponse.json({ received: true });
}

async function handleCheckoutSessionCompleted(
  session: Stripe.Checkout.Session
) {
  const metadata = session.metadata;
  if (!metadata) {
    throw new Error("Session metadata is missing");
  }

  // Get pending checkout from database
  const pendingCheckoutId = metadata.pendingCheckoutId;
  if (!pendingCheckoutId) {
    throw new Error("pendingCheckoutId not found in session metadata");
  }

  const pendingCheckout = await prisma.pendingCheckout.findUnique({
    where: { id: pendingCheckoutId },
    include: { items: true },
  });

  if (!pendingCheckout) {
    throw new Error(`PendingCheckout not found: ${pendingCheckoutId}`);
  }

  // Find user by clerkId (optional for guest checkout)
  let user = null;
  if (pendingCheckout.clerkId) {
    user = await prisma.user.findUnique({
      where: { clerkId: pendingCheckout.clerkId },
    });
  }

  // Calculate total from pending checkout items
  const totalInCents = pendingCheckout.items.reduce(
    (sum: number, item: PendingCheckoutItem) =>
      sum + item.priceInCents * item.quantity,
    0
  );

  // Create the order with items in a transaction
  const order = await prisma.$transaction(async (tx) => {
    // Create the order
    const newOrder = await tx.order.create({
      data: {
        ...(user && { userId: user.id }),
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id || null,
        status: "PROCESSING",
        shippingFirstName: pendingCheckout.shippingFirstName,
        shippingLastName: pendingCheckout.shippingLastName,
        shippingEmail: pendingCheckout.shippingEmail,
        shippingPhone: pendingCheckout.shippingPhone,
        shippingAddress: pendingCheckout.shippingAddress,
        shippingCity: pendingCheckout.shippingCity,
        shippingState: pendingCheckout.shippingState,
        shippingPostalCode: pendingCheckout.shippingPostalCode,
        shippingCountry: pendingCheckout.shippingCountry,
        totalInCents,
        currency: session.currency || "eur",
        items: {
          create: pendingCheckout.items.map((item: PendingCheckoutItem) => ({
            stripeProductId: item.stripeProductId,
            productName: item.productName,
            priceInCents: item.priceInCents,
            quantity: item.quantity,
            imageUrl: item.imageUrl,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Clear the user's cart after successful order creation (only if user exists)
    if (user) {
      await tx.cartItem.deleteMany({
        where: {
          cart: {
            userId: user.id,
          },
        },
      });
    }

    // Delete the pending checkout (no longer needed)
    await tx.pendingCheckout.delete({
      where: { id: pendingCheckoutId },
    });

    return newOrder;
  });

  console.log(`Order created: ${order.id}${user ? ` for user: ${user.id}` : " (guest checkout)"}`);
}
