import { BRAND_NAME, BRAND_SHORT, BRAND_TAGLINE } from "@/lib/brand";

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <main className="container flex min-h-screen items-center py-10">
      <div className="grid w-full gap-8 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
        <section className="surface-elevated hidden rounded-[2rem] p-8 lg:block">
          <div className="rounded-2xl border border-border/70 bg-secondary/25 p-5">
            <p className="text-xs uppercase tracking-[0.2em] text-muted-foreground">
              {BRAND_TAGLINE}
            </p>
            <h1 className="mt-3 font-display text-5xl leading-tight">
              Shop globally with <span className="gradient-text">{BRAND_NAME}</span>
            </h1>
            <p className="mt-4 max-w-xl text-sm text-muted-foreground">
              Unified storefront experience for products, cart, checkout, and payments across
              microservices.
            </p>
          </div>
          <div className="mt-6 grid gap-3 sm:grid-cols-3">
            {[
              { label: "Stores", value: "120+" },
              { label: "Countries", value: "42" },
              { label: "Uptime", value: "99.98%" },
            ].map((item) => (
              <article
                key={item.label}
                className="rounded-2xl border border-border/70 bg-background/80 p-4"
              >
                <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                  {item.label}
                </p>
                <p className="mt-2 font-display text-2xl">{item.value}</p>
              </article>
            ))}
          </div>
        </section>

        <section className="relative flex justify-center">
          <div className="pointer-events-none absolute -top-6 left-1/2 hidden h-14 w-14 -translate-x-1/2 place-content-center rounded-2xl border border-border/70 bg-card/90 text-sm font-bold shadow-soft lg:grid">
            {BRAND_SHORT}
          </div>
          {children}
        </section>
      </div>
    </main>
  );
}
