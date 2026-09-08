import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";
import { Button } from "../atoms/Button";
import type {
  CategoryResponseDto,
  GroupResponseDto,
  PaymentMethodResponseDto,
  Currency,
} from "../../types";
import type { ProjectFixedExpensesData } from "../../services/transaction-service";

interface ProjectExpensesModalProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: ProjectFixedExpensesData) => Promise<unknown>;
  categories: CategoryResponseDto[];
  groups: GroupResponseDto[];
  paymentMethods: PaymentMethodResponseDto[];
  currency: Currency;
}

// Whole-percent cap mirrors the backend's @Max(5) on the rate fractions.
const MAX_RATE_PCT = 500;

const currentMonth = (): string => {
  const d = new Date();
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const addMonths = (month: string, count: number): string => {
  const [y, m] = month.split("-").map(Number);
  const d = new Date(y, m - 1 + count, 1);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
};

const inputClass = (hasError: boolean) =>
  cn(
    "w-full rounded-md border bg-white px-sm py-xs text-sm text-stone-900 placeholder:text-stone-400",
    "focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-colors",
    hasError ? "border-expense-400" : "border-stone-300",
  );

const toPct = (raw: string): number | undefined => {
  const n = Number(raw);
  return raw.trim() === "" || Number.isNaN(n) ? undefined : n;
};

export const ProjectExpensesModal = ({
  open,
  onClose,
  onSubmit,
  categories,
  groups,
  paymentMethods,
  currency,
}: ProjectExpensesModalProps) => {
  const { t } = useTranslation("ledger");

  const [categoryId, setCategoryId] = useState<number | "">("");
  const [groupId, setGroupId] = useState<number | "">("");
  const [bundleTo, setBundleTo] = useState(addMonths(currentMonth(), 6));
  const [showAdvanced, setShowAdvanced] = useState(false);
  const [increaseRatePct, setIncreaseRatePct] = useState("0");
  const [increaseEveryMonths, setIncreaseEveryMonths] = useState("1");
  const [seedIncreaseRatePct, setSeedIncreaseRatePct] = useState("0");
  const [comment, setComment] = useState("");
  const [fieldError, setFieldError] = useState("");
  const [serverError, setServerError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      setCategoryId(categories[0]?.id ?? "");
      setGroupId(groups[0]?.id ?? "");
      setBundleTo(addMonths(currentMonth(), 6));
      setShowAdvanced(false);
      setIncreaseRatePct("0");
      setIncreaseEveryMonths("1");
      setSeedIncreaseRatePct("0");
      setComment("");
      setFieldError("");
      setServerError("");
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  useEffect(() => {
    if (!open) return;
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onClose]);

  const canSubmit = categories.length > 0 && paymentMethods.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFieldError("");
    setServerError("");

    if (!categoryId || !groupId) {
      setFieldError(t("projection.modal.error.categoryGroupRequired"));
      return;
    }
    if (!bundleTo) {
      setFieldError(t("projection.modal.error.horizonRequired"));
      return;
    }

    const increasePct = toPct(increaseRatePct);
    const seedPct = toPct(seedIncreaseRatePct);
    const every = toPct(increaseEveryMonths);

    if (
      (increasePct !== undefined && (increasePct < 0 || increasePct > MAX_RATE_PCT)) ||
      (seedPct !== undefined && (seedPct < 0 || seedPct > MAX_RATE_PCT))
    ) {
      setFieldError(t("projection.modal.error.rateRange", { max: MAX_RATE_PCT }));
      return;
    }
    if (every !== undefined && every < 1) {
      setFieldError(t("projection.modal.error.everyMonthsRange"));
      return;
    }

    setIsSubmitting(true);
    try {
      // UI collects whole percent; the API expects a fraction (same as the
      // FIXED-bundle create flow).
      await onSubmit({
        categoryId: Number(categoryId),
        groupId: Number(groupId),
        paymentMethodId: paymentMethods[0].id,
        currency,
        bundleTo,
        ...(increasePct ? { increaseRate: increasePct / 100 } : {}),
        ...(seedPct ? { seedIncreaseRate: seedPct / 100 } : {}),
        ...(every && every !== 1 ? { increaseEveryMonths: every } : {}),
        ...(comment.trim() ? { comment: comment.trim() } : {}),
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

      <div className="relative bg-white w-full sm:max-w-md rounded-t-2xl sm:rounded-xl shadow-dropdown flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between p-lg border-b border-stone-100">
          <h2 className="text-lg font-semibold text-stone-900">
            {t("projection.modal.title")}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="p-xs rounded-md hover:bg-stone-100 transition-colors text-stone-500"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form
          onSubmit={handleSubmit}
          noValidate
          className="p-lg space-y-md overflow-y-auto flex-1"
        >
          <p className="text-sm text-stone-500">{t("projection.modal.hint")}</p>

          {serverError && (
            <div
              role="alert"
              className="rounded-lg bg-expense-50 border border-expense-100 px-sm py-xs text-sm text-expense-600"
            >
              {serverError}
            </div>
          )}

          {!canSubmit ? (
            <p className="text-sm text-stone-500">
              {t("projection.modal.nothingToProject")}
            </p>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-sm">
                <div className="space-y-xs">
                  <label className="block text-sm font-medium text-stone-700">
                    {t("projection.modal.field.category")}
                    <span className="text-expense-400 ml-xs">*</span>
                  </label>
                  <select
                    autoFocus
                    className={cn(inputClass(false), "cursor-pointer")}
                    value={categoryId}
                    onChange={(e) => setCategoryId(Number(e.target.value))}
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>
                <div className="space-y-xs">
                  <label className="block text-sm font-medium text-stone-700">
                    {t("projection.modal.field.group")}
                    <span className="text-expense-400 ml-xs">*</span>
                  </label>
                  <select
                    className={cn(inputClass(false), "cursor-pointer")}
                    value={groupId}
                    onChange={(e) => setGroupId(Number(e.target.value))}
                  >
                    {groups.map((g) => (
                      <option key={g.id} value={g.id}>
                        {g.name}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="space-y-xs">
                <label className="block text-sm font-medium text-stone-700">
                  {t("projection.modal.field.through")}
                </label>
                <input
                  type="month"
                  className={inputClass(false)}
                  value={bundleTo}
                  onChange={(e) => setBundleTo(e.target.value)}
                />
              </div>

              <button
                type="button"
                onClick={() => setShowAdvanced((v) => !v)}
                className="text-xs font-medium text-primary-600 hover:text-primary-800"
              >
                {showAdvanced
                  ? t("projection.modal.hideIncrease")
                  : t("projection.modal.showIncrease")}
              </button>

              {showAdvanced && (
                <div className="space-y-md rounded-lg bg-stone-50 border border-stone-100 p-sm">
                  <div className="grid grid-cols-2 gap-sm">
                    <div className="space-y-xs">
                      <label className="block text-xs font-medium text-stone-700">
                        {t("projection.modal.field.increaseRate")}
                      </label>
                      <input
                        type="number"
                        min={0}
                        max={MAX_RATE_PCT}
                        step="any"
                        className={inputClass(false)}
                        value={increaseRatePct}
                        onChange={(e) => setIncreaseRatePct(e.target.value)}
                      />
                    </div>
                    <div className="space-y-xs">
                      <label className="block text-xs font-medium text-stone-700">
                        {t("projection.modal.field.everyMonths")}
                      </label>
                      <input
                        type="number"
                        min={1}
                        step={1}
                        className={inputClass(false)}
                        value={increaseEveryMonths}
                        onChange={(e) => setIncreaseEveryMonths(e.target.value)}
                      />
                    </div>
                  </div>
                  <div className="space-y-xs">
                    <label className="block text-xs font-medium text-stone-700">
                      {t("projection.modal.field.seedIncreaseRate")}
                    </label>
                    <input
                      type="number"
                      min={0}
                      max={MAX_RATE_PCT}
                      step="any"
                      className={inputClass(false)}
                      value={seedIncreaseRatePct}
                      onChange={(e) => setSeedIncreaseRatePct(e.target.value)}
                    />
                    <p className="text-xs text-stone-400">
                      {t("projection.modal.seedHint")}
                    </p>
                  </div>
                </div>
              )}

              <div className="space-y-xs">
                <label className="block text-sm font-medium text-stone-700">
                  {t("projection.modal.field.comment")}
                </label>
                <input
                  type="text"
                  className={inputClass(false)}
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder={t("projection.modal.field.commentPlaceholder")}
                />
              </div>

              {fieldError ? (
                <p className="text-xs text-expense-400">{fieldError}</p>
              ) : (
                <p className="text-xs text-stone-500">
                  {t("projection.modal.frontierNote")}
                </p>
              )}
            </>
          )}

          <div className="flex items-center justify-end gap-sm pt-sm border-t border-stone-100">
            <Button type="button" variant="outline" size="sm" onClick={onClose}>
              {t("projection.modal.action.cancel")}
            </Button>
            <Button type="submit" size="sm" disabled={isSubmitting || !canSubmit}>
              {t("projection.modal.action.create")}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};
