"use client";

import { useCartStore } from "@/store/cart-store";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import Image from "next/image";
import Link from "next/link";
import { slugifyProduct } from "@/lib/utils";
import processCheckout from "@/lib/process-checkout";
import { useEffect, useState } from "react";
import { redirect } from "next/navigation";
import { useUser } from "@clerk/nextjs";
import {
  ShippingInfo,
  saveUserShippingInfo,
  deleteUserShippingInfo,
} from "@/lib/user-shipping";
import { COMMON_REDIRECT } from "@/lib/constants";

interface CheckoutClientProps {
  savedShippingInfo: ShippingInfo | null;
}

export default function CheckoutClient({ savedShippingInfo }: CheckoutClientProps) {
  const [mounted, setMounted] = useState(false);
  const [saveShipping, setSaveShipping] = useState(true);
  const { isSignedIn } = useUser();
  const { items, getTotalPrice } = useCartStore();
  const totalPrice = getTotalPrice();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (totalPrice === 0 || items.length === 0) {
    redirect(COMMON_REDIRECT);
  }

  if (!mounted) {
    return null;
  }

  const hasSavedShippingInfo =
    savedShippingInfo?.firstName ||
    savedShippingInfo?.address ||
    savedShippingInfo?.city;

  async function handleSubmit(formData: FormData) {
    if (isSignedIn) {
      if (saveShipping) {
        await saveUserShippingInfo({
          firstName: formData.get("firstName") as string,
          lastName: formData.get("lastName") as string,
          phone: formData.get("phone") as string,
          address: formData.get("address") as string,
          city: formData.get("city") as string,
          state: formData.get("state") as string,
          postalCode: formData.get("postalCode") as string,
          country: formData.get("country") as string,
        });
      } else if (hasSavedShippingInfo) {
        await deleteUserShippingInfo();
      }
    }
    await processCheckout(formData);
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* User Info Form */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Shipping Information</h2>
          <form action={handleSubmit} className="space-y-4">
            <input type="hidden" name="items" value={JSON.stringify(items)} />

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  name="firstName"
                  placeholder="John"
                  defaultValue={savedShippingInfo?.firstName ?? ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  name="lastName"
                  placeholder="Doe"
                  defaultValue={savedShippingInfo?.lastName ?? ""}
                  required
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                name="email"
                type="email"
                placeholder="john.doe@example.com"
                defaultValue={savedShippingInfo?.email ?? ""}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                name="phone"
                type="tel"
                placeholder="+1 (555) 000-0000"
                defaultValue={savedShippingInfo?.phone ?? ""}
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="address">Street Address</Label>
              <Input
                id="address"
                name="address"
                placeholder="123 Main St"
                defaultValue={savedShippingInfo?.address ?? ""}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  placeholder="New York"
                  defaultValue={savedShippingInfo?.city ?? ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="state">State/Province</Label>
                <Input
                  id="state"
                  name="state"
                  placeholder="NY"
                  defaultValue={savedShippingInfo?.state ?? ""}
                  required
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="postalCode">Postal Code</Label>
                <Input
                  id="postalCode"
                  name="postalCode"
                  placeholder="10001"
                  defaultValue={savedShippingInfo?.postalCode ?? ""}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  placeholder="United States"
                  defaultValue={savedShippingInfo?.country ?? ""}
                  required
                />
              </div>
            </div>

            {isSignedIn && (
              <div className="flex items-center space-x-2">
                <Checkbox
                  id="saveShipping"
                  checked={saveShipping}
                  onCheckedChange={(checked) => setSaveShipping(checked === true)}
                />
                <Label htmlFor="saveShipping" className="text-sm font-normal cursor-pointer">
                  Save shipping information for future orders
                </Label>
              </div>
            )}

            <Button type="submit" className="w-full" size="lg">
              Proceed to Payment
            </Button>
          </form>
        </div>

        {/* Order Summary */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
          <div className="border rounded-lg p-4">
            <div className="space-y-4 mb-4">
              {items.map((item) => (
                <div key={item.id} className="flex gap-4 py-4 border-b last:border-b-0">
                  {item.imageUrl && (
                    <div className="relative size-20 rounded-md overflow-hidden bg-muted shrink-0">
                      <Image
                        src={item.imageUrl}
                        alt={item.name}
                        fill
                        className="object-cover"
                      />
                    </div>
                  )}
                  <div className="flex-1 flex flex-col gap-2">
                    <Link
                      href={`/products/${slugifyProduct(item)}`}
                      className="font-medium line-clamp-2 hover:text-secondary"
                    >
                      {item.name}
                    </Link>
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-sm text-muted-foreground">
                        Qty: {item.quantity}
                      </span>
                      <p className="font-semibold text-lg">
                        &euro;{(item.price * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t pt-4">
              <div className="flex justify-between items-center text-xl font-semibold">
                <span>Total</span>
                <span>&euro;{totalPrice.toFixed(2)}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
