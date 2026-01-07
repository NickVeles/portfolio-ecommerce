import Carousel from "@/components/Carousel";
import { Button } from "@/components/ui/button";
import { stripe } from "@/lib/stripe";
import Image from "next/image";
import Link from "next/link";

export default async function Home() {
  const products = await stripe.products.list({
    expand: ["data.default_price"],
    limit: 5,
  });

  return (
    <div>
      <section className="rounded bg-accent py-8 sm:py-12">
        <div className="mx-auto grid grid-cols-1 items-center justify-items-center gap-8 px-8 sm:px-18 md:grid-cols-2">
          <div className="max-w-md space-y-4">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl">
              Welcome to VelBuy
            </h2>
            <p className="text-muted-foreground">
              Discover the best apparels and accessories at the best prices!
            </p>

            <Button
              asChild
              value="default"
              className="inline-flex items-center justify-center rounded-full px-6 py-3 bg-black text-white"
            >
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full px-6 py-3"
              >
                Browse All Products
              </Link>
            </Button>
          </div>
          <Image
            src={products.data[0].images[0]}
            alt="Hero Image"
            width={450}
            height={450}
            className="rounded max-h-64 w-auto"
          />
        </div>
      </section>
      <section className="py-8">
        <Carousel products={products.data} />
      </section>
    </div>
  );
}
