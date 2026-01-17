"use server";

import { CartItem } from "@/store/cart-store";
import { stripe } from "./stripe";
import { redirect } from "next/navigation";
import { auth } from "@clerk/nextjs/server";

export default async function processCheckout(
  formData: FormData
): Promise<void> {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    throw new Error("User must be authenticated to checkout");
  }

  const itemsJson = formData.get("items") as string;
  const items: CartItem[] = JSON.parse(itemsJson);
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

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ["card"],
    line_items,
    mode: "payment",
    // Store all data needed for order creation in metadata
    metadata: {
      clerkId,
      shippingFirstName: firstName,
      shippingLastName: lastName,
      shippingEmail: email,
      shippingPhone: phone,
      shippingAddress: address,
      shippingCity: city,
      shippingState: state,
      shippingPostalCode: postalCode,
      shippingCountry: country,
      // Store cart items for order creation (Stripe metadata has 500 char limit per value)
      cartItems: JSON.stringify(items),
    },
    // Use Stripe's session_id placeholder - Stripe will replace it with actual session ID
    success_url: `${process.env.NEXT_PUBLIC_BASE_URL}/thank-you?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_BASE_URL}/checkout`,
  });

  redirect(session.url!);
}
