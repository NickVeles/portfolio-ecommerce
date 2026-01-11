"use server";

import { CartItem } from "@/store/cart-store";
import { stripe } from "./stripe";
import { redirect } from "next/navigation";

export default async function processCheckout(
  formData: FormData
): Promise<void> {
  const itemsJson = formData.get("items") as string;
  const items = JSON.parse(itemsJson);
  const line_items = items.map((item: CartItem) => ({
    price_data: {
      currency: "eur",
      product_data: {
        name: item.name,
        images: item.imageUrl ? [item.imageUrl] : [],
      },
      unit_amount: item.price * 100, //convert to int
    },
    quantity: item.quantity,
  }));

  // Extract user info from form
  const firstName = formData.get("firstName") as string;
  const address = formData.get("address") as string;
  const city = formData.get("city") as string;

  // Merge location data
  const location = `${address}, ${city}`;

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    // Store customer data in metadata instead of URL params
    metadata: {
      firstName,
      location,
    },
    // Use Stripe's session_id placeholder - Stripe will replace it with actual session ID
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
  });

  redirect(session.url!);
}
