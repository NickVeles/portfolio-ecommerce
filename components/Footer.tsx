import Link from "next/link";
import { Logo } from "./Icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faInstagram,
  faFacebook,
  faYoutube,
  faTiktok,
  faXTwitter,
} from "@fortawesome/free-brands-svg-icons";

export default function Footer() {
  return (
    <footer className="bg-card border-t mt-auto">
      <div className="container mx-auto px-6 py-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Logo Section */}
          <div className="flex flex-col items-center md:items-start">
            <Link href="/" className="flex items-center gap-2 group">
              <Logo
                className="size-8 text-primary group-hover:text-secondary transition-colors"
                aria-label="Velbuy Logo"
              />
              <span className="text-xl font-bold text-primary-foreground group-hover:text-secondary transition-colors">
                Velbuy
              </span>
            </Link>
          </div>

          {/* Navigation Links */}
          <div className="flex flex-col items-center">
            <h3 className="font-semibold mb-4 text-foreground">Navigation</h3>
            <nav className="flex flex-wrap gap-4 justify-center *:text-muted-foreground *:hover:text-secondary *:transition-colors">
              <Link
                href="/"
              >
                Home
              </Link>
              <Link
                href="/products"
              >
                Products
              </Link>
              <Link
                href="/cart"
              >
                Cart
              </Link>
              <Link
                href="/about"
              >
                About
              </Link>
              <Link
                href="/terms"
              >
                Terms
              </Link>
            </nav>
          </div>

          {/* Social Links */}
          <div className="flex flex-col items-center md:items-end">
            <h3 className="font-semibold mb-4 text-foreground">Follow Us</h3>
            <div className="flex gap-4 *:text-primary *:hover:text-secondary *:transition-colors **:size-6">
              <Link
                href="https://nickveles.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </Link>
              <Link
                href="https://nickveles.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Facebook"
              >
                <FontAwesomeIcon icon={faFacebook} />
              </Link>
              <Link
                href="https://nickveles.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="YouTube"
              >
                <FontAwesomeIcon icon={faYoutube} />
              </Link>
              <Link
                href="https://nickveles.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="TikTok"
              >
                <FontAwesomeIcon icon={faTiktok} />
              </Link>
              <Link
                href="https://nickveles.com/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X (Twitter)"
              >
                <FontAwesomeIcon icon={faXTwitter} />
              </Link>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="border-t mt-8 pt-6 text-center text-sm text-muted-foreground">
          <p>
            © {new Date().getFullYear()} Velbuy. Portfolio project by Nick
            Veles.
          </p>
        </div>
      </div>
    </footer>
  );
}
