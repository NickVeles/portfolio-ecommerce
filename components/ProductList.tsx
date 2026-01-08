"use client";

import { Stripe } from "stripe";
import ProductCard from "./ProductCard";
import { Input } from "./ui/input";
import { Button } from "./ui/button";
import { Search, SearchX } from "lucide-react";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
  PaginationEllipsis,
} from "./ui/pagination";
import { useRouter, useSearchParams } from "next/navigation";
import { useState, useTransition } from "react";

interface ProductListProps {
  products: Stripe.Product[];
  currentPage: number;
  totalPages: number;
  searchQuery: string;
}

function ProductList({
  products,
  currentPage,
  totalPages,
  searchQuery,
}: ProductListProps) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [searchInput, setSearchInput] = useState(searchQuery);
  const [isPending, startTransition] = useTransition();

  const createPageUrl = (page: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", page.toString());
    return `/products?${params.toString()}`;
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const params = new URLSearchParams(searchParams.toString());

    if (searchInput.trim()) {
      params.set("search", searchInput.trim());
    } else {
      params.delete("search");
    }

    // Reset to page 1 when searching
    params.set("page", "1");

    startTransition(() => {
      router.push(`/products?${params.toString()}`);
    });
  };

  const renderPageNumbers = () => {
    const pages = [];
    const maxVisiblePages = 5;

    if (totalPages <= maxVisiblePages) {
      // Show all pages if total is less than max visible
      for (let i = 1; i <= totalPages; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={createPageUrl(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }
    } else {
      // Always show first page
      pages.push(
        <PaginationItem key={1}>
          <PaginationLink href={createPageUrl(1)} isActive={currentPage === 1}>
            1
          </PaginationLink>
        </PaginationItem>
      );

      // Show ellipsis if current page is far from start
      if (currentPage > 3) {
        pages.push(<PaginationEllipsis key="ellipsis-start" />);
      }

      // Show pages around current page
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(
          <PaginationItem key={i}>
            <PaginationLink
              href={createPageUrl(i)}
              isActive={currentPage === i}
            >
              {i}
            </PaginationLink>
          </PaginationItem>
        );
      }

      // Show ellipsis if current page is far from end
      if (currentPage < totalPages - 2) {
        pages.push(<PaginationEllipsis key="ellipsis-end" />);
      }

      // Always show last page
      pages.push(
        <PaginationItem key={totalPages}>
          <PaginationLink
            href={createPageUrl(totalPages)}
            isActive={currentPage === totalPages}
          >
            {totalPages}
          </PaginationLink>
        </PaginationItem>
      );
    }

    return pages;
  };

  const PaginationControls = () => (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={currentPage > 1 ? createPageUrl(currentPage - 1) : undefined}
            aria-disabled={currentPage === 1}
            className={
              currentPage === 1 ? "pointer-events-none opacity-50" : undefined
            }
          />
        </PaginationItem>

        {renderPageNumbers()}

        <PaginationItem>
          <PaginationNext
            href={
              currentPage < totalPages
                ? createPageUrl(currentPage + 1)
                : undefined
            }
            aria-disabled={currentPage === totalPages}
            className={
              currentPage === totalPages
                ? "pointer-events-none opacity-50"
                : undefined
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );

  return (
    <div className="w-full space-y-6">
      <div className="w-full flex justify-center">
        <form
          onSubmit={handleSearch}
          className="w-96 flex flex-nowrap items-center max-w-md"
        >
          <Input
            type="text"
            placeholder="Search products..."
            className="rounded-r-none border-r-0"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            disabled={isPending}
          />
          <Button
            type="submit"
            variant="outline"
            className="rounded-l-none"
            disabled={isPending}
          >
            <Search className="size-4" />
          </Button>
        </form>
      </div>

      <PaginationControls />

      {products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 space-y-4 text-muted-foreground text-center">
          <SearchX className="size-16" />
          <div className="space-y-1">
            <p className="text-lg">
              No results for &quot;{searchQuery}&quot;!
            </p>
            <p>Try searching for something else.</p>
          </div>
        </div>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <li key={product.id}>
              <ProductCard product={product} />
            </li>
          ))}
        </ul>
      )}

      <PaginationControls />
    </div>
  );
}

export default ProductList;
