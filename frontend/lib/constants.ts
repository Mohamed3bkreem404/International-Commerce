function normalizeApiBaseUrl(raw?: string) {
  if (!raw) {
    return "/api";
  }

  if (raw === "/api") {
    return raw;
  }

  try {
    const url = new URL(raw);
    url.pathname = "";
    url.search = "";
    url.hash = "";
    return url.toString().replace(/\/$/, "");
  } catch {
    return raw.replace(/\/$/, "");
  }
}

export const API_BASE_URL = normalizeApiBaseUrl(
  process.env.NEXT_PUBLIC_API_URL || "/api",
);
export const AUTH_TOKEN_KEY = "international-commerce-token";
