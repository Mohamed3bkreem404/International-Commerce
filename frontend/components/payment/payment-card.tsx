import Link from "next/link";

import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { formatDateTime, toCurrency, truncate } from "@/lib/utils";
import { type Payment } from "@/types/payment";

type PaymentCardProps = {
  payment: Payment;
};

export function PaymentCard({ payment }: PaymentCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardHeader className="flex-row items-start justify-between gap-3 space-y-0 border-b border-border/70 bg-secondary/20">
        <div>
          <CardTitle className="text-xl">{payment.transactionReference}</CardTitle>
          <p className="mt-1 text-sm text-muted-foreground">
            Order {truncate(payment.orderId, 8)}
          </p>
        </div>
        <StatusBadge value={payment.paymentStatus} />
      </CardHeader>
      <CardContent className="space-y-3 pt-5">
        <div className="flex flex-wrap gap-2">
          <Badge variant="secondary">{payment.paymentMethod}</Badge>
          <Badge variant="outline">{toCurrency(payment.amount)}</Badge>
          <Badge variant="outline">{formatDateTime(payment.paidAt)}</Badge>
        </div>
        <p className="text-sm text-muted-foreground">{payment.notes || "No notes"}</p>
        <Button variant="outline" asChild>
          <Link href={`/payments/${payment.paymentId}`}>View details</Link>
        </Button>
      </CardContent>
    </Card>
  );
}
