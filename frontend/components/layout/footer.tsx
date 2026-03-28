import Link from "next/link";

import { BRAND_NAME, BRAND_TAGLINE } from "@/lib/brand";

const footerLinks = [
  { href: "/products", label: "Products" },
  { href: "/cart", label: "Cart" },
  { href: "/orders", label: "Orders" },
  { href: "/payments", label: "Payments" },
];

export function Footer() {
  return (
    <footer className="mt-10 border-t border-border/70 pt-6">
      <div className="flex flex-col gap-6 rounded-3xl border border-border/70 bg-card/70 px-5 py-6 shadow-soft backdrop-blur-xl sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
            {BRAND_TAGLINE}
          </p>
          <h3 className="mt-1 font-display text-2xl">{BRAND_NAME}</h3>
          <p className="mt-2 max-w-xl text-sm text-muted-foreground">
            Built for global commerce teams with reliable ordering, checkout, and payment flows.
          </p>
        </div>
        <nav className="flex flex-wrap gap-2">
          {footerLinks.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="rounded-xl border border-border/70 bg-background/80 px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
            >
              {item.label}
            </Link>
          ))}
        </nav>
      </div>
    </footer>
  );
}
