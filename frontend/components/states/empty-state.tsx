import { Box } from "lucide-react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type EmptyStateProps = {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
};

export function EmptyState({
  title,
  description,
  actionLabel,
  onAction,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "surface-elevated flex min-h-[220px] flex-col items-center justify-center rounded-3xl border-dashed px-6 py-10 text-center",
        className,
      )}
    >
      <div className="mb-4 rounded-2xl bg-secondary p-3 shadow-innerGlow">
        <Box className="h-5 w-5 text-primary" />
      </div>
      <h3 className="font-display text-xl">{title}</h3>
      <p className="mt-2 max-w-md text-sm text-muted-foreground">{description}</p>
      {actionLabel && onAction ? (
        <Button className="mt-5" variant="outline" onClick={onAction}>
          {actionLabel}
        </Button>
      ) : null}
    </div>
  );
}
