"use client";

import { useQuery } from "@tanstack/react-query";

import { queryKeys } from "@/lib/query-keys";
import { getProducts } from "@/services/products.service";

export const productKeys = queryKeys.products;

export function useProductsQuery() {
  return useQuery({
    queryKey: queryKeys.products.all,
    queryFn: getProducts,
  });
}
