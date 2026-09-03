import { useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTranslation } from "react-i18next";
import { Check, X } from "lucide-react";
import { useAuthStore } from "../../stores/auth-store";
import { updateTransactionBreakdown } from "../../services/transaction-service";
import { formatCurrency } from "../../utils/format-currency";
import { cn } from "../../utils/cn";
import type { TransactionResponseDto, Currency } from "../../types";

interface BreakdownEditorProps {
  tx: TransactionResponseDto;
  onClose: () => void;
  /** Extra query keys to invalidate on save (besides the ledger's transactions). */
  invalidateKeys?: readonly unknown[][];
}

/**
 * The weekly-breakdown editor UI + save logic, with no table markup so it can be
 * dropped into a table row (`TransactionBreakdownPanel`) or a modal (weekly view).
 */
export const BreakdownEditor = ({ tx, onClose, invalidateKeys }: BreakdownEditorProps) => {
  const { t, i18n } = useTranslation("ledger");
  const token = useAuthStore((s) => s.token);
  const queryClient = useQueryClient();

  const sorted = [...(tx.transactionsBreakDown ?? [])].sort(
    (a, b) => a.weekNumber - b.weekNumber,
  );

  const [amounts, setAmounts] = useState<[number, number, number, number]>([
    sorted[0]?.amount ?? 0,
    sorted[1]?.amount ?? 0,
    sorted[2]?.amount ?? 0,
    sorted[3]?.amount ?? 0,
  ]);

  const sum = amounts.reduce((a, b) => a + b, 0);
  const remaining = tx.monthlyAmount - sum;
  const isBalanced = Math.abs(remaining) < 0.01;
  const isOver = remaining < -0.01;

  const mutation = useMutation({
    mutationFn: () =>
      updateTransactionBreakdown(
        tx.id,
        {
          amountOne: amounts[0],
          amountTwo: amounts[1],
          amountThree: amounts[2],
          amountFour: amounts[3],
        },
        token!,
      ),
    onSuccess: () => {
      void queryClient.invalidateQueries({
        queryKey: ["transactions", String(tx.ledgerId)],
      });
      for (const key of invalidateKeys ?? []) {
        void queryClient.invalidateQueries({ queryKey: key });
      }
      onClose();
    },
  });

  const distributeEvenly = () => {
    const base = Math.floor((tx.monthlyAmount / 4) * 100) / 100;
    const remainder = Math.round((tx.monthlyAmount - base * 4) * 100) / 100;
    setAmounts([base + remainder, base, base, base]);
  };

  const allInWeek = (week: 1 | 2 | 3 | 4) => {
    const next: [number, number, number, number] = [0, 0, 0, 0];
    next[week - 1] = tx.monthlyAmount;
    setAmounts(next);
  };

  const setAmount = (index: number, value: number) => {
    const next = [...amounts] as [number, number, number, number];
    next[index] = value;
    setAmounts(next);
  };

  return (
    <div className="space-y-sm">
      <div className="flex flex-wrap items-end gap-md">
        <span className="text-xs font-semibold text-primary-700 uppercase tracking-wide self-center">
          {t("transaction.breakdown.title")}
        </span>

        {/* Week inputs */}
        <div className="flex gap-sm flex-wrap">
          {(["W1", "W2", "W3", "W4"] as const).map((label, i) => (
            <div key={label} className="flex flex-col gap-0.5">
              <label className="text-xs font-medium text-stone-500">{label}</label>
              <input
                type="number"
                min="0"
                step="0.01"
                value={amounts[i]}
                onChange={(e) => setAmount(i, Number(e.target.value) || 0)}
                className="w-28 px-sm py-xs text-sm border border-stone-200 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 tabular-nums bg-white"
              />
            </div>
          ))}
        </div>

        {/* Sum badge */}
        <div className="flex flex-col gap-0.5">
          <span className="text-xs text-stone-400">Σ</span>
          <div
            className={cn(
              "text-sm font-medium tabular-nums px-sm py-xs rounded-md border",
              isBalanced
                ? "text-income-700 bg-income-50 border-income-200"
                : isOver
                  ? "text-expense-700 bg-expense-50 border-expense-200"
                  : "text-stone-600 bg-white border-stone-200",
            )}
          >
            {formatCurrency(sum, tx.currency as Currency, i18n.language)}
            {" / "}
            {formatCurrency(tx.monthlyAmount, tx.currency as Currency, i18n.language)}
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-end gap-xs ml-auto pb-0.5">
          <button
            type="button"
            onClick={distributeEvenly}
            className="text-xs text-stone-500 hover:text-stone-700 px-sm py-[7px] border border-stone-200 rounded-md hover:bg-stone-100 transition-colors whitespace-nowrap bg-white"
          >
            {t("transaction.breakdown.distributeEvenly")}
          </button>
          <button
            type="button"
            onClick={() => mutation.mutate()}
            disabled={mutation.isPending}
            className="text-xs text-white bg-primary-600 hover:bg-primary-700 px-sm py-[7px] rounded-md transition-colors flex items-center gap-xs disabled:opacity-50 whitespace-nowrap"
          >
            <Check className="w-3 h-3" />
            {t("transaction.breakdown.save")}
          </button>
          <button
            type="button"
            onClick={onClose}
            aria-label={t("transaction.action.cancel")}
            className="p-[7px] border border-stone-200 rounded-md text-stone-400 hover:text-stone-600 hover:bg-stone-100 transition-colors bg-white"
          >
            <X className="w-3 h-3" />
          </button>
        </div>
      </div>

      {/* Quick assign — whole monthly amount into a single week */}
      <div className="flex items-center gap-xs flex-wrap">
        <span className="text-xs text-stone-400">
          {t("transaction.breakdown.allInWeekLabel")}
        </span>
        {([1, 2, 3, 4] as const).map((week) => (
          <button
            key={week}
            type="button"
            onClick={() => allInWeek(week)}
            className="text-xs text-stone-500 hover:text-stone-700 px-sm py-xs border border-stone-200 rounded-md hover:bg-stone-100 transition-colors bg-white tabular-nums"
          >
            {t("transaction.breakdown.allInWeek", { week })}
          </button>
        ))}
      </div>

      {/* Progress bar */}
      <div>
        <div className="h-1.5 bg-stone-200 rounded-full overflow-hidden flex gap-px">
          {amounts.map((val, i) => {
            const pct =
              tx.monthlyAmount > 0
                ? Math.min((val / tx.monthlyAmount) * 100, 100)
                : 0;
            return (
              <div
                key={i}
                className={cn(
                  "h-full transition-all rounded-full",
                  ["bg-primary-600", "bg-primary-400", "bg-primary-300", "bg-primary-200"][i],
                )}
                style={{ width: `${pct}%` }}
              />
            );
          })}
        </div>
        {!isBalanced && (
          <p
            className={cn(
              "text-xs mt-1 tabular-nums",
              isOver ? "text-expense-600" : "text-stone-400",
            )}
          >
            {isOver
              ? t("transaction.breakdown.overallocated", {
                  amount: formatCurrency(-remaining, tx.currency as Currency, i18n.language),
                })
              : t("transaction.breakdown.unallocated", {
                  amount: formatCurrency(remaining, tx.currency as Currency, i18n.language),
                })}
          </p>
        )}
      </div>

      {mutation.isError && (
        <p className="text-xs text-expense-600">
          {t("transaction.breakdown.saveError")}
        </p>
      )}
    </div>
  );
};
