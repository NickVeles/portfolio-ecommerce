import Link from "next/link";
import { Logo } from "./Icons";
import { ShoppingCart } from "lucide-react";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-white shadow flex justify-center">
      <div className="container flex items-center py-4 px-8">
        {/* For some reason, using flex-1 instead of mr-auto inherits child's cursor behavior
        - e.g. clicking outside the logo still triggers the Link */}
        <div className="mr-auto">
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
            <ShoppingCart
              className="size-6 text-gray-700 hover:text-secondary"
              aria-label="Cart"
            />
          </Link>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
