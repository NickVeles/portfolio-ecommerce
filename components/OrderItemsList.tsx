import Image from "next/image";
import Link from "next/link";
import { slugifyProduct } from "@/lib/utils";

type OrderItem = {
  id: string;
  stripeProductId: string;
  name: string;
  priceInCents: number;
  quantity: number;
  imageUrl: string | null;
};

type OrderItemsListProps = {
  items: OrderItem[];
  totalInCents: number;
};

function formatPrice(cents: number): string {
  return (cents / 100).toFixed(2);
}

export function OrderItemsList({ items, totalInCents }: OrderItemsListProps) {
  return (
    <div className="border rounded-lg p-4">
      <div className="space-y-4 mb-4">
        {items.map((item) => (
          <div key={item.id} className="flex gap-4 py-4 border-b last:border-b-0">
            {item.imageUrl && (
              <div className="relative size-20 rounded-md overflow-hidden bg-muted shrink-0">
                <Image
                  src={item.imageUrl}
                  alt={item.name}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="flex-1 flex flex-col gap-2">
              <Link
                href={`/products/${slugifyProduct({ id: item.stripeProductId, name: item.name })}`}
                className="font-medium line-clamp-2 hover:text-secondary"
              >
                {item.name}
              </Link>
              <div className="flex items-center justify-between gap-2">
                <span className="text-sm text-muted-foreground">
                  Qty: {item.quantity}
                </span>
                <p className="font-semibold text-lg">
                  &euro;{formatPrice(item.priceInCents * item.quantity)}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="border-t pt-4">
        <div className="flex justify-between items-center text-xl font-semibold">
          <span>Total</span>
          <span>&euro;{formatPrice(totalInCents)}</span>
        </div>
      </div>
    </div>
  );
}
