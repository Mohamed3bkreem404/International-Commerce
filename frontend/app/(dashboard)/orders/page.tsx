"use client";

import { useState } from "react";
import { RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { OrderCard } from "@/components/order/order-card";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { ListSkeleton } from "@/components/states/skeleton-loaders";
import { Button } from "@/components/ui/button";
import { useApiError } from "@/hooks/use-api-error";
import { useCancelOrderMutation, useOrdersQuery } from "@/hooks/use-orders";
import { useCreatePaymentMutation } from "@/hooks/use-payments";
import { type PaymentMethod } from "@/types/payment";

export default function OrdersPage() {
  const router = useRouter();
  const handleError = useApiError();
  const ordersQuery = useOrdersQuery();
  const cancelMutation = useCancelOrderMutation();
  const createPaymentMutation = useCreatePaymentMutation();

  const [methodByOrder, setMethodByOrder] = useState<Record<string, PaymentMethod>>({});
  const [notesByOrder, setNotesByOrder] = useState<Record<string, string>>({});

  const setMethod = (orderId: string, method: PaymentMethod) => {
    setMethodByOrder((prev) => ({ ...prev, [orderId]: method }));
  };

  const setNotes = (orderId: string, notes: string) => {
    setNotesByOrder((prev) => ({ ...prev, [orderId]: notes }));
  };

  const cancelOrder = async (orderId: string) => {
    try {
      await cancelMutation.mutateAsync(orderId);
      toast.success("Order cancelled.");
    } catch (error) {
      handleError(error, "Could not cancel order.");
    }
  };

  const payOrder = async (orderId: string) => {
    try {
      await createPaymentMutation.mutateAsync({
        orderId,
        paymentMethod: methodByOrder[orderId] || "CARD",
        notes: notesByOrder[orderId] || "",
      });
      toast.success("Payment completed.");
    } catch (error) {
      handleError(error, "Could not complete payment.");
    }
  };

  return (
    <section className="space-y-5">
      <PageHeader
        title="Orders"
        subtitle="Track every order, resolve pending payments, and manage lifecycle actions."
        actions={
          <Button
            variant="outline"
            onClick={() => ordersQuery.refetch()}
            disabled={ordersQuery.isFetching}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        }
      />

      {ordersQuery.isLoading ? <ListSkeleton /> : null}
      {ordersQuery.isError ? (
        <ErrorState
          message="Could not load orders."
          onRetry={() => ordersQuery.refetch()}
        />
      ) : null}

      {!ordersQuery.isLoading && !ordersQuery.isError ? (
        ordersQuery.data?.length ? (
          <div className="space-y-4">
            {ordersQuery.data.map((order) => (
              <OrderCard
                key={order.orderId}
                order={order}
                loading={cancelMutation.isPending || createPaymentMutation.isPending}
                selectedMethod={methodByOrder[order.orderId] || "CARD"}
                selectedNotes={notesByOrder[order.orderId] || ""}
                onMethodChange={setMethod}
                onNotesChange={setNotes}
                onCancel={cancelOrder}
                onPay={payOrder}
              />
            ))}
          </div>
        ) : (
          <EmptyState
            title="No orders yet"
            description="Checkout your cart to create your first order."
            actionLabel="Go to checkout"
            onAction={() => router.push("/checkout")}
          />
        )
      ) : null}
    </section>
  );
}
