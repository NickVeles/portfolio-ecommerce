import ProductList from "@/components/ProductList";
import { fetchProductMetadata } from "@/lib/queries/products";
import type { Metadata } from "next";

interface ProductsPageProps {
  searchParams: Promise<{ page?: string; search?: string; sort?: string }>;
}

export const metadata: Metadata = {
  title: "All Products",
  description:
    "Browse our complete collection of premium apparels and accessories. Filter, search, and find the perfect products for your style. Free shipping on orders over €50.",
  openGraph: {
    title: "All Products - Velbuy",
    description:
      "Browse our complete collection of premium apparels and accessories.",
  },
};

export default async function Products({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const searchQuery = params.search || "";
  const sortBy = params.sort || "newest";

  const { totalCount, totalPages } = await fetchProductMetadata(searchQuery);

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          All Products
        </h1>
        <p className="text-muted-foreground">
          Browse our collection of
          {totalCount > 0 ? ` ${totalCount} ` : " our finest "}
          {totalCount === 1 ? "product" : "products"}
        </p>
      </div>
      <ProductList
        page={page}
        searchQuery={searchQuery}
        sortBy={sortBy}
        totalPages={totalPages}
        totalCount={totalCount}
      />
    </div>
  );
}
