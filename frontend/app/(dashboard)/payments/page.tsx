"use client";

import { startTransition, useDeferredValue, useMemo, useState } from "react";
import { RefreshCcw, Search } from "lucide-react";

import { PaymentCard } from "@/components/payment/payment-card";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { ListSkeleton } from "@/components/states/skeleton-loaders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { usePaymentByOrderQuery, usePaymentsQuery } from "@/hooks/use-payments";

export default function PaymentsPage() {
  const paymentsQuery = usePaymentsQuery();
  const [searchText, setSearchText] = useState("");
  const [orderInput, setOrderInput] = useState("");
  const [orderFilter, setOrderFilter] = useState("");

  const paymentByOrderQuery = usePaymentByOrderQuery(orderFilter);

  const deferredSearchText = useDeferredValue(searchText);

  const listData = useMemo(() => {
    const payments = paymentsQuery.data || [];
    if (!deferredSearchText.trim()) {
      return payments;
    }
    return payments.filter((payment) =>
      payment.orderId.toLowerCase().includes(deferredSearchText.toLowerCase()),
    );
  }, [paymentsQuery.data, deferredSearchText]);

  const showSingleOrderResult = Boolean(orderFilter);

  return (
    <section className="space-y-5">
      <PageHeader
        title="Payments"
        subtitle="Review transaction history, and drill into exact order payments."
        actions={
          <Button
            variant="outline"
            onClick={() => paymentsQuery.refetch()}
            disabled={paymentsQuery.isFetching}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        }
      />

      <div className="surface-elevated grid gap-3 rounded-3xl p-4 sm:grid-cols-2">
        <Input
          placeholder="Filter list by order id..."
          value={searchText}
          onChange={(event) => {
            const nextValue = event.target.value;
            startTransition(() => {
              setSearchText(nextValue);
            });
          }}
        />
        <div className="flex gap-2">
          <Input
            placeholder="Fetch exact order payment"
            value={orderInput}
            onChange={(event) => setOrderInput(event.target.value)}
          />
          <Button
            variant="outline"
            onClick={() => setOrderFilter(orderInput.trim())}
          >
            <Search className="mr-2 h-4 w-4" />
            Find
          </Button>
        </div>
      </div>

      {paymentsQuery.isLoading ? <ListSkeleton /> : null}
      {paymentsQuery.isError ? (
        <ErrorState
          message="Could not load payments."
          onRetry={() => paymentsQuery.refetch()}
        />
      ) : null}

      {!paymentsQuery.isLoading && !paymentsQuery.isError ? (
        <>
          {showSingleOrderResult ? (
            paymentByOrderQuery.isLoading ? (
              <ListSkeleton />
            ) : paymentByOrderQuery.isError ? (
              <ErrorState
                message="Could not find payment for this order id."
                onRetry={() => paymentByOrderQuery.refetch()}
              />
            ) : paymentByOrderQuery.data ? (
              <PaymentCard payment={paymentByOrderQuery.data} />
            ) : (
              <EmptyState
                title="No payment found"
                description="Try another order id or clear the filter."
              />
            )
          ) : listData.length ? (
            <div className="space-y-4">
              {listData.map((payment, idx) => (
                <div key={payment.paymentId} className="animate-fade-up" style={{ animationDelay: `${idx * 55}ms` }}>
                  <PaymentCard payment={payment} />
                </div>
              ))}
            </div>
          ) : (
            <EmptyState
              title="No payments yet"
              description="Pay an order to create your first payment record."
            />
          )}
        </>
      ) : null}
    </section>
  );
}
