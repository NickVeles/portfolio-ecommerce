import type { Stripe } from "stripe";

export const productKeys = {
  all: ["products"] as const,
  lists: () => [...productKeys.all, "list"] as const,
  list: (page?: number, search?: string) =>
    [...productKeys.lists(), { page, search }] as const,
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

function getBaseUrl() {
  // Browser should use relative path
  if (typeof window !== "undefined") return "";

  // SSR should use vercel url or localhost
  if (process.env.VERCEL_URL) return `https://${process.env.VERCEL_URL}`;

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export async function fetchRecentProducts(): Promise<RecentProductsResult> {
  const response = await fetch(`${getBaseUrl()}/api/products/recent`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch recent products");
  }

  return response.json();
}

export async function fetchProductsPage(
  page: number = 1,
  searchQuery?: string
): Promise<ProductPaginationResult> {
  const params = new URLSearchParams({
    page: page.toString(),
    ...(searchQuery && { search: searchQuery }),
  });

  const response = await fetch(`${getBaseUrl()}/api/products?${params}`, {
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error("Failed to fetch products");
  }

  return response.json();
}
