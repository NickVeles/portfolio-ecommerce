import { NextRequest, NextResponse } from "next/server";
import { auth } from "@clerk/nextjs/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Find user by clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: {
        cart: {
          include: {
            items: true,
          },
        },
      },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Transform DB cart items to client format
    const items =
      user.cart?.items.map((item) => ({
        id: item.stripeProductId,
        name: item.productName,
        price: item.priceInCents / 100, // Convert cents to dollars
        imageUrl: item.imageUrl,
        quantity: item.quantity,
      })) ?? [];

    return NextResponse.json({ items });
  } catch (error) {
    console.error("Error fetching cart:", error);
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 }
    );
  }
}

interface CartItemInput {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

export async function POST(request: NextRequest) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const { items } = body as { items: CartItemInput[] };

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    // Find user by clerkId
    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Upsert cart and replace all items
    await prisma.$transaction(async (tx) => {
      // Get or create cart
      let cart = await tx.cart.findUnique({
        where: { userId: user.id },
      });

      if (!cart) {
        cart = await tx.cart.create({
          data: { userId: user.id },
        });
      }

      // Delete all existing cart items
      await tx.cartItem.deleteMany({
        where: { cartId: cart.id },
      });

      // Create new cart items if there are any
      if (items.length > 0) {
        await tx.cartItem.createMany({
          data: items.map((item) => ({
            cartId: cart.id,
            stripeProductId: item.id,
            productName: item.name,
            priceInCents: Math.round(item.price * 100), // Convert to cents
            imageUrl: item.imageUrl,
            quantity: item.quantity,
          })),
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving cart:", error);
    return NextResponse.json(
      { error: "Failed to save cart" },
      { status: 500 }
    );
  }
}
