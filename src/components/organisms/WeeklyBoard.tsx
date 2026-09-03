import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../utils/format-currency";
import { weekDayRange } from "../../utils/weekly-breakdown";
import { cn } from "../../utils/cn";
import type { WeekBucket } from "../../utils/weekly-breakdown";
import type { TransactionResponseDto, Currency } from "../../types";

interface WeeklyBoardProps {
  buckets: [WeekBucket, WeekBucket, WeekBucket, WeekBucket];
  currency: Currency;
  /** The board's payment month, "YYYY-MM" — drives the real W4 end day. */
  month: string;
  onChipClick: (tx: TransactionResponseDto) => void;
  currentWeek?: 1 | 2 | 3 | 4;
}

export const WeeklyBoard = ({
  buckets,
  currency,
  month,
  onChipClick,
  currentWeek,
}: WeeklyBoardProps) => {
  const { t, i18n } = useTranslation("ledger");
  const locale = i18n.language;
  const [yearStr, monthStr] = month.split("-");
  const year = Number(yearStr);
  const monthIndex = Number(monthStr) - 1;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
      {buckets.map((bucket) => {
        const isNow = bucket.week === currentWeek;
        const net = bucket.income - bucket.expense;
        const range = weekDayRange(bucket.week, year, monthIndex);
        return (
          <section
            key={bucket.week}
            className={cn(
              "card p-0 overflow-hidden flex flex-col",
              isNow && "ring-2 ring-primary-400",
            )}
            aria-label={t("transaction.weekly.weekLabel", { week: bucket.week })}
            aria-current={isNow ? "date" : undefined}
          >
            {/* Column header */}
            <div
              className={cn(
                "px-md py-sm border-b",
                isNow
                  ? "bg-primary-50 border-primary-100"
                  : "bg-stone-50/60 border-stone-100",
              )}
            >
              <div className="flex items-center justify-between gap-xs">
                <p
                  className={cn(
                    "text-sm font-semibold",
                    isNow ? "text-primary-800" : "text-stone-900",
                  )}
                >
                  {t("transaction.weekly.weekLabel", { week: bucket.week })}
                </p>
                {isNow ? (
                  <span className="flex items-center gap-xs rounded-full bg-primary-600 px-xs py-0.5 text-[10px] font-semibold uppercase tracking-wide text-white">
                    {t("transaction.weekly.thisWeek")}
                  </span>
                ) : (
                  <span className="text-[11px] text-stone-400 tabular-nums">
                    {range.start}–{range.end}
                  </span>
                )}
              </div>
              {isNow && (
                <span className="block text-[11px] text-primary-600 tabular-nums mt-0.5">
                  {range.start}–{range.end}
                </span>
              )}
              <p
                className={cn(
                  "text-sm financial-amount mt-0.5 tabular-nums",
                  net > 0 ? "amount-positive" : "text-stone-900",
                )}
              >
                {net >= 0 ? "+" : "−"}
                {formatCurrency(Math.abs(net), currency, locale)}
              </p>
            </div>

            {/* Entries */}
            {bucket.entries.length === 0 ? (
              <p className="px-md py-lg text-xs text-stone-400 text-center">
                {t("transaction.weekly.emptyWeek")}
              </p>
            ) : (
              <ul className="divide-y divide-stone-100">
                {bucket.entries.map(({ tx, amount }) => {
                  const isIncome = tx.entryType === "INCOME";
                  return (
                    <li key={`${bucket.week}-${tx.id}`}>
                      <button
                        type="button"
                        onClick={() => onChipClick(tx)}
                        className="flex w-full items-center gap-sm px-md py-sm text-left hover:bg-stone-50 transition-colors"
                        title={t("transaction.weekly.editHint")}
                      >
                        <span className="flex-1 min-w-0">
                          <span className="block text-sm text-stone-800 truncate">
                            {tx.category.name}
                          </span>
                          {tx.comment && (
                            <span className="block text-xs text-stone-400 truncate">
                              {tx.comment}
                            </span>
                          )}
                        </span>
                        <span
                          className={cn(
                            "text-sm financial-amount tabular-nums shrink-0",
                            isIncome ? "amount-positive" : "text-stone-900",
                          )}
                        >
                          {isIncome ? "+" : "−"}
                          {formatCurrency(amount, currency, locale)}
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        );
      })}
    </div>
  );
};
