import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { X } from "lucide-react";
import { WeeklyBoard } from "./WeeklyBoard";
import { WeeklyDrawdownStrip } from "../molecules/WeeklyDrawdownStrip";
import { UnallocatedBreakdownCard } from "../molecules/UnallocatedBreakdownCard";
import { BreakdownEditor } from "../molecules/BreakdownEditor";
import { useAuthStore } from "../../stores/auth-store";
import { getTransactions } from "../../services/transaction-service";
import { buildWeeklyBreakdown, weekOfMonth } from "../../utils/weekly-breakdown";
import type { TransactionResponseDto, Currency } from "../../types";

interface WeeklyViewProps {
  ledgerId: number;
  currency: Currency;
}

const currentMonth = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

export const WeeklyView = ({ ledgerId, currency }: WeeklyViewProps) => {
  const { t } = useTranslation("ledger");
  const token = useAuthStore((s) => s.token);

  const [month, setMonth] = useState(currentMonth);
  const [editTx, setEditTx] = useState<TransactionResponseDto | null>(null);

  const { data: transactions = [], isLoading } = useQuery({
    queryKey: ["transactions", String(ledgerId), { paymentMonth: month, take: 500 }],
    queryFn: () =>
      getTransactions(String(ledgerId), { paymentMonth: month, take: 500 }, token!),
    enabled: !!token && !!ledgerId && !!month,
  });

  const { buckets, unallocated, weekIncome, weekExpense } =
    buildWeeklyBreakdown(transactions);

  const isCurrentMonth = month === currentMonth();
  const currentWeek = isCurrentMonth
    ? weekOfMonth(new Date().getDate())
    : undefined;

  return (
    <div className="space-y-md">
      {/* Month picker */}
      <div className="flex items-center gap-sm">
        <label htmlFor="weekly-month" className="text-xs font-medium text-stone-500">
          {t("transaction.weekly.month")}
        </label>
        <input
          id="weekly-month"
          type="month"
          value={month}
          onChange={(e) => setMonth(e.target.value)}
          className="rounded-md border border-stone-200 px-sm py-xs text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
        />
      </div>

      {isLoading ? (
        <div className="space-y-md">
          <div className="h-40 bg-stone-100 animate-pulse rounded-xl" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-md">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="h-48 bg-stone-100 animate-pulse rounded-xl" />
            ))}
          </div>
        </div>
      ) : transactions.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-2xl text-center">
          <p className="section-title mb-xs">{t("transaction.weekly.empty.title")}</p>
          <p className="text-sm text-stone-500">{t("transaction.weekly.empty.body")}</p>
        </div>
      ) : (
        <>
          <WeeklyDrawdownStrip
            weekIncome={weekIncome}
            weekExpense={weekExpense}
            currency={currency}
            currentWeek={currentWeek}
          />
          <UnallocatedBreakdownCard
            entries={unallocated}
            currency={currency}
            onAssign={setEditTx}
          />
          <WeeklyBoard
            buckets={buckets}
            currency={currency}
            onChipClick={setEditTx}
            currentWeek={currentWeek}
          />
        </>
      )}

      {/* Breakdown editor modal */}
      {editTx && (
        <div
          className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-md"
          role="dialog"
          aria-modal="true"
          aria-label={t("transaction.breakdown.title")}
        >
          <div
            className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
            onClick={() => setEditTx(null)}
            aria-hidden="true"
          />
          <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-xl shadow-dropdown p-lg">
            <div className="flex items-start justify-between mb-md">
              <div>
                <p className="text-sm font-semibold text-stone-900">
                  {editTx.category.name}
                </p>
                {editTx.comment && (
                  <p className="text-xs text-stone-400">{editTx.comment}</p>
                )}
              </div>
              <button
                type="button"
                onClick={() => setEditTx(null)}
                aria-label={t("transaction.action.cancel")}
                className="p-xs rounded-md text-stone-400 hover:bg-stone-100 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            <BreakdownEditor tx={editTx} onClose={() => setEditTx(null)} />
          </div>
        </div>
      )}
    </div>
  );
};
