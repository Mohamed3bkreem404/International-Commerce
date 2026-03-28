"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import {
  cancelOrder,
  checkout,
  getMyOrders,
  getOrderById,
  markOrderPaid,
} from "@/services/orders.service";
import { cartKeys } from "@/hooks/use-cart";

export const orderKeys = {
  all: ["orders"] as const,
  detail: (orderId: string) => ["orders", orderId] as const,
};

export function useOrdersQuery() {
  return useQuery({
    queryKey: orderKeys.all,
    queryFn: getMyOrders,
  });
}

export function useOrderByIdQuery(orderId: string) {
  return useQuery({
    queryKey: orderKeys.detail(orderId),
    queryFn: () => getOrderById(orderId),
    enabled: Boolean(orderId),
  });
}

export function useCheckoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: checkout,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
      void queryClient.invalidateQueries({ queryKey: cartKeys.current });
    },
  });
}

export function useCancelOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
    },
  });
}

export function useMarkOrderPaidMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markOrderPaid,
    onSuccess: (_, orderId) => {
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
      void queryClient.invalidateQueries({ queryKey: orderKeys.detail(orderId) });
    },
  });
}
