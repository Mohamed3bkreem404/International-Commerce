import { api } from "@/lib/axios";
import { API_ROUTES } from "@/lib/api-routes";
import { normalizeOrder, normalizeOrderList } from "@/lib/normalizers/order";
import { unwrapApiResponse } from "@/lib/unwrap-response";
import { type ApiResponse } from "@/types/api";
import { type CreateOrderRequest, type Order } from "@/types/order";

export async function checkout(payload: CreateOrderRequest): Promise<Order> {
  const response = await api.post<ApiResponse<unknown>>(API_ROUTES.orders.checkout, payload);
  return normalizeOrder(unwrapApiResponse(response.data));
}

export async function getMyOrders(): Promise<Order[]> {
  const response = await api.get<ApiResponse<unknown>>(API_ROUTES.orders.list);
  return normalizeOrderList(unwrapApiResponse(response.data));
}

export async function getOrderById(orderId: string): Promise<Order> {
  const response = await api.get<ApiResponse<unknown>>(API_ROUTES.orders.detail(orderId));
  return normalizeOrder(unwrapApiResponse(response.data));
}

export async function cancelOrder(orderId: string): Promise<Order> {
  const response = await api.put<ApiResponse<unknown>>(API_ROUTES.orders.cancel(orderId));
  return normalizeOrder(unwrapApiResponse(response.data));
}

export async function markOrderPaid(orderId: string): Promise<Order> {
  const response = await api.put<ApiResponse<unknown>>(API_ROUTES.orders.pay(orderId));
  return normalizeOrder(unwrapApiResponse(response.data));
}
