import Link from "next/link";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
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
      <Card className="max-w-3xl mx-auto">
        <CardContent className="space-y-8 pt-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">Terms and Precautions</h1>
            <p className="text-lg text-muted-foreground">
              Please read the following important information before using this
              website.
            </p>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold mb-6 text-center">
              Important Notices
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Portfolio Project Only</h3>
                <p className="text-sm text-muted-foreground">
                  This is a portfolio demonstration website and is NOT a real
                  online store. No actual products are sold or shipped through
                  this platform.
                </p>
              </div>
              <div className="p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Test Payment Mode</h3>
                <p className="text-sm text-muted-foreground">
                  All payment processing is done in Stripe test mode. No real
                  transactions occur and no charges will be made to your
                  account.
                </p>
              </div>
              <div className="p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Educational Purpose</h3>
                <p className="text-sm text-muted-foreground">
                  This project was created to showcase web development skills
                  and demonstrate e-commerce functionality for portfolio
                  purposes.
                </p>
              </div>
              <div className="p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">No Warranties</h3>
                <p className="text-sm text-muted-foreground">
                  This website is provided &quot;as is&quot; without any
                  guarantees or warranties. Use at your own discretion for
                  demonstration purposes.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold mb-6 text-center">
              Data Handling
            </h2>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Authentication Data</h3>
                <p className="text-sm text-muted-foreground">
                  User authentication is handled by Clerk. Your account
                  information (email, name) is stored securely and synchronized
                  with our PostgreSQL database via webhooks for order history
                  and cart persistence.
                </p>
              </div>
              <div className="p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Payment Information</h3>
                <p className="text-sm text-muted-foreground">
                  Payment details are processed entirely by Stripe in test mode.
                  We never store credit card information. Only order records and
                  Stripe session IDs are saved for demonstration of order
                  tracking.
                </p>
              </div>
              <div className="p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Order &amp; Cart Data</h3>
                <p className="text-sm text-muted-foreground">
                  Your cart and order history are stored in a PostgreSQL
                  database linked to your account. This data is retained to
                  demonstrate full e-commerce functionality including order
                  management.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold mb-6 text-center">
              Third-Party Services
            </h2>
            <div className="flex flex-wrap justify-center gap-2 mb-4">
              {[
                { name: "Clerk", desc: "Authentication" },
                { name: "Stripe", desc: "Payments" },
                { name: "Vercel", desc: "Hosting" },
              ].map((service) => (
                <Badge key={service.name} variant="default">
                  {service.name} ({service.desc})
                </Badge>
              ))}
            </div>
            <p className="text-sm text-muted-foreground text-center">
              This website integrates with third-party services that have their
              own privacy policies and terms of service.
            </p>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold mb-6 text-center">
              Source Code
            </h2>
            <p className="text-sm text-muted-foreground text-center">
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
          </div>

          <div className="border-t pt-8 text-center">
            <p className="text-sm text-muted-foreground mb-4">
              By using this website, you acknowledge that you have read and
              understood these terms.
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
