import { auth } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export interface CartItemResponse {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

// GET /api/cart - Get the user's cart from the database
export async function GET() {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

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

    // Transform DB items to client format
    const items: CartItemResponse[] =
      user.cart?.items.map((item) => ({
        id: item.stripeProductId,
        name: item.productName,
        price: item.priceInCents / 100, // Convert cents to euros
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

// POST /api/cart - Save items to the user's cart in the database
export async function POST(request: Request) {
  try {
    const { userId: clerkId } = await auth();

    if (!clerkId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const body = await request.json();
    const items: CartItemResponse[] = body.items;

    if (!Array.isArray(items)) {
      return NextResponse.json(
        { error: "Invalid request body" },
        { status: 400 }
      );
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
      include: { cart: true },
    });

    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    if (!user.cart) {
      return NextResponse.json({ error: "Cart not found" }, { status: 404 });
    }

    // Use a transaction to atomically update the cart
    await prisma.$transaction(async (tx) => {
      // Delete all existing items
      await tx.cartItem.deleteMany({
        where: { cartId: user.cart!.id },
      });

      // Create new items if there are any
      if (items.length > 0) {
        await tx.cartItem.createMany({
          data: items.map((item) => ({
            cartId: user.cart!.id,
            stripeProductId: item.id,
            productName: item.name,
            priceInCents: Math.round(item.price * 100), // Convert euros to cents
            imageUrl: item.imageUrl,
            quantity: item.quantity,
          })),
        });
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error saving cart:", error);
    return NextResponse.json({ error: "Failed to save cart" }, { status: 500 });
  }
}
