import axios, { AxiosError } from "axios";

import { ApiClientError } from "@/lib/api-error";
import { AUTH_TOKEN_KEY } from "@/lib/constants";
import { type ApiResponse } from "@/types/api";

type MaybeWrappedError = ApiResponse<unknown> | undefined;

export const api = axios.create({
  headers: {
    "Content-Type": "application/json",
  },
});

api.interceptors.request.use((config) => {
  if (config.url && !/^https?:\/\//i.test(config.url)) {
    // Keep all service calls absolute from host root to avoid nested-route URLs.
    if (!config.url.startsWith("/")) {
      config.url = `/${config.url}`;
    }
    config.baseURL = "";
  }

  if (typeof window !== "undefined") {
    const token = localStorage.getItem(AUTH_TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

function extractApiError(error: AxiosError<MaybeWrappedError>) {
  const payload = error.response?.data;
  const fallback = error.message || "Unexpected API error.";
  const message =
    payload?.errors?.map((item) => item.message).join(" | ") || fallback;

  return new ApiClientError(message, error.response?.status);
}

api.interceptors.response.use(
  (response) => response,
  (error: AxiosError<MaybeWrappedError>) => {
    if (error.response?.status === 401 && typeof window !== "undefined") {
      localStorage.removeItem(AUTH_TOKEN_KEY);
      window.dispatchEvent(new Event("auth:unauthorized"));
      if (!window.location.pathname.startsWith("/login")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(extractApiError(error));
  },
);
