import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../utils/format-currency";
import { cn } from "../../utils/cn";
import type { Currency } from "../../types";

interface WeeklyDrawdownStripProps {
  weekIncome: [number, number, number, number];
  weekExpense: [number, number, number, number];
  currency: Currency;
  /** The week "today" falls into (1–4) when the board shows the current month. */
  currentWeek?: 1 | 2 | 3 | 4;
}

/**
 * The Excel "Balance Mes" idea: how much is still due to leave this month after
 * each weekly checkpoint. Five steps — start, then the remainder after W1…W4.
 */
export const WeeklyDrawdownStrip = ({
  weekIncome,
  weekExpense,
  currency,
  currentWeek,
}: WeeklyDrawdownStripProps) => {
  const { t, i18n } = useTranslation("ledger");
  const locale = i18n.language;

  const totalExpense = weekExpense.reduce((a, b) => a + b, 0);
  const totalIncome = weekIncome.reduce((a, b) => a + b, 0);

  // remainingAfter[k] = expense still to go once weeks 1..k have passed (k=0 → all).
  const remainingAfter: number[] = [totalExpense];
  for (let i = 0; i < 4; i++) {
    remainingAfter.push(remainingAfter[i] - weekExpense[i]);
  }

  const steps = [
    { label: t("transaction.weekly.start"), value: remainingAfter[0], week: 0 },
    ...([1, 2, 3, 4] as const).map((w) => ({
      label: `W${w}`,
      value: remainingAfter[w],
      week: w,
    })),
  ];

  return (
    <div className="card">
      <div className="flex items-baseline justify-between gap-md flex-wrap">
        <p className="section-title">{t("transaction.weekly.drawdownTitle")}</p>
        <p className="text-xs text-stone-500">
          {t("transaction.weekly.flowSummary", {
            out: formatCurrency(totalExpense, currency, locale),
            in: formatCurrency(totalIncome, currency, locale),
          })}
        </p>
      </div>

      <div className="mt-md flex items-end gap-xs sm:gap-sm">
        {steps.map((step) => {
          const pct = totalExpense > 0 ? (step.value / totalExpense) * 100 : 0;
          const isPast = currentWeek != null && step.week > 0 && step.week < currentWeek;
          const isNow = currentWeek != null && step.week === currentWeek;
          return (
            <div key={step.label} className="flex-1 flex flex-col items-center gap-xs min-w-0">
              <span className="text-[11px] tabular-nums text-stone-500 truncate w-full text-center">
                {formatCurrency(Math.max(step.value, 0), currency, locale)}
              </span>
              <div className="w-full h-24 flex items-end rounded-md bg-stone-100 overflow-hidden">
                <div
                  className={cn(
                    "w-full rounded-md transition-all",
                    isNow ? "bg-primary-500" : isPast ? "bg-stone-300" : "bg-primary-300",
                  )}
                  style={{ height: `${Math.max(Math.min(pct, 100), 2)}%` }}
                />
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  isNow ? "text-primary-700" : "text-stone-500",
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
