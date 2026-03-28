import { api } from "@/lib/axios";
import { unwrapApiResponse } from "@/lib/unwrap-response";
import { type ApiResponse } from "@/types/api";
import { type Product } from "@/types/product";

export async function getProducts(): Promise<Product[]> {
  const response = await api.get<ApiResponse<Product[]>>("/api/v1/products");
  return unwrapApiResponse(response.data);
}

export async function getProductById(productId: string): Promise<Product> {
  const response = await api.get<ApiResponse<Product>>(`/api/v1/products/${productId}`);
  return unwrapApiResponse(response.data);
}

export async function createProduct(payload: Omit<Product, "id">): Promise<string> {
  const response = await api.post<ApiResponse<string>>("/api/v1/products", payload);
  return unwrapApiResponse(response.data);
}

export async function updateProduct(
  productId: string,
  payload: Omit<Product, "id">,
): Promise<Product> {
  const response = await api.put<ApiResponse<Product>>(
    `/api/v1/products/${productId}`,
    payload,
  );
  return unwrapApiResponse(response.data);
}

export async function deleteProduct(productId: string): Promise<void> {
  await api.delete(`/api/v1/products/${productId}`);
}
