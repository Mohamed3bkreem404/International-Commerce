import { type Product } from "@/types/product";
import {
  asArray,
  asRecord,
  toFiniteNumber,
  toOptionalString,
  toSafeString,
} from "@/lib/normalizers/shared";

export function normalizeProduct(raw: unknown): Product {
  const data = asRecord(raw);

  return {
    id: toSafeString(data.id ?? data.productId),
    name: toSafeString(data.name ?? data.productName),
    description: toSafeString(data.description ?? data.productDescription),
    price: toFiniteNumber(data.price ?? data.productPrice),
    stockQuantity: toFiniteNumber(data.stockQuantity),
    createdAt: toOptionalString(data.createdAt) ?? undefined,
    updatedAt: toOptionalString(data.updatedAt) ?? undefined,
  };
}

export function normalizeProductList(raw: unknown): Product[] {
  return asArray(raw).map(normalizeProduct);
}
