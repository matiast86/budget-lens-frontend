import type React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { X, TrendingUp, TrendingDown } from "lucide-react";
import { cn } from "../../utils/cn";
import { Button } from "../atoms/Button";
import { formatCurrency } from "../../utils/format-currency";
import {
  createTransactionSchema,
  type CreateTransactionFormData,
} from "../../schemas/transaction.schema";
import type {
  CategoryResponseDto,
  PaymentMethodResponseDto,
  GroupResponseDto,
  Currency,
  EntryType,
} from "../../types";

interface CreateTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTransactionFormData) => void;
  defaultEntryType?: EntryType;
  defaultCurrency: Currency;
  categories: CategoryResponseDto[];
  paymentMethods: PaymentMethodResponseDto[];
  groups: GroupResponseDto[];
}

const STATUS_OPTIONS: { value: string; key: string }[] = [
  { value: "CURRENT", key: "transaction.status.current" },
  { value: "FUTURE",  key: "transaction.status.future" },
  { value: "CLOSED",  key: "transaction.status.closed" },
];

const inputClass = (hasError: boolean) =>
  cn(
    "w-full rounded-md border bg-white px-sm py-xs text-sm text-stone-900 placeholder:text-stone-400",
    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
    hasError ? "border-expense-400" : "border-stone-300",
  );

