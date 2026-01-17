"use server";

import { CartItem } from "@/store/cart-store";
import { stripe } from "./stripe";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export default async function processCheckout(
  formData: FormData
): Promise<void> {
  const { userId: clerkId } = await auth();

  const itemsJson = formData.get("items") as string;
  const items: CartItem[] = JSON.parse(itemsJson);
  const line_items = items.map((item: CartItem) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: item.name,
        images: item.imageUrl ? [item.imageUrl] : [],
      },
      unit_amount: Math.round(item.price * 100),
    },
    quantity: item.quantity,
  }));

  // Extract shipping info from form
  const firstName = formData.get("firstName") as string;
  const lastName = formData.get("lastName") as string;
  const email = formData.get("email") as string;
  const phone = formData.get("phone") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;
  const state = formData.get("state") as string;
  const postalCode = formData.get("postalCode") as string;
  const country = formData.get("country") as string;

  // Create pending checkout in database (expires in 24 hours)
  const pendingCheckout = await prisma.pendingCheckout.create({
    data: {
      clerkId: clerkId || null,
      expiresAt: new Date(Date.now() + 24 * 60 * 60 * 1000),
      shippingFirstName: firstName,
      shippingLastName: lastName,
      shippingEmail: email,
      shippingPhone: phone || null,
      shippingAddress: address,
      shippingCity: city,
      shippingState: state || null,
      shippingPostalCode: postalCode,
      shippingCountry: country,
      items: {
        create: items.map((item) => ({
          stripeProductId: item.id,
          productName: item.name,
          priceInCents: Math.round(item.price * 100),
          imageUrl: item.imageUrl || null,
          quantity: item.quantity,
        })),
      },
    },
  });

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    // Only store the pending checkout ID - all other data is in the database
    metadata: {
      pendingCheckoutId: pendingCheckout.id,
    },
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
  });

  redirect(session.url!);
}
