"use client";

import { create } from "zustand";

type CartStoreState = {
  cartCount: number;
  setCartCount: (count: number) => void;
  clearCartCount: () => void;
};

export const useCartStore = create<CartStoreState>((set) => ({
  cartCount: 0,
  setCartCount: (count) => set({ cartCount: count }),
  clearCartCount: () => set({ cartCount: 0 }),
}));
