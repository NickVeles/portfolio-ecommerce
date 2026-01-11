"use client";

import { useAuth } from "@clerk/nextjs";
import { createContext, useContext } from "react";

const ClerkLoadedContext = createContext<boolean>(false);

export function useClerkLoaded() {
  return useContext(ClerkLoadedContext);
}

export function ClerkLoadedWrapper({ children }: { children: React.ReactNode }) {
  const { isLoaded } = useAuth();

  return (
    <ClerkLoadedContext.Provider value={isLoaded}>
      {children}
    </ClerkLoadedContext.Provider>
  );
}
