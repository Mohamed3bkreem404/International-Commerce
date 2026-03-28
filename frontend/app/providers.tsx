"use client";

import dynamic from "next/dynamic";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ThemeProvider } from "next-themes";
import { useEffect, useState } from "react";
import { Toaster } from "sonner";

import { AUTH_TOKEN_KEY } from "@/lib/constants";
import { useAuthStore } from "@/store/auth-store";

const ReactQueryDevtools = dynamic(
  () => import("@tanstack/react-query-devtools").then((mod) => mod.ReactQueryDevtools),
  { ssr: false },
);

type ProvidersProps = {
  children: React.ReactNode;
};

export function Providers({ children }: ProvidersProps) {
  const token = useAuthStore((state) => state.token);
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60_000,
            refetchOnWindowFocus: false,
            retry: 1,
          },
          mutations: {
            retry: 0,
          },
        },
      }),
  );

  useEffect(() => {
    const handler = () => {
      useAuthStore.getState().logout();
    };

    window.addEventListener("auth:unauthorized", handler);
    return () => {
      window.removeEventListener("auth:unauthorized", handler);
    };
  }, []);

  useEffect(() => {
    if (token) {
      localStorage.setItem(AUTH_TOKEN_KEY, token);
    } else {
      localStorage.removeItem(AUTH_TOKEN_KEY);
    }
  }, [token]);

  return (
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        {children}
        <Toaster richColors position="top-right" />
        {process.env.NODE_ENV === "development" ? (
          <ReactQueryDevtools initialIsOpen={false} />
        ) : null}
      </QueryClientProvider>
    </ThemeProvider>
  );
}
