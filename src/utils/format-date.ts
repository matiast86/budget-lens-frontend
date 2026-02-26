import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import type { Locale } from "date-fns";

const LOCALE_MAP: Record<string, Locale> = { es, en: enUS };

/**
 * Dates from the backend are UTC midnight ISO strings (e.g. "2026-02-26T00:00:00.000Z").
 * Passing them directly to `new Date()` and then formatting with date-fns uses the local
 * timezone, which shifts the displayed date backward in negative-offset zones (e.g. UTC-3).
 * We reconstruct a local Date using the UTC year/month/day so format() shows the
 * correct calendar date regardless of the user's timezone.
 */
const utcDateOnly = (isoString: string): Date => {
  const d = new Date(isoString);
  return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
};

export const formatTransactionDate = (date: string, locale: string): string =>
  format(utcDateOnly(date), "dd MMM yyyy", {
    locale: LOCALE_MAP[locale] ?? enUS,
  });

export const formatPaymentMonth = (date: string, locale: string): string =>
  format(utcDateOnly(date), "MMM yyyy", {
    locale: LOCALE_MAP[locale] ?? enUS,
  });
