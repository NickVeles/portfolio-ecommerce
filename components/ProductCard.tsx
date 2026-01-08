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
    <Link href={`/products/${slug}`}>
      <Card>
        {product.images && product.images[0] && (
          <div className="relative w-full">
            <Image
              src={product.images[0]}
              alt={product.name}
              fill
              className="object-cover transition-opacity duration-500 ease-in-out"
            />
          </div>
        )}
        <CardHeader>
          <CardTitle>{product.name}</CardTitle>
        </CardHeader>
        <CardContent>
          {price?.unit_amount ? (
            <p>&euro;{`${(price.unit_amount / 100).toFixed(2)}`}</p>
          ) : (
            <p>N/A</p>
          )}
        </CardContent>
      </Card>
    </Link>
  );
}

export default ProductCard;
