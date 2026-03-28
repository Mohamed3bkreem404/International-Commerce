import { api } from "@/lib/axios";
import { API_ROUTES } from "@/lib/api-routes";
import { normalizeProduct, normalizeProductList } from "@/lib/normalizers/product";
import { unwrapApiResponse } from "@/lib/unwrap-response";
import { type ApiResponse } from "@/types/api";
import { type Product } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  const response = await api.get<ApiResponse<unknown>>(API_ROUTES.products.list);
  return normalizeProductList(unwrapApiResponse(response.data));
}

export async function getProductById(productId: string): Promise<Product> {
  const response = await api.get<ApiResponse<unknown>>(API_ROUTES.products.detail(productId));
  return normalizeProduct(unwrapApiResponse(response.data));
}

export async function createProduct(payload: Omit<Product, "id">): Promise<string> {
  const response = await api.post<ApiResponse<string>>(API_ROUTES.products.list, payload);
  return unwrapApiResponse(response.data);
}

export async function updateProduct(
  productId: string,
  payload: Omit<Product, "id">,
): Promise<Product> {
  const response = await api.put<ApiResponse<unknown>>(API_ROUTES.products.detail(productId), payload);
  return normalizeProduct(unwrapApiResponse(response.data));
}

export async function deleteProduct(productId: string): Promise<void> {
  await api.delete(API_ROUTES.products.detail(productId));
}
