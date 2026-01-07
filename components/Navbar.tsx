import Link from "next/link";
import React from "react";
import { Logo } from "./Icons";
import { ShoppingCart } from "lucide-react";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow flex items-center justify-between">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link href="/" className="text-primary hover:text-blue-600">
          <Logo className="size-8" aria-label="VelBuy Logo" />
        </Link>
      </div>
      <div className="hidden md:flex space-x-6">
        <Link href="/" className="hover:text-blue-600">
          Home
        </Link>
        <Link href="/products" className="hover:text-blue-600">
          Products
        </Link>
        <Link href="/checkout" className="hover:text-blue-600">
          Checkout
        </Link>
      </div>
      <div className="px-6">
        <Link href="/cart">
          <ShoppingCart className="size-6 text-gray-700 hover:text-blue-600" aria-label="Cart"/>
        </Link>
      </div>
    </nav>
  );
}

export default Navbar;
