import { stripe } from "@/lib/stripe";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const products = await stripe.products.list({
      expand: ["data.default_price"],
      limit: 4,
    });

    return NextResponse.json({ products: products.data });
  } catch (error) {
    console.error("Error fetching recent products:", error);
    return NextResponse.json(
      { error: "Failed to fetch recent products" },
      { status: 500 }
    );
  }
}
