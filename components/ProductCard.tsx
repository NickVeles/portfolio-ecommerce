import { slugifyProduct } from "@/lib/utils";
import Link from "next/link";
import Stripe from "stripe";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import Image from "next/image";

interface ProductCardProps {
  product: Stripe.Product;
}

function ProductCard({ product }: ProductCardProps) {
  const slug = slugifyProduct(product);
  const price = product.default_price as Stripe.Price | undefined;

  return (
    <Link href={`/products/${slug}`} className="group h-full" title={product.name}>
      <Card className="overflow-hidden transition-shadow hover:shadow-lg pt-0 h-full flex flex-col">
        {product.images && product.images[0] && (
          <div className="relative w-full h-64">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
            />
          </div>
        )}
        <CardHeader className="grow">
          <CardTitle className="text-lg group-hover:text-primary transition-colors line-clamp-2">
            {product.name}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {price?.unit_amount ? (
            <p className="text-xl font-semibold text-foreground">
              &euro;{`${(price.unit_amount / 100).toFixed(2)}`}
            </p>
          ) : (
            <p className="text-muted-foreground">N/A</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export default ProductCard;
