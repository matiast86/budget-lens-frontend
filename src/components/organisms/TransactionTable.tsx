import type React from "react";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import {
  CheckCircle2,
  Circle,
  Zap,
  ZapOff,
  Plus,
  Pencil,
  Trash2,
  Check,
  X,
  BarChart2,
} from "lucide-react";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { TransactionBreakdownPanel } from "../molecules/TransactionBreakdownPanel";
import { formatCurrency } from "../../utils/format-currency";
import { formatTransactionDate, formatPaymentMonth } from "../../utils/format-date";
import { cn } from "../../utils/cn";
import type {
  TransactionResponseDto,
  TransactionBreakDownResponseDto,
  EntryType,
  Status,
  Currency,
} from "../../types";
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
// BreakdownMiniBar — compact 4-bar sparkline showing W1-W4 distribution
// ---------------------------------------------------------------------------

const BreakdownMiniBar = ({
  breakdowns,
}: {
  breakdowns: TransactionBreakDownResponseDto[];
}) => {
  const sorted = [...breakdowns].sort((a, b) => a.weekNumber - b.weekNumber);
  const max = Math.max(...sorted.map((b) => b.amount), 0);
  const hasAny = max > 0;

  return (
    <div
      className="flex items-end gap-[2px]"
      style={{ height: "18px", width: "40px" }}
      aria-hidden
    >
      {sorted.map((b) => {
        const h = hasAny
          ? b.amount > 0
            ? Math.max(Math.round((b.amount / max) * 16), 4)
            : 3
          : 3;
        return (
          <div
            key={b.id}
            className={cn(
              "flex-1 rounded-[1px] transition-all",
              b.amount > 0 ? "bg-primary-400" : "bg-stone-200",
            )}
            style={{ height: `${h}px` }}
          />
        );
      })}
    </div>
  );
};

// ---------------------------------------------------------------------------
// Row
// ---------------------------------------------------------------------------

const COL_COUNT = 11; // Date + Category + Type + Status + Amount + Quota + Method + Paid + CF + Weeks + Actions

interface TransactionTableRowProps {
  tx: TransactionResponseDto;
  onTogglePaid?: (tx: TransactionResponseDto) => void;
  onToggleCashflow?: (tx: TransactionResponseDto) => void;
  onEdit?: (tx: TransactionResponseDto) => void;
  onDelete?: (tx: TransactionResponseDto) => void;
}

