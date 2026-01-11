import Link from "next/link";
import { Logo } from "./Icons";
import { CartIcon } from "./CartIcon";
import { TriangleAlert } from "lucide-react";

function Navbar() {
  return (
    <div className="sticky top-0 z-50 w-full">
      <div className="bg-destructive text-destructive-foreground text-center py-2 px-4 text-sm font-semibold flex items-center justify-center gap-2">
        <TriangleAlert className="min-w-5 min-h-5" /> <span className="inline"><span className="underline">Portfolio Project Only</span> - Do Not Use Real Payment Information or Personal Credentials</span>
      </div>
      <nav className="bg-card shadow flex justify-center">
        <div className="container flex items-center py-4 px-6 sm:px-8">
          {/* For some reason, using flex-1 instead of mr-auto inherits child's cursor behavior
        - e.g. clicking outside the logo still triggers the Link */}
          <div className="mr-auto">
            <Link href="/" className="flex items-center gap-2 group">
              <Logo className="size-8 text-primary group-hover:text-secondary" aria-label="Velbuy Logo" />
              <span className="hidden sm:inline text-xl font-bold text-primary-foreground group-hover:text-secondary">Velbuy</span>
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
    </div>
  );
}

export default Navbar;
