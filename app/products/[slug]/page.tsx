import ProductDetail from "@/components/ProductDetail";
import { stripe } from "@/lib/stripe";

export default async function Product({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const id = `prod_${slug.split("-").at(-1)}`;
  const product = await stripe.products.retrieve(id, {
    expand: ["default_price"],
  });
  return <ProductDetail product={product} />;
}
