import { AlertTriangle } from "lucide-react";

import { Button } from "@/components/ui/button";

type ErrorStateProps = {
  title?: string;
  message: string;
  onRetry?: () => void;
};

export function ErrorState({
  title = "Something went wrong",
  message,
  onRetry,
}: ErrorStateProps) {
  return (
    <div className="flex min-h-[240px] flex-col items-center justify-center rounded-3xl border border-red-500/25 bg-red-500/8 px-6 text-center shadow-soft">
      <AlertTriangle className="mb-4 h-6 w-6 text-red-600 dark:text-red-400" />
      <h3 className="font-display text-xl">{title}</h3>
      <p className="mt-2 text-sm text-muted-foreground">{message}</p>
      {onRetry ? (
        <Button variant="destructive" className="mt-5" onClick={onRetry}>
          Retry
        </Button>
      ) : null}
    </div>
  );
}
