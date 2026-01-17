import { auth } from "@clerk/nextjs/server";
import { redirect, notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { OrderItemsList } from "@/components/OrderItemsList";
import { ArrowLeft } from "lucide-react";
import type { OrderStatus } from "@prisma/client";
import type { Metadata } from "next";
import { COMMON_REDIRECT } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Order Details",
  description: "View your order details",
};

type OrderPageProps = {
  params: Promise<{ id: string }>;
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

function formatDate(date: Date): string {
  return new Intl.DateTimeFormat("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
  }).format(date);
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    redirect(COMMON_REDIRECT);
  }

  const { id } = await params;

  const user = await prisma.user.findUnique({
    where: { clerkId },
  });

  if (!user) {
    redirect(COMMON_REDIRECT);
  }

  const order = await prisma.order.findUnique({
    where: { id },
    include: {
      items: {
        orderBy: { createdAt: "asc" },
      },
    },
  });

  // Order not found or doesn't belong to user
  if (!order || order.userId !== user.id) {
    notFound();
  }

  const orderItems = order.items.map((item) => ({
    id: item.id,
    stripeProductId: item.stripeProductId,
    name: item.productName,
    priceInCents: item.priceInCents,
    quantity: item.quantity,
    imageUrl: item.imageUrl,
  }));

  return (
    <div className="space-y-8">
      <div>
        <Button variant="ghost" size="sm" asChild className="-ml-2 mb-4">
          <Link href="/orders">
            <ArrowLeft className="size-4 mr-1" />
            Back to Orders
          </Link>
        </Button>

        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl font-semibold">
            Order #{order.id.slice(-8).toUpperCase()}
          </h1>
          <Badge variant={getStatusBadgeVariant(order.status)}>
            {formatStatus(order.status)}
          </Badge>
        </div>
        <p className="text-sm text-muted-foreground mt-1">
          Placed on {formatDate(order.createdAt)}
        </p>
      </div>

      {/* Shipping Information */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Shipping Address</h2>
        <div className="border rounded-lg p-4 space-y-1 text-sm">
          <p className="font-medium">
            {order.shippingFirstName} {order.shippingLastName}
          </p>
          <p className="text-muted-foreground">{order.shippingAddress}</p>
          <p className="text-muted-foreground">
            {order.shippingCity}
            {order.shippingState && `, ${order.shippingState}`}{" "}
            {order.shippingPostalCode}
          </p>
          <p className="text-muted-foreground">{order.shippingCountry}</p>
          {order.shippingPhone && (
            <p className="text-muted-foreground pt-2">{order.shippingPhone}</p>
          )}
          <p className="text-muted-foreground">{order.shippingEmail}</p>
        </div>
      </div>

      {/* Order Items */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Items</h2>
        <OrderItemsList items={orderItems} totalInCents={order.totalInCents} />
      </div>
    </div>
  );
}
