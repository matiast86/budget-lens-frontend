import { useState } from "react";
import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../utils/format-currency";
import { sumWeeks } from "../../utils/weekly-breakdown";
import { cn } from "../../utils/cn";
import type { TransactionResponseDto, Currency } from "../../types";

interface WeeklyDrawdownStripProps {
  transactions: TransactionResponseDto[];
  currency: Currency;
  /** The week "today" falls into (1–4) when the board shows the current month. */
  currentWeek?: 1 | 2 | 3 | 4;
}

/**
 * The Excel "Balance Mes" idea: how much is still due to leave this month after
 * each weekly checkpoint. Five steps — start, then the remainder after W1…W4.
 * Mirrors the cashflow report: scoped to "counts toward the month" by default,
 * and OWED_TO_ME is netted out of the starting figure.
 */
export const WeeklyDrawdownStrip = ({
  transactions,
  currency,
  currentWeek,
}: WeeklyDrawdownStripProps) => {
  const { t, i18n } = useTranslation("ledger");
  const locale = i18n.language;
  const [cashflowOnly, setCashflowOnly] = useState(true);

  const { weekIncome, weekExpense, owedToMe } = sumWeeks(transactions, {
    impactsCashflowOnly: cashflowOnly,
  });

  const totalExpense = weekExpense.reduce((a, b) => a + b, 0);
  const totalIncome = weekIncome.reduce((a, b) => a + b, 0);

  // remainingAfter[k] = bucketed expense still to go once weeks 1..k have passed.
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

  const netStart = totalExpense - owedToMe;

  return (
    <div className="card">
      <div className="flex items-baseline justify-between gap-md flex-wrap">
        <p className="section-title">{t("transaction.weekly.drawdownTitle")}</p>
        <div className="flex items-center gap-xs">
          {(["counts", "all"] as const).map((opt) => {
            const active = (opt === "counts") === cashflowOnly;
            return (
              <button
                key={opt}
                type="button"
                onClick={() => setCashflowOnly(opt === "counts")}
                aria-pressed={active}
                className={cn(
                  "text-xs font-medium px-sm py-xs rounded-full border transition-colors",
                  active
                    ? "bg-primary-600 text-white border-primary-600"
                    : "bg-white text-stone-500 border-stone-200 hover:border-primary-400",
                )}
              >
                {t(
                  opt === "counts"
                    ? "transaction.weekly.scopeCashflow"
                    : "transaction.weekly.scopeAll",
                )}
              </button>
            );
          })}
        </div>
      </div>

      <p className="text-xs text-stone-500 mt-xs">
        {t("transaction.weekly.flowSummary", {
          out: formatCurrency(totalExpense, currency, locale),
          in: formatCurrency(totalIncome, currency, locale),
        })}
        {owedToMe > 0.01 && (
          <>
            {" · "}
            {t("transaction.weekly.owedNote", {
              owed: formatCurrency(owedToMe, currency, locale),
              net: formatCurrency(Math.max(netStart, 0), currency, locale),
            })}
          </>
        )}
      </p>

      <div className="mt-md flex items-end gap-xs sm:gap-sm">
        {steps.map((step) => {
          const pct = totalExpense > 0 ? (step.value / totalExpense) * 100 : 0;
          const isPast =
            currentWeek != null && step.week > 0 && step.week < currentWeek;
          const isNow = currentWeek != null && step.week === currentWeek;
          return (
            <div
              key={step.label}
              className="flex-1 flex flex-col items-center gap-xs min-w-0"
            >
              <span
                className={cn(
                  "text-[10px] font-semibold uppercase tracking-wide h-4",
                  isNow ? "text-primary-700" : "text-transparent",
                )}
              >
                {isNow ? `▾ ${t("transaction.weekly.now")}` : "·"}
              </span>
              <span className="text-[11px] tabular-nums text-stone-500 truncate w-full text-center">
                {formatCurrency(Math.max(step.value, 0), currency, locale)}
              </span>
              <div
                className={cn(
                  "w-full h-24 flex items-end rounded-md overflow-hidden",
                  isNow ? "bg-primary-100 ring-2 ring-primary-400" : "bg-stone-100",
                )}
              >
                <div
                  className={cn(
                    "w-full rounded-md transition-all",
                    isNow
                      ? "bg-primary-600"
                      : isPast
                        ? "bg-stone-300"
                        : "bg-primary-300",
                  )}
                  style={{ height: `${Math.max(Math.min(pct, 100), 2)}%` }}
                />
              </div>
              <span
                className={cn(
                  "text-xs font-medium",
                  isNow ? "text-primary-700 font-semibold" : "text-stone-500",
                )}
              >
                {step.label}
              </span>
            </div>
          );
        })}
      </div>

      {currentWeek != null && (
        <div className="mt-sm flex items-center gap-md text-[11px] text-stone-400">
          <span className="flex items-center gap-xs">
            <span className="w-2.5 h-2.5 rounded-sm bg-stone-300" /> {t("transaction.weekly.legendPast")}
          </span>
          <span className="flex items-center gap-xs">
            <span className="w-2.5 h-2.5 rounded-sm bg-primary-600" /> {t("transaction.weekly.now")}
          </span>
          <span className="flex items-center gap-xs">
            <span className="w-2.5 h-2.5 rounded-sm bg-primary-300" /> {t("transaction.weekly.legendUpcoming")}
          </span>
        </div>
      )}
    </div>
  );
};
