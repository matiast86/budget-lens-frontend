import type React from "react";
import { useEffect, useRef, useState } from "react";
import { useForm, useFieldArray, type FieldErrors } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import { X, TrendingUp, TrendingDown, Plus, Minus, Check } from "lucide-react";
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
  PaymentType,
} from "../../types";

interface CreateTransactionModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateTransactionFormData) => Promise<unknown>;
  defaultEntryType?: EntryType;
  defaultCurrency: Currency;
  categories: CategoryResponseDto[];
  paymentMethods: PaymentMethodResponseDto[];
  groups: GroupResponseDto[];
  onCreateCategory?: (name: string) => Promise<CategoryResponseDto>;
  onCreateGroup?: (name: string) => Promise<GroupResponseDto>;
  onCreatePaymentMethod?: (name: string, type: PaymentType) => Promise<PaymentMethodResponseDto>;
}

// ---------------------------------------------------------------------------
// Inline quick-create row — appears below an empty select
// ---------------------------------------------------------------------------

const PAYMENT_TYPES: { value: PaymentType; key: string }[] = [
  { value: "CASH",        key: "paymentMethod.type.CASH" },
  { value: "BANK",        key: "paymentMethod.type.BANK" },
  { value: "WALLET",      key: "paymentMethod.type.WALLET" },
  { value: "CREDIT_CARD", key: "paymentMethod.type.CREDIT_CARD" },
  { value: "OTHER",       key: "paymentMethod.type.OTHER" },
];

interface QuickCreateProps {
  onConfirm: (name: string, pmType?: PaymentType) => Promise<void>;
  onCancel: () => void;
  showTypeSelect?: boolean;
}

