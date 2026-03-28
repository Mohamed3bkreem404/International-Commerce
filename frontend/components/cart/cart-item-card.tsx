import { Minus, Plus, Trash2 } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { toCurrency } from "@/lib/utils";
import { type CartItem } from "@/types/cart";

type CartItemCardProps = {
  item: CartItem;
  onIncrement: (productId: string, nextQty: number) => void;
  onDecrement: (productId: string, nextQty: number) => void;
  onRemove: (productId: string) => void;
  disabled?: boolean;
};

export function CartItemCard({
  item,
  onIncrement,
  onDecrement,
  onRemove,
  disabled = false,
}: CartItemCardProps) {
  return (
    <Card className="overflow-hidden">
      <CardContent className="flex flex-col gap-4 p-5 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h3 className="text-base font-semibold">{item.productName}</h3>
          <p className="mt-1 text-sm text-muted-foreground">
            {toCurrency(item.price)} each
          </p>
          <p className="mt-1 text-sm font-medium text-primary">{toCurrency(item.subtotal)} subtotal</p>
        </div>

        <div className="rounded-2xl border border-border/70 bg-secondary/25 p-1">
          <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            disabled={disabled || item.quantity <= 1}
            onClick={() => onDecrement(item.productId, item.quantity - 1)}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="min-w-8 text-center text-sm font-semibold">{item.quantity}</span>
          <Button
            variant="outline"
            size="icon"
            disabled={disabled}
            onClick={() => onIncrement(item.productId, item.quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            disabled={disabled}
            onClick={() => onRemove(item.productId)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
