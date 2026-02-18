import type { BudgetItem } from "../../types";

export function BudgetProgressItem({ category, spent, budget, color }: BudgetItem) {
  const pct = Math.min((spent / budget) * 100, 100);
  const isOver = spent > budget;

  return (
    <div>
      <div className="flex justify-between text-sm mb-xs">
        <span className="font-medium text-slate-700">{category}</span>
        <span
          className={`tabular-nums ${
            isOver ? "text-expense-600 font-semibold" : "text-slate-500"
          }`}
        >
          ${spent} / ${budget}
        </span>
      </div>
      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full transition-all duration-500 ${
            isOver ? "bg-expense-500" : color
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
