import { api } from "@/lib/axios";
import { unwrapApiResponse } from "@/lib/unwrap-response";
import { type ApiResponse } from "@/types/api";
import { type LogInRequest, type SignUpRequest } from "@/types/auth";

export async function signUp(payload: SignUpRequest): Promise<string> {
  const response = await api.post<ApiResponse<string>>("/api/v1/auth/signUp", payload);
  return unwrapApiResponse(response.data);
}

export async function login(payload: LogInRequest): Promise<string> {
  const response = await api.post<ApiResponse<string>>("/api/v1/auth/login", payload);
  return unwrapApiResponse(response.data);
}
