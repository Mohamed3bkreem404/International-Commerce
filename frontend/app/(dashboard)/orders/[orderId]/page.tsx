"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowLeft, CreditCard, XCircle } from "lucide-react";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ErrorState } from "@/components/states/error-state";
import { DetailSkeleton } from "@/components/states/skeleton-loaders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { useApiError } from "@/hooks/use-api-error";
import { useCancelOrderMutation, useOrderByIdQuery } from "@/hooks/use-orders";
import { useCreatePaymentMutation } from "@/hooks/use-payments";
import { formatDateTime, toCurrency } from "@/lib/utils";
import { type PaymentMethod } from "@/types/payment";

type OrderDetailPageProps = {
  params: {
    orderId: string;
  };
};

export default function OrderDetailPage({ params }: OrderDetailPageProps) {
  const handleError = useApiError();
  const orderQuery = useOrderByIdQuery(params.orderId);
  const cancelMutation = useCancelOrderMutation();
  const paymentMutation = useCreatePaymentMutation();

  const [paymentMethod, setPaymentMethod] = useState<PaymentMethod>("CARD");
  const [notes, setNotes] = useState("");

  const order = orderQuery.data;
  const canCancel =
    order && order.status !== "CANCELLED" && order.status !== "COMPLETED";
  const canPay =
    order && order.paymentStatus !== "PAID" && order.status !== "CANCELLED";

  const cancelOrder = async () => {
    if (!order) {
      return;
    }
    try {
      await cancelMutation.mutateAsync(order.orderId);
      toast.success("Order cancelled.");
      await orderQuery.refetch();
    } catch (error) {
      handleError(error, "Could not cancel order.");
    }
  };

  const payOrder = async () => {
    if (!order) {
      return;
    }
    try {
      await paymentMutation.mutateAsync({
        orderId: order.orderId,
        paymentMethod,
        notes,
      });
      toast.success("Payment completed.");
      await orderQuery.refetch();
    } catch (error) {
      handleError(error, "Could not complete payment.");
    }
  };

  return (
    <section className="space-y-5">
      <PageHeader
        title="Order Details"
        subtitle="Inspect item breakdown, status, and payment state for this order."
        actions={
          <Button variant="outline" asChild>
            <Link href="/orders">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to orders
            </Link>
          </Button>
        }
      />

      {orderQuery.isLoading ? <DetailSkeleton /> : null}
      {orderQuery.isError ? (
        <ErrorState
          message="Could not load order details."
          onRetry={() => orderQuery.refetch()}
        />
      ) : null}

      {!orderQuery.isLoading && !orderQuery.isError && order ? (
        <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
          <Card>
            <CardHeader>
              <div className="flex flex-wrap items-center justify-between gap-3">
                <CardTitle>Order #{order.orderId.slice(0, 8)}</CardTitle>
                <div className="flex gap-2">
                  <StatusBadge value={order.status} />
                  <StatusBadge value={order.paymentStatus} />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                <Badge variant="secondary">{toCurrency(order.totalAmount)}</Badge>
                <Badge variant="outline">{formatDateTime(order.createdAt)}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
                <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Shipping Address
                </p>
                <p className="mt-1">{order.shippingAddress || "Not provided"}</p>
                <p className="mt-3 text-xs uppercase tracking-[0.2em] text-muted-foreground">
                  Notes
                </p>
                <p className="mt-1 text-sm text-muted-foreground">{order.notes || "No notes"}</p>
              </div>
              <div className="space-y-2 rounded-2xl border border-border/70 bg-background/70 p-4">
                {order.items.map((item) => (
                  <div key={item.itemId} className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {item.productName} x {item.quantity}
                    </span>
                    <span className="font-medium">{toCurrency(item.subtotal)}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="h-fit">
            <CardHeader>
              <CardTitle>Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              {canCancel ? (
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={cancelOrder}
                  disabled={cancelMutation.isPending}
                >
                  <XCircle className="mr-2 h-4 w-4" />
                  {cancelMutation.isPending ? "Cancelling..." : "Cancel Order"}
                </Button>
              ) : null}

              {canPay ? (
                <div className="space-y-2 rounded-2xl border border-border/70 bg-secondary/40 p-3">
                  <Select
                    value={paymentMethod}
                    onChange={(event) =>
                      setPaymentMethod(event.target.value as PaymentMethod)
                    }
                  >
                    <option value="CARD">Card</option>
                    <option value="WALLET">Wallet</option>
                    <option value="CASH_ON_DELIVERY">Cash on delivery</option>
                  </Select>
                  <Input
                    placeholder="Payment notes"
                    value={notes}
                    onChange={(event) => setNotes(event.target.value)}
                  />
                  <Button
                    className="w-full"
                    onClick={payOrder}
                    disabled={paymentMutation.isPending}
                  >
                    <CreditCard className="mr-2 h-4 w-4" />
                    {paymentMutation.isPending ? "Processing..." : "Pay Order"}
                  </Button>
                </div>
              ) : null}
            </CardContent>
          </Card>
        </div>
      ) : null}
    </section>
  );
}
