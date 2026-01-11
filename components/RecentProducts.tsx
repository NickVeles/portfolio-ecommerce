"use client";

import { useQuery } from "@tanstack/react-query";
import { productKeys, fetchRecentProducts } from "@/lib/queries/products";
import ProductCard from "@/components/ProductCard";
import { useAuth } from "@clerk/nextjs";
import { Skeleton } from "./ui/skeleton";
import { Spinner } from "./ui/spinner";

export default function RecentProducts() {

  const { data, isPending } = useQuery({
    queryKey: productKeys.recent(),
    queryFn: fetchRecentProducts,
  });

  if (isPending) {
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

  if (!data || data.products.length === 0) {
    return (
      <div className="col-span-full text-center py-12 text-muted-foreground">
        <p>No recent additions yet.</p>
      </div>
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
