import { useEffect, useMemo, useState } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";
import { Button } from "../atoms/Button";
import type { PaymentMethodResponseDto, Currency } from "../../types";
import type { CreateBalanceData } from "../../services/transaction-service";

interface CreateBalanceModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: CreateBalanceData) => Promise<unknown>;
  paymentMethods: PaymentMethodResponseDto[];
  currency: Currency;
}

// Only money-holding buckets track a balance — a credit card isn't a place
// you keep money, and "other" is too ambiguous to offer here.
const BALANCE_PAYMENT_TYPES = new Set(["CASH", "BANK", "WALLET"]);

const MAX_MONTHS = 24;

const currentMonth = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const addMonths = (month: string, count: number): string => {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 1 + count, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

// Inclusive month count from `from` through `to` — mirrors the backend's
// createBalance span check (createBundle's monthRange is also inclusive).
const monthsBetween = (from: string, to: string): number => {
  const [fy, fm] = from.split("-").map(Number);
  const [ty, tm] = to.split("-").map(Number);
  if ([fy, fm, ty, tm].some(Number.isNaN)) return 0;
  return (ty - fy) * 12 + (tm - fm) + 1;
};

const inputClass = (hasError: boolean) =>
  cn(
    "w-full rounded-md border bg-white px-sm py-xs text-sm text-stone-900 placeholder:text-stone-400",
    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
    hasError ? "border-expense-400" : "border-stone-300",
  );

export const CreateBalanceModal = ({
  open,
  onClose,
  onSubmit,
  paymentMethods,
  currency,
}: CreateBalanceModalProps) => {
  const { t } = useTranslation("ledger");

  const buckets = useMemo(
    () => paymentMethods.filter((pm) => BALANCE_PAYMENT_TYPES.has(pm.type)),
    [paymentMethods],
  );

  const [paymentMethodId, setPaymentMethodId] = useState<number | "">("");
  const [paymentMonthValue, setPaymentMonthValue] = useState(currentMonth());
  const [bundleTo, setBundleTo] = useState(addMonths(currentMonth(), 5));
  const [fieldError, setFieldError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setPaymentMethodId(buckets[0]?.id ?? "");
      setPaymentMonthValue(currentMonth());
      setBundleTo(addMonths(currentMonth(), 5));
      setFieldError("");
      setServerError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const monthCount = monthsBetween(paymentMonthValue, bundleTo);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError("");
    setServerError("");

    if (!paymentMethodId) {
      setFieldError(t("balance.modal.error.paymentMethodRequired"));
      return;
    }
    if (monthCount < 1) {
      setFieldError(t("balance.modal.error.rangeInvalid"));
      return;
    }
    if (monthCount > MAX_MONTHS) {
      setFieldError(t("balance.modal.error.rangeTooLong", { max: MAX_MONTHS }));
      return;
    }

    setIsSubmitting(true);
    try {
      await onSubmit({
        paymentMethodId,
        paymentMonthValue,
        bundleTo,
        currency,
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
            {t("balance.modal.title")}
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
          <p className="text-sm text-stone-500">{t("balance.modal.hint")}</p>

          {serverError && (
            <div className="rounded-lg bg-expense-50 border border-expense-100 px-sm py-xs text-sm text-expense-600">
              {serverError}
            </div>
          )}

          {buckets.length === 0 ? (
            <p className="text-sm text-stone-500">
              {t("balance.modal.noPaymentMethods")}
            </p>
          ) : (
            <>
              <div className="space-y-xs">
                <label className="block text-sm font-medium text-stone-700">
                  {t("balance.modal.field.paymentMethod")}
                  <span className="text-expense-400 ml-xs">*</span>
                </label>
                <select
                  autoFocus
                  className={cn(inputClass(false), "cursor-pointer")}
                  value={paymentMethodId}
                  onChange={(e) => setPaymentMethodId(Number(e.target.value))}
                >
                  {buckets.map((pm) => (
                    <option key={pm.id} value={pm.id}>
                      {pm.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-sm">
                <div className="space-y-xs">
                  <label className="block text-sm font-medium text-stone-700">
                    {t("balance.modal.field.startMonth")}
                  </label>
                  <input
                    type="month"
                    className={inputClass(false)}
                    value={paymentMonthValue}
                    onChange={(e) => setPaymentMonthValue(e.target.value)}
                  />
                </div>
                <div className="space-y-xs">
                  <label className="block text-sm font-medium text-stone-700">
                    {t("balance.modal.field.endMonth")}
                  </label>
                  <input
                    type="month"
                    className={inputClass(false)}
                    value={bundleTo}
                    onChange={(e) => setBundleTo(e.target.value)}
                  />
                </div>
              </div>

              {fieldError ? (
                <p className="text-xs text-expense-400">{fieldError}</p>
              ) : (
                monthCount > 0 && (
                  <p className="text-xs text-stone-500">
                    {t("balance.modal.preview", { count: monthCount })}
                  </p>
                )
              )}
            </>
          )}

          <div className="flex items-center justify-end gap-sm pt-sm border-t border-stone-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              {t("balance.modal.action.cancel")}
            </Button>
            <Button
              type="submit"
              size="sm"
              disabled={isSubmitting || buckets.length === 0}
            >
              {t("balance.modal.action.create")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
