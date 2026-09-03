import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { HandCoins } from "lucide-react";
import { DebtsView } from "../components/organisms/DebtsView";
import { EditTransactionModal } from "../components/organisms/EditTransactionModal";
import { useAuthStore } from "../stores/auth-store";
import { getLedgers, getLedger } from "../services/ledger-service";
import { getTransaction, updateTransaction } from "../services/transaction-service";
import { cn } from "../utils/cn";
import type { TransactionResponseDto } from "../types";
import type { EditTransactionFormData } from "../schemas/transaction.schema";

export const DebtsPage = () => {
  const { t } = useTranslation("common");
  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);

  const [pickedLedgerId, setPickedLedgerId] = useState<number | null>(null);
  const [editTarget, setEditTarget] = useState<TransactionResponseDto | null>(null);

  const { data: ledgers = [], isLoading: ledgersLoading } = useQuery({
    queryKey: ["ledgers"],
    queryFn: () => getLedgers(token!),
    enabled: !!token,
  });

  const activeLedgerId = pickedLedgerId ?? ledgers[0]?.id ?? null;

  const { data: ledger } = useQuery({
    queryKey: ["ledger", activeLedgerId ? String(activeLedgerId) : null],
    queryFn: () => getLedger(String(activeLedgerId), token!),
    enabled: !!activeLedgerId && !!token,
  });

  const editTransactionMutation = useMutation({
    mutationFn: (data: EditTransactionFormData) =>
      updateTransaction(editTarget!.id, data, token!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["debtOwners", activeLedgerId] });
      void queryClient.invalidateQueries({ queryKey: ["debtReport", activeLedgerId] });
      void queryClient.invalidateQueries({ queryKey: ["transactions", String(activeLedgerId)] });
      setEditTarget(null);
    },
  });

  const openDebtTransaction = async (transactionId: number) => {
    const tx = await getTransaction(transactionId, token!);
    setEditTarget(tx);
  };

  return (
    <div className="p-md space-y-md">
      {/* Title */}
      <div className="flex items-center gap-sm">
        <div className="icon-pill bg-primary-100">
          <HandCoins className="w-5 h-5 text-primary-600" />
        </div>
        <h1 className="text-2xl font-semibold text-stone-900">{t("debts.title")}</h1>
      </div>

      {/* Ledger selector */}
      {ledgersLoading ? (
        <div className="h-9 bg-stone-100 animate-pulse rounded-full w-48" />
      ) : ledgers.length === 0 ? (
        <div className="card text-center py-xl">
          <p className="section-title mb-xs">{t("debts.noLedger.title")}</p>
          <p className="label-muted">{t("debts.noLedger.body")}</p>
        </div>
      ) : (
        <div className="flex gap-xs overflow-x-auto scrollbar-hide pb-xs">
          {ledgers.map((l) => (
            <button
              key={l.id}
              onClick={() => setPickedLedgerId(l.id)}
              className={cn(
                "flex-shrink-0 px-md py-xs rounded-full text-sm font-medium border transition-colors whitespace-nowrap",
                l.id === activeLedgerId
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-stone-600 border-stone-200 hover:border-primary-400 hover:text-primary-600",
              )}
            >
              {l.name}
              <span className="ml-xs text-xs opacity-70">{l.currency}</span>
            </button>
          ))}
        </div>
      )}

      {/* View */}
      {activeLedgerId && ledger && (
        <DebtsView
          ledgerId={activeLedgerId}
          currency={ledger.currency}
          onOpenTransaction={openDebtTransaction}
        />
      )}

      {/* Edit transaction modal — the path to changing a debt */}
      {ledger && (
        <EditTransactionModal
          open={!!editTarget}
          transaction={editTarget}
          onClose={() => setEditTarget(null)}
          onSubmit={(data) => editTransactionMutation.mutateAsync(data)}
          categories={ledger.categories}
          paymentMethods={ledger.paymentMethods}
          groups={ledger.groups}
        />
      )}
    </div>
  );
};
