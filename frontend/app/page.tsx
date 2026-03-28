import Link from "next/link";
import { ArrowRight, Globe2, ShieldCheck, Sparkles, Zap } from "lucide-react";

import { BRAND_NAME, BRAND_SHORT, BRAND_TAGLINE } from "@/lib/brand";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

const highlights = [
  {
    title: "Frictionless Checkout",
    description: "Streamlined product, cart, and checkout experiences tuned for conversion.",
    icon: Zap,
  },
  {
    title: "Global Reach",
    description: "Built for distributed teams and international growth across markets.",
    icon: Globe2,
  },
  {
    title: "Reliable Security",
    description: "Token-based auth and hardened API interactions for production confidence.",
    icon: ShieldCheck,
  },
];

export default function HomePage() {
  return (
    <main className="container py-6 sm:py-10">
      <header className="glass-panel flex items-center justify-between rounded-3xl px-4 py-3">
        <Link href="/" className="flex items-center gap-3">
          <div className="grid h-10 w-10 place-content-center rounded-2xl bg-gradient-to-br from-primary to-accent text-xs font-bold text-white shadow-soft">
            {BRAND_SHORT}
          </div>
          <div>
            <p className="text-[11px] uppercase tracking-[0.2em] text-muted-foreground">
              {BRAND_TAGLINE}
            </p>
            <p className="font-display text-xl leading-none">{BRAND_NAME}</p>
          </div>
        </Link>
        <div className="flex gap-2">
          <Button variant="outline" asChild>
            <Link href="/login">Sign in</Link>
          </Button>
          <Button asChild>
            <Link href="/signup">Create account</Link>
          </Button>
        </div>
      </header>

      <section className="relative mt-6 overflow-hidden rounded-[2rem] border border-border/70 bg-card/78 px-6 py-10 shadow-premium sm:px-10 sm:py-14">
        <div className="pointer-events-none absolute -left-20 top-0 h-56 w-56 rounded-full bg-primary/20 blur-3xl" />
        <div className="pointer-events-none absolute -right-16 bottom-0 h-56 w-56 rounded-full bg-accent/20 blur-3xl" />
        <div className="relative grid gap-8 lg:grid-cols-[1.05fr_0.95fr] lg:items-center">
          <div>
            <p className="inline-flex items-center gap-2 rounded-full border border-border/70 bg-secondary/60 px-3 py-1 text-xs text-muted-foreground">
              <Sparkles className="h-3.5 w-3.5 text-accent" />
              Enterprise-grade storefront
            </p>
            <h1 className="mt-4 max-w-2xl font-display text-5xl leading-tight sm:text-6xl">
              The new standard for <span className="gradient-text">global e-commerce UX</span>
            </h1>
            <p className="mt-4 max-w-xl text-base text-muted-foreground">
              {BRAND_NAME} delivers a modern, performant storefront with seamless cart, checkout,
              orders, and payments on top of your microservices backend.
            </p>
            <div className="mt-7 flex flex-wrap gap-3">
              <Button size="lg" asChild>
                <Link href="/login">
                  Start Shopping
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/signup">Create account</Link>
              </Button>
            </div>
          </div>

          <div className="grid gap-3">
            {[
              { label: "Countries served", value: "42" },
              { label: "Average checkout", value: "< 2 min" },
              { label: "Operational uptime", value: "99.98%" },
            ].map((item) => (
              <Card key={item.label} className="animate-float">
                <CardContent className="flex items-end justify-between gap-4 p-5">
                  <div>
                    <p className="text-xs uppercase tracking-[0.18em] text-muted-foreground">
                      {item.label}
                    </p>
                    <p className="mt-1 font-display text-3xl">{item.value}</p>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      <section className="mt-7 grid gap-4 md:grid-cols-3">
        {highlights.map((item) => {
          const Icon = item.icon;
          return (
            <Card key={item.title}>
              <CardContent className="p-5">
                <div className="mb-3 inline-flex rounded-2xl bg-secondary p-2.5">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <h2 className="font-display text-2xl">{item.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{item.description}</p>
              </CardContent>
            </Card>
          );
        })}
      </section>
    </main>
  );
}
