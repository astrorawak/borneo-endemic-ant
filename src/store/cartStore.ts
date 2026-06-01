import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { CartItem, Product } from '../types';

interface CartStore {
  items: CartItem[];
  addItem: (product: Product, quantity?: number) => void;
  removeItem: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  totalItems: () => number;
  totalPrice: () => number;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (product, quantity = 1) => set((s) => {
        const existing = s.items.find((i) => i.product.id === product.id);
        if (existing) {
          return { items: s.items.map((i) => i.product.id === product.id ? { ...i, quantity: i.quantity + quantity } : i) };
        }
        return { items: [...s.items, { product, quantity }] };
      }),
      removeItem: (id) => set((s) => ({ items: s.items.filter((i) => i.product.id !== id) })),
      updateQuantity: (id, qty) => set((s) => ({
        items: qty <= 0 ? s.items.filter((i) => i.product.id !== id) : s.items.map((i) => i.product.id === id ? { ...i, quantity: qty } : i)
      })),
      clearCart: () => set({ items: [] }),
      totalItems: () => get().items.reduce((sum, i) => sum + i.quantity, 0),
      totalPrice: () => get().items.reduce((sum, i) => sum + i.product.price * i.quantity, 0),
    }),
    { name: 'borneo-endemic-ant-cart' }
  )
);
