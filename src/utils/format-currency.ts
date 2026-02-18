import type { Currency } from "../types";

export const formatCurrency = (
  amount: number,
  currency: Currency,
  locale: string,
): string =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
