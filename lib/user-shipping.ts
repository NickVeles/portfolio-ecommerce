"use server";

import { auth } from "@clerk/nextjs/server";
import { prisma } from "./prisma";

export interface ShippingInfo {
  firstName: string | null;
  lastName: string | null;
  email: string | null;
  phone: string | null;
  address: string | null;
  city: string | null;
  state: string | null;
  postalCode: string | null;
  country: string | null;
}

export async function getUserShippingInfo(): Promise<ShippingInfo | null> {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return null;
  }

  const user = await prisma.user.findUnique({
    where: { clerkId },
    select: {
      firstName: true,
      lastName: true,
      email: true,
      phone: true,
      address: true,
      city: true,
      state: true,
      postalCode: true,
      country: true,
    },
  });

  return user;
}

export async function saveUserShippingInfo(
  shippingInfo: Omit<ShippingInfo, "email">
): Promise<{ success: boolean; error?: string }> {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.user.update({
      where: { clerkId },
      data: {
        firstName: shippingInfo.firstName,
        lastName: shippingInfo.lastName,
        phone: shippingInfo.phone,
        address: shippingInfo.address,
        city: shippingInfo.city,
        state: shippingInfo.state,
        postalCode: shippingInfo.postalCode,
        country: shippingInfo.country,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error saving shipping info:", error);
    return { success: false, error: "Failed to save shipping information" };
  }
}

export async function deleteUserShippingInfo(): Promise<{
  success: boolean;
  error?: string;
}> {
  const { userId: clerkId } = await auth();

  if (!clerkId) {
    return { success: false, error: "Unauthorized" };
  }

  try {
    await prisma.user.update({
      where: { clerkId },
      data: {
        firstName: null,
        lastName: null,
        phone: null,
        address: null,
        city: null,
        state: null,
        postalCode: null,
        country: null,
      },
    });

    return { success: true };
  } catch (error) {
    console.error("Error deleting shipping info:", error);
    return { success: false, error: "Failed to delete shipping information" };
  }
}
