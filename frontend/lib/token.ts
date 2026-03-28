import { type AuthProfile } from "@/types/auth";

export function decodeJwt(token: string): AuthProfile | null {
  try {
    const payload = token.split(".")[1];
    if (!payload) {
      return null;
    }
    const normalized = payload.replace(/-/g, "+").replace(/_/g, "/");
    const decoded = atob(normalized);
    return JSON.parse(decoded) as AuthProfile;
  } catch {
    return null;
  }
}
