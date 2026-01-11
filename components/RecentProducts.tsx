"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { productKeys, fetchRecentProducts } from "@/lib/queries/products";
import ProductCard from "@/components/ProductCard";

export default function RecentProducts() {
  const { data } = useSuspenseQuery({
    queryKey: productKeys.recent(),
    queryFn: fetchRecentProducts,
    staleTime: 5 * 60 * 1000, // Data stays fresh for 5 minutes
  });

  return (
    <>
      {data.products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </>
  );
}