export const CreateTransactionModal = ({
  open,
  onClose,
  onSubmit,
  defaultEntryType = "EXPENSE",
  defaultCurrency,
  categories,
  paymentMethods,
  groups,
}: CreateTransactionModalProps) => {
  const { t, i18n } = useTranslation("ledger");

  const {
    register,
    handleSubmit,
    watch,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<CreateTransactionFormData>({
    resolver: zodResolver(createTransactionSchema),
  });

  // Reset to fresh defaults whenever the modal opens
  useEffect(() => {
    if (open) {
      reset({
        entryType: defaultEntryType,
        status: "CURRENT",
        currency: defaultCurrency,
        installments: 1,
        isPaid: false,
        impactsCashflow: true,
        transactionDate: format(new Date(), "yyyy-MM-dd"),
        paymentMonth: format(new Date(), "yyyy-MM"),
      });
    }
  }, [open, defaultEntryType, defaultCurrency, reset]);

  // Close on Escape
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

  const submit = (data: CreateTransactionFormData) => {
    onSubmit(data);
    handleClose();
  };

  const watchedEntryType = watch("entryType");
  const watchedAmount    = watch("totalAmount");
  const watchedInstall   = watch("installments") ?? 1;
  const watchedCurrency  = watch("currency") ?? defaultCurrency;

  const isIncome = watchedEntryType === "INCOME";
  const showMonthlyPreview =
    !isNaN(watchedAmount) &&
    watchedAmount > 0 &&
    watchedInstall > 1;

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-tx-title"
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
        <div className={cn(
          "flex items-start justify-between p-lg border-b border-stone-100 rounded-t-2xl sm:rounded-t-xl",
          isIncome ? "bg-income-50" : "bg-expense-50",
        )}>
          <div>
            <h2
              id="create-tx-title"
              className={cn("text-lg font-semibold", isIncome ? "text-income-600" : "text-expense-600")}
            >
              {t(isIncome ? "transaction.create.title.income" : "transaction.create.title.expense")}
            </h2>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-xs rounded-md hover:bg-white/60 transition-colors text-stone-500"
            aria-label={t("create.action.cancel")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Scrollable body */}
        <form onSubmit={handleSubmit(submit)} noValidate className="flex flex-col flex-1 min-h-0">
          <div className="overflow-y-auto flex-1 p-lg space-y-md">

            {/* Entry type */}
            <div className="grid grid-cols-2 gap-sm">
              {(["INCOME", "EXPENSE"] as const).map((type) => {
                const isType = watchedEntryType === type;
                const Icon = type === "INCOME" ? TrendingUp : TrendingDown;
                return (
                  <label
                    key={type}
                    className={cn(
                      "flex items-center gap-sm p-sm border rounded-lg cursor-pointer transition-colors",
                      type === "INCOME"
                        ? "has-[:checked]:border-income-500 has-[:checked]:bg-income-50 border-stone-200"
                        : "has-[:checked]:border-expense-400 has-[:checked]:bg-expense-50 border-stone-200",
                    )}
                  >
                    <input type="radio" value={type} className="sr-only" {...register("entryType")} />
                    <Icon className={cn("w-4 h-4", isType
                      ? type === "INCOME" ? "text-income-600" : "text-expense-600"
                      : "text-stone-400"
                    )} />
                    <span className={cn("text-sm font-medium", isType
                      ? type === "INCOME" ? "text-income-600" : "text-expense-600"
                      : "text-stone-500"
                    )}>
                      {t(`transaction.entryType.${type.toLowerCase()}`)}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Amount + installments */}
            <div className="grid grid-cols-2 gap-sm">
              <div className="space-y-xs">
                <label htmlFor="tx-amount" className="block text-sm font-medium text-stone-700">
                  {t("transaction.create.field.amount")}
                  <span className="text-expense-400 ml-xs" aria-hidden="true">*</span>
                </label>
                <input
                  id="tx-amount"
                  type="number"
                  step="any"
                  min="0"
                  autoFocus
                  placeholder="0"
                  className={inputClass(!!errors.totalAmount)}
                  {...register("totalAmount", { valueAsNumber: true })}
                />
                {errors.totalAmount && (
                  <p className="text-xs text-expense-400" role="alert">
                    {t(errors.totalAmount.message ?? "")}
                  </p>
                )}
              </div>

              <div className="space-y-xs">
                <label htmlFor="tx-installments" className="block text-sm font-medium text-stone-700">
                  {t("transaction.create.field.installments")}
                </label>
                <input
                  id="tx-installments"
                  type="number"
                  min="1"
                  step="1"
                  className={inputClass(!!errors.installments)}
                  {...register("installments", { valueAsNumber: true })}
                />
                {showMonthlyPreview && (
                  <p className="text-xs text-stone-400">
                    {t("transaction.create.field.monthlyPreview", {
                      amount: formatCurrency(watchedAmount / watchedInstall, watchedCurrency as Currency, i18n.language),
                    })}
                  </p>
                )}
                {errors.installments && (
                  <p className="text-xs text-expense-400" role="alert">
                    {t(errors.installments.message ?? "")}
                  </p>
                )}
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-sm">
              <div className="space-y-xs">
                <label htmlFor="tx-date" className="block text-sm font-medium text-stone-700">
                  {t("transaction.create.field.date")}
                  <span className="text-expense-400 ml-xs" aria-hidden="true">*</span>
                </label>
                <input
                  id="tx-date"
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
                <label htmlFor="tx-month" className="block text-sm font-medium text-stone-700">
                  {t("transaction.create.field.paymentMonth")}
                  <span className="text-expense-400 ml-xs" aria-hidden="true">*</span>
                </label>
                <input
                  id="tx-month"
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
                <label htmlFor="tx-category" className="block text-sm font-medium text-stone-700">
                  {t("transaction.create.field.category")}
                  <span className="text-expense-400 ml-xs" aria-hidden="true">*</span>
                </label>
                <select
                  id="tx-category"
                  className={cn(inputClass(!!errors.categoryId), "cursor-pointer")}
                  defaultValue=""
                  {...register("categoryId")}
                >
                  <option value="" disabled>{t("transaction.create.field.selectCategory")}</option>
                  {categories.map((c) => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
                {errors.categoryId && (
                  <p className="text-xs text-expense-400" role="alert">
                    {t(errors.categoryId.message ?? "")}
                  </p>
                )}
              </div>

              <div className="space-y-xs">
                <label htmlFor="tx-method" className="block text-sm font-medium text-stone-700">
                  {t("transaction.create.field.paymentMethod")}
                  <span className="text-expense-400 ml-xs" aria-hidden="true">*</span>
                </label>
                <select
                  id="tx-method"
                  className={cn(inputClass(!!errors.paymentMethodId), "cursor-pointer")}
                  defaultValue=""
                  {...register("paymentMethodId")}
                >
                  <option value="" disabled>{t("transaction.create.field.selectMethod")}</option>
                  {paymentMethods.filter((pm) => pm.isActive).map((pm) => (
                    <option key={pm.id} value={pm.id}>{pm.name}</option>
                  ))}
                </select>
                {errors.paymentMethodId && (
                  <p className="text-xs text-expense-400" role="alert">
                    {t(errors.paymentMethodId.message ?? "")}
                  </p>
                )}
              </div>
            </div>

            {/* Group + Currency */}
            <div className="grid grid-cols-2 gap-sm">
              <div className="space-y-xs">
                <label htmlFor="tx-group" className="block text-sm font-medium text-stone-700">
                  {t("transaction.create.field.group")}
                </label>
                <select
                  id="tx-group"
                  className={cn(inputClass(false), "cursor-pointer")}
                  defaultValue=""
                  {...register("groupId")}
                >
                  <option value="">{t("transaction.create.noGroup")}</option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
              </div>

              <div className="space-y-xs">
                <label htmlFor="tx-status" className="block text-sm font-medium text-stone-700">
                  {t("transaction.create.field.status")}
                </label>
                <select
                  id="tx-status"
                  className={cn(inputClass(false), "cursor-pointer")}
                  {...register("status")}
                >
                  {STATUS_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{t(opt.key)}</option>
                  ))}
                </select>
              </div>
            </div>

            {/* Comment */}
            <div className="space-y-xs">
              <label htmlFor="tx-comment" className="block text-sm font-medium text-stone-700">
                {t("transaction.create.field.comment")}
              </label>
              <input
                id="tx-comment"
                type="text"
                placeholder={t("transaction.create.field.commentPlaceholder")}
                className={inputClass(!!errors.comment)}
                {...register("comment")}
              />
              {errors.comment && (
                <p className="text-xs text-expense-400" role="alert">
                  {t(errors.comment.message ?? "")}
                </p>
              )}
            </div>

            {/* Toggles */}
            <div className="flex gap-lg">
              <label className="flex items-center gap-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-primary-600 cursor-pointer"
                  {...register("isPaid")}
                />
                <span className="text-sm text-stone-700">{t("transaction.create.field.isPaid")}</span>
              </label>
              <label className="flex items-center gap-sm cursor-pointer select-none">
                <input
                  type="checkbox"
                  className="w-4 h-4 accent-primary-600 cursor-pointer"
                  {...register("impactsCashflow")}
                />
                <span className="text-sm text-stone-700">{t("transaction.create.field.impactsCashflow")}</span>
              </label>
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-sm px-lg pb-lg pt-sm border-t border-stone-100 shrink-0">
            <Button type="button" variant="outline" size="sm" onClick={handleClose}>
              {t("create.action.cancel")}
            </Button>
            <Button
              type="submit"
              variant={isIncome ? "income" : "expense"}
              size="sm"
              disabled={isSubmitting}
            >
              {t("transaction.create.action.submit")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
