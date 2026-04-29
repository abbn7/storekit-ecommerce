import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(
  price: number,
  currency: string = "USD",
  locale: string = "en-US"
): string {
  return new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
  }).format(price / 100);
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trimEnd() + "…";
}

/** Format a Zod validation error into a human-readable string (L7) */
export function formatZodError(error: { flatten: () => { fieldErrors: Record<string, string[] | undefined> } }): string {
  const errors = error.flatten().fieldErrors;
  return Object.entries(errors)
    .map(([key, vals]) => `${key}: ${vals?.join(", ")}`)
    .join("; ");
}

/** Country code to display name lookup (H7) */
export const COUNTRY_NAMES: Record<string, string> = {
  US: "United States",
  CA: "Canada",
  GB: "United Kingdom",
  AU: "Australia",
  DE: "Germany",
  FR: "France",
  IT: "Italy",
  ES: "Spain",
  NL: "Netherlands",
  SE: "Sweden",
  NO: "Norway",
  DK: "Denmark",
  FI: "Finland",
  JP: "Japan",
  SG: "Singapore",
  HK: "Hong Kong",
  NZ: "New Zealand",
  IE: "Ireland",
  CH: "Switzerland",
  AT: "Austria",
  BE: "Belgium",
  MX: "Mexico",
  BR: "Brazil",
  IN: "India",
  AE: "United Arab Emirates",
};

export function getCountryName(code: string): string {
  return COUNTRY_NAMES[code] ?? code;
}
