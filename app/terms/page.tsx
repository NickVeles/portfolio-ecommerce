import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms and Precautions",
  description:
    "Important information about Velbuy. This is a portfolio demonstration website with test payment mode. No actual products are sold or shipped. All transactions are for demonstration purposes only.",
  openGraph: {
    title: "Terms and Precautions - Velbuy",
    description:
      "Portfolio demonstration website with test payment mode. No actual transactions or product shipments.",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function Terms() {
  return (
    <div className="container mx-auto py-16">
      <Card className="max-w-2xl mx-auto">
        <CardContent className="space-y-8 pt-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Terms and Precautions</h1>
            <p className="text-lg text-muted-foreground">
              Please read the following important information before using this
              website.
            </p>
          </div>

          <div className="border-t pt-8">
            <ol className="space-y-6 list-decimal list-inside">
              <li className="text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Portfolio Project Only
                </span>
                <p className="ml-6 mt-2">
                  This is a portfolio demonstration website and is NOT a real
                  online store. No actual products are sold or shipped through
                  this platform.
                </p>
              </li>

              <li className="text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Test Payment Mode
                </span>
                <p className="ml-6 mt-2">
                  All payment processing is done in Stripe test mode. While the
                  checkout process is functional, no real transactions occur and
                  no charges will be made to your account.
                </p>
              </li>

              <li className="text-muted-foreground">
                <span className="font-semibold text-foreground">
                  No Personal Data Storage
                </span>
                <p className="ml-6 mt-2">
                  This website does not permanently store any personal
                  information, payment details, or order data. All information
                  is processed temporarily for demonstration purposes only.
                </p>
              </li>

              <li className="text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Educational Purpose
                </span>
                <p className="ml-6 mt-2">
                  This project was created to showcase web development skills
                  and demonstrate e-commerce functionality. It is intended for
                  educational and portfolio purposes only.
                </p>
              </li>

              <li className="text-muted-foreground">
                <span className="font-semibold text-foreground">
                  No Guarantees or Warranties
                </span>
                <p className="ml-6 mt-2">
                  This website is provided "as is" without any guarantees or
                  warranties. Use at your own discretion for demonstration and
                  testing purposes.
                </p>
              </li>

              <li className="text-muted-foreground">
                <span className="font-semibold text-foreground">
                  Source Code Availability
                </span>
                <p className="ml-6 mt-2">
                  The complete source code for this project is available on{" "}
                  <Link
                    href="https://github.com/NickVeles/portfolio-ecommerce"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-primary hover:text-secondary transition-colors underline"
                  >
                    GitHub
                  </Link>{" "}
                  for review and educational purposes.
                </p>
              </li>
            </ol>
          </div>

          <div className="border-t pt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              By using this website, you acknowledge that you have read and
              understood these precautions.
            </p>
            <Link
              href="/"
              className="text-primary hover:text-secondary transition-colors underline"
            >
              Return to Home
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
