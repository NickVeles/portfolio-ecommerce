import Stripe from "stripe";
import QuantitySelector from "./QuantitySelector";
import ZoomableImage from "./ZoomableImage";

interface ProductDetailProps {
  product: Stripe.Product;
}

function ProductDetail({ product }: ProductDetailProps) {
  const price = product.default_price as Stripe.Price;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
      {/* Product Image */}
      {product.images && product.images[0] && (
        <ZoomableImage src={product.images[0]} alt={product.name} />
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
        <QuantitySelector />
      </div>
    </div>
  );
}

export default ProductDetail;
