import Link from "next/link";
import { Link as LinkIcon } from "lucide-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faGithub, faLinkedin } from "@fortawesome/free-brands-svg-icons";
import { Card, CardContent } from "@/components/ui/card";
import type { Metadata } from "next";
import { Badge } from "@/components/ui/badge";

export const metadata: Metadata = {
  title: "About",
  description:
    "Learn about Velbuy - a portfolio e-commerce project built with Next.js, Stripe, Clerk, PostgreSQL, and TypeScript. Features webhooks, authentication, and order management.",
  openGraph: {
    title: "About Velbuy - Portfolio E-commerce Project",
    description:
      "A full-stack e-commerce website featuring Stripe payments, Clerk authentication, PostgreSQL database, webhooks, and modern React with Next.js.",
  },
};

export default function About() {
  return (
    <div className="container mx-auto py-16">
      <Card className="max-w-3xl mx-auto">
        <CardContent className="space-y-8 pt-6">
          <div className="text-center space-y-4">
            <h1 className="text-3xl font-bold">About This Project</h1>
            <p className="text-lg text-muted-foreground">
              This is a portfolio e-commerce website built with modern web
              technologies, featuring a fully functional shopping cart, secure
              payment processing, user authentication, and a complete order
              management system.
            </p>
            <p className="text-muted-foreground">
              <Link
                href="https://github.com/NickVeles/portfolio-ecommerce"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-secondary transition-colors underline underline-offset-2"
              >
                View the source code on GitHub
              </Link>
            </p>
            <p>
              If you want to test payments on this website, you may use any of
              Stripe&apos;s{" "}
              <Link
                href="https://docs.stripe.com/testing#cards"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary hover:text-secondary transition-colors underline underline-offset-2"
              >
                test cards
              </Link>
              .
            </p>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold mb-6 text-center">
              Key Features
            </h2>
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Authentication</h3>
                <p className="text-sm text-muted-foreground">
                  Secure user authentication powered by Clerk with
                  email/password and Google OAuth support.
                </p>
              </div>
              <div className="p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Payment Processing</h3>
                <p className="text-sm text-muted-foreground">
                  Stripe integration for secure checkout with webhook-based
                  order confirmation.
                </p>
              </div>
              <div className="p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">PostgreSQL Database</h3>
                <p className="text-sm text-muted-foreground">
                  Prisma ORM with PostgreSQL for persistent storage of users,
                  carts, and orders.
                </p>
              </div>
              <div className="p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Webhooks</h3>
                <p className="text-sm text-muted-foreground">
                  Real-time event handling with Stripe and Clerk webhooks for
                  payment and user sync.
                </p>
              </div>
              <div className="p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Order Management</h3>
                <p className="text-sm text-muted-foreground">
                  Complete order history with status tracking and detailed order
                  views in user dashboard.
                </p>
              </div>
              <div className="p-4 rounded-lg border">
                <h3 className="font-semibold mb-2">Cart Persistence</h3>
                <p className="text-sm text-muted-foreground">
                  Zustand state management with server sync and smart cart
                  merging on login.
                </p>
              </div>
            </div>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold mb-6 text-center">
              Tech Stack
            </h2>
            <div className="flex flex-wrap justify-center gap-2">
              {[
                "Next.js 16",
                "React 19",
                "TypeScript",
                "Tailwind CSS",
                "Prisma",
                "PostgreSQL",
                "Stripe",
                "Clerk",
                "Zustand",
                "TanStack Query",
                "shadcn/ui",
                "Radix UI",
              ].map((tech) => (
                <Badge
                  key={tech}
                  variant="default"
                >
                  {tech}
                </Badge>
              ))}
            </div>
          </div>

          <div className="border-t pt-8">
            <h2 className="text-xl font-semibold mb-4 text-center">
              Connect With Me
            </h2>
            <div className="flex flex-col gap-4">
              <Link
                href="https://nickveles.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-4 rounded-lg border transition-colors"
              >
                <LinkIcon className="size-6 text-primary group-hover:text-secondary transition-colors" />
                <span className="text-lg text-primary group-hover:text-secondary transition-colors">
                  nickveles.com
                </span>
              </Link>

              <Link
                href="https://github.com/NickVeles/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-4 rounded-lg border transition-colors"
              >
                <FontAwesomeIcon
                  icon={faGithub}
                  className="size-6 text-primary group-hover:text-secondary transition-colors"
                />
                <span className="text-lg text-primary group-hover:text-secondary transition-colors">
                  GitHub
                </span>
              </Link>

              <Link
                href="https://www.linkedin.com/in/nickveles/"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center gap-3 p-4 rounded-lg border transition-colors"
              >
                <FontAwesomeIcon
                  icon={faLinkedin}
                  className="size-6 text-primary group-hover:text-secondary transition-colors"
                />
                <span className="text-lg text-primary group-hover:text-secondary transition-colors">
                  LinkedIn
                </span>
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
