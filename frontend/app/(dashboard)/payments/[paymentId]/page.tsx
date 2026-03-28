"use client";

import Link from "next/link";
import { ArrowLeft } from "lucide-react";

import { PageHeader } from "@/components/shared/page-header";
import { StatusBadge } from "@/components/shared/status-badge";
import { ErrorState } from "@/components/states/error-state";
import { DetailSkeleton } from "@/components/states/skeleton-loaders";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { usePaymentByIdQuery } from "@/hooks/use-payments";
import { formatDateTime, toCurrency, truncate } from "@/lib/utils";

type PaymentDetailsPageProps = {
  params: {
    paymentId: string;
  };
};

export default function PaymentDetailsPage({ params }: PaymentDetailsPageProps) {
  const paymentQuery = usePaymentByIdQuery(params.paymentId);
  const payment = paymentQuery.data;

  return (
    <section className="space-y-5">
      <PageHeader
        title="Payment Details"
        subtitle="Inspect transaction reference and payment metadata."
        actions={
          <Button variant="outline" asChild>
            <Link href="/payments">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to payments
            </Link>
          </Button>
        }
      />

      {paymentQuery.isLoading ? <DetailSkeleton /> : null}
      {paymentQuery.isError ? (
        <ErrorState
          message="Could not load payment details."
          onRetry={() => paymentQuery.refetch()}
        />
      ) : null}

      {!paymentQuery.isLoading && !paymentQuery.isError && payment ? (
        <Card>
          <CardHeader>
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <CardTitle>{payment.transactionReference}</CardTitle>
                <p className="mt-1 text-sm text-muted-foreground">
                  Payment #{truncate(payment.paymentId, 10)}
                </p>
              </div>
              <StatusBadge value={payment.paymentStatus} />
            </div>
          </CardHeader>
          <CardContent className="grid gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Amount</p>
              <p className="mt-2 text-lg font-semibold">{toCurrency(payment.amount)}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Method</p>
              <div className="mt-2">
                <Badge variant="secondary">{payment.paymentMethod}</Badge>
              </div>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Order ID</p>
              <p className="mt-2 text-sm">{payment.orderId}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Paid At</p>
              <p className="mt-2 text-sm">{formatDateTime(payment.paidAt)}</p>
            </div>
            <div className="rounded-2xl border border-border/70 bg-background/70 p-4 sm:col-span-2">
              <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Notes</p>
              <p className="mt-2 text-sm text-muted-foreground">{payment.notes || "No notes"}</p>
            </div>
          </CardContent>
        </Card>
      ) : null}
    </section>
  );
}
