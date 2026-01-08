import ProductList from "@/components/ProductList";
import { getProductsPage } from "@/lib/products";

interface ProductsPageProps {
  searchParams: Promise<{ page?: string }>;
}

export default async function Products({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);

  const { products, totalCount, totalPages, currentPage } =
    await getProductsPage(page);

  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          All Products
        </h1>
        <p className="text-muted-foreground">
          Browse our complete collection of {totalCount} products
        </p>
      </div>
      <ProductList
        products={products}
        currentPage={currentPage}
        totalPages={totalPages}
      />
    </div>
  );
}
