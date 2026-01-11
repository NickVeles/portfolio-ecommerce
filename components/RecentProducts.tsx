"use client";

import { useSuspenseQuery } from "@tanstack/react-query";
import { productKeys, fetchRecentProducts } from "@/lib/queries/products";
import ProductCard from "@/components/ProductCard";
import { useClerkLoaded } from "@/components/providers/ClerkLoadedWrapper";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

export default function RecentProducts() {
  const isClerkLoaded = useClerkLoaded();

  const { data } = useSuspenseQuery({
    queryKey: [...productKeys.recent(), isClerkLoaded],
    queryFn: fetchRecentProducts,
  });

  if (!isClerkLoaded) {
    return (
      <>
        {Array.from({ length: 4 }).map((_, index) => (
          <Skeleton
            key={index}
            className="min-w-full min-h-105.5 rounded-xl opacity-50 flex justify-center items-center"
          >
            <Spinner className="size-8" />
          </Skeleton>
        ))}
      </>
    );
  }

  return (
    <>
      {data.products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </>
  );
}
