export const queryKeys = {
  products: {
    all: ["products"] as const,
    detail: (productId: string) => ["products", productId] as const,
  },
  cart: {
    current: ["cart"] as const,
  },
  orders: {
    all: ["orders"] as const,
    detail: (orderId: string) => ["orders", orderId] as const,
  },
  payments: {
    all: ["payments"] as const,
    detail: (paymentId: string) => ["payments", paymentId] as const,
    byOrder: (orderId: string) => ["payments", "order", orderId] as const,
  },
} as const;
