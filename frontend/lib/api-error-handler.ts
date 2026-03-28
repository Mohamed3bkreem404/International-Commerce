import { ApiClientError } from "@/lib/api-error";

export function getApiErrorMessage(error: unknown, fallback: string): string {
  if (error instanceof ApiClientError) {
    return error.message;
  }

  if (error instanceof Error && error.message) {
    return error.message;
  }

  return fallback;
}
