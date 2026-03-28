import { api } from "@/lib/axios";
import { unwrapApiResponse } from "@/lib/unwrap-response";
import { type ApiResponse } from "@/types/api";
import { type Product } from "@/types/product";

type ProductPayload = Partial<{
  id: string;
  productId: string;
  name: string;
  productName: string;
  description: string;
  productDescription: string;
  price: number | string;
  productPrice: number | string;
  stockQuantity: number | string;
}>;

function normalizeProduct(raw: ProductPayload): Product {
  return {
    id: String(raw.id ?? raw.productId ?? ""),
    name: String(raw.name ?? raw.productName ?? ""),
    description: String(raw.description ?? raw.productDescription ?? ""),
    price: Number(raw.price ?? raw.productPrice ?? 0),
    stockQuantity: Number(raw.stockQuantity ?? 0),
  };
}

export async function getProducts(): Promise<Product[]> {
  const response = await api.get<ApiResponse<ProductPayload[]>>("/api/v1/products");
  return unwrapApiResponse(response.data).map(normalizeProduct);
}

export async function getProductById(productId: string): Promise<Product> {
  const response = await api.get<ApiResponse<ProductPayload>>(`/api/v1/products/${productId}`);
  return normalizeProduct(unwrapApiResponse(response.data));
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
