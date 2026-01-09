import Image from "next/image";
import Stripe from "stripe";
import { Button } from "./ui/button";
import { Minus, Plus } from "lucide-react";
import { Input } from "./ui/input";

interface ProductDetailProps {
  product: Stripe.Product;
}

function ProductDetail({ product }: ProductDetailProps) {
  const price = product.default_price as Stripe.Price;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Product Image */}
      {product.images && product.images[0] && (
        <div className="relative h-64 sm:h-96 lg:h-[500px] w-full rounded-lg overflow-hidden bg-card">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="hover:object-cover object-contain"
            priority
          />
        </div>
      )}

      {/* Product Details */}
      <div className="flex flex-col gap-6">
        <div className="space-y-4">
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {product.name}
          </h1>

          {product.description && (
            <p className="text-muted-foreground text-base sm:text-lg leading-relaxed">
              {product.description}
            </p>
          )}

          {price?.unit_amount ? (
            <p className="text-3xl sm:text-4xl font-bold text-foreground">
              &euro;{`${(price.unit_amount / 100).toFixed(2)}`}
            </p>
          ) : (
            <p className="text-2xl text-muted-foreground">N/A</p>
          )}
        </div>

        {/* Quantity Selector and Add to Cart */}
        <div className="space-y-4 pt-4">
          <div className="flex flex-col sm:flex-row items-center gap-3">
            <div className="flex items-center  flex-nowrap w-2/3 sm:w-auto">
              <Button
                variant="outline"
                size="icon"
                className="size-10 rounded-r-none"
                aria-label="Decrease quantity"
              >
                <Minus className="size-4" />
              </Button>
              <Input
                type="number"
                value="1"
                readOnly
                className="text-center h-10 rounded-none border-x-0"
                min={1}
                max={99}
              />
              <Button
                variant="outline"
                size="icon"
                className="size-10 rounded-l-none"
                aria-label="Increase quantity"
              >
                <Plus className="size-4" />
              </Button>
            </div>

          <Button
            className="h-10 text-base font-semibold px-10 w-2/3 sm:w-auto"
          >
            Add to Cart
          </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
