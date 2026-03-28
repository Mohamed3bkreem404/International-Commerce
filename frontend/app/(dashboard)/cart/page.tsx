"use client";

import Link from "next/link";
import { RefreshCcw, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import { CartItemCard } from "@/components/cart/cart-item-card";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { ListSkeleton } from "@/components/states/skeleton-loaders";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useApiError } from "@/hooks/use-api-error";
import {
  useCartQuery,
  useClearCartMutation,
  useRemoveCartItemMutation,
  useUpdateCartItemMutation,
} from "@/hooks/use-cart";
import { toCurrency } from "@/lib/utils";

export default function CartPage() {
  const router = useRouter();
  const handleError = useApiError();
  const cartQuery = useCartQuery();
  const updateMutation = useUpdateCartItemMutation();
  const removeMutation = useRemoveCartItemMutation();
  const clearMutation = useClearCartMutation();

  const cart = cartQuery.data;

  const updateQty = async (productId: string, quantity: number) => {
    if (quantity < 1) {
      return;
    }
    try {
      await updateMutation.mutateAsync({ productId, quantity });
      toast.success("Quantity updated.");
    } catch (error) {
      handleError(error, "Could not update quantity.");
    }
  };

  const removeItem = async (productId: string) => {
    try {
      await removeMutation.mutateAsync(productId);
      toast.success("Item removed.");
    } catch (error) {
      handleError(error, "Could not remove item.");
    }
  };

  const clearAll = async () => {
    try {
      await clearMutation.mutateAsync();
      toast.success("Cart cleared.");
    } catch (error) {
      handleError(error, "Could not clear cart.");
    }
  };

  return (
    <section className="space-y-5">
      <PageHeader
        title="Your Cart"
        subtitle="Adjust quantities, remove items, and proceed to checkout."
        actions={
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => cartQuery.refetch()}
              disabled={cartQuery.isFetching}
            >
              <RefreshCcw className="mr-2 h-4 w-4" />
              Refresh
            </Button>
            <Button
              variant="destructive"
              disabled={clearMutation.isPending || !cart?.items.length}
              onClick={clearAll}
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Clear Cart
            </Button>
          </div>
        }
      />

      {cartQuery.isLoading ? <ListSkeleton /> : null}
      {cartQuery.isError ? (
        <ErrorState
          message="Could not load your cart."
          onRetry={() => cartQuery.refetch()}
        />
      ) : null}

      {!cartQuery.isLoading && !cartQuery.isError ? (
        cart?.items.length ? (
          <div className="grid gap-5 lg:grid-cols-[1fr_340px]">
            <div className="space-y-4">
              {cart.items.map((item, idx) => (
                <div key={item.itemId} className="animate-fade-up" style={{ animationDelay: `${idx * 50}ms` }}>
                  <CartItemCard
                    item={item}
                    disabled={
                      updateMutation.isPending || removeMutation.isPending || clearMutation.isPending
                    }
                    onIncrement={updateQty}
                    onDecrement={updateQty}
                    onRemove={removeItem}
                  />
                </div>
              ))}
            </div>

            <Card className="h-fit overflow-hidden">
              <CardContent className="space-y-4 p-5">
                <h3 className="font-display text-2xl">Summary</h3>
                <div className="rounded-2xl border border-border/70 bg-background/80 p-4">
                  <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>Items</span>
                    <span>{cart.items.length}</span>
                  </div>
                  <div className="mt-2 flex items-center justify-between text-base font-semibold">
                    <span>Subtotal</span>
                    <span>{toCurrency(cart.totalPrice)}</span>
                  </div>
                </div>
                <Button asChild className="w-full">
                  <Link href="/checkout">Proceed to Checkout</Link>
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <EmptyState
            title="Your cart is empty"
            description="Browse products and add a few items first."
            actionLabel="Browse products"
            onAction={() => router.push("/products")}
          />
        )
      ) : null}
    </section>
  );
}
