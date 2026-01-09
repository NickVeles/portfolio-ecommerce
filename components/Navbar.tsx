import Link from "next/link";
import { Logo } from "./Icons";
import { CartIcon } from "./CartIcon";

function Navbar() {
  return (
    <nav className="sticky top-0 z-50 bg-card shadow flex justify-center">
      <div className="container flex items-center py-4 px-6 sm:px-8">
        {/* For some reason, using flex-1 instead of mr-auto inherits child's cursor behavior
        - e.g. clicking outside the logo still triggers the Link */}
        <div className="mr-auto">
          <Link href="/" className="text-primary hover:text-secondary">
            <Logo className="size-8" aria-label="Velbuy Logo" />
          </Link>
        </div>
        <div className="flex space-x-6">
          <Link href="/" className="hover:text-secondary">
            Home
          </Link>
          <Link href="/products" className="hover:text-secondary">
            Products
          </Link>
        </div>
        <div className="ml-6">
          <CartIcon />
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
