import { apiFetch } from "./api-client";
import { findOrCreateDebtOwner } from "./debt-owner-service";
import type { TransactionResponseDto, TransactionFilters } from "../types";
import type {
  CreateTransactionFormData,
  EditTransactionFormData,
} from "../schemas/transaction.schema";

// ---------------------------------------------------------------------------
// Create
// ---------------------------------------------------------------------------

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

  const isBundle = data.transactionType === "FIXED";

  const body: Record<string, unknown> = {
    categoryId: data.categoryId,
    groupId: data.groupId,
    paymentMethodId: data.paymentMethodId,
    transactionDate: data.transactionDate,
    paymentMonthValue: data.paymentMonth,
    currency: data.currency,
    transactionTypeEntry: data.transactionType,
    totalProvidedAmount: data.totalAmount,
    impactsCashflow: data.impactsCashflow,
    debtAssignments: resolvedDebtAssignments,
    ...(data.comment ? { comment: data.comment } : {}),
  };

  if (data.entryType === "EXPENSE") {
    // Installments and recurring bundles are mutually exclusive on the backend.
    body.installments = isBundle ? 1 : data.installments;
  }

  if (isBundle) {
    // `bundleTo` is a "YYYY-MM" period string; the backend expands the bundle
    // to one transaction per month up to and including it.
    body.bundleTo = data.bundleTo;
    // UI collects a whole-number percentage; the API expects a fraction.
    if (data.increaseRate !== undefined) {
      body.increaseRate = data.increaseRate / 100;
    }
    if (data.increaseEveryMonths !== undefined) {
      body.increaseEveryMonths = data.increaseEveryMonths;
    }
  }

  return apiFetch<TransactionResponseDto | TransactionResponseDto[]>(
    endpoint,
    { method: "POST", body: JSON.stringify(body) },
    token,
  );
};

// ---------------------------------------------------------------------------
// Read (filtered list)
// ---------------------------------------------------------------------------

export const getTransactions = async (
  ledgerId: string,
  filters: TransactionFilters,
  token: string,
): Promise<TransactionResponseDto[]> => {
  const params = new URLSearchParams();

  if (filters.status) params.set("status", filters.status);
  if (filters.entryType) params.set("entryType", filters.entryType);
  if (filters.categoryId) params.set("categoryId", String(filters.categoryId));
  if (filters.groupId) params.set("groupId", String(filters.groupId));
  if (filters.paymentMethodId)
    params.set("paymentMethodId", String(filters.paymentMethodId));
  if (filters.paymentMonth) params.set("paymentMonth", filters.paymentMonth);
  if (filters.isPaid !== undefined) params.set("isPaid", String(filters.isPaid));
  if (filters.skip !== undefined) params.set("skip", String(filters.skip));
  if (filters.take !== undefined) params.set("take", String(filters.take));

  const qs = params.toString();
  const endpoint = `/transactions/ledgers/${ledgerId}${qs ? `?${qs}` : ""}`;

  return apiFetch<TransactionResponseDto[]>(
    endpoint,
    { method: "GET" },
    token,
  );
};

// ---------------------------------------------------------------------------
// Read (single)
// ---------------------------------------------------------------------------

export const getTransaction = async (
  txId: number,
  token: string,
): Promise<TransactionResponseDto> =>
  apiFetch<TransactionResponseDto>(
    `/transactions/${txId}`,
    { method: "GET" },
    token,
  );

// ---------------------------------------------------------------------------
// Update flags (isPaid / impactsCashflow)
// ---------------------------------------------------------------------------

export const updateTransactionFlags = async (
  txId: number,
  flags: { isPaid?: boolean; impactsCashflow?: boolean },
  token: string,
): Promise<TransactionResponseDto> => {
  return apiFetch<TransactionResponseDto>(
    `/transactions/${txId}/flags`,
    { method: "PATCH", body: JSON.stringify(flags) },
    token,
  );
};

// ---------------------------------------------------------------------------
// Update core fields (amount, date, comment, relations)
// ---------------------------------------------------------------------------

export const updateTransaction = async (
  txId: number,
  data: EditTransactionFormData,
  token: string,
): Promise<TransactionResponseDto> => {
  const body: Record<string, unknown> = {
    totalProvidedAmount: data.totalAmount,
    transactionDate: data.transactionDate,
    paymentMonthValue: data.paymentMonth,
    categoryId: data.categoryId,
    groupId: data.groupId,
    paymentMethodId: data.paymentMethodId,
    comment: data.comment ?? "",
  };

  return apiFetch<TransactionResponseDto>(
    `/transactions/${txId}`,
    { method: "PATCH", body: JSON.stringify(body) },
    token,
  );
};

// ---------------------------------------------------------------------------
// Breakdown (W1-W4)
// ---------------------------------------------------------------------------

export const updateTransactionBreakdown = async (
  txId: number,
  amounts: { amountOne?: number; amountTwo?: number; amountThree?: number; amountFour?: number },
  token: string,
): Promise<TransactionResponseDto> => {
  return apiFetch<TransactionResponseDto>(
    `/transactions/${txId}/breakdown`,
    { method: "PATCH", body: JSON.stringify(amounts) },
    token,
  );
};

// ---------------------------------------------------------------------------
// Delete
// ---------------------------------------------------------------------------

export const deleteTransaction = async (
  txId: number,
  token: string,
): Promise<void> => {
  return apiFetch<void>(
    `/transactions/${txId}`,
    { method: "DELETE" },
    token,
  );
};
