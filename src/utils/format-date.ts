import { format } from "date-fns";
import { es, enUS } from "date-fns/locale";
import type { Locale } from "date-fns";

const LOCALE_MAP: Record<string, Locale> = { es, en: enUS };

export const formatTransactionDate = (date: string, locale: string): string =>
  format(new Date(date), "dd MMM yyyy", {
    locale: LOCALE_MAP[locale] ?? enUS,
  });

export const formatPaymentMonth = (date: string, locale: string): string =>
  format(new Date(date), "MMM yyyy", {
    locale: LOCALE_MAP[locale] ?? enUS,
  });
