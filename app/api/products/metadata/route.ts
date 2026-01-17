import { ITEMS_PER_PAGE } from "@/lib/constants";
import { stripe } from "@/lib/stripe";
import { NextRequest, NextResponse } from "next/server";
import type { Stripe } from "stripe";

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const search = searchParams.get("search") || undefined;

    // Fetch all product IDs
    const allIds: string[] = [];
    let hasMore = true;
    let startingAfter: string | undefined = undefined;

    while (hasMore) {
      const response: Stripe.ApiList<Stripe.Product> =
        await stripe.products.list({
          limit: 100,
          active: true,
          ...(startingAfter && { starting_after: startingAfter }),
        });

      allIds.push(...response.data.map((p) => p.id));
      hasMore = response.has_more;

      if (hasMore && response.data.length > 0) {
        startingAfter = response.data[response.data.length - 1].id;
      }
    }

    let totalCount = allIds.length;

    // If there's a search query, we need to fetch all products to filter them
    if (search) {
      const allProducts = await Promise.all(
        allIds.map((id) => stripe.products.retrieve(id))
      );

      const query = search.toLowerCase().trim();
      const filteredProducts = allProducts.filter((product) => {
        const nameMatch = product.name.toLowerCase().includes(query);
        const descriptionMatch = product.description
          ?.toLowerCase()
          .includes(query);
        return nameMatch || descriptionMatch;
      });

      totalCount = filteredProducts.length;
    }

    const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

    return NextResponse.json({
      totalCount,
      totalPages,
      itemsPerPage: ITEMS_PER_PAGE,
    });
  } catch (error) {
    console.error("Error fetching product metadata:", error);
    return NextResponse.json(
      { error: "Failed to fetch product metadata" },
      { status: 500 }
    );
  }
}
