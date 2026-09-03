import { cn } from "../../utils/cn";
import { CategoryIcon } from "../atoms/CategoryIcon";
import { formatCurrency } from "../../utils/format-currency";
import type { TransactionResponseDto, Currency } from "../../types";

interface TransactionListRowProps {
  transaction: TransactionResponseDto;
  locale: string;
}

export const TransactionListRow = ({ transaction: tx, locale }: TransactionListRowProps) => {
  const isIncome = tx.entryType === "INCOME";

  return (
    <div className="flex items-center gap-md py-sm">
      <CategoryIcon name={tx.category.name} />

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-stone-900 truncate">
          {tx.comment ?? tx.category.name}
        </p>
        <p className="text-xs text-stone-500">{tx.category.name}</p>
      </div>

      {/* Only income is coloured; expenses stay ink-coloured. The +/− sign is
          the non-colour cue. */}
      <p
        className={cn(
          "financial-amount text-base",
          isIncome ? "amount-positive" : "text-stone-900",
        )}
      >
        {isIncome ? "+" : "−"}
        {formatCurrency(tx.monthlyAmount, tx.currency as Currency, locale)}
      </p>
    </div>
  );
};
