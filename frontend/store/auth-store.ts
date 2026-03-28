"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

import { AUTH_TOKEN_KEY } from "@/lib/constants";
import { decodeJwt } from "@/lib/token";
import { type AuthProfile } from "@/types/auth";

type AuthState = {
  token: string | null;
  profile: AuthProfile | null;
  setToken: (token: string) => void;
  logout: () => void;
};

const getInitialToken = () =>
  typeof window !== "undefined" ? localStorage.getItem(AUTH_TOKEN_KEY) : null;

const initialToken = getInitialToken();

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: initialToken,
      profile: initialToken ? decodeJwt(initialToken) : null,
      setToken: (token) => {
        if (typeof window !== "undefined") {
          localStorage.setItem(AUTH_TOKEN_KEY, token);
        }
        set({ token, profile: decodeJwt(token) });
      },
      logout: () => {
        if (typeof window !== "undefined") {
          localStorage.removeItem(AUTH_TOKEN_KEY);
        }
        set({ token: null, profile: null });
      },
    }),
    {
      name: "international-commerce-auth",
      partialize: (state) => ({
        token: state.token,
        profile: state.profile,
      }),
    },
  ),
);
