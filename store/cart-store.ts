import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";
import { MAX_CART_ITEMS, MAX_CART_ITEMS_WARNING } from "@/lib/constants";

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
  clearLocalCart: () => void;
  getTotalPrice: () => number;
  getTotalQuantity: () => number;
  setAuthenticated: (isAuth: boolean) => void;
  setItems: (items: CartItem[]) => void;
  syncToServer: () => Promise<void>;
  loadFromServer: () => Promise<CartItem[]>;
  mergeWithServer: () => Promise<void>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isSheetOpen: false,
      isSyncing: false,
      isAuthenticated: false,
      setSheetOpen: (isOpen) => set({ isSheetOpen: isOpen }),
      setAuthenticated: (isAuth) => set({ isAuthenticated: isAuth }),
      setItems: (items) => set({ items }),
      addItem: (item) =>
        set((state) => {
          // Calculate current total quantity in cart
          const currentTotal = state.items.reduce(
            (sum, i) => sum + i.quantity,
            0
          );
          const availableSpace = MAX_CART_ITEMS - currentTotal;

          // If cart is full, show warning and don't add
          if (availableSpace <= 0) {
            toast.warning(
              `You can't have more than ${MAX_CART_ITEMS} items in the cart.`
            );
            return state;
          }

          // Calculate how many items we can actually add
          const quantityToAdd = Math.min(item.quantity, availableSpace);

          // If we can't add all requested items, show warning
          if (quantityToAdd < item.quantity) {
            toast.warning(MAX_CART_ITEMS_WARNING);
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
        }),
      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        })),
      updateItemQuantity: (itemId, quantity) =>
        set((state) => {
          // Calculate current total quantity excluding the item being updated
          const currentItem = state.items.find((i) => i.id === itemId);
          if (!currentItem) return state;

          const otherItemsTotal = state.items
            .filter((i) => i.id !== itemId)
            .reduce((sum, i) => sum + i.quantity, 0);

          const availableSpace = MAX_CART_ITEMS - otherItemsTotal;

          // Cap the quantity to available space
          const newQuantity = Math.min(quantity, availableSpace);

          // Show warning if we can't set the full requested quantity
          if (newQuantity < quantity) {
            toast.warning(MAX_CART_ITEMS_WARNING);
          }

          return {
            items: state.items.map((i) =>
              i.id === itemId ? { ...i, quantity: newQuantity } : i
            ),
          };
        }),
      clearLocalCart: () => set({ items: [] }),
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
      syncToServer: async () => {
        const state = get();
        if (state.isSyncing || !state.isAuthenticated) return;

        set({ isSyncing: true });
        try {
          const response = await fetch("/api/cart", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ items: state.items }),
          });

          if (!response.ok) {
            throw new Error("Failed to sync cart");
          }
        } catch (error) {
          console.error("Error syncing cart to server:", error);
        } finally {
          set({ isSyncing: false });
        }
      },
      loadFromServer: async () => {
        try {
          const response = await fetch("/api/cart");
          if (!response.ok) {
            throw new Error("Failed to load cart");
          }
          const data = await response.json();
          return data.items as CartItem[];
        } catch (error) {
          console.error("Error loading cart from server:", error);
          return [];
        }
      },
      mergeWithServer: async () => {
        const state = get();
        if (state.isSyncing) return;

        set({ isSyncing: true });
        try {
          // Load server cart
          const serverItems = await get().loadFromServer();

          // Server cart takes priority - replace local cart with server cart
          set({ items: serverItems });

          // If local cart had items but server was empty, sync local to server
          if (serverItems.length === 0 && state.items.length > 0) {
            // Restore local items temporarily for syncing
            set({ items: state.items, isSyncing: false });
            await get().syncToServer();
          }
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
        isSheetOpen: state.isSheetOpen,
      }),
    }
  )
);
