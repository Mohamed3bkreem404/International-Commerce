"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import {
  cancelOrder,
  checkout,
  getMyOrders,
  getOrderById,
  markOrderPaid,
} from "@/services/orders.service";

export const orderKeys = queryKeys.orders;

export function useOrdersQuery() {
  return useQuery({
    queryKey: queryKeys.orders.all,
    queryFn: getMyOrders,
  });
}

export function useOrderByIdQuery(orderId: string) {
  return useQuery({
    queryKey: queryKeys.orders.detail(orderId),
    queryFn: () => getOrderById(orderId),
    enabled: Boolean(orderId),
  });
}

export function useCheckoutMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: checkout,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.cart.current });
    },
  });
}

export function useCancelOrderMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: cancelOrder,
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
    },
  });
}

export function useMarkOrderPaidMutation() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: markOrderPaid,
    onSuccess: (_, orderId) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.detail(orderId) });
    },
  });
}
