"use client";

import { toast } from "sonner";

import { getApiErrorMessage } from "@/lib/api-error-handler";

export function useApiError() {
  return (error: unknown, fallback = "Something went wrong.") => {
    const message = getApiErrorMessage(error, fallback);
    toast.error(message);
    return message;
  };
}
