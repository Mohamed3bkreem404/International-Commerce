"use client";

import { useQuery } from "@tanstack/react-query";

import { getProducts } from "@/services/products.service";

export const productKeys = {
  all: ["products"] as const,
};

export function useProductsQuery() {
  return useQuery({
    queryKey: productKeys.all,
    queryFn: getProducts,
  });
}
