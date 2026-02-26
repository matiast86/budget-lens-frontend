import type React from "react";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { X, Pencil } from "lucide-react";
import { cn } from "../../utils/cn";
import { Button } from "../atoms/Button";
import { formatCurrency } from "../../utils/format-currency";
import {
  editTransactionSchema,
  type EditTransactionFormData,
} from "../../schemas/transaction.schema";
import type {
  CategoryResponseDto,
  PaymentMethodResponseDto,
  GroupResponseDto,
  TransactionResponseDto,
  Currency,
} from "../../types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface EditTransactionModalProps {
  open: boolean;
  transaction: TransactionResponseDto | null;
  onClose: () => void;
  onSubmit: (data: EditTransactionFormData) => Promise<void>;
  categories: CategoryResponseDto[];
  paymentMethods: PaymentMethodResponseDto[];
  groups: GroupResponseDto[];
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const inputClass = (hasError: boolean) =>
  cn(
    "w-full rounded-md border bg-white px-sm py-xs text-sm text-stone-900 placeholder:text-stone-400",
    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
    hasError ? "border-expense-400" : "border-stone-300",
  );

/** Convert an ISO date string to YYYY-MM-DD for <input type="date"> */
const toDateValue = (iso: string): string => iso.slice(0, 10);

/** Convert an ISO date string to YYYY-MM for <input type="month"> */
const toMonthValue = (iso: string): string => iso.slice(0, 7);

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const EditTransactionModal = ({
  open,
  transaction,
  onClose,
  onSubmit,
  categories,
  paymentMethods,
  groups,
}: EditTransactionModalProps) => {
  const { t, i18n } = useTranslation("ledger");
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EditTransactionFormData>({
    resolver: zodResolver(editTransactionSchema),
  });

  // Pre-fill from the transaction whenever the modal opens
  useEffect(() => {
    if (open && transaction) {
      setServerError(null);
      reset({
        totalAmount: transaction.totalAmount,
        transactionDate: toDateValue(transaction.transactionDate),
        paymentMonth: toMonthValue(transaction.paymentMonth),
        categoryId: transaction.category.id,
        groupId: transaction.group?.id,
        paymentMethodId: transaction.paymentMethod.id,
        comment: transaction.comment ?? "",
      });
    }
  }, [open, transaction, reset]);

  // Escape key closes
  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") handleClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open]); // eslint-disable-line react-hooks/exhaustive-deps

  const handleClose = () => {
    reset();
    onClose();
  };

  const submit = async (data: EditTransactionFormData) => {
    setServerError(null);
    try {
      await onSubmit(data);
      handleClose();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : String(err));
    }
  };

  const watchedAmount = watch("totalAmount");
  const currency = (transaction?.currency ?? "ARS") as Currency;

  if (!open || !transaction) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="edit-tx-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Panel */}
      <div className="relative bg-white w-full sm:max-w-lg rounded-t-2xl sm:rounded-xl shadow-dropdown flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="flex items-start justify-between p-lg border-b border-stone-100 rounded-t-2xl sm:rounded-t-xl bg-stone-50">
          <div className="flex items-center gap-sm">
            <div className="icon-pill bg-stone-100">
              <Pencil className="w-4 h-4 text-stone-600" />
            </div>
            <div>
              <h2
                id="edit-tx-title"
                className="text-lg font-semibold text-stone-900"
              >
                {t("transaction.edit.title")}
              </h2>
              {transaction.comment && (
                <p className="text-xs text-stone-500 truncate max-w-[220px]">
                  {transaction.comment}
                </p>
              )}
            </div>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-xs rounded-md hover:bg-stone-200 transition-colors text-stone-500"
            aria-label={t("transaction.edit.action.cancel")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Locked info bar — currency + entryType are read-only after creation */}
        <div className="flex items-center gap-md px-lg py-xs bg-stone-50 border-b border-stone-100 text-xs text-stone-500">
          <span className="font-medium text-stone-700">{currency}</span>
          <span
            className={cn(
              "font-medium",
              transaction.entryType === "INCOME"
                ? "text-income-600"
                : "text-expense-600",
            )}
          >
            {t(`transaction.entryType.${transaction.entryType.toLowerCase()}`)}
          </span>
          {transaction.installments > 1 && (
            <span>
              {transaction.installment}/{transaction.installments}
            </span>
          )}
        </div>

        {/* Scrollable body */}
        <form
          onSubmit={handleSubmit(submit)}
          noValidate
          className="flex flex-col flex-1 min-h-0"
        >
          <div className="overflow-y-auto flex-1 p-lg space-y-md">
            {/* Server error */}
            {serverError && (
              <div
                className="rounded-lg bg-expense-50 border border-expense-100 px-sm py-xs text-sm text-expense-600"
                role="alert"
                aria-live="assertive"
              >
                {serverError}
              </div>
            )}

            {/* Amount */}
            <div className="space-y-xs">
              <label
                htmlFor="edit-tx-amount"
                className="block text-sm font-medium text-stone-700"
              >
                {t("transaction.edit.field.amount")}
                <span className="text-expense-400 ml-xs" aria-hidden="true">
                  *
                </span>
              </label>
              <div className="relative">
                <span className="absolute left-sm top-1/2 -translate-y-1/2 text-sm text-stone-400 pointer-events-none">
                  {currency}
                </span>
                <input
                  id="edit-tx-amount"
                  type="number"
                  step="any"
                  min="0"
                  autoFocus
                  placeholder="0"
                  className={cn(inputClass(!!errors.totalAmount), "pl-12")}
                  {...register("totalAmount", { valueAsNumber: true })}
                />
              </div>
              {!isNaN(watchedAmount) && watchedAmount > 0 && (
                <p className="text-xs text-stone-400">
                  {formatCurrency(watchedAmount, currency, i18n.language)}
                </p>
              )}
              {errors.totalAmount && (
                <p className="text-xs text-expense-400" role="alert">
                  {t(errors.totalAmount.message ?? "")}
                </p>
              )}
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-sm">
              <div className="space-y-xs">
                <label
                  htmlFor="edit-tx-date"
                  className="block text-sm font-medium text-stone-700"
                >
                  {t("transaction.edit.field.date")}
                  <span className="text-expense-400 ml-xs" aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  id="edit-tx-date"
                  type="date"
                  className={inputClass(!!errors.transactionDate)}
                  {...register("transactionDate")}
                />
                {errors.transactionDate && (
                  <p className="text-xs text-expense-400" role="alert">
                    {t(errors.transactionDate.message ?? "")}
                  </p>
                )}
              </div>

              <div className="space-y-xs">
                <label
                  htmlFor="edit-tx-month"
                  className="block text-sm font-medium text-stone-700"
                >
                  {t("transaction.edit.field.paymentMonth")}
                  <span className="text-expense-400 ml-xs" aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  id="edit-tx-month"
                  type="month"
                  className={inputClass(!!errors.paymentMonth)}
                  {...register("paymentMonth")}
                />
                {errors.paymentMonth && (
                  <p className="text-xs text-expense-400" role="alert">
                    {t(errors.paymentMonth.message ?? "")}
                  </p>
                )}
              </div>
            </div>

            {/* Category + Payment method */}
            <div className="grid grid-cols-2 gap-sm">
              <div className="space-y-xs">
                <label
                  htmlFor="edit-tx-category"
                  className="block text-sm font-medium text-stone-700"
                >
                  {t("transaction.edit.field.category")}
                  <span className="text-expense-400 ml-xs" aria-hidden="true">
                    *
                  </span>
                </label>
                <select
                  id="edit-tx-category"
                  className={cn(inputClass(!!errors.categoryId), "cursor-pointer")}
                  {...register("categoryId")}
                >
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.name}
                    </option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-xs text-expense-400" role="alert">
                    {t(errors.categoryId.message ?? "")}
                  </p>
                )}
              </div>

              <div className="space-y-xs">
                <label
                  htmlFor="edit-tx-method"
                  className="block text-sm font-medium text-stone-700"
                >
                  {t("transaction.edit.field.paymentMethod")}
                  <span className="text-expense-400 ml-xs" aria-hidden="true">
                    *
                  </span>
                </label>
                <select
                  id="edit-tx-method"
                  className={cn(inputClass(!!errors.paymentMethodId), "cursor-pointer")}
                  {...register("paymentMethodId")}
                >
                  {paymentMethods.filter((pm) => pm.isActive).map((pm) => (
                    <option key={pm.id} value={pm.id}>
                      {pm.name}
                    </option>
                  ))}
                </select>
                {errors.paymentMethodId && (
                  <p className="text-xs text-expense-400" role="alert">
                    {t(errors.paymentMethodId.message ?? "")}
                  </p>
                )}
              </div>
            </div>

            {/* Group */}
            <div className="space-y-xs">
              <label
                htmlFor="edit-tx-group"
                className="block text-sm font-medium text-stone-700"
              >
                {t("transaction.edit.field.group")}
                <span className="text-expense-400 ml-xs" aria-hidden="true">
                  *
                </span>
              </label>
              <select
                id="edit-tx-group"
                className={cn(inputClass(!!errors.groupId), "cursor-pointer")}
                {...register("groupId")}
              >
                {groups.map((g) => (
                  <option key={g.id} value={g.id}>
                    {g.name}
                  </option>
                ))}
              </select>
              {errors.groupId && (
                <p className="text-xs text-expense-400" role="alert">
                  {t(errors.groupId.message ?? "")}
                </p>
              )}
            </div>

            {/* Comment */}
            <div className="space-y-xs">
              <label
                htmlFor="edit-tx-comment"
                className="block text-sm font-medium text-stone-700"
              >
                {t("transaction.edit.field.comment")}
              </label>
              <input
                id="edit-tx-comment"
                type="text"
                placeholder={t("transaction.edit.field.commentPlaceholder")}
                className={inputClass(!!errors.comment)}
                {...register("comment")}
              />
              {errors.comment && (
                <p className="text-xs text-expense-400" role="alert">
                  {t(errors.comment.message ?? "")}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-sm px-lg pb-lg pt-sm border-t border-stone-100 shrink-0">
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={handleClose}
            >
              {t("transaction.edit.action.cancel")}
            </Button>
            <Button
              type="submit"
              variant="default"
              size="sm"
              disabled={isSubmitting}
            >
              {t("transaction.edit.action.submit")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
