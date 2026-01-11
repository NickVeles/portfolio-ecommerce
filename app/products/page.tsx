import ProductList from "@/components/ProductList";
import { fetchProductMetadata } from "@/lib/queries/products";

interface ProductsPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function Products({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const searchQuery = params.search || "";

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
          product
          {totalCount !== 1 && "s"}
        </p>
      </div>
      <ProductList
        page={page}
        searchQuery={searchQuery}
        totalPages={totalPages}
        totalCount={totalCount}
      />
    </div>
  );
}
