import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Plus, Wallet } from "lucide-react";
import { TransactionFilters } from "../components/molecules/TransactionFilters";
import { TransactionTable } from "../components/organisms/TransactionTable";
import { WeeklyView } from "../components/organisms/WeeklyView";
import { TransactionViewToggle } from "../components/molecules/TransactionViewToggle";
import { CreateTransactionModal } from "../components/organisms/CreateTransactionModal";
import { EditTransactionModal } from "../components/organisms/EditTransactionModal";
import { Button } from "../components/atoms/Button";
import { useAuthStore } from "../stores/auth-store";
import { getLedgers, getLedger } from "../services/ledger-service";
import {
  createTransaction,
  getTransactions,
  updateTransactionFlags,
  updateTransaction,
  deleteTransaction,
} from "../services/transaction-service";
import { formatCurrency } from "../utils/format-currency";
import { cn } from "../utils/cn";
import type {
  TransactionResponseDto,
  TransactionFilters as TxFilters,
  EntryType,
  Currency,
} from "../types";
import type {
  CreateTransactionFormData,
  EditTransactionFormData,
} from "../schemas/transaction.schema";
import type { TransactionView } from "../components/molecules/TransactionViewToggle";

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export const TransactionsPage = () => {
  const { t, i18n } = useTranslation("ledger");
  const { t: tc } = useTranslation("common");
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);

  const [pickedLedgerId, setPickedLedgerId] = useState<string | null>(null);
  const [filters, setFilters] = useState<TxFilters>({});
  const [view, setView] = useState<TransactionView>("table");
  const [txModal, setTxModal] = useState<{ open: boolean; entryType: EntryType }>({
    open: false,
    entryType: "EXPENSE",
  });
  const [editTarget, setEditTarget] = useState<TransactionResponseDto | null>(null);

  // -------------------------------------------------------------------------
  // Queries
  // -------------------------------------------------------------------------

  const { data: ledgers = [], isLoading: ledgersLoading } = useQuery({
    queryKey: ["ledgers"],
    queryFn: () => getLedgers(token!),
    enabled: !!token,
  });

  // Effective selection: the user's explicit pick, else the first ledger once
  // the list loads. Derived during render — no effect, no cascading re-render.
  const selectedLedgerId =
    pickedLedgerId ?? (ledgers[0] ? String(ledgers[0].id) : null);

  const { data: ledger } = useQuery({
    queryKey: ["ledger", selectedLedgerId],
    queryFn: () => getLedger(selectedLedgerId!, token!),
    enabled: !!selectedLedgerId && !!token,
  });

  const { data: transactions = [], isLoading: txLoading } = useQuery({
    queryKey: ["transactions", selectedLedgerId, filters],
    queryFn: () => getTransactions(selectedLedgerId!, filters, token!),
    enabled: !!selectedLedgerId && !!token,
  });

  // -------------------------------------------------------------------------
  // Summary stats (derived from the current filtered result)
  // -------------------------------------------------------------------------

  const totalIncome = transactions
    .filter((tx) => tx.entryType === "INCOME")
    .reduce((sum, tx) => sum + tx.monthlyAmount, 0);

  const totalExpenses = transactions
    .filter((tx) => tx.entryType === "EXPENSE")
    .reduce((sum, tx) => sum + tx.monthlyAmount, 0);

  const balance = totalIncome - totalExpenses;
  const currency = ledger?.currency as Currency | undefined;

  // -------------------------------------------------------------------------
  // Mutations
  // -------------------------------------------------------------------------

  const createTransactionMutation = useMutation({
    mutationFn: (data: CreateTransactionFormData) =>
      createTransaction(selectedLedgerId!, data, token!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["transactions", selectedLedgerId] });
      void queryClient.invalidateQueries({ queryKey: ["ledger", selectedLedgerId] });
    },
  });

  const togglePaidMutation = useMutation({
    mutationFn: (tx: TransactionResponseDto) =>
      updateTransactionFlags(tx.id, { isPaid: !tx.isPaid }, token!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["transactions", selectedLedgerId] });
    },
  });

  const toggleCashflowMutation = useMutation({
    mutationFn: (tx: TransactionResponseDto) =>
      updateTransactionFlags(tx.id, { impactsCashflow: !tx.impactsCashflow }, token!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["transactions", selectedLedgerId] });
    },
  });

  const editTransactionMutation = useMutation({
    mutationFn: (data: EditTransactionFormData) =>
      updateTransaction(editTarget!.id, data, token!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["transactions", selectedLedgerId] });
      setEditTarget(null);
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: (tx: TransactionResponseDto) => deleteTransaction(tx.id, token!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["transactions", selectedLedgerId] });
      void queryClient.invalidateQueries({ queryKey: ["ledger", selectedLedgerId] });
    },
  });

  // -------------------------------------------------------------------------
  // Loading / empty states
  // -------------------------------------------------------------------------

  if (ledgersLoading) {
    return (
      <main className="flex-1 p-lg flex items-center justify-center">
        <div className="w-10 h-10 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
      </main>
    );
  }

  if (ledgers.length === 0) {
    return (
      <main className="flex-1 p-lg flex flex-col items-center justify-center text-center gap-md">
        <span className="text-4xl">📊</span>
        <p className="section-title">{tc("transactions.noLedgers.title")}</p>
        <p className="text-sm text-stone-500">{tc("transactions.noLedgers.body")}</p>
      </main>
    );
  }

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  return (
    <main className="flex-1 overflow-y-auto">
      {/* ------------------------------------------------------------------ */}
      {/* Toolbar: ledger selector + add buttons                              */}
      {/* ------------------------------------------------------------------ */}
      <div className="bg-white border-b border-stone-100 px-lg py-sm flex flex-wrap items-center gap-sm">
        {/* Ledger selector pills */}
        <div className="flex gap-xs overflow-x-auto scrollbar-hide py-xs">
          {ledgers.map((l) => (
            <button
              key={l.id}
              type="button"
              onClick={() => {
                setPickedLedgerId(String(l.id));
                setFilters({});
              }}
              className={cn(
                "px-md py-xs rounded-full text-sm font-medium whitespace-nowrap transition-colors shrink-0",
                selectedLedgerId === String(l.id)
                  ? "bg-primary-600 text-white"
                  : "bg-stone-100 text-stone-600 hover:bg-stone-200",
              )}
            >
              {l.name}
            </button>
          ))}
        </div>

        {/* Add buttons — only when a ledger is fully loaded */}
        {ledger && (
          <div className="flex gap-sm ml-auto shrink-0">
            <Button
              variant="income"
              size="sm"
              onClick={() => setTxModal({ open: true, entryType: "INCOME" })}
            >
              <Plus className="w-4 h-4" />
              {t("transaction.table.addIncome")}
            </Button>
            <Button
              variant="expense"
              size="sm"
              onClick={() => setTxModal({ open: true, entryType: "EXPENSE" })}
            >
              <Plus className="w-4 h-4" />
              {t("transaction.table.addExpense")}
            </Button>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Page body                                                           */}
      {/* ------------------------------------------------------------------ */}
      <div className="p-lg space-y-lg">
        {selectedLedgerId && ledger ? (
          <>
            <TransactionViewToggle view={view} onChange={setView} />

            {view === "weekly" ? (
              <WeeklyView
                ledgerId={ledger.id}
                currency={ledger.currency}
                paymentMethods={ledger.paymentMethods}
              />
            ) : (
            <>
            {/* Summary cards */}
            {currency && (
              <div className="grid grid-cols-3 gap-md">
                <div className="card">
                  <p className="label-muted">{tc("recentTransactions.income")}</p>
                  <p className="text-xl font-bold text-income-600 mt-xs">
                    {formatCurrency(totalIncome, currency, i18n.language)}
                  </p>
                </div>
                <div className="card">
                  <p className="label-muted">{tc("recentTransactions.expenses")}</p>
                  <p className="text-xl font-bold text-expense-600 mt-xs">
                    {formatCurrency(totalExpenses, currency, i18n.language)}
                  </p>
                </div>
                <div className="card">
                  <p className="label-muted">{tc("transactions.summary.balance")}</p>
                  <p
                    className={cn(
                      "text-xl font-bold mt-xs",
                      balance >= 0 ? "text-income-600" : "text-expense-600",
                    )}
                  >
                    {formatCurrency(balance, currency, i18n.language)}
                  </p>
                </div>
              </div>
            )}

            {/* Filters */}
            <TransactionFilters
              filters={filters}
              onChange={setFilters}
              categories={ledger.categories}
              groups={ledger.groups}
              paymentMethods={ledger.paymentMethods}
              totalCount={transactions.length}
            />

            {/* Transaction table */}
            {txLoading ? (
              <div className="flex justify-center py-xl">
                <div className="w-8 h-8 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
              </div>
            ) : (
              <TransactionTable
                transactions={transactions}
                onAddIncome={() => setTxModal({ open: true, entryType: "INCOME" })}
                onAddExpense={() => setTxModal({ open: true, entryType: "EXPENSE" })}
                onTogglePaid={(tx) => togglePaidMutation.mutate(tx)}
                onToggleCashflow={(tx) => toggleCashflowMutation.mutate(tx)}
                onEdit={setEditTarget}
                onDelete={(tx) => deleteTransactionMutation.mutate(tx)}
              />
            )}
            </>
            )}
          </>
        ) : (
          /* Fallback — should rarely show since we auto-select the first ledger */
          <div className="flex flex-col items-center justify-center py-3xl text-center gap-md">
            <Wallet className="w-12 h-12 text-stone-300" />
            <p className="section-title">{tc("transactions.pickLedger")}</p>
            <p className="text-sm text-stone-500">{tc("transactions.pickLedgerBody")}</p>
          </div>
        )}
      </div>

      {/* ------------------------------------------------------------------ */}
      {/* Modals                                                              */}
      {/* ------------------------------------------------------------------ */}
      {ledger && (
        <>
          <CreateTransactionModal
            open={txModal.open}
            onClose={() => setTxModal((s) => ({ ...s, open: false }))}
            onSubmit={(data) => createTransactionMutation.mutateAsync(data)}
            defaultEntryType={txModal.entryType}
            defaultCurrency={ledger.currency}
            categories={ledger.categories}
            paymentMethods={ledger.paymentMethods}
            groups={ledger.groups}
          />
          <EditTransactionModal
            open={!!editTarget}
            transaction={editTarget}
            onClose={() => setEditTarget(null)}
            onSubmit={(data) => editTransactionMutation.mutateAsync(data)}
            categories={ledger.categories}
            paymentMethods={ledger.paymentMethods}
            groups={ledger.groups}
          />
        </>
      )}
    </main>
  );
};
