import Carousel from "@/components/Carousel";
import { Button } from "@/components/ui/button";
import { stripe } from "@/lib/stripe";
import Link from "next/link";

export default async function Home() {
  const products = await stripe.products.list({
    expand: ["data.default_price"],
    limit: 5,
  });

  return (
    <div>
      <section
        className="rounded py-8 sm:py-12 lg:py-24 bg-cover bg-center bg-no-repeat relative"
        style={{ backgroundImage: "url('/banner.jpg')" }}
      >
        <div className="absolute inset-0 bg-black/50 rounded"></div>
        <div className="flex items-center justify-around gap-8 px-8 sm:px-18 flex-wrap relative z-10">
          <div className="max-w-md space-y-4">
            <h2 className="text-3xl font-bold tracking-tight md:text-4xl text-white">
              Welcome to Velbuy
            </h2>
            <p className="text-white">
              Discover the best apparels and accessories at the best prices!
            </p>

            <Button
              asChild
              variant="secondary"
              className="inline-flex items-center justify-center rounded-lg px-6 py-3"
            >
              <Link
                href="/products"
                className="inline-flex items-center justify-center rounded-full px-6 py-3"
              >
                Browse All Products
              </Link>
            </Button>
          </div>
        </div>
      </section>
      <section className="py-8">
        <Carousel products={products.data} />
      </section>
    </div>
  );
}
