import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { LayoutDashboard } from "lucide-react";
import { CategoriesTable } from "../components/molecules/CategoriesTable";
import { CollaboratorsTable } from "../components/molecules/CollaboratorsTable";
import { GroupsTable } from "../components/molecules/GroupsTable";
import { PaymentMethodsTable } from "../components/molecules/PaymentMethodsTable";
import { TransactionFilters } from "../components/molecules/TransactionFilters";
import { LedgerDetailHeader } from "../components/organisms/LedgerDetailHeader";
import { TransactionTable } from "../components/organisms/TransactionTable";
import { CreateTransactionModal } from "../components/organisms/CreateTransactionModal";
import { EditTransactionModal } from "../components/organisms/EditTransactionModal";
import { useAuthStore } from "../stores/auth-store";
import { getLedger } from "../services/ledger-service";
import {
  createTransaction,
  getTransactions,
  updateTransactionFlags,
  updateTransaction,
  deleteTransaction,
} from "../services/transaction-service";
import { ApiError } from "../services/api-client";
import { cn } from "../utils/cn";
import type {
  LedgerDetailTab,
  LedgerResponseDto,
  EntryType,
  TransactionResponseDto,
  TransactionFilters as TxFilters,
} from "../types";
import type {
  CreateTransactionFormData,
  EditTransactionFormData,
} from "../schemas/transaction.schema";

// ---------------------------------------------------------------------------
// Tab config
// ---------------------------------------------------------------------------

