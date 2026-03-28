type UnknownRecord = Record<string, unknown>;

export function asRecord(value: unknown): UnknownRecord {
  if (typeof value === "object" && value !== null && !Array.isArray(value)) {
    return value as UnknownRecord;
  }
  return {};
}

export function asArray(value: unknown): unknown[] {
  return Array.isArray(value) ? value : [];
}

export function toSafeString(value: unknown, fallback = ""): string {
  if (typeof value === "string") {
    return value;
  }
  if (typeof value === "number" || typeof value === "boolean") {
    return String(value);
  }
  return fallback;
}

export function toOptionalString(value: unknown): string | null {
  const next = toSafeString(value).trim();
  return next ? next : null;
}

export function toFiniteNumber(value: unknown, fallback = 0): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : fallback;
}

export function toPositiveInteger(value: unknown, fallback = 1): number {
  const parsed = Math.trunc(toFiniteNumber(value, fallback));
  return parsed > 0 ? parsed : fallback;
}
