import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { Transaction } from "../../types";

export const TransactionRow = ({ name, category, amount, type }: Transaction) => {
  return (
    <div className="flex items-center justify-between py-sm border-b border-stone-100 last:border-0">
      <div className="flex items-center gap-sm">
        <div
          className={`w-8 h-8 rounded-full flex items-center justify-center ${
            type === "income"
              ? "bg-income-50 text-income-600"
              : "bg-expense-50 text-expense-600"
          }`}
        >
          {type === "income" ? (
            <ArrowUpRight className="w-4 h-4" />
          ) : (
            <ArrowDownRight className="w-4 h-4" />
          )}
        </div>
        <div>
          <p className="text-sm font-medium text-stone-900">{name}</p>
          <p className="text-xs text-stone-500">{category}</p>
        </div>
      </div>
      <span
        className={`text-sm financial-amount ${
          type === "income" ? "amount-positive" : "amount-negative"
        }`}
      >
        {amount}
      </span>
    </div>
  );
}
