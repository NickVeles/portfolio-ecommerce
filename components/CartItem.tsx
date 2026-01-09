"use client";

import Link from "next/link";
import Image from "next/image";
import { Button } from "./ui/button";
import { Minus, Plus, Trash2 } from "lucide-react";
import { slugifyProduct } from "@/lib/utils";
import type { CartItem as CartItemType } from "@/store/cart-store";

interface CartItemProps {
  item: CartItemType;
  totalQuantity: number;
  onQuantityChange: (itemId: string, newQuantity: number) => void;
  onRemove: (itemId: string) => void;
  onLinkClick?: () => void;
}

export function CartItem({
  item,
  totalQuantity,
  onQuantityChange,
  onRemove,
  onLinkClick,
}: CartItemProps) {
  return (
    <div className="flex gap-4 py-4 border-b last:border-b-0">
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
        <div className="flex justify-between items-start gap-2">
          <Link
            href={`/products/${slugifyProduct(item)}`}
            onClick={onLinkClick}
            className="font-medium line-clamp-2 hover:text-secondary"
          >
            {item.name}
          </Link>
          <Button
            variant="ghost"
            size="icon"
            className="mt-1"
            onClick={() => onRemove(item.id)}
            aria-label="Remove item"
          >
            <Trash2 className="size-6" />
          </Button>
        </div>
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center">
            <Button
              variant="outline"
              size="icon"
              className="size-8 rounded-r-none"
              onClick={() => onQuantityChange(item.id, item.quantity - 1)}
              aria-label="Decrease quantity"
            >
              <Minus className="size-4" />
            </Button>
            <span className="flex items-center justify-center text-sm font-medium h-8 w-10 text-center border border-input border-x-0">
              {item.quantity}
            </span>
            <Button
              variant="outline"
              size="icon"
              className="size-8 rounded-l-none"
              onClick={() => onQuantityChange(item.id, item.quantity + 1)}
              disabled={totalQuantity >= 99}
              aria-label="Increase quantity"
            >
              <Plus className="size-4" />
            </Button>
          </div>
          <p className="font-semibold text-lg">
            &euro;{(item.price * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>
    </div>
  );
}
