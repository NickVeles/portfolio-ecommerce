import { redirect } from "next/navigation";
import type { Stripe } from "stripe";
import { stripe } from "@/lib/stripe";
import { ITEMS_PER_PAGE } from "@/lib/constants";

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (page?: number, search?: string, sort?: string) =>
    [...productKeys.lists(), { page, search, sort }] as const,
  recent: () => [...productKeys.all, "recent"] as const,
};

interface RecentProductsResult {
  products: Stripe.Product[];
}

interface ProductPaginationResult {
  products: Stripe.Product[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

export interface ProductMetadata {
  totalCount: number;
  totalPages: number;
  itemsPerPage: number;
}

// Used for client-side fetches only (relative path works in browser)
function getBaseUrl() {
  if (typeof window !== "undefined") return "";
  return "";
}

export async function fetchProductMetadata(
  searchQuery?: string
): Promise<ProductMetadata> {
  try {
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
    if (searchQuery) {
      const allProducts = await Promise.all(
        allIds.map((id) => stripe.products.retrieve(id))
      );

      const query = searchQuery.toLowerCase().trim();
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

    return {
      totalCount,
      totalPages,
      itemsPerPage: ITEMS_PER_PAGE,
    };
  } catch (error) {
    console.error("Failed to fetch product metadata:", error);
    redirect("/500");
  }
}

export async function fetchRecentProducts(): Promise<RecentProductsResult> {
  const response = await fetch(`${getBaseUrl()}/api/products/recent`, {
    cache: "no-store",
  });

  if (!response.ok) {
    console.error("Failed to fetch recent products");
    redirect("/500");
  }

  return response.json();
}

export async function fetchProductsPage(
  page: number = 1,
  searchQuery?: string,
  sortBy: string = "newest"
): Promise<ProductPaginationResult> {
  const params = new URLSearchParams({
    page: page.toString(),
    ...(searchQuery && { search: searchQuery }),
    sort: sortBy,
  });

  const response = await fetch(`${getBaseUrl()}/api/products?${params}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}
