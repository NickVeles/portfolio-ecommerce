import ProductList from "@/components/ProductList";
import { Suspense } from "react";
import { Spinner } from "@/components/ui/spinner";

interface ProductsPageProps {
  searchParams: Promise<{ page?: string; search?: string }>;
}

export default async function Products({ searchParams }: ProductsPageProps) {
  const params = await searchParams;
  const page = parseInt(params.page || "1", 10);
  const searchQuery = params.search || "";

  return (
    <div className="space-y-8">
      <div className="flex flex-col items-center justify-center gap-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
          All Products
        </h1>
        <p className="text-muted-foreground">
          Browse our collection of products
        </p>
      </div>
      <Suspense
        fallback={
          <div className="flex justify-center items-center py-16">
            <Spinner className="size-8" />
          </div>
        }
      >
        <ProductList page={page} searchQuery={searchQuery} />
      </Suspense>
    </div>
  );
}
