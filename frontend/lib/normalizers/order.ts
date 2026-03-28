import {
  type Order,
  type OrderItem,
  type OrderPaymentStatus,
  type OrderStatus,
} from "@/types/order";
import {
  asArray,
  asRecord,
  toFiniteNumber,
  toOptionalString,
  toPositiveInteger,
  toSafeString,
} from "@/lib/normalizers/shared";

const ORDER_STATUS_VALUES: OrderStatus[] = ["CREATED", "PAID", "CANCELLED", "COMPLETED"];
const ORDER_PAYMENT_STATUS_VALUES: OrderPaymentStatus[] = [
  "PENDING",
  "PAID",
  "FAILED",
  "REFUNDED",
];

function normalizeOrderStatus(value: unknown): OrderStatus {
  const candidate = toSafeString(value).toUpperCase() as OrderStatus;
  return ORDER_STATUS_VALUES.includes(candidate) ? candidate : "CREATED";
}

function normalizeOrderPaymentStatus(value: unknown): OrderPaymentStatus {
  const candidate = toSafeString(value).toUpperCase() as OrderPaymentStatus;
  return ORDER_PAYMENT_STATUS_VALUES.includes(candidate) ? candidate : "PENDING";
}

function normalizeOrderItem(raw: unknown, index: number): OrderItem {
  const data = asRecord(raw);
  const price = toFiniteNumber(data.price);
  const quantity = toPositiveInteger(data.quantity, 1);
  const subtotal = toFiniteNumber(data.subtotal, price * quantity);

  return {
    itemId: toSafeString(data.itemId ?? data.id, `item-${index}`),
    productId: toSafeString(data.productId ?? data.product_id),
    productName: toSafeString(data.productName ?? data.product_name ?? data.name, "Unknown product"),
    price,
    quantity,
    subtotal,
  };
}

export function normalizeOrder(raw: unknown): Order {
  const data = asRecord(raw);
  const items = asArray(data.items).map(normalizeOrderItem);

  return {
    orderId: toSafeString(data.orderId ?? data.id),
    userId: toSafeString(data.userId ?? data.user_id),
    totalAmount: toFiniteNumber(data.totalAmount ?? data.totalPrice),
    status: normalizeOrderStatus(data.status),
    paymentStatus: normalizeOrderPaymentStatus(data.paymentStatus ?? data.payment_status),
    shippingAddress: toOptionalString(data.shippingAddress ?? data.shipping_address),
    notes: toOptionalString(data.notes),
    createdAt: toSafeString(data.createdAt ?? data.created_at),
    items,
  };
}

export function normalizeOrderList(raw: unknown): Order[] {
  return asArray(raw).map(normalizeOrder);
}
