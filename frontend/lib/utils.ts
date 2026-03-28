import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toCurrency(value: number | string | null | undefined): string {
  const amount = Number(value ?? 0);
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDateTime(value?: string | null): string {
  if (!value) {
    return "N/A";
  }
  return new Date(value).toLocaleString();
}

export function truncate(value: string, max = 10): string {
  if (value.length <= max) {
    return value;
  }
  return `${value.slice(0, max)}...`;
}
