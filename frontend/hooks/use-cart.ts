"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useEffect } from "react";

import {
  addCartItem,
  clearCart,
  getMyCart,
  removeCartItem,
  updateCartItem,
} from "@/services/cart.service";
import { useCartStore } from "@/store/cart-store";

export const cartKeys = {
  current: ["cart"] as const,
};

export function useCartQuery() {
  const setCartCount = useCartStore((state) => state.setCartCount);
  const query = useQuery({
    queryKey: cartKeys.current,
    queryFn: getMyCart,
  });

  useEffect(() => {
    const count = query.data?.items?.reduce((sum, item) => sum + item.quantity, 0) ?? 0;
    setCartCount(count);
  }, [query.data?.items, setCartCount]);

  return query;
}

export function useAddCartItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: addCartItem,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cartKeys.current });
    },
  });
}

export function useUpdateCartItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({ productId, quantity }: { productId: string; quantity: number }) =>
      updateCartItem(productId, { quantity }),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cartKeys.current });
    },
  });
}

export function useRemoveCartItemMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: removeCartItem,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: cartKeys.current });
    },
  });
}

export function useClearCartMutation() {
  const queryClient = useQueryClient();
  const clearCartCount = useCartStore((state) => state.clearCartCount);

  return useMutation({
    mutationFn: clearCart,
    onSuccess: () => {
      clearCartCount();
      void queryClient.invalidateQueries({ queryKey: cartKeys.current });
    },
  });
}
