import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

const MAX_CART_QUANTITY = 99;
const MAX_CART_QUANTITY_WARNING = `You can't have more than ${MAX_CART_QUANTITY} items in your cart.`;

// Debounce timer for server sync
let syncTimeout: ReturnType<typeof setTimeout> | null = null;
const SYNC_DEBOUNCE_MS = 500;

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string | null;
  quantity: number;
}

interface CartStore {
  items: CartItem[];
  isSheetOpen: boolean;
  isSyncing: boolean;
  isAuthenticated: boolean;
  setSheetOpen: (isOpen: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalQuantity: () => number;
  // Server sync methods
  setAuthenticated: (isAuthenticated: boolean) => void;
  syncToServer: () => Promise<void>;
  loadFromServer: () => Promise<void>;
  mergeWithServer: () => Promise<void>;
}

// Helper to sync cart to server (debounced)
const debouncedSync = (syncFn: () => Promise<void>) => {
  if (syncTimeout) {
    clearTimeout(syncTimeout);
  }
  syncTimeout = setTimeout(() => {
    syncFn();
  }, SYNC_DEBOUNCE_MS);
};

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isSheetOpen: false,
      isSyncing: false,
      isAuthenticated: false,
      setSheetOpen: (isOpen) => set({ isSheetOpen: isOpen }),
      setAuthenticated: (isAuthenticated) => {
        // Cancel any pending sync when logging out
        if (!isAuthenticated && syncTimeout) {
          clearTimeout(syncTimeout);
          syncTimeout = null;
        }
        set({ isAuthenticated });
      },

      addItem: (item) => {
        set((state) => {
          // Calculate current total quantity in cart
          const currentTotal = state.items.reduce(
            (sum, i) => sum + i.quantity,
            0
          );
          const availableSpace = MAX_CART_QUANTITY - currentTotal;

          // If cart is full, show warning and don't add
          if (availableSpace <= 0) {
            toast.warning(
              `You can't have more than ${MAX_CART_QUANTITY} items in the cart.`
            );
            return state;
          }

          // Calculate how many items we can actually add
          const quantityToAdd = Math.min(item.quantity, availableSpace);

          // If we can't add all requested items, show warning
          if (quantityToAdd < item.quantity) {
            toast.warning(MAX_CART_QUANTITY_WARNING);
          }

          const existingItem = state.items.find((i) => i.id === item.id);
          // If item exists, update the quantity
          // Otherwise, add the new item
          if (existingItem) {
            return {
              items: state.items.map((i) =>
                i.id === item.id
                  ? { ...i, quantity: i.quantity + quantityToAdd }
                  : i
              ),
            };
          }
          return {
            items: [...state.items, { ...item, quantity: quantityToAdd }],
          };
        });

        // Sync to server if authenticated
        const { isAuthenticated, syncToServer } = get();
        if (isAuthenticated) {
          debouncedSync(syncToServer);
        }
      },

      removeItem: (itemId) => {
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        }));

        // Sync to server if authenticated
        const { isAuthenticated, syncToServer } = get();
        if (isAuthenticated) {
          debouncedSync(syncToServer);
        }
      },

      updateItemQuantity: (itemId, quantity) => {
        set((state) => {
          // Calculate current total quantity excluding the item being updated
          const currentItem = state.items.find((i) => i.id === itemId);
          if (!currentItem) return state;

          const otherItemsTotal = state.items
            .filter((i) => i.id !== itemId)
            .reduce((sum, i) => sum + i.quantity, 0);

          const availableSpace = MAX_CART_QUANTITY - otherItemsTotal;

          // Cap the quantity to available space
          const newQuantity = Math.min(quantity, availableSpace);

          // Show warning if we can't set the full requested quantity
          if (newQuantity < quantity) {
            toast.warning(MAX_CART_QUANTITY_WARNING);
          }

          return {
            items: state.items.map((i) =>
              i.id === itemId ? { ...i, quantity: newQuantity } : i
            ),
          };
        });

        // Sync to server if authenticated
        const { isAuthenticated, syncToServer } = get();
        if (isAuthenticated) {
          debouncedSync(syncToServer);
        }
      },

      clearCart: () => {
        set({ items: [] });

        // Sync to server if authenticated
        const { isAuthenticated, syncToServer } = get();
        if (isAuthenticated) {
          debouncedSync(syncToServer);
        }
      },

      getTotalPrice: () => {
        const state = get();
        return state.items.reduce(
          (total, item) => total + item.price * item.quantity,
          0
        );
      },

      getTotalQuantity: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },

      // Sync current cart state to server
      syncToServer: async () => {
        const { items, isSyncing, isAuthenticated } = get();
        // Skip if not authenticated (user logged out) or already syncing
        if (!isAuthenticated || isSyncing) return;

        set({ isSyncing: true });
        try {
          const response = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items }),
          });

          // 401 is expected if user logged out mid-sync, don't treat as error
          if (!response.ok && response.status !== 401) {
            throw new Error("Failed to sync cart");
          }
        } catch (error) {
          console.error("Error syncing cart to server:", error);
        } finally {
          set({ isSyncing: false });
        }
      },

      // Load cart from server (replaces local cart)
      loadFromServer: async () => {
        const { isSyncing } = get();
        if (isSyncing) return;

        set({ isSyncing: true });
        try {
          const response = await fetch("/api/cart");
          if (!response.ok) {
            throw new Error("Failed to load cart");
          }

          const data = await response.json();
          set({ items: data.items || [] });
        } catch (error) {
          console.error("Error loading cart from server:", error);
        } finally {
          set({ isSyncing: false });
        }
      },

      // Merge local cart with server cart (used on login)
      mergeWithServer: async () => {
        const { items: localItems, isSyncing } = get();
        if (isSyncing) return;

        set({ isSyncing: true });
        try {
          // Fetch server cart
          const response = await fetch("/api/cart");
          if (!response.ok) {
            throw new Error("Failed to load cart");
          }

          const data = await response.json();
          const serverItems: CartItem[] = data.items || [];

          // Merge: combine items, preferring higher quantities
          const mergedMap = new Map<string, CartItem>();

          // Add server items first
          for (const item of serverItems) {
            mergedMap.set(item.id, item);
          }

          // Merge local items (add quantities for existing, add new items)
          for (const localItem of localItems) {
            const existing = mergedMap.get(localItem.id);
            if (existing) {
              // Keep the higher quantity between local and server
              mergedMap.set(localItem.id, {
                ...existing,
                quantity: Math.max(existing.quantity, localItem.quantity),
              });
            } else {
              mergedMap.set(localItem.id, localItem);
            }
          }

          // Convert map to array and enforce max quantity
          let mergedItems = Array.from(mergedMap.values());
          const totalQuantity = mergedItems.reduce(
            (sum, item) => sum + item.quantity,
            0
          );

          // If over limit, scale down proportionally
          if (totalQuantity > MAX_CART_QUANTITY) {
            const scale = MAX_CART_QUANTITY / totalQuantity;
            mergedItems = mergedItems.map((item) => ({
              ...item,
              quantity: Math.max(1, Math.floor(item.quantity * scale)),
            }));
            toast.warning(MAX_CART_QUANTITY_WARNING);
          }

          // Update local state
          set({ items: mergedItems });

          // Sync merged cart back to server
          await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: mergedItems }),
          });
        } catch (error) {
          console.error("Error merging cart with server:", error);
        } finally {
          set({ isSyncing: false });
        }
      },
    }),
    {
      name: "cart-storage",
      partialize: (state) => ({
        items: state.items,
        // Don't persist sync state
      }),
    }
  )
);
