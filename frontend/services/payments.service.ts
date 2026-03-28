import { api } from "@/lib/axios";
import { unwrapApiResponse } from "@/lib/unwrap-response";
import { type ApiResponse } from "@/types/api";
import { type CreatePaymentRequest, type Payment } from "@/types/payment";

export async function createPayment(payload: CreatePaymentRequest): Promise<Payment> {
  const response = await api.post<ApiResponse<Payment>>("/api/v1/payments", payload);
  return unwrapApiResponse(response.data);
}

export async function getMyPayments(): Promise<Payment[]> {
  const response = await api.get<ApiResponse<Payment[]>>("/api/v1/payments");
  return unwrapApiResponse(response.data);
}

export async function getPaymentById(paymentId: string): Promise<Payment> {
  const response = await api.get<ApiResponse<Payment>>(`/api/v1/payments/${paymentId}`);
  return unwrapApiResponse(response.data);
}

export async function getPaymentByOrderId(orderId: string): Promise<Payment> {
  const response = await api.get<ApiResponse<Payment>>(`/api/v1/payments/order/${orderId}`);
  return unwrapApiResponse(response.data);
}
