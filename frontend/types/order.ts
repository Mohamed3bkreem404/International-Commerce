export type OrderStatus = "CREATED" | "PAID" | "CANCELLED" | "COMPLETED";
export type OrderPaymentStatus = "PENDING" | "PAID" | "FAILED" | "REFUNDED";

export type OrderItem = {
  itemId: string;
  productId: string;
  productName: string;
  price: number;
  quantity: number;
  subtotal: number;
};

export type Order = {
  orderId: string;
  userId: string;
  totalAmount: number;
  status: OrderStatus;
  paymentStatus: OrderPaymentStatus;
  shippingAddress: string | null;
  notes: string | null;
  createdAt: string;
  items: OrderItem[];
};

export type CreateOrderRequest = {
  shippingAddress: string;
  notes?: string;
};