const TransactionTableRow = ({
  tx,
  onTogglePaid,
  onToggleCashflow,
  onEdit,
  onDelete,
}: TransactionTableRowProps) => {
  const { t, i18n } = useTranslation("ledger");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [breakdownOpen, setBreakdownOpen] = useState(false);
  const isIncome = tx.entryType === "INCOME";
  const hasInstallments = tx.installments > 1;
  const breakdowns = tx.transactionsBreakDown ?? [];
  const hasBreakdownData = breakdowns.some((b) => b.amount > 0);

  return (
    <>
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
          <button
            type="button"
            onClick={() => onTogglePaid?.(tx)}
            disabled={!onTogglePaid}
            aria-label={t("transaction.action.togglePaid")}
            className={cn(
              "mx-auto block rounded-full transition-colors",
              onTogglePaid ? "hover:bg-stone-100 p-0.5 cursor-pointer" : "cursor-default",
            )}
          >
            {tx.isPaid ? (
              <CheckCircle2 className="w-4 h-4 text-income-500" />
            ) : (
              <Circle className="w-4 h-4 text-stone-300" />
            )}
          </button>
        </td>

        {/* Cashflow */}
        <td className="px-md py-sm text-center">
          <button
            type="button"
            onClick={() => onToggleCashflow?.(tx)}
            disabled={!onToggleCashflow}
            aria-label={t("transaction.action.toggleCashflow")}
            className={cn(
              "mx-auto block rounded-full transition-colors",
              onToggleCashflow ? "hover:bg-stone-100 p-0.5 cursor-pointer" : "cursor-default",
            )}
          >
            {tx.impactsCashflow ? (
              <Zap className="w-4 h-4 text-warning-500" />
            ) : (
              <ZapOff className="w-4 h-4 text-stone-300" />
            )}
          </button>
        </td>

        {/* Weeks breakdown mini-viz */}
        <td className="px-md py-sm text-center">
          <button
            type="button"
            onClick={() => setBreakdownOpen((v) => !v)}
            aria-label={t("transaction.breakdown.toggle")}
            title={t("transaction.breakdown.toggle")}
            className={cn(
              "mx-auto flex flex-col items-center gap-0.5 rounded-md p-xs transition-colors group",
              breakdownOpen
                ? "bg-primary-100 text-primary-700"
                : "hover:bg-stone-100 text-stone-400 hover:text-stone-600",
            )}
          >
            {breakdowns.length > 0 ? (
              <BreakdownMiniBar breakdowns={breakdowns} />
            ) : (
              <BarChart2
                className={cn(
                  "w-4 h-4",
                  breakdownOpen ? "text-primary-600" : "text-stone-300 group-hover:text-stone-400",
                )}
              />
            )}
            {hasBreakdownData && (
              <span className="text-[9px] font-medium tabular-nums text-stone-400 leading-none">
                {formatCurrency(
                  breakdowns.reduce((s, b) => s + b.amount, 0),
                  tx.currency as Currency,
                  i18n.language,
                )}
              </span>
            )}
          </button>
        </td>

        {/* Actions */}
        <td className="px-md py-sm text-center">
          <div className="flex items-center justify-center gap-xs">
            <button
              type="button"
              onClick={() => onEdit?.(tx)}
              aria-label={t("transaction.action.edit")}
              className="p-xs rounded-md text-stone-400 hover:text-primary-600 hover:bg-primary-50 transition-colors"
            >
              <Pencil className="w-3.5 h-3.5" />
            </button>

            {confirmDelete ? (
              <div className="flex items-center gap-xs">
                <span className="text-xs text-stone-500 whitespace-nowrap">
                  {t("transaction.action.confirmDelete")}
                </span>
                <button
                  type="button"
                  onClick={() => {
                    setConfirmDelete(false);
                    onDelete?.(tx);
                  }}
                  aria-label="Confirm delete"
                  className="p-xs rounded-md text-white bg-expense hover:bg-expense-600 transition-colors"
                >
                  <Check className="w-3 h-3" />
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmDelete(false)}
                  aria-label={t("transaction.action.cancel")}
                  className="p-xs rounded-md text-stone-500 hover:bg-stone-100 transition-colors"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={() => setConfirmDelete(true)}
                aria-label={t("transaction.action.delete")}
                className="p-xs rounded-md text-stone-400 hover:text-expense-600 hover:bg-expense-50 transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </td>
      </tr>

      {/* Inline breakdown editor */}
      {breakdownOpen && (
        <TransactionBreakdownPanel
          tx={tx}
          colSpan={COL_COUNT}
          onClose={() => setBreakdownOpen(false)}
        />
      )}
    </>
  );
};

// ---------------------------------------------------------------------------
// Table
// ---------------------------------------------------------------------------

interface TransactionTableProps {
  transactions: TransactionResponseDto[];
  onAddIncome?: () => void;
  onAddExpense?: () => void;
  onTogglePaid?: (tx: TransactionResponseDto) => void;
  onToggleCashflow?: (tx: TransactionResponseDto) => void;
  onEdit?: (tx: TransactionResponseDto) => void;
  onDelete?: (tx: TransactionResponseDto) => void;
}

export const TransactionTable = ({
  transactions,
  onAddIncome,
  onAddExpense,
  onTogglePaid,
  onToggleCashflow,
  onEdit,
  onDelete,
}: TransactionTableProps) => {
  const { t } = useTranslation("ledger");

  if (transactions.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-3xl text-center">
        <p className="section-title mb-xs">{t("transaction.table.empty.title")}</p>
        <p className="text-sm text-stone-500 mb-lg">
          {t("transaction.table.empty.body")}
        </p>
        <div className="flex gap-sm">
          <Button variant="income" size="sm" onClick={onAddIncome}>
            <Plus className="w-4 h-4" /> {t("transaction.table.empty.addIncome")}
          </Button>
          <Button variant="expense" size="sm" onClick={onAddExpense}>
            <Plus className="w-4 h-4" /> {t("transaction.table.empty.addExpense")}
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-0 overflow-hidden">
      {/* Table header */}
      <div className="flex items-center justify-between px-md py-sm border-b border-stone-100">
        <h2 className="section-title">{t("transaction.table.title")}</h2>
        <div className="flex gap-sm">
          <Button variant="income" size="sm" onClick={onAddIncome}>
            <Plus className="w-4 h-4" /> {t("transaction.table.addIncome")}
          </Button>
          <Button variant="expense" size="sm" onClick={onAddExpense}>
            <Plus className="w-4 h-4" /> {t("transaction.table.addExpense")}
          </Button>
        </div>
      </div>

      {/* Scrollable table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left" aria-label={t("transaction.table.title")}>
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
              <th className="px-md py-sm text-xs font-semibold text-stone-500 uppercase tracking-wide text-center" title={t("transaction.table.col.weeksFull")}>{t("transaction.table.col.weeks")}</th>
              <th className="px-md py-sm text-xs font-semibold text-stone-500 uppercase tracking-wide text-center">{t("transaction.table.col.actions")}</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map((tx) => (
              <TransactionTableRow
                key={tx.id}
                tx={tx}
                onTogglePaid={onTogglePaid}
                onToggleCashflow={onToggleCashflow}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};
