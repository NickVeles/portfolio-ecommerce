import { CartItem } from "@/store/cart-store";
import { clsx, type ClassValue } from "clsx"
import Stripe from "stripe";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function slugifyProduct(product: Stripe.Product | CartItem) {
  const name = product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-");
  const id = product.id.split("_")[1];
  return `${name}-${id}`;
}