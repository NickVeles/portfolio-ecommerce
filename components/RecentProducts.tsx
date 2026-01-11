"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { productKeys, fetchRecentProducts } from "@/lib/queries/products";
import ProductCard from "@/components/ProductCard";

export default function RecentProducts() {
  const { data } = useSuspenseQuery({
    queryKey: productKeys.recent(),
    queryFn: fetchRecentProducts,
  });

  return (
    <>
      {data.products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </>
  );
}
