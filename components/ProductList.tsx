import React from "react";
import { Stripe } from "stripe";
import ProductCard from "./ProductCard";

interface ProductListProps {
  products: Stripe.Product[];
}

function ProductList({ products }: ProductListProps) {
  return (
    <div>
      <div>
        <input type="text" placeholder="Search products..." />
      </div>

      <ul>
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
