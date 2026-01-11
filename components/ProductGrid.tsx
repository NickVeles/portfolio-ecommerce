"use client";

import { useQuery } from "@tanstack/react-query";
import { productKeys, fetchProductsPage } from "@/lib/queries/products";
import ProductCard from "./ProductCard";
import { SearchX } from "lucide-react";
import { Button } from "./ui/button";
import { useRouter, useSearchParams } from "next/navigation";
import { useTransition, useState } from "react";
import { Spinner } from "./ui/spinner";
import { Skeleton } from "./ui/skeleton";

interface ProductGridProps {
  page: number;
  searchQuery: string;
  sortBy: string;
}

export default function ProductGrid({
  page,
  searchQuery,
  sortBy,
}: ProductGridProps) {

  const { data, isPending } = useQuery({
    queryKey: productKeys.list(page, searchQuery, sortBy),
    queryFn: () => fetchProductsPage(page, searchQuery, sortBy),
  });

  const router = useRouter();
  const searchParams = useSearchParams();
  const [_1, setSearchInput] = useState(searchQuery);
  const [_2, startTransition] = useTransition();

  if (isPending) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {Array.from({ length: 12 }).map((_, index) => (
          <Skeleton
            key={index}
            className="min-w-full min-h-105.5 rounded-xl opacity-50 flex justify-center items-center"
          >
            <Spinner className="size-8" />
          </Skeleton>
        ))}
      </div>
    );
  }

  if (!data || data.products.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-16 space-y-4 text-muted-foreground text-center">
        <SearchX className="size-16" />
        <div className="space-y-1">
          <p className="text-lg">No results for &quot;{searchQuery}&quot;!</p>
          <p>Try searching for something else.</p>
        </div>
        <Button
          variant="link"
          onClick={() => {
            setSearchInput("");
            const params = new URLSearchParams(searchParams.toString());
            params.delete("search");
            params.set("page", "1");
            startTransition(() => {
              router.push(`/products?${params.toString()}`);
            });
          }}
        >
          Clear search
        </Button>
      </div>
    );
  }

  return (
    <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {data.products.map((product) => (
        <li key={product.id}>
          <ProductCard product={product} />
        </li>
      ))}
    </ul>
  );
}
