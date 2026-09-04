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
import { WeeklyView } from "../components/organisms/WeeklyView";
import { DebtsView } from "../components/organisms/DebtsView";
import { TransactionViewToggle } from "../components/molecules/TransactionViewToggle";
import { CreateTransactionModal } from "../components/organisms/CreateTransactionModal";
import { EditTransactionModal } from "../components/organisms/EditTransactionModal";
import { CategoryModal } from "../components/organisms/CategoryModal";
import { GroupModal } from "../components/organisms/GroupModal";
import { PaymentMethodModal } from "../components/organisms/PaymentMethodModal";
import { useAuthStore } from "../stores/auth-store";
import { getLedger } from "../services/ledger-service";
import {
  createTransaction,
  getTransactions,
  getTransaction,
  updateTransactionFlags,
  updateTransaction,
  deleteTransaction,
} from "../services/transaction-service";
import { getDebtOwners } from "../services/debt-owner-service";
import {
  createCategory,
  updateCategory,
  deleteCategory,
} from "../services/category-service";
import {
  createGroup,
  updateGroup,
  deleteGroup,
} from "../services/group-service";
import {
  createPaymentMethod,
  updatePaymentMethod,
  deletePaymentMethod,
} from "../services/payment-method-service";
import { ApiError } from "../services/api-client";
import { cn } from "../utils/cn";
import type {
  LedgerDetailTab,
  LedgerResponseDto,
  EntryType,
  TransactionResponseDto,
  TransactionFilters as TxFilters,
  CategoryResponseDto,
  GroupResponseDto,
  PaymentMethodResponseDto,
} from "../types";
import type {
  CreateTransactionFormData,
  EditTransactionFormData,
} from "../schemas/transaction.schema";
import type { CreatePaymentMethodData } from "../services/payment-method-service";
import type { TransactionView } from "../components/molecules/TransactionViewToggle";

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
  { id: "debts", labelKey: "detail.tab.debts", count: () => 0 },
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
  const [txView, setTxView] = useState<TransactionView>("table");
  const [editTarget, setEditTarget] = useState<TransactionResponseDto | null>(null);

  // Category modal state
  const [categoryModal, setCategoryModal] = useState<{
    open: boolean;
    editTarget: CategoryResponseDto | null;
  }>({ open: false, editTarget: null });

  // Group modal state
  const [groupModal, setGroupModal] = useState<{
    open: boolean;
    editTarget: GroupResponseDto | null;
  }>({ open: false, editTarget: null });

  // Payment method modal state
  const [pmModal, setPmModal] = useState<{
    open: boolean;
    editTarget: PaymentMethodResponseDto | null;
  }>({ open: false, editTarget: null });

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

  // Debt owners — shares its cache key with DebtsView, so this only powers the
  // tab count and triggers no extra request.
  const { data: debtOwners = [] } = useQuery({
    queryKey: ["debtOwners", Number(id)],
    queryFn: () => getDebtOwners(id!, token!),
    enabled: !!id && !!token,
  });

  // Open the transaction a debt belongs to — debt edits happen through it.
  const openDebtTransaction = async (transactionId: number) => {
    const tx = await getTransaction(transactionId, token!);
    setEditTarget(tx);
  };

  const invalidateLedger = () =>
    queryClient.invalidateQueries({ queryKey: ["ledger", id] });

  // ---------------------------------------------------------------------------
  // Transaction mutations
  // ---------------------------------------------------------------------------

  const createTransactionMutation = useMutation({
    mutationFn: (data: CreateTransactionFormData) =>
      createTransaction(id!, data, token!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["transactions", id] });
      void invalidateLedger();
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
      void queryClient.invalidateQueries({ queryKey: ["debtOwners", Number(id)] });
      void queryClient.invalidateQueries({ queryKey: ["debtReport", Number(id)] });
      setEditTarget(null);
    },
  });

  const deleteTransactionMutation = useMutation({
    mutationFn: (tx: TransactionResponseDto) =>
      deleteTransaction(tx.id, token!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["transactions", id] });
      void invalidateLedger();
    },
  });

  // ---------------------------------------------------------------------------
  // Category mutations
  // ---------------------------------------------------------------------------

  const createCategoryMutation = useMutation({
    mutationFn: (data: { name: string; description?: string }) =>
      createCategory(id!, data, token!),
    onSuccess: () => void invalidateLedger(),
  });

  const updateCategoryMutation = useMutation({
    mutationFn: ({ catId, data }: { catId: number; data: { name?: string; description?: string } }) =>
      updateCategory(catId, data, token!),
    onSuccess: () => void invalidateLedger(),
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: (cat: CategoryResponseDto) => deleteCategory(cat.id, token!),
    onSuccess: () => void invalidateLedger(),
  });

  // ---------------------------------------------------------------------------
  // Group mutations
  // ---------------------------------------------------------------------------

  const createGroupMutation = useMutation({
    mutationFn: (data: { name: string }) => createGroup(id!, data, token!),
    onSuccess: () => void invalidateLedger(),
  });

  const updateGroupMutation = useMutation({
    mutationFn: ({ groupId, data }: { groupId: number; data: { name?: string } }) =>
      updateGroup(groupId, data, token!),
    onSuccess: () => void invalidateLedger(),
  });

  const deleteGroupMutation = useMutation({
    mutationFn: (group: GroupResponseDto) => deleteGroup(group.id, token!),
    onSuccess: () => void invalidateLedger(),
  });

  // ---------------------------------------------------------------------------
  // Payment method mutations
  // ---------------------------------------------------------------------------

  const createPaymentMethodMutation = useMutation({
    mutationFn: (data: CreatePaymentMethodData) =>
      createPaymentMethod(data, token!),
    onSuccess: () => void invalidateLedger(),
  });

  const updatePaymentMethodMutation = useMutation({
    mutationFn: ({ pmId, data }: { pmId: number; data: Partial<CreatePaymentMethodData> }) =>
      updatePaymentMethod(pmId, data, token!),
    onSuccess: () => void invalidateLedger(),
  });

  const deletePaymentMethodMutation = useMutation({
    mutationFn: (pm: PaymentMethodResponseDto) =>
      deletePaymentMethod(pm.id, token!),
    onSuccess: () => void invalidateLedger(),
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
              tab.id === "transactions"
                ? transactions.length
                : tab.id === "debts"
                  ? debtOwners.length
                  : tab.count(ledger);
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
          <div className="space-y-md">
            <TransactionViewToggle view={txView} onChange={setTxView} />

            {txView === "weekly" ? (
              <WeeklyView
                ledgerId={ledger.id}
                currency={ledger.currency}
                paymentMethods={ledger.paymentMethods}
              />
            ) : (
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
          </div>
        )}

        {activeTab === "categories" && (
          <CategoriesTable
            categories={ledger.categories}
            onAdd={() => setCategoryModal({ open: true, editTarget: null })}
            onEdit={(cat) => setCategoryModal({ open: true, editTarget: cat })}
            onDelete={(cat) => deleteCategoryMutation.mutate(cat)}
          />
        )}

        {activeTab === "paymentMethods" && (
          <PaymentMethodsTable
            methods={ledger.paymentMethods}
            onAdd={() => setPmModal({ open: true, editTarget: null })}
            onEdit={(pm) => setPmModal({ open: true, editTarget: pm })}
            onDelete={(pm) => deletePaymentMethodMutation.mutate(pm)}
          />
        )}

        {activeTab === "groups" && (
          <GroupsTable
            groups={ledger.groups}
            onAdd={() => setGroupModal({ open: true, editTarget: null })}
            onEdit={(g) => setGroupModal({ open: true, editTarget: g })}
            onDelete={(g) => deleteGroupMutation.mutate(g)}
          />
        )}

        {activeTab === "collaborators" && (
          <CollaboratorsTable collaborations={ledger.collaborations} />
        )}

        {activeTab === "debts" && (
          <DebtsView
            ledgerId={ledger.id}
            currency={ledger.currency}
            onOpenTransaction={openDebtTransaction}
          />
        )}
      </div>

      {/* Transaction modals */}
      <CreateTransactionModal
        open={txModal.open}
        onClose={() => setTxModal((s) => ({ ...s, open: false }))}
        onSubmit={(data) => createTransactionMutation.mutateAsync(data)}
        defaultEntryType={txModal.entryType}
        defaultCurrency={ledger.currency}
        categories={ledger.categories}
        paymentMethods={ledger.paymentMethods}
        groups={ledger.groups}
        onCreateCategory={(name) => createCategoryMutation.mutateAsync({ name })}
        onCreateGroup={(name) => createGroupMutation.mutateAsync({ name })}
        onCreatePaymentMethod={(name, type) =>
          createPaymentMethodMutation.mutateAsync({ name, type })
        }
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

      {/* Category modal */}
      <CategoryModal
        open={categoryModal.open}
        onClose={() => setCategoryModal({ open: false, editTarget: null })}
        initialData={categoryModal.editTarget ?? undefined}
        onSubmit={(data) => {
          if (categoryModal.editTarget) {
            return updateCategoryMutation.mutateAsync({
              catId: categoryModal.editTarget.id,
              data,
            });
          }
          return createCategoryMutation.mutateAsync(data);
        }}
      />

      {/* Group modal */}
      <GroupModal
        open={groupModal.open}
        onClose={() => setGroupModal({ open: false, editTarget: null })}
        initialData={groupModal.editTarget ?? undefined}
        onSubmit={(data) => {
          if (groupModal.editTarget) {
            return updateGroupMutation.mutateAsync({
              groupId: groupModal.editTarget.id,
              data,
            });
          }
          return createGroupMutation.mutateAsync(data);
        }}
      />

      {/* Payment method modal */}
      <PaymentMethodModal
        open={pmModal.open}
        onClose={() => setPmModal({ open: false, editTarget: null })}
        initialData={pmModal.editTarget ?? undefined}
        onSubmit={(data) => {
          if (pmModal.editTarget) {
            return updatePaymentMethodMutation.mutateAsync({
              pmId: pmModal.editTarget.id,
              data,
            });
          }
          return createPaymentMethodMutation.mutateAsync(data);
        }}
      />
    </main>
  );
};
