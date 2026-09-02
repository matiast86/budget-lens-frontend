import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";
import type { BudgetItem } from "../../types";

export const BudgetProgressItem = ({ category, spent, budget }: BudgetItem) => {
  const { t } = useTranslation("common");
  const ratio = Math.min(spent / budget, 1);
  const pct   = ratio * 100;
  const isOver = spent > budget;

  const signal =
    ratio < 0.6  ? { emoji: "🟢", label: t("budget.signal.good") }
    : ratio < 0.85 ? { emoji: "🟡", label: t("budget.signal.heads_up") }
    :                { emoji: "🔴", label: t("budget.signal.close") };

  const barColor =
    ratio < 0.6  ? "bg-income"
    : ratio < 0.85 ? "bg-warning"
    :                "bg-expense";

  return (
    <div>
      <div className="flex justify-between items-center mb-xs">
        <span className="text-sm font-semibold text-stone-900">{category}</span>
        <span className="budget-signal">
          <span>{signal.emoji}</span>
          <span className={cn(isOver ? "text-expense-600" : "text-stone-500")}>{signal.label}</span>
        </span>
      </div>
      <div className="flex justify-between text-xs text-stone-500 mb-xs">
        <span className="tabular-nums">${spent.toLocaleString()}</span>
        <span className="tabular-nums">${budget.toLocaleString()}</span>
      </div>
      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", barColor)}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
};
