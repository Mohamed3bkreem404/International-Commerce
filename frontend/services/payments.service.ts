import { api } from "@/lib/axios";
import { API_ROUTES } from "@/lib/api-routes";
import { normalizePayment, normalizePaymentList } from "@/lib/normalizers/payment";
import { unwrapApiResponse } from "@/lib/unwrap-response";
import { type ApiResponse } from "@/types/api";
import { type CreatePaymentRequest, type Payment } from "@/types/payment";

export async function createPayment(payload: CreatePaymentRequest): Promise<Payment> {
  const response = await api.post<ApiResponse<unknown>>(API_ROUTES.payments.list, payload);
  return normalizePayment(unwrapApiResponse(response.data));
}

export async function getMyPayments(): Promise<Payment[]> {
  const response = await api.get<ApiResponse<unknown>>(API_ROUTES.payments.list);
  return normalizePaymentList(unwrapApiResponse(response.data));
}

export async function getPaymentById(paymentId: string): Promise<Payment> {
  const response = await api.get<ApiResponse<unknown>>(API_ROUTES.payments.detail(paymentId));
  return normalizePayment(unwrapApiResponse(response.data));
}

export async function getPaymentByOrderId(orderId: string): Promise<Payment> {
  const response = await api.get<ApiResponse<unknown>>(API_ROUTES.payments.byOrder(orderId));
  return normalizePayment(unwrapApiResponse(response.data));
}
