import { useTranslation } from "react-i18next";
import { CheckCircle2, Circle, Zap, ZapOff, Plus } from "lucide-react";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { formatCurrency } from "../../utils/format-currency";
import { formatTransactionDate, formatPaymentMonth } from "../../utils/format-date";
import type { TransactionResponseDto, EntryType, Status, Currency } from "../../types";
import type { TFunction } from "i18next";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const PAYMENT_TYPE_ICONS: Record<string, string> = {
  CASH: "💵",
  BANK: "🏦",
  WALLET: "👛",
  CREDIT_CARD: "💳",
  OTHER: "💰",
};

const entryTypeBadge = (type: EntryType, t: TFunction) => (
  <Badge variant={type === "INCOME" ? "income" : "expense"}>
    {type === "INCOME" ? t("transaction.entryType.income") : t("transaction.entryType.expense")}
  </Badge>
);

const statusBadge = (status: Status, t: TFunction) => {
  const map = {
    CURRENT: { variant: "current" as const, key: "transaction.status.current" },
    CLOSED:  { variant: "closed"  as const, key: "transaction.status.closed"  },
    FUTURE:  { variant: "future"  as const, key: "transaction.status.future"  },
  };
  const { variant, key } = map[status];
  return <Badge variant={variant}>{t(key)}</Badge>;
};

// ---------------------------------------------------------------------------
// Row
// ---------------------------------------------------------------------------

const TransactionTableRow = ({ tx }: { tx: TransactionResponseDto }) => {
  const { t, i18n } = useTranslation("ledger");
  const isIncome = tx.entryType === "INCOME";
  const hasInstallments = tx.installments > 1;

  return (
    <tr className="border-b border-stone-100 hover:bg-stone-50 transition-colors">
      {/* Date */}
      <td className="px-md py-sm whitespace-nowrap">
        <p className="text-sm text-stone-900 tabular-nums">
          {formatTransactionDate(tx.transactionDate, i18n.language)}
        </p>
        <p className="text-xs text-stone-400 tabular-nums">
          {formatPaymentMonth(tx.paymentMonth, i18n.language)}
        </p>
      </td>

      {/* Category / Comment */}
      <td className="px-md py-sm max-w-[200px]">
        <p className="text-sm font-medium text-stone-900 truncate">
          {tx.category.name}
        </p>
        {tx.comment && (
          <p className="text-xs text-stone-400 truncate">{tx.comment}</p>
        )}
        {tx.group && (
          <p className="text-xs text-stone-400 truncate">↳ {tx.group.name}</p>
        )}
      </td>

      {/* Type */}
      <td className="px-md py-sm">{entryTypeBadge(tx.entryType, t)}</td>

      {/* Status */}
      <td className="px-md py-sm">{statusBadge(tx.status, t)}</td>

      {/* Amount */}
      <td className="px-md py-sm text-right">
        <p className={`text-sm financial-amount ${isIncome ? "amount-positive" : "amount-negative"}`}>
          {isIncome ? "+" : "-"}{formatCurrency(tx.monthlyAmount, tx.currency as Currency, i18n.language)}
        </p>
        {tx.realMonthlyAmount != null && (
          <p className="text-xs text-stone-400 tabular-nums">
            ≈ {formatCurrency(tx.realMonthlyAmount, tx.currency as Currency, i18n.language)} {t("transaction.table.real")}
          </p>
        )}
      </td>

      {/* Installments */}
      <td className="px-md py-sm text-center">
        {hasInstallments ? (
          <Badge variant="default" size="sm">
            {tx.installment}/{tx.installments}
          </Badge>
        ) : (
          <span className="text-stone-300 text-xs">—</span>
        )}
      </td>

      {/* Payment method */}
      <td className="px-md py-sm">
        <div className="flex items-center gap-xs">
          <span>{PAYMENT_TYPE_ICONS[tx.paymentMethod.type] ?? "💰"}</span>
          <span className="text-sm text-stone-700 truncate max-w-[100px]">
            {tx.paymentMethod.name}
          </span>
        </div>
      </td>

      {/* Paid */}
      <td className="px-md py-sm text-center">
        {tx.isPaid ? (
          <CheckCircle2 className="w-4 h-4 text-income-500 mx-auto" />
        ) : (
          <Circle className="w-4 h-4 text-stone-300 mx-auto" />
        )}
      </td>

      {/* Cashflow */}
      <td className="px-md py-sm text-center">
        {tx.impactsCashflow ? (
          <Zap className="w-4 h-4 text-warning-500 mx-auto" />
        ) : (
          <ZapOff className="w-4 h-4 text-stone-300 mx-auto" />
        )}
      </td>
    </tr>
  );
};

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------

interface TransactionTableProps {
  transactions: TransactionResponseDto[];
}

export const TransactionTable = ({ transactions }: TransactionTableProps) => {
  const { t } = useTranslation("ledger");

  if (transactions.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-3xl text-center">
        <p className="section-title mb-xs">{t("transaction.table.empty.title")}</p>
        <p className="text-sm text-stone-500 mb-lg">
          {t("transaction.table.empty.body")}
        </p>
        <div className="flex gap-sm">
          <Button variant="income" size="sm">
            <Plus className="w-4 h-4" /> {t("transaction.table.empty.addIncome")}
          </Button>
          <Button variant="expense" size="sm">
            <Plus className="w-4 h-4" /> {t("transaction.table.empty.addExpense")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-0 overflow-hidden">
      {/* Table header actions */}
      <div className="flex items-center justify-between px-md py-sm border-b border-stone-100">
        <h2 className="section-title">{t("transaction.table.title")}</h2>
        <div className="flex gap-sm">
          <Button variant="income" size="sm">
            <Plus className="w-4 h-4" /> {t("transaction.table.addIncome")}
          </Button>
          <Button variant="expense" size="sm">
            <Plus className="w-4 h-4" /> {t("transaction.table.addExpense")}
          </Button>
        </div>
      </div>

      {/* Scrollable table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-stone-50 border-b border-stone-200">
              <th className="px-md py-sm text-xs font-semibold text-stone-500 uppercase tracking-wide whitespace-nowrap">{t("transaction.table.col.date")}</th>
              <th className="px-md py-sm text-xs font-semibold text-stone-500 uppercase tracking-wide">{t("transaction.table.col.category")}</th>
              <th className="px-md py-sm text-xs font-semibold text-stone-500 uppercase tracking-wide">{t("transaction.table.col.type")}</th>
              <th className="px-md py-sm text-xs font-semibold text-stone-500 uppercase tracking-wide">{t("transaction.table.col.status")}</th>
              <th className="px-md py-sm text-xs font-semibold text-stone-500 uppercase tracking-wide text-right">{t("transaction.table.col.amount")}</th>
              <th className="px-md py-sm text-xs font-semibold text-stone-500 uppercase tracking-wide text-center">{t("transaction.table.col.quota")}</th>
              <th className="px-md py-sm text-xs font-semibold text-stone-500 uppercase tracking-wide">{t("transaction.table.col.method")}</th>
              <th className="px-md py-sm text-xs font-semibold text-stone-500 uppercase tracking-wide text-center" title={t("transaction.table.col.paid")}>{t("transaction.table.col.paid")}</th>
              <th className="px-md py-sm text-xs font-semibold text-stone-500 uppercase tracking-wide text-center" title={t("transaction.table.col.cashflowFull")}>{t("transaction.table.col.cashflow")}</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <TransactionTableRow key={tx.id} tx={tx} />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