const TAB_CONFIG: {
  id: LedgerDetailTab;
  labelKey: string;
  count: (l: LedgerResponseDto) => number;
}[] = [
  { id: "transactions", labelKey: "detail.tab.transactions", count: (l) => l.transactions.length },
  { id: "categories", labelKey: "detail.tab.categories", count: (l) => l.categories.length },
  { id: "paymentMethods", labelKey: "detail.tab.paymentMethods", count: (l) => l.paymentMethods.length },
  { id: "groups", labelKey: "detail.tab.groups", count: (l) => l.groups.length },
  { id: "collaborators", labelKey: "detail.tab.collaborators", count: (l) => l.collaborations.length },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export const LedgerDetailPage = () => {
  const { t } = useTranslation("ledger");
  const { id } = useParams<{ id: string }>();
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);

  const [activeTab, setActiveTab] = useState<LedgerDetailTab>("transactions");
  const [txModal, setTxModal] = useState<{ open: boolean; entryType: EntryType }>({
    open: false,
    entryType: "EXPENSE",
  });
  const [filters, setFilters] = useState<TxFilters>({});
  const [editTarget, setEditTarget] = useState<TransactionResponseDto | null>(null);

  const openTxModal = (entryType: EntryType) =>
    setTxModal({ open: true, entryType });

  // Ledger query — metadata, categories, groups, etc.
  const {
    data: ledger,
    isLoading,
    isError,
    error,
  } = useQuery({
    queryKey: ["ledger", id],
    queryFn: () => getLedger(id!, token!),
    enabled: !!id && !!token,
  });

  // Separate transactions query — filterable, independent from ledger query
  const { data: transactions = [], isLoading: txLoading } = useQuery({
    queryKey: ["transactions", id, filters],
    queryFn: () => getTransactions(id!, filters, token!),
    enabled: !!id && !!token,
  });

  // ---------------------------------------------------------------------------
  // Mutations
  // ---------------------------------------------------------------------------

  const createTransactionMutation = useMutation({
    mutationFn: (data: CreateTransactionFormData) =>
      createTransaction(id!, data, token!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["transactions", id] });
      void queryClient.invalidateQueries({ queryKey: ["ledger", id] });
    },
  });

  const togglePaidMutation = useMutation({
    mutationFn: (tx: TransactionResponseDto) =>
      updateTransactionFlags(tx.id, { isPaid: !tx.isPaid }, token!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["transactions", id] });
    },
  });

  const toggleCashflowMutation = useMutation({
    mutationFn: (tx: TransactionResponseDto) =>
      updateTransactionFlags(tx.id, { impactsCashflow: !tx.impactsCashflow }, token!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["transactions", id] });
    },
  });

  const editTransactionMutation = useMutation({
    mutationFn: (data: EditTransactionFormData) =>
      updateTransaction(editTarget!.id, data, token!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["transactions", id] });
      setEditTarget(null);
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: (tx: TransactionResponseDto) =>
      deleteTransaction(tx.id, token!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["transactions", id] });
      void queryClient.invalidateQueries({ queryKey: ["ledger", id] });
    },
  });

  // ---------------------------------------------------------------------------
  // Loading / error states
  // ---------------------------------------------------------------------------

  if (isLoading) {
    return (
      <main className="flex-1 overflow-y-auto p-lg">
        <div className="flex flex-col items-center justify-center h-full gap-md text-center">
          <div className="w-10 h-10 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
        </div>
      </main>
    );
  }

  if (isError) {
    const isNotFound = error instanceof ApiError && error.status === 404;
    return (
      <main className="flex-1 overflow-y-auto p-lg">
        <div className="flex flex-col items-center justify-center h-full gap-md text-center">
          <p className="text-4xl">{isNotFound ? "🔍" : "⚠️"}</p>
          <h2 className="text-xl font-semibold text-stone-900">
            {isNotFound ? t("detail.notFound.title") : t("detail.unavailable.title")}
          </h2>
          <p className="text-sm text-stone-500 max-w-xs">
            {isNotFound
              ? t("detail.notFound.body", { id })
              : t("detail.unavailable.body")}
          </p>
          <Link
            to="/dashboard"
            className="flex items-center gap-xs text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <LayoutDashboard className="w-4 h-4" />
            {t("detail.notFound.back")}
          </Link>
        </div>
      </main>
    );
  }

  if (!ledger) return null;

  return (
    <main className="flex-1 overflow-y-auto">
      <LedgerDetailHeader ledger={ledger} />

      {/* Tab bar */}
      <div className="bg-white border-b border-stone-200 px-lg overflow-x-auto scrollbar-hide">
        <nav className="flex gap-xs -mb-px min-w-max">
          {TAB_CONFIG.map((tab) => {
            const isActive = activeTab === tab.id;
            const count =
              tab.id === "transactions" ? transactions.length : tab.count(ledger);
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-xs px-md py-sm text-sm font-medium border-b-2 transition-colors",
                  isActive
                    ? "border-primary-500 text-primary-700"
                    : "border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300",
                )}
              >
                {t(tab.labelKey)}
                <span
                  className={cn(
                    "inline-flex items-center justify-center rounded-full text-xs font-semibold w-5 h-5",
                    isActive
                      ? "bg-primary-100 text-primary-700"
                      : "bg-stone-100 text-stone-500",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab content */}
      <div className="p-lg">
        {activeTab === "transactions" && (
          <>
            <TransactionFilters
              filters={filters}
              onChange={setFilters}
              categories={ledger.categories}
              groups={ledger.groups}
              paymentMethods={ledger.paymentMethods}
              totalCount={transactions.length}
            />
            {txLoading ? (
              <div className="flex justify-center py-xl">
                <div className="w-8 h-8 rounded-full border-4 border-primary-200 border-t-primary-600 animate-spin" />
              </div>
            ) : (
              <TransactionTable
                transactions={transactions}
                onAddIncome={() => openTxModal("INCOME")}
                onAddExpense={() => openTxModal("EXPENSE")}
                onTogglePaid={(tx) => togglePaidMutation.mutate(tx)}
                onToggleCashflow={(tx) => toggleCashflowMutation.mutate(tx)}
                onEdit={setEditTarget}
                onDelete={(tx) => deleteTransactionMutation.mutate(tx)}
              />
            )}
          </>
        )}
        {activeTab === "categories" && (
          <CategoriesTable categories={ledger.categories} />
        )}
        {activeTab === "paymentMethods" && (
          <PaymentMethodsTable methods={ledger.paymentMethods} />
        )}
        {activeTab === "groups" && <GroupsTable groups={ledger.groups} />}
        {activeTab === "collaborators" && (
          <CollaboratorsTable collaborations={ledger.collaborations} />
        )}
      </div>

      {/* Create transaction modal */}
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

      {/* Edit transaction modal */}
      <EditTransactionModal
        open={!!editTarget}
        transaction={editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={(data) => editTransactionMutation.mutateAsync(data)}
        categories={ledger.categories}
        paymentMethods={ledger.paymentMethods}
        groups={ledger.groups}
      />
    </main>
  );
};
