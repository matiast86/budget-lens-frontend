import { useTranslation } from "react-i18next";
import { TrendingUp, Users, Pencil, Trash2, CalendarDays, Layers } from "lucide-react";
import { Badge } from "../atoms/Badge";
import { Button } from "../atoms/Button";
import { formatTransactionDate } from "../../utils/format-date";
import type { LedgerResponseDto } from "../../types";

interface LedgerDetailHeaderProps {
  ledger: LedgerResponseDto;
}

export const LedgerDetailHeader = ({ ledger }: LedgerDetailHeaderProps) => {
  const { t, i18n } = useTranslation("ledger");
  const createdAt = formatTransactionDate(ledger.createdAt, i18n.language);
  const txCount = ledger.transactions.length;
  const incomeCount = ledger.transactions.filter((tx) => tx.entryType === "INCOME").length;
  const expenseCount = ledger.transactions.filter((tx) => tx.entryType === "EXPENSE").length;

  return (
    <div className="bg-white border-b border-slate-200 px-lg py-lg">
      {/* Title row */}
      <div className="flex items-start justify-between gap-md mb-sm">
        <div className="flex items-center gap-sm">
          <h1 className="text-2xl font-semibold text-slate-900">{ledger.name}</h1>
          <Badge variant="primary" size="md">{ledger.currency}</Badge>
        </div>
        <div className="flex items-center gap-sm shrink-0">
          <Button variant="outline" size="sm">
            <Pencil className="w-3.5 h-3.5" />
            {t("detail.action.edit")}
          </Button>
          <Button variant="ghost" size="sm" className="text-expense-600 hover:bg-expense-50 hover:text-expense-700">
            <Trash2 className="w-3.5 h-3.5" />
            {t("detail.action.delete")}
          </Button>
        </div>
      </div>

      {/* Description */}
      {ledger.description && (
        <p className="text-sm text-slate-500 mb-md">{ledger.description}</p>
      )}

      {/* Metadata strip */}
      <div className="flex flex-wrap items-center gap-lg text-sm text-slate-500">
        <span className="flex items-center gap-xs">
          <TrendingUp className="w-4 h-4 text-slate-400" />
          {t("detail.meta.baseCpi")}&nbsp;
          <span className="font-medium text-slate-700 tabular-nums">
            {ledger.baseCpiIndex.toLocaleString(i18n.language, { minimumFractionDigits: 2, maximumFractionDigits: 4 })}
          </span>
        </span>
        <span className="flex items-center gap-xs">
          <CalendarDays className="w-4 h-4 text-slate-400" />
          {t("detail.meta.created", { date: createdAt })}
        </span>
        <span className="flex items-center gap-xs">
          <Users className="w-4 h-4 text-slate-400" />
          {t("detail.meta.collaborator", { count: ledger.collaborations.length })}
        </span>
        <span className="flex items-center gap-xs">
          <Layers className="w-4 h-4 text-slate-400" />
          {t("detail.meta.categories", { count: ledger.categories.length })}
        </span>
      </div>

      {/* Transaction summary strip */}
      <div className="flex items-center gap-md mt-md pt-md border-t border-slate-100">
        <div className="flex items-center gap-xs">
          <span className="label-muted">{t("detail.summary.transactions")}</span>
          <span className="text-sm font-semibold text-slate-900 tabular-nums">{txCount}</span>
        </div>
        <div className="w-px h-4 bg-slate-200" />
        <div className="flex items-center gap-xs">
          <span className="w-2 h-2 rounded-full bg-income-500" />
          <span className="label-muted">{t("detail.summary.income")}</span>
          <span className="text-sm font-semibold text-income-600 tabular-nums">{incomeCount}</span>
        </div>
        <div className="w-px h-4 bg-slate-200" />
        <div className="flex items-center gap-xs">
          <span className="w-2 h-2 rounded-full bg-expense-500" />
          <span className="label-muted">{t("detail.summary.expenses")}</span>
          <span className="text-sm font-semibold text-expense-600 tabular-nums">{expenseCount}</span>
        </div>
        <div className="w-px h-4 bg-slate-200" />
        <div className="flex items-center gap-xs">
          <span className="label-muted">{t("detail.summary.paymentMethods")}</span>
          <span className="text-sm font-semibold text-slate-900 tabular-nums">{ledger.paymentMethods.length}</span>
        </div>
      </div>
    </div>
  );
};
