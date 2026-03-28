"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { ShieldCheck, Truck } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { toast } from "sonner";

import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { DetailSkeleton } from "@/components/states/skeleton-loaders";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useApiError } from "@/hooks/use-api-error";
import { useCartQuery } from "@/hooks/use-cart";
import { useCheckoutMutation } from "@/hooks/use-orders";
import { toCurrency } from "@/lib/utils";

const formSchema = z.object({
  shippingAddress: z.string().min(1, "Shipping address is required"),
  notes: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

export default function CheckoutPage() {
  const router = useRouter();
  const handleError = useApiError();
  const cartQuery = useCartQuery();
  const checkoutMutation = useCheckoutMutation();

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shippingAddress: "",
      notes: "",
    },
  });

  const submitCheckout = async (values: FormValues) => {
    try {
      const order = await checkoutMutation.mutateAsync(values);
      toast.success("Order created successfully.");
      router.push(`/checkout/success?orderId=${order.orderId}`);
    } catch (error) {
      handleError(error, "Could not complete checkout.");
    }
  };

  const cart = cartQuery.data;

  return (
    <section className="space-y-5">
      <PageHeader
        title="Checkout"
        subtitle="Confirm delivery details and submit your order with secure checkout."
      />

      {cartQuery.isLoading ? <DetailSkeleton /> : null}
      {cartQuery.isError ? (
        <ErrorState
          message="Could not load checkout details."
          onRetry={() => cartQuery.refetch()}
        />
      ) : null}

      {!cartQuery.isLoading && !cartQuery.isError ? (
        cart?.items.length ? (
          <div className="grid gap-5 lg:grid-cols-[1fr_360px]">
            <Card className="animate-fade-up overflow-hidden">
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
                <div className="flex flex-wrap gap-2 text-xs text-muted-foreground">
                  <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-secondary/30 px-2.5 py-1">
                    <Truck className="h-3.5 w-3.5" />
                    Delivery enabled
                  </span>
                  <span className="inline-flex items-center gap-1 rounded-full border border-border/70 bg-secondary/30 px-2.5 py-1">
                    <ShieldCheck className="h-3.5 w-3.5" />
                    Secure checkout
                  </span>
                </div>
              </CardHeader>
              <CardContent>
                <Form {...form}>
                  <form className="space-y-4" onSubmit={form.handleSubmit(submitCheckout)}>
                    <FormField
                      control={form.control}
                      name="shippingAddress"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Shipping Address</FormLabel>
                          <FormControl>
                            <Input placeholder="City, Street, Building" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="notes"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Notes</FormLabel>
                          <FormControl>
                            <Textarea
                              placeholder="Any details for delivery"
                              rows={5}
                              {...field}
                            />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <Button type="submit" className="w-full" disabled={checkoutMutation.isPending}>
                      {checkoutMutation.isPending ? "Confirming..." : "Confirm Order"}
                    </Button>
                  </form>
                </Form>
              </CardContent>
            </Card>

            <Card className="h-fit animate-fade-up overflow-hidden" style={{ animationDelay: "70ms" }}>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="max-h-60 space-y-2 overflow-auto rounded-2xl border border-border/70 bg-background/80 p-3">
                  {cart.items.map((item) => (
                    <div key={item.itemId} className="flex justify-between text-sm">
                      <span className="text-muted-foreground">
                        {item.productName} x {item.quantity}
                      </span>
                      <span className="font-medium">{toCurrency(item.subtotal)}</span>
                    </div>
                  ))}
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex items-center justify-between rounded-2xl bg-secondary/40 p-3 text-base font-semibold">
                  <span>Total</span>
                  <span>{toCurrency(cart.totalPrice)}</span>
                </div>
              </CardContent>
            </Card>
          </div>
        ) : (
          <EmptyState
            title="Nothing to checkout"
            description="Your cart is empty. Add products before creating an order."
            actionLabel="Go to products"
            onAction={() => router.push("/products")}
          />
        )
      ) : null}
    </section>
  );
}
