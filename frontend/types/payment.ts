export type PaymentMethod = "CARD" | "CASH_ON_DELIVERY" | "WALLET";
export type PaymentStatus = "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";

export type Payment = {
  paymentId: string;
  orderId: string;
  userId: string;
  amount: number;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  transactionReference: string;
  notes: string | null;
  createdAt: string;
  paidAt: string | null;
};

export type CreatePaymentRequest = {
  orderId: string;
  paymentMethod: PaymentMethod;
  notes?: string;
};
