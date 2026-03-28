import { type Cart, type CartItem } from "@/types/cart";
import {
  asArray,
  asRecord,
  toFiniteNumber,
  toPositiveInteger,
  toSafeString,
} from "@/lib/normalizers/shared";

function normalizeCartItem(raw: unknown, index: number): CartItem {
  const data = asRecord(raw);
  const productId = toSafeString(data.productId ?? data.product_id ?? data.id);
  const price = toFiniteNumber(data.price ?? data.productPrice);
  const quantity = toPositiveInteger(data.quantity, 1);
  const subtotal = toFiniteNumber(data.subtotal, price * quantity);

  return {
    itemId: toSafeString(data.itemId ?? data.id, `item-${index}`),
    productId,
    productName: toSafeString(
      data.productName ?? data.name ?? data.product_name,
      "Unknown product",
    ),
    price,
    quantity,
    subtotal,
  };
}

export function normalizeCart(raw: unknown): Cart {
  const data = asRecord(raw);
  const items = asArray(data.items).map(normalizeCartItem);
  const derivedTotal = items.reduce((sum, item) => sum + item.subtotal, 0);

  return {
    cartId: toSafeString(data.cartId ?? data.id),
    userId: toSafeString(data.userId ?? data.user_id),
    items,
    totalPrice: toFiniteNumber(data.totalPrice ?? data.totalAmount, derivedTotal),
  };
}
