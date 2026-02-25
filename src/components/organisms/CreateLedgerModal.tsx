import type React from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";
import { Button } from "../atoms/Button";
import { createLedgerSchema, type CreateLedgerFormData } from "../../schemas/ledger.schema";

interface CreateLedgerModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateLedgerFormData) => void;
}

const CURRENCIES: { value: "ARS" | "USD"; labelKey: string }[] = [
  { value: "ARS", labelKey: "create.currency.ARS" },
  { value: "USD", labelKey: "create.currency.USD" },
];

const inputClass = (hasError: boolean) =>
  cn(
    "w-full rounded-md border bg-white px-sm py-xs text-sm text-stone-900 placeholder:text-stone-400",
    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
    hasError ? "border-expense-400" : "border-stone-300",
  );

export const CreateLedgerModal = ({ open, onClose, onSubmit }: CreateLedgerModalProps) => {
  const { t } = useTranslation("ledger");

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm<CreateLedgerFormData>({
    resolver: zodResolver(createLedgerSchema),
    defaultValues: { currency: "ARS" },
  });

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

  const submit = (data: CreateLedgerFormData) => {
    onSubmit(data);
    handleClose();
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-md"
      role="dialog"
      aria-modal="true"
      aria-labelledby="create-ledger-title"
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
        onClick={handleClose}
        aria-hidden="true"
      />

      {/* Panel — sheet on mobile, centered card on sm+ */}
      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-xl shadow-dropdown">
        {/* Header */}
        <div className="flex items-start justify-between p-lg border-b border-stone-100">
          <div>
            <h2 id="create-ledger-title" className="text-lg font-semibold text-stone-900">
              {t("create.title")}
            </h2>
            <p className="text-sm text-stone-500 mt-xs">{t("create.description")}</p>
          </div>
          <button
            type="button"
            onClick={handleClose}
            className="p-xs rounded-md hover:bg-stone-100 transition-colors text-stone-400 hover:text-stone-600"
            aria-label={t("create.action.cancel")}
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit(submit)} noValidate>
          <div className="p-lg space-y-md">
            {/* Name */}
            <div className="space-y-xs">
              <label htmlFor="ledger-name" className="block text-sm font-medium text-stone-700">
                {t("create.field.name")}
                <span className="text-expense-400 ml-xs" aria-hidden="true">*</span>
              </label>
              <input
                id="ledger-name"
                type="text"
                placeholder={t("create.field.namePlaceholder")}
                autoFocus
                autoComplete="off"
                className={inputClass(!!errors.name)}
                {...register("name")}
              />
              {errors.name && (
                <p className="text-xs text-expense-400" role="alert">
                  {t(errors.name.message ?? "")}
                </p>
              )}
            </div>

            {/* Description */}
            <div className="space-y-xs">
              <label htmlFor="ledger-description" className="block text-sm font-medium text-stone-700">
                {t("create.field.description")}
              </label>
              <textarea
                id="ledger-description"
                placeholder={t("create.field.descriptionPlaceholder")}
                rows={2}
                className={cn(inputClass(!!errors.description), "resize-none")}
                {...register("description")}
              />
              {errors.description && (
                <p className="text-xs text-expense-400" role="alert">
                  {t(errors.description.message ?? "")}
                </p>
              )}
            </div>

            {/* Currency */}
            <fieldset>
              <legend className="block text-sm font-medium text-stone-700 mb-xs">
                {t("create.field.currency")}
                <span className="text-expense-400 ml-xs" aria-hidden="true">*</span>
              </legend>
              <div className="flex gap-sm">
                {CURRENCIES.map(({ value, labelKey }) => (
                  <label
                    key={value}
                    className="flex-1 flex items-center gap-sm p-sm border rounded-lg cursor-pointer transition-colors has-[:checked]:border-primary-500 has-[:checked]:bg-primary-50 border-stone-200 hover:bg-stone-50"
                  >
                    <input
                      type="radio"
                      value={value}
                      className="accent-primary-600"
                      {...register("currency")}
                    />
                    <span className="text-sm font-medium text-stone-700">{t(labelKey)}</span>
                  </label>
                ))}
              </div>
              {errors.currency && (
                <p className="text-xs text-expense-400 mt-xs" role="alert">
                  {t(errors.currency.message ?? "")}
                </p>
              )}
            </fieldset>

            {/* Base CPI Index */}
            <div className="space-y-xs">
              <label htmlFor="ledger-cpi" className="block text-sm font-medium text-stone-700">
                {t("create.field.baseCpiIndex")}
              </label>
              <input
                id="ledger-cpi"
                type="number"
                step="any"
                min="0"
                placeholder={t("create.field.baseCpiIndexPlaceholder")}
                className={inputClass(!!errors.baseCpiIndex)}
                {...register("baseCpiIndex", { valueAsNumber: true })}
              />
              <p className="text-xs text-stone-400">{t("create.field.baseCpiIndexHint")}</p>
              {errors.baseCpiIndex && (
                <p className="text-xs text-expense-400" role="alert">
                  {t(errors.baseCpiIndex.message ?? "")}
                </p>
              )}
            </div>
          </div>

          {/* Footer */}
          <div className="flex items-center justify-end gap-sm px-lg pb-lg pt-sm border-t border-stone-100">
            <Button type="button" variant="outline" size="sm" onClick={handleClose}>
              {t("create.action.cancel")}
            </Button>
            <Button type="submit" variant="default" size="sm" disabled={isSubmitting}>
              {t("create.action.submit")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
