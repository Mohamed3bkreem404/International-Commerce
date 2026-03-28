"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { DetailSkeleton } from "@/components/states/skeleton-loaders";
import { useAuthStore } from "@/store/auth-store";

type ProtectedRouteProps = {
  children: React.ReactNode;
};

export function ProtectedRoute({ children }: ProtectedRouteProps) {
  const router = useRouter();
  const token = useAuthStore((state) => state.token);
  const [hydrated, setHydrated] = useState(false);

  useEffect(() => {
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated && !token) {
      router.replace("/login");
    }
  }, [hydrated, token, router]);

  if (!hydrated || !token) {
    return (
      <div className="container py-10">
        <DetailSkeleton />
      </div>
    );
  }

  return <>{children}</>;
}
