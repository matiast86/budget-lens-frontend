import { format } from "date-fns";
import { CheckCircle2, Circle, Zap, ZapOff, Plus } from "lucide-react";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import type { TransactionResponseDto, EntryType, Status } from "../../types";

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

const entryTypeBadge = (type: EntryType) => (
  <Badge variant={type === "INCOME" ? "income" : "expense"}>
    {type === "INCOME" ? "Income" : "Expense"}
  </Badge>
);

const statusBadge = (status: Status) => {
  const map = {
    CURRENT: { variant: "current" as const, label: "Current" },
    CLOSED:  { variant: "closed"  as const, label: "Closed"  },
    FUTURE:  { variant: "future"  as const, label: "Future"  },
  };
  const { variant, label } = map[status];
  return <Badge variant={variant}>{label}</Badge>;
};

const formatAmount = (amount: number, currency: string) =>
  new Intl.NumberFormat("es-AR", {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);

// ---------------------------------------------------------------------------
// Row
// ---------------------------------------------------------------------------

const TransactionTableRow = ({ tx }: { tx: TransactionResponseDto }) => {
  const isIncome = tx.entryType === "INCOME";
  const hasInstallments = tx.installments > 1;

  return (
    <tr className="border-b border-slate-100 hover:bg-slate-50 transition-colors">
      {/* Date */}
      <td className="px-md py-sm whitespace-nowrap">
        <p className="text-sm text-slate-900 tabular-nums">
          {format(new Date(tx.transactionDate), "dd MMM yyyy")}
        </p>
        <p className="text-xs text-slate-400 tabular-nums">
          {format(new Date(tx.paymentMonth), "MMM yyyy")}
        </p>
      </td>

      {/* Category / Comment */}
      <td className="px-md py-sm max-w-[200px]">
        <p className="text-sm font-medium text-slate-900 truncate">
          {tx.category.name}
        </p>
        {tx.comment && (
          <p className="text-xs text-slate-400 truncate">{tx.comment}</p>
        )}
        {tx.group && (
          <p className="text-xs text-slate-400 truncate">↳ {tx.group.name}</p>
        )}
      </td>

      {/* Type */}
      <td className="px-md py-sm">{entryTypeBadge(tx.entryType)}</td>

      {/* Status */}
      <td className="px-md py-sm">{statusBadge(tx.status)}</td>

      {/* Amount */}
      <td className="px-md py-sm text-right">
        <p className={`text-sm financial-amount ${isIncome ? "amount-positive" : "amount-negative"}`}>
          {isIncome ? "+" : "-"}{formatAmount(tx.monthlyAmount, tx.currency)}
        </p>
        {tx.realMonthlyAmount != null && (
          <p className="text-xs text-slate-400 tabular-nums">
            ≈ {formatAmount(tx.realMonthlyAmount, tx.currency)} real
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
          <span className="text-slate-300 text-xs">—</span>
        )}
      </td>

      {/* Payment method */}
      <td className="px-md py-sm">
        <div className="flex items-center gap-xs">
          <span>{PAYMENT_TYPE_ICONS[tx.paymentMethod.type] ?? "💰"}</span>
          <span className="text-sm text-slate-700 truncate max-w-[100px]">
            {tx.paymentMethod.name}
          </span>
        </div>
      </td>

      {/* Paid */}
      <td className="px-md py-sm text-center">
        {tx.isPaid ? (
          <CheckCircle2 className="w-4 h-4 text-income-500 mx-auto" />
        ) : (
          <Circle className="w-4 h-4 text-slate-300 mx-auto" />
        )}
      </td>

      {/* Cashflow */}
      <td className="px-md py-sm text-center">
        {tx.impactsCashflow ? (
          <Zap className="w-4 h-4 text-warning-500 mx-auto" />
        ) : (
          <ZapOff className="w-4 h-4 text-slate-300 mx-auto" />
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
  if (transactions.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-3xl text-center">
        <p className="section-title mb-xs">No transactions yet</p>
        <p className="text-sm text-slate-500 mb-lg">
          Add your first income or expense to get started.
        </p>
        <div className="flex gap-sm">
          <Button variant="income" size="sm">
            <Plus className="w-4 h-4" /> Add Income
          </Button>
          <Button variant="expense" size="sm">
            <Plus className="w-4 h-4" /> Add Expense
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="card p-0 overflow-hidden">
      {/* Table header actions */}
      <div className="flex items-center justify-between px-md py-sm border-b border-slate-100">
        <h2 className="section-title">Transactions</h2>
        <div className="flex gap-sm">
          <Button variant="income" size="sm">
            <Plus className="w-4 h-4" /> Income
          </Button>
          <Button variant="expense" size="sm">
            <Plus className="w-4 h-4" /> Expense
          </Button>
        </div>
      </div>

      {/* Scrollable table */}
      <div className="overflow-x-auto">
        <table className="w-full text-left">
          <thead>
            <tr className="bg-slate-50 border-b border-slate-200">
              <th className="px-md py-sm text-xs font-semibold text-slate-500 uppercase tracking-wide whitespace-nowrap">Date</th>
              <th className="px-md py-sm text-xs font-semibold text-slate-500 uppercase tracking-wide">Category</th>
              <th className="px-md py-sm text-xs font-semibold text-slate-500 uppercase tracking-wide">Type</th>
              <th className="px-md py-sm text-xs font-semibold text-slate-500 uppercase tracking-wide">Status</th>
              <th className="px-md py-sm text-xs font-semibold text-slate-500 uppercase tracking-wide text-right">Amount</th>
              <th className="px-md py-sm text-xs font-semibold text-slate-500 uppercase tracking-wide text-center">Quota</th>
              <th className="px-md py-sm text-xs font-semibold text-slate-500 uppercase tracking-wide">Method</th>
              <th className="px-md py-sm text-xs font-semibold text-slate-500 uppercase tracking-wide text-center" title="Paid">Paid</th>
              <th className="px-md py-sm text-xs font-semibold text-slate-500 uppercase tracking-wide text-center" title="Impacts Cashflow">CF</th>
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
