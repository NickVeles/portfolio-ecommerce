import { headers } from "next/headers";
import { NextResponse } from "next/server";
import Stripe from "stripe";
import { stripe } from "@/lib/stripe";
import { prisma } from "@/lib/prisma";

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
  // Get the full session with line items
  const fullSession = await stripe.checkout.sessions.retrieve(session.id, {
    expand: ["line_items.data.price.product"],
  });

  const metadata = fullSession.metadata;
  if (!metadata) {
    throw new Error("Session metadata is missing");
  }

  // Parse shipping info from metadata
  const shippingInfo = {
    firstName: metadata.shippingFirstName || "",
    lastName: metadata.shippingLastName || "",
    email: metadata.shippingEmail || "",
    phone: metadata.shippingPhone || null,
    address: metadata.shippingAddress || "",
    city: metadata.shippingCity || "",
    state: metadata.shippingState || null,
    postalCode: metadata.shippingPostalCode || "",
    country: metadata.shippingCountry || "",
  };

  // Find user by clerkId (stored in metadata)
  const clerkId = metadata.clerkId;
  if (!clerkId) {
    throw new Error("clerkId not found in session metadata");
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    throw new Error(`User not found for clerkId: ${clerkId}`);
  }

  // Parse cart items from metadata
  const cartItemsJson = metadata.cartItems;
  if (!cartItemsJson) {
    throw new Error("cartItems not found in session metadata");
  }

  const cartItems = JSON.parse(cartItemsJson) as Array<{
    id: string;
    name: string;
    price: number;
    imageUrl: string | null;
    quantity: number;
  }>;

  // Calculate total from cart items (price is in euros, store in cents)
  const totalInCents = cartItems.reduce(
    (sum, item) => sum + Math.round(item.price * 100) * item.quantity,
    0
  );

  // Create the order with items in a transaction
  const order = await prisma.$transaction(async (tx) => {
    // Create the order
    const newOrder = await tx.order.create({
      data: {
        userId: user.id,
        stripeCheckoutSessionId: session.id,
        stripePaymentIntentId:
          typeof session.payment_intent === "string"
            ? session.payment_intent
            : session.payment_intent?.id || null,
        status: "PROCESSING",
        shippingFirstName: shippingInfo.firstName,
        shippingLastName: shippingInfo.lastName,
        shippingEmail: shippingInfo.email,
        shippingPhone: shippingInfo.phone,
        shippingAddress: shippingInfo.address,
        shippingCity: shippingInfo.city,
        shippingState: shippingInfo.state,
        shippingPostalCode: shippingInfo.postalCode,
        shippingCountry: shippingInfo.country,
        totalInCents,
        currency: session.currency || "eur",
        items: {
          create: cartItems.map((item) => ({
            stripeProductId: item.id,
            productName: item.name,
            priceInCents: Math.round(item.price * 100),
            quantity: item.quantity,
            imageUrl: item.imageUrl,
          })),
        },
      },
      include: {
        items: true,
      },
    });

    // Clear the user's cart after successful order creation
    await tx.cartItem.deleteMany({
      where: {
        cart: {
          userId: user.id,
        },
      },
    });

    return newOrder;
  });

  console.log(`Order created: ${order.id} for user: ${user.id}`);
}
