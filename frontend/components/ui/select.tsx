import * as React from "react";

import { cn } from "@/lib/utils";

export type NativeSelectProps = React.SelectHTMLAttributes<HTMLSelectElement>;

const Select = React.forwardRef<HTMLSelectElement, NativeSelectProps>(
  ({ className, children, ...props }, ref) => (
    <select
      ref={ref}
      className={cn(
        "h-10 w-full rounded-2xl border border-input bg-background/85 px-3 text-sm outline-none ring-offset-background shadow-innerGlow transition-all focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50",
        className,
      )}
      {...props}
    >
      {children}
    </select>
  ),
);

Select.displayName = "Select";

export { Select };
