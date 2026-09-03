import { useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { CreditCard } from "lucide-react";
import { formatCurrency } from "../../utils/format-currency";
import { cn } from "../../utils/cn";
import type { TransactionResponseDto, Currency } from "../../types";

interface WeeklyMethodAssignCardProps {
  transactions: TransactionResponseDto[];
  currency: Currency;
  busy?: boolean;
  /** Put the whole monthly amount of every movement on this method into `week`. */
  onAssign: (paymentMethodId: number, week: 1 | 2 | 3 | 4) => void;
}

interface MethodSummary {
  id: number;
  name: string;
  count: number;
  total: number;
}

/**
 * Bulk helper: drop every movement paid with one payment method into a single
 * week (e.g. a credit-card summary that is always paid the same day). Replaces
 * each movement's current W1–W4 split — same `singleWeekPayload` the per-row
 * "Put in W{n}" uses, applied across the method.
 */
export const WeeklyMethodAssignCard = ({
  transactions,
  currency,
  busy,
  onAssign,
}: WeeklyMethodAssignCardProps) => {
  const { t, i18n } = useTranslation("ledger");
  const locale = i18n.language;

  const methods = useMemo<MethodSummary[]>(() => {
    const map = new Map<number, MethodSummary>();
    for (const tx of transactions) {
      const pm = tx.paymentMethod;
      if (!pm) continue;
      const entry = map.get(pm.id) ?? {
        id: pm.id,
        name: pm.name,
        count: 0,
        total: 0,
      };
      entry.count += 1;
      entry.total += tx.monthlyAmount;
      map.set(pm.id, entry);
    }
    return [...map.values()].sort((a, b) => b.count - a.count);
  }, [transactions]);

  const [methodId, setMethodId] = useState<number | null>(null);
  const [week, setWeek] = useState<1 | 2 | 3 | 4>(1);

  // Fall back to the busiest method so the selection survives a data refresh.
  const selected = methods.find((m) => m.id === methodId) ?? methods[0] ?? null;

  if (methods.length === 0) return null;

  return (
    <div className="card">
      <div className="flex items-center gap-sm">
        <CreditCard className="w-4 h-4 text-primary-600 shrink-0" />
        <p className="text-sm font-semibold text-stone-900">
          {t("transaction.weekly.methodAssignTitle")}
        </p>
      </div>
      <p className="text-xs text-stone-500 mt-xs">
        {t("transaction.weekly.methodAssignHint")}
      </p>

      <div className="mt-sm flex flex-wrap items-end gap-sm">
        <label className="flex flex-col gap-0.5">
          <span className="text-xs font-medium text-stone-500">
            {t("transaction.weekly.methodAssignSelect")}
          </span>
          <select
            value={selected?.id ?? ""}
            onChange={(e) => setMethodId(Number(e.target.value))}
            className="rounded-md border border-stone-200 px-sm py-xs text-sm text-stone-800 bg-white focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {methods.map((m) => (
              <option key={m.id} value={m.id}>
                {t("transaction.weekly.methodOptionCount", {
                  name: m.name,
                  count: m.count,
                })}
              </option>
            ))}
          </select>
        </label>

        <div className="flex items-center gap-xs">
          {([1, 2, 3, 4] as const).map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setWeek(w)}
              aria-pressed={week === w}
              className={cn(
                "text-xs font-medium px-sm py-xs rounded-full border transition-colors tabular-nums",
                week === w
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-stone-500 border-stone-200 hover:border-primary-400",
              )}
            >
              {t("transaction.breakdown.allInWeek", { week: w })}
            </button>
          ))}
        </div>

        <button
          type="button"
          disabled={busy || !selected}
          onClick={() => selected && onAssign(selected.id, week)}
          className="text-xs font-medium text-white bg-primary-600 hover:bg-primary-700 px-sm py-xs rounded-md transition-colors disabled:opacity-50 ml-auto"
        >
          {t("transaction.weekly.methodAssignApply", {
            count: selected?.count ?? 0,
            week,
          })}
        </button>
      </div>

      {selected && (
        <p className="text-[11px] text-stone-400 mt-xs tabular-nums">
          {formatCurrency(selected.total, currency, locale)}
        </p>
      )}
    </div>
  );
};
