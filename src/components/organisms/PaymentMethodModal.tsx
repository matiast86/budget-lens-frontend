import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";
import { Button } from "../atoms/Button";
import type { PaymentMethodResponseDto, PaymentType, CreditBrand, Currency } from "../../types";
import type { CreatePaymentMethodData } from "../../services/payment-method-service";

interface PaymentMethodModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePaymentMethodData) => Promise<unknown>;
  initialData?: PaymentMethodResponseDto;
}

const PAYMENT_TYPES: PaymentType[] = ["CASH", "BANK", "WALLET", "CREDIT_CARD", "OTHER"];
const CREDIT_BRANDS: CreditBrand[] = ["VISA", "AMEX", "MASTER", "OTHER"];
const CURRENCIES: Currency[] = ["ARS", "USD"];

const inputClass = (hasError: boolean) =>
  cn(
    "w-full rounded-md border bg-white px-sm py-xs text-sm text-stone-900 placeholder:text-stone-400",
    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
    hasError ? "border-expense-400" : "border-stone-300",
  );

export const PaymentMethodModal = ({
  open,
  onClose,
  onSubmit,
  initialData,
}: PaymentMethodModalProps) => {
  const { t } = useTranslation("ledger");
  const isEdit = !!initialData;

  const [name, setName] = useState("");
  const [type, setType] = useState<PaymentType>("CASH");
  const [brand, setBrand] = useState<CreditBrand | "">("");
  const [currency, setCurrency] = useState<Currency | "">("");
  const [color, setColor] = useState("");
  const [nameError, setNameError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setName(initialData?.name ?? "");
      setType(initialData?.type ?? "CASH");
      setBrand(initialData?.brand ?? "");
      setCurrency(initialData?.currency ?? "");
      setColor(initialData?.color ?? "");
      setNameError("");
      setServerError("");
    }
  }, [open, initialData]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setNameError("");
    setServerError("");

    if (!name.trim()) {
      setNameError(t("paymentMethod.modal.error.nameRequired"));
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        name: name.trim(),
        type,
        brand: (type === "CREDIT_CARD" && brand) ? brand as CreditBrand : undefined,
        currency: currency ? currency as Currency : undefined,
        color: color.trim() || undefined,
      });
      onClose();
    } catch (err) {
      setServerError(err instanceof Error ? err.message : String(err));
    } finally {
      setIsSubmitting(false);
    }
  };

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-md"
      role="dialog"
      aria-modal="true"
    >
      <div
        className="absolute inset-0 bg-stone-900/50 backdrop-blur-sm"
        onClick={onClose}
        aria-hidden="true"
      />

      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-xl shadow-dropdown flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-lg border-b border-stone-100">
          <h2 className="text-lg font-semibold text-stone-900">
            {isEdit
              ? t("paymentMethod.modal.editTitle")
              : t("paymentMethod.modal.createTitle")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-xs rounded-md hover:bg-stone-100 transition-colors text-stone-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <form onSubmit={handleSubmit} noValidate className="p-lg space-y-md">
          {serverError && (
            <div className="rounded-lg bg-expense-50 border border-expense-100 px-sm py-xs text-sm text-expense-600">
              {serverError}
            </div>
          )}

          {/* Name */}
          <div className="space-y-xs">
            <label className="block text-sm font-medium text-stone-700">
              {t("paymentMethod.modal.field.name")}
              <span className="text-expense-400 ml-xs">*</span>
            </label>
            <input
              type="text"
              autoFocus
              placeholder={t("paymentMethod.modal.field.namePlaceholder")}
              className={inputClass(!!nameError)}
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            {nameError && (
              <p className="text-xs text-expense-400">{nameError}</p>
            )}
          </div>

          {/* Type + Brand */}
          <div className="grid grid-cols-2 gap-sm">
            <div className="space-y-xs">
              <label className="block text-sm font-medium text-stone-700">
                {t("paymentMethod.modal.field.type")}
                <span className="text-expense-400 ml-xs">*</span>
              </label>
              <select
                className={cn(inputClass(false), "cursor-pointer")}
                value={type}
                onChange={(e) => {
                  setType(e.target.value as PaymentType);
                  if (e.target.value !== "CREDIT_CARD") setBrand("");
                }}
              >
                {PAYMENT_TYPES.map((pt) => (
                  <option key={pt} value={pt}>
                    {t(`paymentMethod.type.${pt}`)}
                  </option>
                ))}
              </select>
            </div>

            {type === "CREDIT_CARD" && (
              <div className="space-y-xs">
                <label className="block text-sm font-medium text-stone-700">
                  {t("paymentMethod.modal.field.brand")}
                </label>
                <select
                  className={cn(inputClass(false), "cursor-pointer")}
                  value={brand}
                  onChange={(e) => setBrand(e.target.value as CreditBrand)}
                >
                  <option value="">—</option>
                  {CREDIT_BRANDS.map((b) => (
                    <option key={b} value={b}>{b}</option>
                  ))}
                </select>
              </div>
            )}
          </div>

          {/* Currency + Color */}
          <div className="grid grid-cols-2 gap-sm">
            <div className="space-y-xs">
              <label className="block text-sm font-medium text-stone-700">
                {t("paymentMethod.modal.field.currency")}
              </label>
              <select
                className={cn(inputClass(false), "cursor-pointer")}
                value={currency}
                onChange={(e) => setCurrency(e.target.value as Currency | "")}
              >
                <option value="">—</option>
                {CURRENCIES.map((c) => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            <div className="space-y-xs">
              <label className="block text-sm font-medium text-stone-700">
                {t("paymentMethod.modal.field.color")}
              </label>
              <div className="flex items-center gap-xs">
                <input
                  type="color"
                  className="w-10 h-9 rounded-md border border-stone-300 cursor-pointer p-0.5"
                  value={color || "#6366f1"}
                  onChange={(e) => setColor(e.target.value)}
                />
                <input
                  type="text"
                  placeholder="#6366f1"
                  className={cn(inputClass(false), "flex-1 font-mono text-xs")}
                  value={color}
                  onChange={(e) => setColor(e.target.value)}
                  maxLength={7}
                />
              </div>
            </div>
          </div>

          <div className="flex items-center justify-end gap-sm pt-sm border-t border-stone-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              {t("paymentMethod.modal.action.cancel")}
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting}>
              {isEdit
                ? t("paymentMethod.modal.action.save")
                : t("paymentMethod.modal.action.create")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
