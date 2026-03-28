import type { Metadata } from "next";
import { Manrope, Playfair_Display } from "next/font/google";

import { BRAND_NAME } from "@/lib/brand";

import "./globals.css";
import { Providers } from "./providers";

const manrope = Manrope({
  subsets: ["latin"],
  variable: "--font-manrope",
});

const playfair = Playfair_Display({
  subsets: ["latin"],
  variable: "--font-playfair",
});

export const metadata: Metadata = {
  title: BRAND_NAME,
  description:
    "International Commerce is a premium e-commerce frontend powered by a microservices backend.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${manrope.variable} ${playfair.variable} min-h-screen bg-background font-sans text-foreground`}
      >
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
