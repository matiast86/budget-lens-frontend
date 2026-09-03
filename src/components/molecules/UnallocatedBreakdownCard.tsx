import { useTranslation } from "react-i18next";
import { AlertTriangle, Wand2 } from "lucide-react";
import { formatCurrency } from "../../utils/format-currency";
import { weekOfDate } from "../../utils/weekly-breakdown";
import type { UnallocatedEntry } from "../../utils/weekly-breakdown";
import type { TransactionResponseDto, Currency } from "../../types";

interface UnallocatedBreakdownCardProps {
  entries: UnallocatedEntry[];
  currency: Currency;
  /** Place the whole monthly amount in the week of the transaction date. */
  onQuickFill: (tx: TransactionResponseDto) => void;
  /** Quick-fill every listed transaction. */
  onAutoSplitAll: () => void;
  /** Open the manual W1–W4 editor. */
  onSplitManually: (tx: TransactionResponseDto) => void;
  busy?: boolean;
}

export const UnallocatedBreakdownCard = ({
  entries,
  currency,
  onQuickFill,
  onAutoSplitAll,
  onSplitManually,
  busy,
}: UnallocatedBreakdownCardProps) => {
  const { t, i18n } = useTranslation("ledger");
  const locale = i18n.language;

  if (entries.length === 0) return null;

  return (
    <div className="card border-warning-200 bg-warning-50/50">
      <div className="flex items-start justify-between gap-md flex-wrap">
        <div className="flex items-center gap-sm">
          <AlertTriangle className="w-4 h-4 text-warning-600 shrink-0" />
          <p className="text-sm font-semibold text-stone-900">
            {t("transaction.weekly.unallocatedTitle", { count: entries.length })}
          </p>
        </div>
        <button
          type="button"
          onClick={onAutoSplitAll}
          disabled={busy}
          className="flex items-center gap-xs text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 px-sm py-xs rounded-md transition-colors disabled:opacity-50"
        >
          <Wand2 className="w-3.5 h-3.5" />
          {t("transaction.weekly.autoSplitAll")}
        </button>
      </div>
      <p className="text-xs text-stone-500 mt-xs">
        {t("transaction.weekly.unallocatedHint")}
      </p>

      <ul className="mt-sm divide-y divide-warning-200/60">
        {entries.map(({ tx, allocated, expected }) => {
          const targetWeek = weekOfDate(tx.transactionDate);
          return (
            <li key={tx.id} className="flex items-center gap-sm py-sm flex-wrap">
              <span className="flex-1 min-w-0">
                <span className="block text-sm text-stone-800 truncate">
                  {tx.category.name}
                </span>
                <span className="block text-xs text-stone-500 tabular-nums">
                  {t("transaction.weekly.allocatedOf", {
                    allocated: formatCurrency(allocated, currency, locale),
                    expected: formatCurrency(expected, currency, locale),
                  })}
                </span>
              </span>
              <div className="flex items-center gap-xs shrink-0">
                <button
                  type="button"
                  onClick={() => onQuickFill(tx)}
                  disabled={busy}
                  className="text-xs font-medium text-primary-700 bg-primary-50 hover:bg-primary-100 px-sm py-xs rounded-md transition-colors disabled:opacity-50"
                >
                  {t("transaction.weekly.putInWeek", { week: targetWeek })}
                </button>
                <button
                  type="button"
                  onClick={() => onSplitManually(tx)}
                  className="text-xs font-medium text-stone-500 hover:text-stone-700 px-sm py-xs rounded-md hover:bg-stone-100 transition-colors"
                >
                  {t("transaction.weekly.splitManually")}
                </button>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};
