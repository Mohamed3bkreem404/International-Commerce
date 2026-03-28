"use client";

import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import {
  createPayment,
  getMyPayments,
  getPaymentById,
  getPaymentByOrderId,
} from "@/services/payments.service";

export const paymentKeys = queryKeys.payments;

export function usePaymentsQuery() {
  return useQuery({
    queryKey: queryKeys.payments.all,
    queryFn: getMyPayments,
  });
}

export function usePaymentByIdQuery(paymentId: string) {
  return useQuery({
    queryKey: queryKeys.payments.detail(paymentId),
    queryFn: () => getPaymentById(paymentId),
    enabled: Boolean(paymentId),
  });
}

export function usePaymentByOrderQuery(orderId: string) {
  return useQuery({
    queryKey: queryKeys.payments.byOrder(orderId),
    queryFn: () => getPaymentByOrderId(orderId),
    enabled: Boolean(orderId),
  });
}

export function useCreatePaymentMutation() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createPayment,
    onSuccess: (_, variables) => {
      void queryClient.invalidateQueries({ queryKey: queryKeys.payments.all });
      void queryClient.invalidateQueries({ queryKey: queryKeys.orders.all });
      void queryClient.invalidateQueries({
        queryKey: queryKeys.payments.byOrder(variables.orderId),
      });
    },
  });
}
