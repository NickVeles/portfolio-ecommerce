import ProductList from "@/components/ProductList";
import { getProductsPage } from "@/lib/products";

interface ProductsPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function Products({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const searchQuery = params.search || "";

  const { products, totalCount, totalPages, currentPage } =
    await getProductsPage(page, searchQuery);

  // Serialize products to plain objects for Client Component
  const serializedProducts = JSON.parse(JSON.stringify(products));

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          All Products
        </h1>
        <p className="text-muted-foreground">
          Browse our complete collection of {totalCount} products
        </p>
      </div>
      <ProductList
        products={serializedProducts}
        currentPage={currentPage}
        totalPages={totalPages}
        searchQuery={searchQuery}
      />
    </div>
  );
}
