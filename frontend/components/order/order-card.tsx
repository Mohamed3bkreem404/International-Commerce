import Link from "next/link";
import { CreditCard, XCircle } from "lucide-react";

import { StatusBadge } from "@/components/shared/status-badge";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Select } from "@/components/ui/select";
import { toCurrency, truncate } from "@/lib/utils";
import { type PaymentMethod } from "@/types/payment";
import { type Order } from "@/types/order";

type OrderCardProps = {
  order: Order;
  loading?: boolean;
  selectedMethod: PaymentMethod;
  selectedNotes: string;
  onMethodChange: (orderId: string, value: PaymentMethod) => void;
  onNotesChange: (orderId: string, value: string) => void;
  onCancel: (orderId: string) => void;
  onPay: (orderId: string) => void;
};

export function OrderCard({
  order,
  loading = false,
  selectedMethod,
  selectedNotes,
  onMethodChange,
  onNotesChange,
  onCancel,
  onPay,
}: OrderCardProps) {
  const canCancel = order.status !== "CANCELLED" && order.status !== "COMPLETED";
  const canPay = order.paymentStatus !== "PAID" && order.status !== "CANCELLED";

  return (
    <Card className="overflow-hidden">
      <CardHeader className="space-y-3">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <CardTitle className="text-xl">Order {truncate(order.orderId, 8)}</CardTitle>
          <div className="flex items-center gap-2">
            <StatusBadge value={order.status} />
            <StatusBadge value={order.paymentStatus} />
          </div>
        </div>
        <div className="flex flex-wrap gap-2 text-sm text-muted-foreground">
          <Badge variant="secondary">{toCurrency(order.totalAmount)}</Badge>
          <Badge variant="outline">{order.items.length} items</Badge>
          <Badge variant="outline">{order.shippingAddress || "No shipping address"}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2 rounded-2xl border border-border/70 bg-background/70 p-4">
          {order.items.map((item) => (
            <div key={item.itemId} className="flex justify-between text-sm">
              <span className="text-muted-foreground">
                {item.productName} x {item.quantity}
              </span>
              <span className="font-medium">{toCurrency(item.subtotal)}</span>
            </div>
          ))}
        </div>
        <div className="flex flex-wrap gap-2">
          <Button variant="outline" asChild>
            <Link href={`/orders/${order.orderId}`}>Details</Link>
          </Button>
          {canCancel ? (
            <Button
              variant="destructive"
              disabled={loading}
              onClick={() => onCancel(order.orderId)}
            >
              <XCircle className="mr-2 h-4 w-4" />
              Cancel
            </Button>
          ) : null}
        </div>

        {canPay ? (
          <div className="grid gap-2 rounded-2xl border border-border/70 bg-secondary/35 p-3 sm:grid-cols-[1fr_1fr_auto]">
            <Select
              value={selectedMethod}
              onChange={(event) =>
                onMethodChange(order.orderId, event.target.value as PaymentMethod)
              }
            >
              <option value="CARD">Card</option>
              <option value="WALLET">Wallet</option>
              <option value="CASH_ON_DELIVERY">Cash on delivery</option>
            </Select>
            <Input
              value={selectedNotes}
              placeholder="Payment notes"
              onChange={(event) => onNotesChange(order.orderId, event.target.value)}
            />
            <Button disabled={loading} onClick={() => onPay(order.orderId)}>
              <CreditCard className="mr-2 h-4 w-4" />
              {loading ? "Processing..." : "Pay"}
            </Button>
          </div>
        ) : null}
      </CardContent>
    </Card>
  );
}
