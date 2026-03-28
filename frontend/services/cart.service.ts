import { api } from "@/lib/axios";
import { unwrapApiResponse } from "@/lib/unwrap-response";
import { type ApiResponse } from "@/types/api";
import {
  type AddCartItemRequest,
  type Cart,
  type UpdateCartItemRequest,
} from "@/types/cart";

export async function getMyCart(): Promise<Cart> {
  const response = await api.get<ApiResponse<Cart>>("/api/v1/cart");
  return unwrapApiResponse(response.data);
}

export async function addCartItem(payload: AddCartItemRequest): Promise<Cart> {
  const response = await api.post<ApiResponse<Cart>>("/api/v1/cart/items", payload);
  return unwrapApiResponse(response.data);
}

export async function updateCartItem(
  productId: string,
  payload: UpdateCartItemRequest,
): Promise<Cart> {
  const response = await api.put<ApiResponse<Cart>>(
    `/api/v1/cart/items/${productId}`,
    payload,
  );
  return unwrapApiResponse(response.data);
}

export async function removeCartItem(productId: string): Promise<Cart> {
  const response = await api.delete<ApiResponse<Cart>>(`/api/v1/cart/items/${productId}`);
  return unwrapApiResponse(response.data);
}

export async function clearCart(): Promise<Cart> {
  const response = await api.delete<ApiResponse<Cart>>("/api/v1/cart");
  return unwrapApiResponse(response.data);
}
