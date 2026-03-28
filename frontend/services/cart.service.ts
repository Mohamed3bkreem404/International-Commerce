import { api } from "@/lib/axios";
import { API_ROUTES } from "@/lib/api-routes";
import { ApiClientError } from "@/lib/api-error";
import { normalizeCart } from "@/lib/normalizers/cart";
import { unwrapApiResponse } from "@/lib/unwrap-response";
import { type ApiResponse } from "@/types/api";
import {
  type AddCartItemRequest,
  type Cart,
  type UpdateCartItemRequest,
} from "@/types/cart";

function normalizeProductId(productId: string): string {
  const value = productId?.trim();
  if (!value) {
    throw new ApiClientError("Product id is missing. Please refresh products and try again.");
  }
  return value;
}

function assertValidQuantity(quantity: number): number {
  if (!Number.isFinite(quantity) || quantity < 1) {
    throw new ApiClientError("Quantity must be at least 1.");
  }
  return Math.trunc(quantity);
}

export async function getMyCart(): Promise<Cart> {
  const response = await api.get<ApiResponse<unknown>>(API_ROUTES.cart.current);
  return normalizeCart(unwrapApiResponse(response.data));
}

export async function addCartItem(payload: AddCartItemRequest): Promise<Cart> {
  const response = await api.post<ApiResponse<unknown>>(API_ROUTES.cart.items, {
    productId: normalizeProductId(payload.productId),
    quantity: assertValidQuantity(payload.quantity),
  });
  return normalizeCart(unwrapApiResponse(response.data));
}

export async function updateCartItem(
  productId: string,
  payload: UpdateCartItemRequest,
): Promise<Cart> {
  const normalizedProductId = normalizeProductId(productId);
  const response = await api.put<ApiResponse<unknown>>(
    API_ROUTES.cart.itemDetail(normalizedProductId),
    {
      quantity: assertValidQuantity(payload.quantity),
    },
  );
  return normalizeCart(unwrapApiResponse(response.data));
}

export async function removeCartItem(productId: string): Promise<Cart> {
  const response = await api.delete<ApiResponse<unknown>>(
    API_ROUTES.cart.itemDetail(normalizeProductId(productId)),
  );
  return normalizeCart(unwrapApiResponse(response.data));
}

export async function clearCart(): Promise<Cart> {
  const response = await api.delete<ApiResponse<unknown>>(API_ROUTES.cart.current);
  return normalizeCart(unwrapApiResponse(response.data));
}
