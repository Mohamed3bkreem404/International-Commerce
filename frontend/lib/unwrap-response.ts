import { ApiClientError } from "@/lib/api-error";
import { type ApiResponse } from "@/types/api";

export function unwrapApiResponse<T>(response: ApiResponse<T>): T {
  if (!response) {
    throw new ApiClientError("Empty server response.");
  }

  if (response.status === "Error") {
    const messages = response.errors?.map((item) => item.message).filter(Boolean);
    throw new ApiClientError(
      messages?.join(" | ") || "Request failed.",
      undefined,
      messages,
    );
  }

  return response.data;
}
