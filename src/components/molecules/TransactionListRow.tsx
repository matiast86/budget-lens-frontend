import type React from "react";
import {
  Utensils,
  Car,
  Home,
  Zap,
  TrendingUp,
  CreditCard,
  DollarSign,
} from "lucide-react";
import { cn } from "../../utils/cn";
import { formatCurrency } from "../../utils/format-currency";
import type { TransactionResponseDto, Currency } from "../../types";

// Map category name keywords to icon pill styles
const resolveCategoryStyle = (
  categoryName: string,
): { bg: string; icon: string; Icon: React.ElementType } => {
  const lower = categoryName.toLowerCase();
  if (lower.includes("food") || lower.includes("dining") || lower.includes("restaurant"))
    return { bg: "bg-amber-50", icon: "text-amber-500", Icon: Utensils };
  if (lower.includes("transport") || lower.includes("fuel") || lower.includes("transit"))
    return { bg: "bg-sky-50", icon: "text-sky-500", Icon: Car };
  if (lower.includes("home") || lower.includes("household") || lower.includes("rent"))
    return { bg: "bg-teal-50", icon: "text-teal-600", Icon: Home };
  if (lower.includes("utilit") || lower.includes("electric") || lower.includes("gas"))
    return { bg: "bg-rose-50", icon: "text-rose-500", Icon: Zap };
  if (lower.includes("income") || lower.includes("salary"))
    return { bg: "bg-emerald-50", icon: "text-emerald-600", Icon: TrendingUp };
  if (lower.includes("card") || lower.includes("credit"))
    return { bg: "bg-purple-50", icon: "text-purple-500", Icon: CreditCard };
  return { bg: "bg-stone-100", icon: "text-stone-500", Icon: DollarSign };
};

interface TransactionListRowProps {
  transaction: TransactionResponseDto;
  locale: string;
}

export const TransactionListRow = ({ transaction: tx, locale }: TransactionListRowProps) => {
  const isIncome = tx.entryType === "INCOME";
  const { bg, icon, Icon } = resolveCategoryStyle(tx.category.name);

  return (
    <div className="flex items-center gap-md py-sm">
      <div className={cn("icon-pill", bg)}>
        <Icon className={cn("w-5 h-5", icon)} />
      </div>

      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-stone-900 truncate">
          {tx.comment ?? tx.category.name}
        </p>
        <p className="text-xs text-stone-500">{tx.category.name}</p>
      </div>

      <p
        className={cn(
          "financial-amount text-base",
          isIncome ? "amount-positive" : "amount-negative",
        )}
      >
        {isIncome ? "+" : "−"}
        {formatCurrency(tx.monthlyAmount, tx.currency as Currency, locale)}
      </p>
    </div>
  );
};
