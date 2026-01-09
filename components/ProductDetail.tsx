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
    <div>
      {product.images && product.images[0] && (
        <div className="relative h-60 w-full">
          <Image
            src={product.images[0]}
            alt={product.name}
            fill
            className="object-cover"
          />
        </div>
      )}

      <div>
        <h1>{product.name}</h1>
        {product.description && <p>{product.description}</p>}
        {price?.unit_amount ? (
          <p>&euro;{`${(price.unit_amount / 100).toFixed(2)}`}</p>
        ) : (
          <p>N/A</p>
        )}
      </div>

      <div>
        <div className="flex">
          <Button variant="outline"><Minus className="size-4" /></Button>
          <Input type="number" value="1" readOnly className="w-12 text-center mx-2" max={99} min={1} />
          <Button variant="outline"><Plus className="size-4" /></Button>
        </div>
        <Button>Add to Cart</Button>
      </div>
    </div>
  );
}

export default ProductDetail;
