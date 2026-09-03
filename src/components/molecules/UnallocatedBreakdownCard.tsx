import { useTranslation } from "react-i18next";
import { AlertTriangle } from "lucide-react";
import { formatCurrency } from "../../utils/format-currency";
import type { UnallocatedEntry } from "../../utils/weekly-breakdown";
import type { TransactionResponseDto, Currency } from "../../types";

interface UnallocatedBreakdownCardProps {
  entries: UnallocatedEntry[];
  currency: Currency;
  onAssign: (tx: TransactionResponseDto) => void;
}

export const UnallocatedBreakdownCard = ({
  entries,
  currency,
  onAssign,
}: UnallocatedBreakdownCardProps) => {
  const { t, i18n } = useTranslation("ledger");
  const locale = i18n.language;

  if (entries.length === 0) return null;

  return (
    <div className="card border-warning-200 bg-warning-50/50">
      <div className="flex items-center gap-sm">
        <AlertTriangle className="w-4 h-4 text-warning-600 shrink-0" />
        <p className="text-sm font-semibold text-stone-900">
          {t("transaction.weekly.unallocatedTitle", { count: entries.length })}
        </p>
      </div>
      <p className="text-xs text-stone-500 mt-xs">
        {t("transaction.weekly.unallocatedHint")}
      </p>

      <ul className="mt-sm divide-y divide-warning-200/60">
        {entries.map(({ tx, allocated, expected }) => (
          <li key={tx.id} className="flex items-center gap-sm py-sm">
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
            <button
              type="button"
              onClick={() => onAssign(tx)}
              className="shrink-0 text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 px-sm py-xs rounded-md transition-colors"
            >
              {t("transaction.weekly.assignWeeks")}
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};
