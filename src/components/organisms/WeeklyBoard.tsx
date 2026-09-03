import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../utils/format-currency";
import { cn } from "../../utils/cn";
import type { WeekBucket } from "../../utils/weekly-breakdown";
import type { TransactionResponseDto, Currency } from "../../types";

interface WeeklyBoardProps {
  buckets: [WeekBucket, WeekBucket, WeekBucket, WeekBucket];
  currency: Currency;
  onChipClick: (tx: TransactionResponseDto) => void;
  currentWeek?: 1 | 2 | 3 | 4;
}

const WEEK_DAYS: Record<number, string> = {
  1: "1–7",
  2: "8–14",
  3: "15–21",
  4: "22+",
};

export const WeeklyBoard = ({
  buckets,
  currency,
  onChipClick,
  currentWeek,
}: WeeklyBoardProps) => {
  const { t, i18n } = useTranslation("ledger");
  const locale = i18n.language;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
      {buckets.map((bucket) => {
        const isNow = bucket.week === currentWeek;
        const net = bucket.income - bucket.expense;
        return (
          <section
            key={bucket.week}
            className={cn(
              "card p-0 overflow-hidden flex flex-col",
              isNow && "ring-2 ring-primary-300",
            )}
            aria-label={t("transaction.weekly.weekLabel", { week: bucket.week })}
          >
            {/* Column header */}
            <div className="px-md py-sm border-b border-stone-100 bg-stone-50/60">
              <div className="flex items-baseline justify-between gap-xs">
                <p className="text-sm font-semibold text-stone-900">
                  {t("transaction.weekly.weekLabel", { week: bucket.week })}
                </p>
                <span className="text-[11px] text-stone-400 tabular-nums">
                  {WEEK_DAYS[bucket.week]}
                </span>
              </div>
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
