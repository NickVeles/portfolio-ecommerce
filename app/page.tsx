import { Button } from "@/components/ui/button";
import Link from "next/link";
import { Suspense } from "react";
import RecentProducts from "@/components/RecentProducts";
import { Spinner } from "@/components/ui/spinner";
import { Skeleton } from "@/components/ui/skeleton";

export default function Home() {
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
        <h2 className="text-2xl font-bold mb-6 text-center">
          Recent Additions
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <Suspense
            fallback={
              <>
                {Array.from({ length: 4 }).map((_, index) => (
                  <Skeleton
                    key={index}
                    className="min-w-full min-h-105.5 rounded-xl opacity-50 flex justify-center items-center"
                  >
                    <Spinner className="size-8" />
                  </Skeleton>
                ))}
              </>
            }
          >
            <RecentProducts />
          </Suspense>
        </div>
        <div className="flex justify-center">
          <Button asChild>
            <Link href="/products">Browse All</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
