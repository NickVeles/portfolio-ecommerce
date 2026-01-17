import { redirect } from "next/navigation";
import type { Stripe } from "stripe";

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

function getBaseUrl() {
  // Browser should use relative path
  if (typeof window !== "undefined") return "";

  // SSR should use vercel url or localhost
  if (process.env.NEXT_PUBLIC_APP_URL) return `https://${process.env.NEXT_PUBLIC_APP_URL}`;

  return `http://localhost:${process.env.PORT ?? 3000}`;
}

export async function fetchProductMetadata(
  searchQuery?: string
): Promise<ProductMetadata> {
  const params = new URLSearchParams({
    ...(searchQuery && { search: searchQuery }),
  });

  const response = await fetch(
    `${getBaseUrl()}/api/products/metadata?${params}`,
    {
      cache: "no-store",
    }
  );

  if (!response.ok) {
    console.error("Failed to fetch product metadata");
    redirect("/500");
  }

  return response.json();
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
