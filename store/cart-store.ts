import { create } from "zustand";
import { persist } from "zustand/middleware";
import { toast } from "sonner";

const MAX_CART_QUANTITY = 99;

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
  setSheetOpen: (isOpen: boolean) => void;
  addItem: (item: CartItem) => void;
  removeItem: (itemId: string) => void;
  updateItemQuantity: (itemId: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalQuantity: () => number;
}

export const createCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isSheetOpen: false,
      setSheetOpen: (isOpen) => set({ isSheetOpen: isOpen }),
      addItem: (item) =>
        set((state) => {
          // Calculate current total quantity in cart
          const currentTotal = state.items.reduce((sum, i) => sum + i.quantity, 0);
          const availableSpace = MAX_CART_QUANTITY - currentTotal;

          // If cart is full, show warning and don't add
          if (availableSpace <= 0) {
            toast.warning(`You can't have more than ${MAX_CART_QUANTITY} items in the cart.`);
            return state;
          }

          // Calculate how many items we can actually add
          const quantityToAdd = Math.min(item.quantity, availableSpace);

          // If we can't add all requested items, show warning
          if (quantityToAdd < item.quantity) {
            toast.warning(`You can't have more than ${MAX_CART_QUANTITY} items in your cart.`);
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
          return { items: [...state.items, { ...item, quantity: quantityToAdd }] };
        }),
      removeItem: (itemId) =>
        set((state) => ({
          items: state.items.filter((i) => i.id !== itemId),
        })),
      updateItemQuantity: (itemId, quantity) =>
        set((state) => ({
          items: state.items.map((i) =>
            i.id === itemId ? { ...i, quantity } : i
          ),
        })),
      clearCart: () => set({ items: [] }),
      getTotalPrice: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.price * item.quantity, 0);
      },
      getTotalQuantity: () => {
        const state = get();
        return state.items.reduce((total, item) => total + item.quantity, 0);
      },
    }),
    {
      name: "cart-storage",
    }
  )
);
