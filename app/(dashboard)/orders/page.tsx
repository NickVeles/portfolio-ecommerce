import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import type { OrderStatus } from "@prisma/client";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Orders",
  description: "View your order history",
};

const ORDERS_PER_PAGE = 10;

type OrdersProps = {
  searchParams: Promise<{ page?: string }>;
};

function getStatusBadgeVariant(
  status: OrderStatus
): "default" | "secondary" | "destructive" | "outline" {
  switch (status) {
    case "DELIVERED":
      return "default";
    case "PROCESSING":
    case "SHIPPED":
      return "secondary";
    case "CANCELLED":
    case "REFUNDED":
    case "FAILED":
      return "destructive";
    case "PENDING":
    default:
      return "outline";
  }
}

function formatStatus(status: OrderStatus): string {
  return status.charAt(0) + status.slice(1).toLowerCase();
}

function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2);
}

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(date);
}

export default async function Orders({ searchParams }: OrdersProps) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect("/");
  }

  const params = await searchParams;
  const currentPage = Math.max(1, parseInt(params.page || "1", 10));

  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    redirect("/");
  }

  const [orders, totalCount] = await Promise.all([
    prisma.order.findMany({
      where: { userId: user.id },
      include: {
        items: {
          orderBy: { createdAt: "asc" },
        },
      },
      orderBy: { createdAt: "desc" },
      skip: (currentPage - 1) * ORDERS_PER_PAGE,
      take: ORDERS_PER_PAGE,
    }),
    prisma.order.count({
      where: { userId: user.id },
    }),
  ]);

  const totalPages = Math.ceil(totalCount / ORDERS_PER_PAGE);

  return (
    <div className="space-y-12">
      <div>
        <h1 className="text-2xl font-semibold">Order History</h1>
        <p className="text-sm text-muted-foreground mt-1">
          Check and manage your website purchases
        </p>
      </div>

      {orders.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground text-lg">
            You haven&apos;t placed any orders yet.
          </p>
          <Link
            href="/products"
            className="text-primary hover:underline mt-2 inline-block"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <>
          <div className="space-y-4">
            {orders.map((order) => {
              const firstItem = order.items[0];
              const additionalItemsCount = order.items.length - 1;

              return (
                <Link
                  key={order.id}
                  href={`/orders/${order.id}`}
                  className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4 p-2 border rounded-lg hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center gap-3 sm:gap-4">
                    {/* Image preview with +X indicator */}
                    <div className="relative size-16 sm:size-20 rounded-md overflow-hidden bg-muted shrink-0">
                      {firstItem?.imageUrl ? (
                        <Image
                          src={firstItem.imageUrl}
                          alt={firstItem.productName}
                          fill
                          className="object-cover"
                        />
                      ) : (
                        <div className="size-full flex items-center justify-center text-muted-foreground text-xs">
                          No image
                        </div>
                      )}
                      {additionalItemsCount > 0 && (
                        <div className="absolute bottom-1 right-1 bg-black/70 text-white text-xs font-medium px-1.5 py-0.5 rounded">
                          +{additionalItemsCount}
                        </div>
                      )}
                    </div>

                    {/* Order details - mobile: next to image */}
                    <div className="flex-1 min-w-0 sm:hidden">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        <span className="font-medium text-sm">
                          #{order.id.slice(-8).toUpperCase()}
                        </span>
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {formatStatus(order.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                      <p className="font-semibold mt-1">
                        &euro;{formatPrice(order.totalInCents)}
                      </p>
                    </div>
                  </div>

                  {/* Order details - desktop */}
                  <div className="hidden sm:flex sm:flex-1 md:items-center sm:justify-between md:min-w-0">
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="font-medium truncate">
                          Order #{order.id.slice(-8).toUpperCase()}
                        </span>
                        <Badge variant={getStatusBadgeVariant(order.status)}>
                          {formatStatus(order.status)}
                        </Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {formatDate(order.createdAt)}
                      </p>
                    </div>

                    {/* Total price */}
                    <div className="text-right shrink-0 ml-4">
                      <p className="font-semibold text-lg">
                        &euro;{formatPrice(order.totalInCents)}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <Pagination className="mt-8">
              <PaginationContent>
                {currentPage > 1 && (
                  <PaginationItem>
                    <PaginationPrevious
                      href={`/orders?page=${currentPage - 1}`}
                    />
                  </PaginationItem>
                )}

                {Array.from({ length: totalPages }, (_, i) => i + 1).map(
                  (page) => (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href={`/orders?page=${page}`}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  )
                )}

                {currentPage < totalPages && (
                  <PaginationItem>
                    <PaginationNext href={`/orders?page=${currentPage + 1}`} />
                  </PaginationItem>
                )}
              </PaginationContent>
            </Pagination>
          )}
        </>
      )}
    </div>
  );
}