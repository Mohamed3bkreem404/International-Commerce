import { api } from "@/lib/axios";
import { unwrapApiResponse } from "@/lib/unwrap-response";
import { type ApiResponse } from "@/types/api";
import { type CreateOrderRequest, type Order } from "@/types/order";

export async function checkout(payload: CreateOrderRequest): Promise<Order> {
  const response = await api.post<ApiResponse<Order>>("/api/v1/orders/checkout", payload);
  return unwrapApiResponse(response.data);
}

export async function getMyOrders(): Promise<Order[]> {
  const response = await api.get<ApiResponse<Order[]>>("/api/v1/orders");
  return unwrapApiResponse(response.data);
}

export async function getOrderById(orderId: string): Promise<Order> {
  const response = await api.get<ApiResponse<Order>>(`/api/v1/orders/${orderId}`);
  return unwrapApiResponse(response.data);
}

export async function cancelOrder(orderId: string): Promise<Order> {
  const response = await api.put<ApiResponse<Order>>(`/api/v1/orders/${orderId}/cancel`);
  return unwrapApiResponse(response.data);
}

export async function markOrderPaid(orderId: string): Promise<Order> {
  const response = await api.put<ApiResponse<Order>>(`/api/v1/orders/${orderId}/pay`);
  return unwrapApiResponse(response.data);
}
