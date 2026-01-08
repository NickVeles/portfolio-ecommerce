import React from "react";
import { Stripe } from "stripe";
import ProductCard from "./ProductCard";

interface ProductListProps {
  products: Stripe.Product[];
}

function ProductList({ products }: ProductListProps) {
  return (
    <div className="space-y-6">
      <div className="flex items-center">
        <input
          type="text"
          placeholder="Search products..."
          className="w-full max-w-md px-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((product) => (
          <li key={product.id}>
            <ProductCard product={product} />
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ProductList;
