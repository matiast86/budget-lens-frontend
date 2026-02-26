import { apiFetch } from "./api-client";
import { findOrCreateDebtOwner } from "./debt-owner-service";
import type { TransactionResponseDto } from "../types";
import type { CreateTransactionFormData } from "../schemas/transaction.schema";

export const createTransaction = async (
  ledgerId: string,
  data: CreateTransactionFormData,
  token: string,
): Promise<TransactionResponseDto | TransactionResponseDto[]> => {
  const endpoint =
    data.entryType === "EXPENSE"
      ? `/transactions/ledgers/${ledgerId}/expenses`
      : `/transactions/ledgers/${ledgerId}/incomes`;

  // Resolve each debt owner name to an existing or newly-created ID
  const resolvedDebtAssignments = await Promise.all(
    data.debtAssignments.map(async ({ ownerName, amount, direction }) => {
      const owner = await findOrCreateDebtOwner(ledgerId, ownerName, token);
      return { debtOwnerId: owner.id, amount, direction };
    }),
  );

  const body: Record<string, unknown> = {
    categoryId: data.categoryId,
    groupId: data.groupId,
    paymentMethodId: data.paymentMethodId,
    transactionDate: data.transactionDate,
    paymentMonthValue: data.paymentMonth,
    currency: data.currency,
    totalProvidedAmount: data.totalAmount,
    impactsCashflow: data.impactsCashflow,
    debtAssignments: resolvedDebtAssignments,
    ...(data.comment ? { comment: data.comment } : {}),
  };

  if (data.entryType === "EXPENSE") {
    body.installments = data.installments;
  }

  return apiFetch<TransactionResponseDto | TransactionResponseDto[]>(
    endpoint,
    { method: "POST", body: JSON.stringify(body) },
    token,
  );
};
