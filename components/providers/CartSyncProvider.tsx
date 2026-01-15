"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { useCartStore } from "@/store/cart-store";

export function CartSyncProvider({ children }: { children: React.ReactNode }) {
  const { isSignedIn, isLoaded } = useUser();
  const { setAuthenticated, mergeWithServer } = useCartStore();
  const hasInitialized = useRef(false);
  const wasSignedIn = useRef(false);

  useEffect(() => {
    // Wait for Clerk to load
    if (!isLoaded) return;

    // Update auth state in store
    setAuthenticated(!!isSignedIn);

    // Handle sign-in: merge local cart with server cart
    if (isSignedIn && !wasSignedIn.current && !hasInitialized.current) {
      hasInitialized.current = true;
      mergeWithServer();
    }

    // Track sign-in state for detecting login events
    wasSignedIn.current = !!isSignedIn;
  }, [isSignedIn, isLoaded, setAuthenticated, mergeWithServer]);

  return <>{children}</>;
}