const QuickCreate = ({ onConfirm, onCancel, showTypeSelect }: QuickCreateProps) => {
  const { t } = useTranslation("ledger");
  const inputRef = useRef<HTMLInputElement>(null);
  const [name, setName] = useState("");
  const [pmType, setPmType] = useState<PaymentType>("CASH");
  const [saving, setSaving] = useState(false);

  useEffect(() => { inputRef.current?.focus(); }, []);

  const handleConfirm = async () => {
    if (!name.trim()) return;
    setSaving(true);
    try {
      await onConfirm(name.trim(), showTypeSelect ? pmType : undefined);
    } finally {
      setSaving(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") { e.preventDefault(); void handleConfirm(); }
    if (e.key === "Escape") onCancel();
  };

  return (
    <div className="flex items-center gap-xs mt-xs">
      <input
        ref={inputRef}
        type="text"
        value={name}
        onChange={(e) => setName(e.target.value)}
        onKeyDown={handleKeyDown}
        placeholder={t("transaction.create.quickCreate.namePlaceholder")}
        className={cn(
          "flex-1 rounded-md border border-primary-300 bg-primary-50 px-sm py-xs text-xs text-stone-900",
          "placeholder:text-stone-400 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent",
        )}
      />
      {showTypeSelect && (
        <select
          value={pmType}
          onChange={(e) => setPmType(e.target.value as PaymentType)}
          className="rounded-md border border-primary-300 bg-primary-50 px-xs py-xs text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-primary-500 cursor-pointer"
        >
          {PAYMENT_TYPES.map((pt) => (
            <option key={pt.value} value={pt.value}>{t(pt.key)}</option>
          ))}
        </select>
      )}
      <button
        type="button"
        onClick={() => void handleConfirm()}
        disabled={!name.trim() || saving}
        className="p-xs rounded text-white bg-primary-600 hover:bg-primary-700 disabled:opacity-40 transition-colors"
      >
        <Check className="w-3 h-3" />
      </button>
      <button
        type="button"
        onClick={onCancel}
        className="p-xs rounded text-stone-400 hover:bg-stone-100 transition-colors"
      >
        <X className="w-3 h-3" />
      </button>
    </div>
  );
};

const CURRENCY_OPTIONS: { value: string; key: string }[] = [
  { value: "ARS", key: "create.currency.ARS" },
  { value: "USD", key: "create.currency.USD" },
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
  onCreateCategory,
  onCreateGroup,
  onCreatePaymentMethod,
}: CreateTransactionModalProps) => {
  const { t, i18n } = useTranslation("ledger");

  const [serverError, setServerError] = useState<string | null>(null);
  const [inlineCreate, setInlineCreate] = useState<"category" | "group" | "paymentMethod" | null>(null);
  // Progressive disclosure: Level 1 (amount + category) is always visible;
  // everything else lives behind this toggle.
  const [showDetail, setShowDetail] = useState(false);

  const {
    register,
    handleSubmit,
    watch,
    reset,
    setValue,
    control,
    formState: { errors, isSubmitting },
  } = useForm<CreateTransactionFormData>({
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    resolver: zodResolver(createTransactionSchema) as any,
  });

  const { fields: debtFields, append: appendDebt, remove: removeDebt } = useFieldArray({
    control,
    name: "debtAssignments",
  });

  // Reset to fresh defaults (and clear server error) whenever the modal opens
  useEffect(() => {
    if (open) {
      setServerError(null);
      setShowDetail(false);
      reset({
        entryType: defaultEntryType,
        transactionType: "VARIABLE",

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
    setInlineCreate(null);
    setShowDetail(false);
    onClose();
  };

  // If a submit fails validation on a field that lives inside the collapsed
  // detail section, open it so the user can see what needs fixing.
  const LEVEL_1_FIELDS = ["entryType", "totalAmount", "categoryId"];
  const revealDetailOnError = (formErrors: FieldErrors<CreateTransactionFormData>) => {
    if (Object.keys(formErrors).some((k) => !LEVEL_1_FIELDS.includes(k))) {
      setShowDetail(true);
    }
  };

  const submit = async (data: CreateTransactionFormData) => {
    setServerError(null);
    try {
      await onSubmit(data);
      handleClose();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : String(err));
    }
  };

  const watchedEntryType = watch("entryType");
  const watchedType      = watch("transactionType") ?? "VARIABLE";
  const watchedAmount    = watch("totalAmount");
  const watchedInstall   = watch("installments") ?? 1;
  const watchedCurrency  = watch("currency") ?? defaultCurrency;
  const watchedPayMonth  = watch("paymentMonth");
  const watchedBundleTo  = watch("bundleTo");

  const isIncome = watchedEntryType === "INCOME";
  const isFixed = watchedType === "FIXED";
  const showMonthlyPreview =
    !isFixed &&
    !isNaN(watchedAmount) &&
    watchedAmount > 0 &&
    watchedInstall > 1;

  // Number of transactions a FIXED bundle will create: one per month from
  // paymentMonth through bundleTo, both inclusive. Mirrors the backend's
  // monthRange() helper.
  const monthsBetween = (from?: string, to?: string): number => {
    if (!from || !to) return 0;
    const [fy, fm] = from.split("-").map(Number);
    const [ty, tm] = to.split("-").map(Number);
    if ([fy, fm, ty, tm].some(Number.isNaN)) return 0;
    return (ty - fy) * 12 + (tm - fm) + 1;
  };
  const bundleCount = isFixed ? monthsBetween(watchedPayMonth, watchedBundleTo) : 0;

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
        <form onSubmit={handleSubmit(submit, revealDetailOnError)} noValidate className="flex flex-col flex-1 min-h-0">
          <div className="overflow-y-auto flex-1 p-lg space-y-md">

            {/* Server error banner */}
            {serverError && (
              <div
                className="rounded-lg bg-expense-50 border border-expense-100 px-sm py-xs text-sm text-expense-600"
                role="alert"
                aria-live="assertive"
              >
                {serverError}
              </div>
            )}

            {/* Entry type — Level 1 */}
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

            {/* Amount — Level 1 */}
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

            {/* Category — Level 1 */}
            <div className="space-y-xs">
              <label htmlFor="tx-category" className="block text-sm font-medium text-stone-700">
                {t("transaction.create.field.category")}
                <span className="text-expense-400 ml-xs" aria-hidden="true">*</span>
              </label>
              <select
                id="tx-category"
                className={cn(inputClass(!!errors.categoryId), "cursor-pointer")}
                defaultValue=""
                disabled={categories.length === 0}
                {...register("categoryId")}
              >
                <option value="" disabled>
                  {categories.length === 0
                    ? t("transaction.create.quickCreate.emptyCategory")
                    : t("transaction.create.field.selectCategory")}
                </option>
                {categories.map((c) => (
                  <option key={c.id} value={c.id}>{c.name}</option>
                ))}
              </select>
              {errors.categoryId && (
                <p className="text-xs text-expense-400" role="alert">
                  {t(errors.categoryId.message ?? "")}
                </p>
              )}
              {onCreateCategory && (
                inlineCreate === "category" ? (
                  <QuickCreate
                    onConfirm={async (name) => {
                      const created = await onCreateCategory(name);
                      setValue("categoryId", created.id, { shouldValidate: true });
                      setInlineCreate(null);
                    }}
                    onCancel={() => setInlineCreate(null)}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setInlineCreate("category")}
                    className="flex items-center gap-xs text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors mt-xs"
                  >
                    <Plus className="w-3 h-3" />
                    {t("transaction.create.quickCreate.trigger")}
                  </button>
                )
              )}
            </div>

            {/* Progressive disclosure toggle */}
            <button
              type="button"
              onClick={() => setShowDetail((v) => !v)}
              aria-expanded={showDetail}
              className="flex w-full items-center justify-between rounded-lg border border-stone-200 px-sm py-xs text-sm font-medium text-primary-600 hover:bg-primary-50 transition-colors"
            >
              <span className="flex items-center gap-xs">
                {showDetail ? <Minus className="w-4 h-4" /> : <Plus className="w-4 h-4" />}
                {t(showDetail ? "transaction.moreFields.hide" : "transaction.moreFields.show")}
              </span>
              <span className="text-xs font-normal text-stone-400">
                {t("transaction.moreFields.optional")}
              </span>
            </button>

            {/* Level 2 — optional detail, kept mounted so RHF state persists */}
            <div className={cn("space-y-md", !showDetail && "hidden")}>

            {/* Transaction type — one-off vs recurring bundle */}
            <div className="grid grid-cols-2 gap-sm">
              {(["VARIABLE", "FIXED"] as const).map((type) => {
                const isType = watchedType === type;
                return (
                  <label
                    key={type}
                    className={cn(
                      "flex items-center gap-sm p-sm border rounded-lg cursor-pointer transition-colors",
                      "has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50 border-stone-200",
                    )}
                  >
                    <input type="radio" value={type} className="sr-only" {...register("transactionType")} />
                    <span className={cn("text-sm font-medium", isType ? "text-primary-700" : "text-stone-500")}>
                      {t(`transaction.create.type.${type}`)}
                    </span>
                  </label>
                );
              })}
            </div>

            {/* Currency + Installments */}
            <div className={cn("grid gap-sm", isFixed ? "grid-cols-1" : "grid-cols-2")}>
              <div className="space-y-xs">
                <label htmlFor="tx-currency" className="block text-sm font-medium text-stone-700">
                  {t("transaction.create.field.currency")}
                  <span className="text-expense-400 ml-xs" aria-hidden="true">*</span>
                </label>
                <select
                  id="tx-currency"
                  className={cn(inputClass(!!errors.currency), "cursor-pointer")}
                  {...register("currency")}
                >
                  {CURRENCY_OPTIONS.map((opt) => (
                    <option key={opt.value} value={opt.value}>{t(opt.key)}</option>
                  ))}
                </select>
              </div>

              {!isFixed && (
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
              )}
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

            {/* Recurrence — FIXED bundle settings */}
            {isFixed && (
              <div className="rounded-lg border border-primary-100 bg-primary-50/50 p-sm space-y-sm">
                <p className="text-sm font-medium text-stone-700">
                  {t("transaction.create.field.recurrence")}
                </p>

                <div className="grid grid-cols-3 gap-sm">
                  <div className="space-y-xs">
                    <label htmlFor="tx-bundle-to" className="block text-xs font-medium text-stone-600">
                      {t("transaction.create.field.bundleTo")}
                      <span className="text-expense-400 ml-xs" aria-hidden="true">*</span>
                    </label>
                    <input
                      id="tx-bundle-to"
                      type="month"
                      min={watchedPayMonth}
                      className={inputClass(!!errors.bundleTo)}
                      {...register("bundleTo")}
                    />
                  </div>

                  <div className="space-y-xs">
                    <label htmlFor="tx-increase-rate" className="block text-xs font-medium text-stone-600">
                      {t("transaction.create.field.increaseRate")}
                    </label>
                    <input
                      id="tx-increase-rate"
                      type="number"
                      step="any"
                      min="0"
                      placeholder="0"
                      className={inputClass(!!errors.increaseRate)}
                      {...register("increaseRate", { valueAsNumber: true })}
                    />
                  </div>

                  <div className="space-y-xs">
                    <label htmlFor="tx-increase-every" className="block text-xs font-medium text-stone-600">
                      {t("transaction.create.field.increaseEveryMonths")}
                    </label>
                    <input
                      id="tx-increase-every"
                      type="number"
                      step="1"
                      min="1"
                      placeholder="1"
                      className={inputClass(!!errors.increaseEveryMonths)}
                      {...register("increaseEveryMonths", { valueAsNumber: true })}
                    />
                  </div>
                </div>

                {(errors.bundleTo || errors.increaseRate || errors.increaseEveryMonths) && (
                  <p className="text-xs text-expense-400" role="alert">
                    {t(
                      errors.bundleTo?.message ??
                        errors.increaseRate?.message ??
                        errors.increaseEveryMonths?.message ??
                        "",
                    )}
                  </p>
                )}

                {bundleCount > 0 && (
                  <p className="text-xs text-stone-500">
                    {t("transaction.create.field.bundlePreview", { count: bundleCount })}
                  </p>
                )}
              </div>
            )}

            {/* Payment method */}
            <div className="space-y-xs">
              <label htmlFor="tx-method" className="block text-sm font-medium text-stone-700">
                {t("transaction.create.field.paymentMethod")}
                <span className="text-expense-400 ml-xs" aria-hidden="true">*</span>
              </label>
              <select
                id="tx-method"
                className={cn(inputClass(!!errors.paymentMethodId), "cursor-pointer")}
                defaultValue=""
                disabled={paymentMethods.filter((pm) => pm.isActive).length === 0}
                {...register("paymentMethodId")}
              >
                <option value="" disabled>
                  {paymentMethods.filter((pm) => pm.isActive).length === 0
                    ? t("transaction.create.quickCreate.emptyPaymentMethod")
                    : t("transaction.create.field.selectMethod")}
                </option>
                {paymentMethods.filter((pm) => pm.isActive).map((pm) => (
                  <option key={pm.id} value={pm.id}>{pm.name}</option>
                ))}
              </select>
              {errors.paymentMethodId && (
                <p className="text-xs text-expense-400" role="alert">
                  {t(errors.paymentMethodId.message ?? "")}
                </p>
              )}
              {onCreatePaymentMethod && (
                inlineCreate === "paymentMethod" ? (
                  <QuickCreate
                    showTypeSelect
                    onConfirm={async (name, pmType) => {
                      const created = await onCreatePaymentMethod(name, pmType ?? "CASH");
                      setValue("paymentMethodId", created.id, { shouldValidate: true });
                      setInlineCreate(null);
                    }}
                    onCancel={() => setInlineCreate(null)}
                  />
                ) : (
                  <button
                    type="button"
                    onClick={() => setInlineCreate("paymentMethod")}
                    className="flex items-center gap-xs text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors mt-xs"
                  >
                    <Plus className="w-3 h-3" />
                    {t("transaction.create.quickCreate.trigger")}
                  </button>
                )
              )}
            </div>

            {/* Group */}
            <div>
              <div className="space-y-xs">
                <label htmlFor="tx-group" className="block text-sm font-medium text-stone-700">
                  {t("transaction.create.field.group")}
                  <span className="text-expense-400 ml-xs" aria-hidden="true">*</span>
                </label>
                <select
                  id="tx-group"
                  className={cn(inputClass(!!errors.groupId), "cursor-pointer")}
                  defaultValue=""
                  disabled={groups.length === 0}
                  {...register("groupId")}
                >
                  <option value="" disabled>
                    {groups.length === 0
                      ? t("transaction.create.quickCreate.emptyGroup")
                      : t("transaction.create.field.selectGroup")}
                  </option>
                  {groups.map((g) => (
                    <option key={g.id} value={g.id}>{g.name}</option>
                  ))}
                </select>
                {errors.groupId && (
                  <p className="text-xs text-expense-400" role="alert">
                    {t(errors.groupId.message ?? "")}
                  </p>
                )}
                {onCreateGroup && (
                  inlineCreate === "group" ? (
                    <QuickCreate
                      onConfirm={async (name) => {
                        const created = await onCreateGroup(name);
                        setValue("groupId", created.id, { shouldValidate: true });
                        setInlineCreate(null);
                      }}
                      onCancel={() => setInlineCreate(null)}
                    />
                  ) : (
                    <button
                      type="button"
                      onClick={() => setInlineCreate("group")}
                      className="flex items-center gap-xs text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors mt-xs"
                    >
                      <Plus className="w-3 h-3" />
                      {t("transaction.create.quickCreate.trigger")}
                    </button>
                  )
                )}
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

            {/* Debt assignments */}
            <div className="space-y-sm">
              <div className="flex items-center justify-between">
                <p className="text-sm font-medium text-stone-700">
                  {t("transaction.create.field.debtOwners")}
                </p>
                <button
                  type="button"
                  onClick={() => appendDebt({ ownerName: "", amount: 0, direction: "OWED_TO_ME" })}
                  className="flex items-center gap-xs text-xs font-medium text-primary-600 hover:text-primary-700 transition-colors"
                >
                  <Plus className="w-3.5 h-3.5" />
                  {t("transaction.create.field.addDebtOwner")}
                </button>
              </div>

              {debtFields.map((field, index) => (
                <div
                  key={field.id}
                  className="rounded-lg border border-stone-200 bg-stone-50 p-sm space-y-xs"
                >
                  {/* Owner name + remove */}
                  <div className="flex items-center gap-xs">
                    <input
                      type="text"
                      placeholder={t("transaction.create.field.ownerNamePlaceholder")}
                      className={cn(
                        inputClass(!!errors.debtAssignments?.[index]?.ownerName),
                        "flex-1",
                      )}
                      {...register(`debtAssignments.${index}.ownerName`)}
                    />
                    <button
                      type="button"
                      onClick={() => removeDebt(index)}
                      className="p-xs rounded-md text-stone-400 hover:text-expense-500 hover:bg-expense-50 transition-colors"
                      aria-label={t("transaction.create.field.removeDebtOwner")}
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                  {errors.debtAssignments?.[index]?.ownerName && (
                    <p className="text-xs text-expense-400" role="alert">
                      {t(errors.debtAssignments[index].ownerName?.message ?? "")}
                    </p>
                  )}

                  {/* Amount + direction */}
                  <div className="flex items-center gap-xs">
                    <input
                      type="number"
                      step="any"
                      min="0"
                      placeholder="0"
                      className={cn(
                        inputClass(!!errors.debtAssignments?.[index]?.amount),
                        "w-28",
                      )}
                      {...register(`debtAssignments.${index}.amount`, { valueAsNumber: true })}
                    />
                    <select
                      className={cn(inputClass(false), "flex-1 cursor-pointer")}
                      {...register(`debtAssignments.${index}.direction`)}
                    >
                      <option value="OWED_TO_ME">
                        {t("transaction.create.field.direction.OWED_TO_ME")}
                      </option>
                      <option value="OWED_BY_ME">
                        {t("transaction.create.field.direction.OWED_BY_ME")}
                      </option>
                    </select>
                  </div>
                  {errors.debtAssignments?.[index]?.amount && (
                    <p className="text-xs text-expense-400" role="alert">
                      {t(errors.debtAssignments[index].amount?.message ?? "")}
                    </p>
                  )}
                </div>
              ))}
            </div>

            </div>
            {/* end Level 2 */}
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
