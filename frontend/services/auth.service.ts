import { api } from "@/lib/axios";
import { API_ROUTES } from "@/lib/api-routes";
import { unwrapApiResponse } from "@/lib/unwrap-response";
import { type ApiResponse } from "@/types/api";
import { type LogInRequest, type SignUpRequest } from "@/types/auth";

export async function signUp(payload: SignUpRequest): Promise<string> {
  const response = await api.post<ApiResponse<string>>(API_ROUTES.auth.signUp, payload);
  return unwrapApiResponse(response.data);
}

export async function login(payload: LogInRequest): Promise<string> {
  const response = await api.post<ApiResponse<string>>(API_ROUTES.auth.login, payload);
  return unwrapApiResponse(response.data);
}
