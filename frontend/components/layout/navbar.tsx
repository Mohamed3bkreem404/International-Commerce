"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { LogOut, ShoppingCart, Sparkles, User2 } from "lucide-react";

import { BRAND_NAME, BRAND_SHORT, BRAND_TAGLINE } from "@/lib/brand";
import { ThemeToggle } from "@/components/layout/theme-toggle";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import { useAuthStore } from "@/store/auth-store";
import { useCartStore } from "@/store/cart-store";

const navItems = [
  { href: "/products", label: "Products" },
  { href: "/cart", label: "Cart" },
  { href: "/checkout", label: "Checkout" },
  { href: "/orders", label: "Orders" },
  { href: "/payments", label: "Payments" },
];

export function Navbar() {
  const pathname = usePathname();
  const router = useRouter();
  const cartCount = useCartStore((state) => state.cartCount);
  const profile = useAuthStore((state) => state.profile);
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    router.push("/login");
  };

  return (
    <header className="sticky top-3 z-40 mb-7">
      <div className="glass-panel rounded-[1.75rem]">
        <div className="grid gap-4 p-4 lg:grid-cols-[auto_1fr_auto] lg:items-center">
          <div className="flex items-center justify-between gap-4">
            <Link href="/products" className="group flex items-center gap-3">
              <div className="grid h-11 w-11 place-content-center rounded-2xl bg-gradient-to-br from-primary to-accent text-sm font-bold text-white shadow-soft transition-transform duration-300 group-hover:-translate-y-0.5">
                {BRAND_SHORT}
              </div>
              <div>
                <p className="text-[11px] uppercase tracking-[0.22em] text-muted-foreground">
                  {BRAND_TAGLINE}
                </p>
                <h2 className="font-display text-lg leading-none">{BRAND_NAME}</h2>
              </div>
            </Link>
            <div className="sm:hidden lg:hidden">
              <ThemeToggle />
            </div>
          </div>

          <nav className="flex gap-1.5 overflow-auto rounded-2xl border border-border/70 bg-background/60 p-1 shadow-innerGlow">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className={cn(
                  "rounded-xl px-3 py-2 text-sm font-medium text-muted-foreground transition-all duration-200 hover:bg-secondary hover:text-foreground",
                  pathname === item.href && "bg-primary text-primary-foreground shadow-soft",
                )}
              >
                {item.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center justify-end gap-2">
            <Badge
              variant="outline"
              className="hidden h-9 items-center gap-1.5 rounded-2xl border-primary/30 bg-primary/10 px-3 text-primary md:inline-flex"
            >
              <Sparkles className="h-3.5 w-3.5" />
              Premium
            </Badge>
            <div className="hidden sm:block">
              <ThemeToggle />
            </div>
            <Button variant="outline" asChild className="relative">
              <Link href="/cart">
                <ShoppingCart className="mr-2 h-4 w-4" />
                Cart
                {cartCount > 0 ? (
                  <Badge className="ml-2 h-5 min-w-5 justify-center rounded-full" variant="default">
                    {cartCount}
                  </Badge>
                ) : null}
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" aria-label="Profile">
                  <Avatar className="h-8 w-8">
                    <AvatarFallback>
                      {(profile?.username || profile?.sub || "U").slice(0, 1).toUpperCase()}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-64">
                <DropdownMenuLabel className="space-y-1">
                  <p className="text-sm font-semibold">{profile?.username || profile?.sub || "User"}</p>
                  <p className="text-xs font-normal text-muted-foreground">
                    Role: {profile?.role || "USER"}
                  </p>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => router.push("/orders")}
                  className="cursor-pointer"
                >
                  <User2 className="mr-2 h-4 w-4" />
                  My Orders
                </DropdownMenuItem>
                <DropdownMenuItem
                  onClick={handleLogout}
                  className="cursor-pointer text-red-600 dark:text-red-400"
                >
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </header>
  );
}
