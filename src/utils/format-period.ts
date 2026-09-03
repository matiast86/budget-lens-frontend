/**
 * Format a "YYYY-MM" period string (as returned by the reports + debt APIs)
 * into a short localized month label, e.g. "Feb 26" / "feb 26".
 */
export const formatMonthShort = (period: string, locale: string): string => {
  const [y, m] = period.split("-").map(Number);
  if (Number.isNaN(y) || Number.isNaN(m)) return period;
  return new Intl.DateTimeFormat(locale, {
    month: "short",
    year: "2-digit",
  }).format(new Date(y, m - 1, 1));
};
