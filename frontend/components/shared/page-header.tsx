import { cn } from "@/lib/utils";
import { BRAND_NAME } from "@/lib/brand";

type PageHeaderProps = {
  title: string;
  subtitle: string;
  actions?: React.ReactNode;
  className?: string;
};

export function PageHeader({ title, subtitle, actions, className }: PageHeaderProps) {
  return (
    <div
      className={cn(
        "surface-elevated mb-6 flex flex-col gap-4 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between",
        className,
      )}
    >
      <div>
        <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
          {BRAND_NAME}
        </p>
        <h1 className="mt-1 font-display text-3xl sm:text-4xl">{title}</h1>
        <p className="mt-1 max-w-2xl text-sm text-muted-foreground">{subtitle}</p>
      </div>
      {actions}
    </div>
  );
}
