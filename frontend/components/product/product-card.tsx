"use client";

import { motion } from "framer-motion";
import { ShoppingCart } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toCurrency } from "@/lib/utils";
import { type Product } from "@/types/product";

type ProductCardProps = {
  product: Product;
  onAddToCart: (productId: string) => void;
  isAdding?: boolean;
};

export function ProductCard({ product, onAddToCart, isAdding = false }: ProductCardProps) {
  const inStock = Number(product.stockQuantity) > 0;
  const hasId = Boolean(product.id);

  return (
    <motion.div whileHover={{ y: -5 }} transition={{ duration: 0.2 }}>
      <Card className="h-full overflow-hidden">
        <CardHeader className="border-b border-border/70 bg-secondary/25">
          <div className="mb-3 flex items-center justify-between gap-2">
            {inStock ? (
              <Badge variant="success">{product.stockQuantity} in stock</Badge>
            ) : (
              <Badge variant="destructive">Out of stock</Badge>
            )}
            <p className="text-base font-semibold text-primary">{toCurrency(product.price)}</p>
          </div>
          <CardTitle className="line-clamp-2 text-xl">{product.name}</CardTitle>
        </CardHeader>
        <CardContent className="pt-5">
          <p className="line-clamp-3 text-sm text-muted-foreground">{product.description}</p>
        </CardContent>
        <CardFooter>
          <Button
            disabled={!inStock || isAdding || !hasId}
            className="w-full"
            onClick={() => onAddToCart(product.id)}
          >
            <ShoppingCart className="mr-2 h-4 w-4" />
            {isAdding ? "Adding..." : "Add to Cart"}
          </Button>
        </CardFooter>
      </Card>
    </motion.div>
  );
}
