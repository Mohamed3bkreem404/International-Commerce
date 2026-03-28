"use client";

import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

import { ProductArtwork } from "@/components/product/product-artwork";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { getProductVisual } from "@/lib/product-visuals";
import { toCurrency } from "@/lib/utils";
import { type Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
  onAddToCart: (productId: string) => void;
  isAdding?: boolean;
  remainingStock?: number;
  inCartQuantity?: number;
};

export function ProductCard({
  product,
  onAddToCart,
  isAdding = false,
  remainingStock,
  inCartQuantity = 0,
}: ProductCardProps) {
  const safeRemainingStock = Math.max(
    0,
    Number.isFinite(remainingStock)
      ? Number(remainingStock)
      : Number(product.stockQuantity),
  );
  const inStock = safeRemainingStock > 0;
  const normalizedId = product.id?.trim();
  const hasId = Boolean(normalizedId);
  const visual = getProductVisual(product.name);
  const Icon = visual.icon;

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card className="h-full overflow-hidden">
        <CardHeader className="border-b border-border/70 bg-secondary/25">
          <div className="mb-3 flex items-center justify-between gap-2">
            {inStock ? (
              <Badge variant="success">{safeRemainingStock} remaining</Badge>
            ) : (
              <Badge variant="destructive">Out of stock</Badge>
            )}
            <p className="text-base font-semibold text-primary">{toCurrency(product.price)}</p>
          </div>
          <ProductArtwork variant={visual.artworkVariant} label={product.name} />
          <div
            className={`mb-3 inline-flex h-10 w-10 items-center justify-center rounded-2xl border ${visual.surfaceClassName}`}
            aria-hidden="true"
          >
            <Icon className={`h-5 w-5 ${visual.iconClassName}`} />
          </div>
          <CardTitle className="line-clamp-2 text-xl">{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <p className="line-clamp-3 text-sm text-muted-foreground">{product.description}</p>
          {inCartQuantity > 0 ? (
            <p className="mt-3 text-xs text-muted-foreground">
              {inCartQuantity} currently in your cart
            </p>
          ) : null}
        </CardContent>
        <CardFooter>
          <Button
            disabled={!inStock || isAdding || !hasId}
            className="w-full"
            onClick={() => onAddToCart(normalizedId || "")}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isAdding ? "Adding..." : "Add to Cart"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
