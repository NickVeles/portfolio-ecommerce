import ProductList from "@/components/ProductList";
import { stripe } from "@/lib/stripe";
import React from "react";

export default async function Products() {
  const products = await stripe.products.list({
    expand: ["data.default_price"],
    limit: 12,
  });
  return (
    <div className="space-y-8">
      <div className="space-y-2">
        <h1 className="text-3xl font-bold tracking-tight md:text-4xl">All Products</h1>
        <p className="text-muted-foreground">Browse our complete collection of products</p>
      </div>
      <ProductList products={products.data} />
    </div>
  );
}
