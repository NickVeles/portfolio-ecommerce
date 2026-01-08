import { stripe } from "./stripe";
import { Stripe } from "stripe";

const ITEMS_PER_PAGE = 12;

interface ProductPaginationResult {
  products: Stripe.Product[];
  totalCount: number;
  totalPages: number;
  currentPage: number;
}

// Cache for product IDs to avoid repeated fetches
let productIdsCache: { ids: string[]; timestamp: number } | null = null;
const CACHE_TTL = 5 * 60 * 1000; // 5 minutes

/**
 * Fetches all product IDs from Stripe (lightweight operation)
 * Results are cached for performance
 */
async function getAllProductIds(): Promise<string[]> {
  const now = Date.now();

  // Return cached IDs if still valid
  if (productIdsCache && now - productIdsCache.timestamp < CACHE_TTL) {
    return productIdsCache.ids;
  }

  const allIds: string[] = [];
  let hasMore = true;
  let startingAfter: string | undefined = undefined;

  // Fetch all product IDs in batches
  while (hasMore) {
    const response: Stripe.ApiList<Stripe.Product> = await stripe.products.list(
      {
        limit: 100,
        active: true,
        ...(startingAfter && { starting_after: startingAfter }),
      }
    );

    allIds.push(...response.data.map((p) => p.id));
    hasMore = response.has_more;

    if (hasMore && response.data.length > 0) {
      startingAfter = response.data[response.data.length - 1].id;
    }
  }

  // Update cache
  productIdsCache = {
    ids: allIds,
    timestamp: now,
  };

  return allIds;
}

/**
 * Fetches a specific page of products with full details
 */
export async function getProductsPage(
  page: number = 1,
  searchQuery?: string
): Promise<ProductPaginationResult> {
  // Get all product IDs
  const allProductIds = await getAllProductIds();

  // Fetch full product details for all products if we need to search
  let allProducts: Stripe.Product[] = [];
  if (searchQuery) {
    allProducts = await Promise.all(
      allProductIds.map((id) =>
        stripe.products.retrieve(id, {
          expand: ["default_price"],
        })
      )
    );

    // Filter products by search query (search in name and description)
    const query = searchQuery.toLowerCase().trim();
    allProducts = allProducts.filter((product) => {
      const nameMatch = product.name.toLowerCase().includes(query);
      const descriptionMatch = product.description
        ?.toLowerCase()
        .includes(query);
      return nameMatch || descriptionMatch;
    });
  }

  // Calculate pagination based on filtered or all products
  const totalCount = searchQuery ? allProducts.length : allProductIds.length;
  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  // Validate page number
  const currentPage = Math.max(1, Math.min(page, totalPages || 1));

  // Calculate which products to fetch for this page
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = Math.min(startIndex + ITEMS_PER_PAGE, totalCount);

  let products: Stripe.Product[];

  if (searchQuery) {
    // Use already filtered products
    products = allProducts.slice(startIndex, endIndex);
  } else {
    // Fetch full product details only for the current page
    const pageProductIds = allProductIds.slice(startIndex, endIndex);
    products = await Promise.all(
      pageProductIds.map((id) =>
        stripe.products.retrieve(id, {
          expand: ["default_price"],
        })
      )
    );
  }

  return {
    products,
    totalCount,
    totalPages,
    currentPage,
  };
}

/**
 * Clears the product IDs cache (useful for webhooks or manual refresh)
 */
export function clearProductCache(): void {
  productIdsCache = null;
}
