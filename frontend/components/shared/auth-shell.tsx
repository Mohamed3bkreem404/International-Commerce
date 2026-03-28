import Link from "next/link";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BRAND_NAME, BRAND_SHORT, BRAND_TAGLINE } from "@/lib/brand";

type AuthShellProps = {
  title: string;
  description: string;
  footerLabel: string;
  footerLink: string;
  footerHref: string;
  children: React.ReactNode;
};

export function AuthShell({
  title,
  description,
  footerLabel,
  footerLink,
  footerHref,
  children,
}: AuthShellProps) {
  return (
    <Card className="w-full max-w-md overflow-hidden">
      <CardHeader className="space-y-3 border-b border-border/70 bg-secondary/20">
        <div className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-content-center rounded-2xl bg-gradient-to-br from-primary to-accent text-xs font-bold text-white shadow-soft">
            {BRAND_SHORT}
          </div>
          <div>
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">{BRAND_TAGLINE}</p>
            <p className="font-display text-xl">{BRAND_NAME}</p>
          </div>
        </div>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {children}
        <p className="text-center text-sm text-muted-foreground">
          {footerLabel}{" "}
          <Link href={footerHref} className="font-semibold text-primary hover:underline">
            {footerLink}
          </Link>
        </p>
      </CardContent>
    </Card>
  );
}
