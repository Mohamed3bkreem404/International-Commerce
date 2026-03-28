"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { orderKeys } from "@/hooks/use-orders";
import {
  createPayment,
  getMyPayments,
  getPaymentById,
  getPaymentByOrderId,
} from "@/services/payments.service";

export const paymentKeys = {
  all: ["payments"] as const,
  detail: (paymentId: string) => ["payments", paymentId] as const,
  byOrder: (orderId: string) => ["payments", "order", orderId] as const,
};

export function usePaymentsQuery() {
  return useQuery({
    queryKey: paymentKeys.all,
    queryFn: getMyPayments,
  });
}

export function usePaymentByIdQuery(paymentId: string) {
  return useQuery({
    queryKey: paymentKeys.detail(paymentId),
    queryFn: () => getPaymentById(paymentId),
    enabled: Boolean(paymentId),
  });
}

export function usePaymentByOrderQuery(orderId: string) {
  return useQuery({
    queryKey: paymentKeys.byOrder(orderId),
    queryFn: () => getPaymentByOrderId(orderId),
    enabled: Boolean(orderId),
  });
}

export function useCreatePaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPayment,
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: paymentKeys.all });
      void queryClient.invalidateQueries({ queryKey: orderKeys.all });
      void queryClient.invalidateQueries({
        queryKey: paymentKeys.byOrder(variables.orderId),
      });
    },
  });
}
