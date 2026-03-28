"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useSearchParams } from "next/navigation";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { truncate } from "@/lib/utils";
import { BRAND_NAME } from "@/lib/brand";

export default function CheckoutSuccessPage() {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("orderId");

  return (
    <div className="mx-auto max-w-2xl">
      <Card>
        <CardHeader className="items-center text-center">
          <div className="mb-3 rounded-full bg-emerald-500/15 p-3">
            <CheckCircle2 className="h-8 w-8 text-emerald-600 dark:text-emerald-400" />
          </div>
          <CardTitle className="text-3xl">Order Confirmed</CardTitle>
          <p className="text-sm text-muted-foreground">
            Your checkout is complete and your order has been created in {BRAND_NAME}.
          </p>
        </CardHeader>
        <CardContent className="space-y-4 text-center">
          <div className="rounded-2xl border border-border/70 bg-secondary/40 p-4">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              Order Reference
            </p>
            <p className="mt-1 text-lg font-semibold">
              {orderId ? truncate(orderId, 14) : "N/A"}
            </p>
          </div>
          <div className="flex flex-wrap justify-center gap-2">
            <Button asChild>
              <Link href="/orders">View Orders</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/products">Continue Shopping</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
