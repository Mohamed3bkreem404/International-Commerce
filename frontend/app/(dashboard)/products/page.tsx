"use client";

import { startTransition, useDeferredValue, useMemo, useState } from "react";
import { Filter, RefreshCcw } from "lucide-react";
import { toast } from "sonner";

import { ProductCard } from "@/components/product/product-card";
import { PageHeader } from "@/components/shared/page-header";
import { EmptyState } from "@/components/states/empty-state";
import { ErrorState } from "@/components/states/error-state";
import { ProductGridSkeleton } from "@/components/states/skeleton-loaders";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useApiError } from "@/hooks/use-api-error";
import { useAddCartItemMutation, useCartQuery } from "@/hooks/use-cart";
import { useProductsQuery } from "@/hooks/use-products";

export default function ProductsPage() {
  const handleError = useApiError();
  const [query, setQuery] = useState("");
  const [inStockOnly, setInStockOnly] = useState(false);

  const productsQuery = useProductsQuery();
  const cartQuery = useCartQuery();
  const addToCartMutation = useAddCartItemMutation();

  const deferredQuery = useDeferredValue(query);
  const quantitiesByProductId = useMemo(() => {
    const cartItems = cartQuery.data?.items || [];
    return cartItems.reduce(
      (acc, item) => {
        const normalizedProductId = item.productId?.trim();
        if (!normalizedProductId) {
          return acc;
        }
        acc[normalizedProductId] = (acc[normalizedProductId] ?? 0) + Number(item.quantity || 0);
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [cartQuery.data?.items]);

  const remainingStockByProductId = useMemo(() => {
    const products = productsQuery.data || [];
    return products.reduce(
      (acc, product) => {
        const normalizedProductId = product.id?.trim();
        if (!normalizedProductId) {
          return acc;
        }
        const reserved = quantitiesByProductId[normalizedProductId] ?? 0;
        acc[normalizedProductId] = Math.max(0, Number(product.stockQuantity) - reserved);
        return acc;
      },
      {} as Record<string, number>,
    );
  }, [productsQuery.data, quantitiesByProductId]);

  const filteredProducts = useMemo(() => {
    const products = productsQuery.data || [];
    return products.filter((product) => {
      const matchesText =
        !deferredQuery ||
        product.name.toLowerCase().includes(deferredQuery.toLowerCase());
      const matchesStock = !inStockOnly || (remainingStockByProductId[product.id?.trim()] ?? 0) > 0;
      return matchesText && matchesStock;
    });
  }, [productsQuery.data, deferredQuery, inStockOnly, remainingStockByProductId]);

  const onAddToCart = async (productId: string) => {
    if (!productId?.trim()) {
      toast.error("This product is unavailable right now. Please refresh and try again.");
      return;
    }

    try {
      await addToCartMutation.mutateAsync({ productId: productId.trim(), quantity: 1 });
      toast.success("Item added to cart.");
    } catch (error) {
      handleError(error, "Could not add item to cart.");
    }
  };

  return (
    <section>
      <PageHeader
        title="Product Catalog"
        subtitle="Discover products, apply quick filters, and add items to cart in one flow."
        actions={
          <Button
            variant="outline"
            onClick={() => productsQuery.refetch()}
            disabled={productsQuery.isFetching}
          >
            <RefreshCcw className="mr-2 h-4 w-4" />
            Refresh
          </Button>
        }
      />

      <div className="surface-elevated mb-5 grid gap-3 rounded-3xl p-4 sm:grid-cols-[1fr_auto]">
        <div className="relative">
          <Input
            value={query}
            onChange={(event) => {
              const nextValue = event.target.value;
              startTransition(() => {
                setQuery(nextValue);
              });
            }}
            placeholder="Search by product name..."
            className="pr-10"
          />
          <Filter className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
        </div>
        <label className="inline-flex items-center gap-2 rounded-2xl border border-border/70 bg-background/80 px-3 text-sm text-muted-foreground">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(event) => setInStockOnly(event.target.checked)}
          />
          In-stock only
        </label>
      </div>

      {!productsQuery.isLoading && !productsQuery.isError ? (
        <div className="mb-5 grid gap-3 rounded-3xl border border-border/70 bg-secondary/20 p-4 sm:grid-cols-3">
          <article>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Total products</p>
            <p className="mt-1 font-display text-3xl">{productsQuery.data?.length || 0}</p>
          </article>
          <article>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Filtered</p>
            <p className="mt-1 font-display text-3xl">{filteredProducts.length}</p>
          </article>
          <article>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">Ready stock</p>
            <p className="mt-1 font-display text-3xl">
              {(productsQuery.data || []).filter((product) => {
                const normalizedProductId = product.id?.trim();
                return normalizedProductId
                  ? (remainingStockByProductId[normalizedProductId] ?? 0) > 0
                  : false;
              }).length}
            </p>
          </article>
        </div>
      ) : null}

      {productsQuery.isLoading ? <ProductGridSkeleton /> : null}

      {productsQuery.isError ? (
        <ErrorState
          message="Could not load products."
          onRetry={() => productsQuery.refetch()}
        />
      ) : null}

      {!productsQuery.isLoading && !productsQuery.isError ? (
        filteredProducts.length ? (
          <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {filteredProducts.map((product, idx) => (
              <div key={product.id} style={{ animationDelay: `${idx * 70}ms` }} className="animate-fade-up">
                <ProductCard
                  product={product}
                  onAddToCart={onAddToCart}
                  isAdding={addToCartMutation.isPending}
                  remainingStock={remainingStockByProductId[product.id?.trim()] ?? 0}
                  inCartQuantity={quantitiesByProductId[product.id?.trim()] ?? 0}
                />
              </div>
            ))}
          </div>
        ) : (
          <EmptyState
            title="No products found"
            description="Try another search term or disable stock filtering."
            actionLabel="Reset filters"
            onAction={() => {
              setQuery("");
              setInStockOnly(false);
            }}
          />
        )
      ) : null}
    </section>
  );
}
