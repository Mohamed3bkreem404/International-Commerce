const API_VERSION_PREFIX = "/api/v1";

function encodePathSegment(value: string) {
  return encodeURIComponent(value.trim());
}

export const API_ROUTES = {
  auth: {
    signUp: `${API_VERSION_PREFIX}/auth/signUp`,
    login: `${API_VERSION_PREFIX}/auth/login`,
  },
  products: {
    list: `${API_VERSION_PREFIX}/products`,
    detail: (productId: string) =>
      `${API_VERSION_PREFIX}/products/${encodePathSegment(productId)}`,
  },
  cart: {
    current: `${API_VERSION_PREFIX}/cart`,
    items: `${API_VERSION_PREFIX}/cart/items`,
    itemDetail: (productId: string) =>
      `${API_VERSION_PREFIX}/cart/items/${encodePathSegment(productId)}`,
  },
  orders: {
    list: `${API_VERSION_PREFIX}/orders`,
    checkout: `${API_VERSION_PREFIX}/orders/checkout`,
    detail: (orderId: string) =>
      `${API_VERSION_PREFIX}/orders/${encodePathSegment(orderId)}`,
    cancel: (orderId: string) =>
      `${API_VERSION_PREFIX}/orders/${encodePathSegment(orderId)}/cancel`,
    pay: (orderId: string) =>
      `${API_VERSION_PREFIX}/orders/${encodePathSegment(orderId)}/pay`,
  },
  payments: {
    list: `${API_VERSION_PREFIX}/payments`,
    detail: (paymentId: string) =>
      `${API_VERSION_PREFIX}/payments/${encodePathSegment(paymentId)}`,
    byOrder: (orderId: string) =>
      `${API_VERSION_PREFIX}/payments/order/${encodePathSegment(orderId)}`,
  },
} as const;
