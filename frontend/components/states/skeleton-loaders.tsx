import { Skeleton } from "@/components/ui/skeleton";

export function ProductGridSkeleton() {
  return (
    <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
      {Array.from({ length: 6 }).map((_, idx) => (
        <div key={idx} className="surface-elevated rounded-3xl p-5">
          <Skeleton className="h-5 w-32" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-1 h-4 w-11/12" />
          <Skeleton className="mt-5 h-9 w-full" />
        </div>
      ))}
    </div>
  );
}

export function ListSkeleton() {
  return (
    <div className="space-y-4">
      {Array.from({ length: 4 }).map((_, idx) => (
        <div key={idx} className="surface-elevated rounded-3xl p-5">
          <Skeleton className="h-5 w-40" />
          <Skeleton className="mt-3 h-4 w-full" />
          <Skeleton className="mt-1 h-4 w-8/12" />
        </div>
      ))}
    </div>
  );
}

export function DetailSkeleton() {
  return (
    <div className="surface-elevated rounded-3xl p-6">
      <Skeleton className="h-7 w-52" />
      <Skeleton className="mt-4 h-4 w-full" />
      <Skeleton className="mt-2 h-4 w-9/12" />
      <Skeleton className="mt-8 h-40 w-full" />
    </div>
  );
}
