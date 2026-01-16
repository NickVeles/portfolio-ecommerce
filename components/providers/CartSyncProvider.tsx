"use client";

import { useUser } from "@clerk/nextjs";
import { useEffect, useRef } from "react";
import { useCartStore } from "@/store/cart-store";

export function CartSyncProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser();
  const setAuthenticated = useCartStore((state) => state.setAuthenticated);
  const mergeWithServer = useCartStore((state) => state.mergeWithServer);
  const syncToServer = useCartStore((state) => state.syncToServer);
  const isAuthenticated = useCartStore((state) => state.isAuthenticated);
  const items = useCartStore((state) => state.items);
  const prevUserIdRef = useRef<string | null>(null);
  const hasSyncedRef = useRef(false);

  // Handle authentication state changes
  useEffect(() => {
    if (!isLoaded) return;

    const isSignedIn = !!user;
    const currentUserId = user?.id ?? null;
    const previousUserId = prevUserIdRef.current;

    // User just signed in (was not signed in, now is signed in)
    if (isSignedIn && previousUserId === null && currentUserId !== null) {
      setAuthenticated(true);
      hasSyncedRef.current = false;
    }

    // User signed out
    if (!isSignedIn && previousUserId !== null) {
      setAuthenticated(false);
      hasSyncedRef.current = false;
    }

    prevUserIdRef.current = currentUserId;
  }, [user, isLoaded, setAuthenticated]);

  // Sync cart when user signs in
  useEffect(() => {
    if (!isLoaded) return;

    const isSignedIn = !!user;

    if (isSignedIn && isAuthenticated && !hasSyncedRef.current) {
      hasSyncedRef.current = true;
      mergeWithServer();
    }
  }, [user, isLoaded, isAuthenticated, mergeWithServer]);

  // Sync cart changes to server when authenticated (debounced)
  useEffect(() => {
    if (!isAuthenticated || !hasSyncedRef.current) return;

    const timeoutId = setTimeout(() => {
      syncToServer();
    }, 500);

    return () => clearTimeout(timeoutId);
  }, [items, isAuthenticated, syncToServer]);

  return <>{children}</>;
}
