import { type Payment, type PaymentMethod, type PaymentStatus } from "@/types/payment";
import {
  asArray,
  asRecord,
  toFiniteNumber,
  toOptionalString,
  toSafeString,
} from "@/lib/normalizers/shared";

const PAYMENT_METHOD_VALUES: PaymentMethod[] = ["CARD", "CASH_ON_DELIVERY", "WALLET"];
const PAYMENT_STATUS_VALUES: PaymentStatus[] = ["PENDING", "SUCCESS", "FAILED", "REFUNDED"];

function normalizePaymentMethod(value: unknown): PaymentMethod {
  const candidate = toSafeString(value).toUpperCase() as PaymentMethod;
  return PAYMENT_METHOD_VALUES.includes(candidate) ? candidate : "CARD";
}

function normalizePaymentStatus(value: unknown): PaymentStatus {
  const candidate = toSafeString(value).toUpperCase() as PaymentStatus;
  return PAYMENT_STATUS_VALUES.includes(candidate) ? candidate : "PENDING";
}

export function normalizePayment(raw: unknown): Payment {
  const data = asRecord(raw);

  return {
    paymentId: toSafeString(data.paymentId ?? data.id),
    orderId: toSafeString(data.orderId ?? data.order_id),
    userId: toSafeString(data.userId ?? data.user_id),
    amount: toFiniteNumber(data.amount),
    paymentMethod: normalizePaymentMethod(data.paymentMethod ?? data.payment_method),
    paymentStatus: normalizePaymentStatus(data.paymentStatus ?? data.payment_status),
    transactionReference: toSafeString(
      data.transactionReference ?? data.transaction_reference,
    ),
    notes: toOptionalString(data.notes),
    createdAt: toSafeString(data.createdAt ?? data.created_at),
    paidAt: toOptionalString(data.paidAt ?? data.paid_at),
  };
}

export function normalizePaymentList(raw: unknown): Payment[] {
  return asArray(raw).map(normalizePayment);
}
