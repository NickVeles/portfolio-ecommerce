import Link from "next/link";
import React from "react";
import { Logo } from "./Icons";
import { ShoppingCart } from "lucide-react";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow flex items-center">
      <div className="p-4 flex-1">
        <Link href="/" className="text-primary hover:text-secondary">
          <Logo className="size-8" aria-label="VelBuy Logo" />
        </Link>
      </div>
      <div className="hidden md:flex space-x-6">
        <Link href="/" className="hover:text-secondary">
          Home
        </Link>
        <Link href="/products" className="hover:text-secondary">
          Products
        </Link>
        <Link href="/checkout" className="hover:text-secondary">
          Checkout
        </Link>
      </div>
      <div className="px-6">
        <Link href="/cart">
          <ShoppingCart className="size-6 text-gray-700 hover:text-secondary" aria-label="Cart"/>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
