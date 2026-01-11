import ProductDetail from "@/components/ProductDetail";
import { stripe } from "@/lib/stripe";
import type { Metadata } from "next";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const id = `prod_${slug.split("-").at(-1)}`;

  try {
    const product = await stripe.products.retrieve(id, {
      expand: ["default_price"],
    });

    return {
      title: product.name,
      description:
        product.description || `Shop ${product.name} at Velbuy. High-quality products at competitive prices.`,
      openGraph: {
        title: product.name,
        description: product.description || `Shop ${product.name} at Velbuy`,
        images: product.images.map((img) => ({
          url: img,
          width: 800,
          height: 800,
          alt: product.name,
        })),
        type: "website",
      },
      twitter: {
        card: "summary_large_image",
        title: product.name,
        description: product.description || `Shop ${product.name} at Velbuy`,
        images: product.images,
      },
    };
  } catch {
    return {
      title: "Product Not Found",
      description: "The requested product could not be found.",
    };
  }
}

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

  return (
    <div className="max-w-7xl mx-auto">
      <ProductDetail product={product} />
    </div>
  );
}
