import { useTranslation } from "react-i18next";
import { X } from "lucide-react";
import { cn } from "../../utils/cn";
import type {
  CategoryResponseDto,
  GroupResponseDto,
  PaymentMethodResponseDto,
  TransactionFilters as TransactionFiltersState,
} from "../../types";

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface TransactionFiltersProps {
  filters: TransactionFiltersState;
  onChange: (filters: TransactionFiltersState) => void;
  categories: CategoryResponseDto[];
  groups: GroupResponseDto[];
  paymentMethods: PaymentMethodResponseDto[];
  totalCount?: number;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const STATUS_OPTIONS = ["CURRENT", "CLOSED", "FUTURE"] as const;
const ENTRY_TYPE_OPTIONS = ["INCOME", "EXPENSE"] as const;

const hasActiveFilters = (f: TransactionFiltersState): boolean =>
  !!(
    f.status ||
    f.entryType ||
    f.categoryId ||
    f.groupId ||
    f.paymentMethodId ||
    f.paymentMonth ||
    f.isPaid !== undefined
  );

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export const TransactionFilters = ({
  filters,
  onChange,
  categories,
  groups,
  paymentMethods,
  totalCount,
}: TransactionFiltersProps) => {
  const { t } = useTranslation("ledger");

  const set = (patch: Partial<TransactionFiltersState>) =>
    onChange({ ...filters, ...patch });

  const clear = () => onChange({});

  const active = hasActiveFilters(filters);

  return (
    <div className="mb-md space-y-sm">
      {/* Row 1: month + type + status */}
      <div className="flex flex-wrap gap-sm items-center">
        {/* Month picker */}
        <input
          type="month"
          value={filters.paymentMonth ?? ""}
          onChange={(e) =>
            set({ paymentMonth: e.target.value || undefined })
          }
          className="h-8 rounded-md border border-stone-200 bg-white px-sm text-sm text-stone-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent"
          aria-label={t("transaction.filter.month")}
        />

        {/* EntryType toggle pills */}
        <div className="flex rounded-md border border-stone-200 bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => set({ entryType: undefined })}
            className={cn(
              "px-sm py-xs text-xs font-medium transition-colors",
              !filters.entryType
                ? "bg-primary-600 text-white"
                : "text-stone-600 hover:bg-stone-50",
            )}
          >
            {t("transaction.filter.all")}
          </button>
          {ENTRY_TYPE_OPTIONS.map((type) => (
            <button
              key={type}
              type="button"
              onClick={() =>
                set({ entryType: filters.entryType === type ? undefined : type })
              }
              className={cn(
                "px-sm py-xs text-xs font-medium border-l border-stone-200 transition-colors",
                filters.entryType === type
                  ? type === "INCOME"
                    ? "bg-income text-white"
                    : "bg-expense text-white"
                  : "text-stone-600 hover:bg-stone-50",
              )}
            >
              {t(`transaction.entryType.${type.toLowerCase()}`)}
            </button>
          ))}
        </div>

        {/* Status pills */}
        <div className="flex rounded-md border border-stone-200 bg-white overflow-hidden">
          <button
            type="button"
            onClick={() => set({ status: undefined })}
            className={cn(
              "px-sm py-xs text-xs font-medium transition-colors",
              !filters.status
                ? "bg-primary-600 text-white"
                : "text-stone-600 hover:bg-stone-50",
            )}
          >
            {t("transaction.filter.all")}
          </button>
          {STATUS_OPTIONS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() =>
                set({ status: filters.status === s ? undefined : s })
              }
              className={cn(
                "px-sm py-xs text-xs font-medium border-l border-stone-200 transition-colors",
                filters.status === s
                  ? "bg-primary-600 text-white"
                  : "text-stone-600 hover:bg-stone-50",
              )}
            >
              {t(`transaction.status.${s.toLowerCase()}`)}
            </button>
          ))}
        </div>
      </div>

      {/* Row 2: relation selects + isPaid + clear */}
      <div className="flex flex-wrap gap-sm items-center">
        {/* Category select */}
        {categories.length > 0 && (
          <select
            value={filters.categoryId ?? ""}
            onChange={(e) =>
              set({ categoryId: e.target.value ? Number(e.target.value) : undefined })
            }
            className="h-8 rounded-md border border-stone-200 bg-white px-sm text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent max-w-[140px]"
            aria-label={t("transaction.filter.category")}
          >
            <option value="">{t("transaction.filter.category")}</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        )}

        {/* Group select */}
        {groups.length > 0 && (
          <select
            value={filters.groupId ?? ""}
            onChange={(e) =>
              set({ groupId: e.target.value ? Number(e.target.value) : undefined })
            }
            className="h-8 rounded-md border border-stone-200 bg-white px-sm text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent max-w-[140px]"
            aria-label={t("transaction.filter.group")}
          >
            <option value="">{t("transaction.filter.group")}</option>
            {groups.map((g) => (
              <option key={g.id} value={g.id}>
                {g.name}
              </option>
            ))}
          </select>
        )}

        {/* Payment method select */}
        {paymentMethods.length > 0 && (
          <select
            value={filters.paymentMethodId ?? ""}
            onChange={(e) =>
              set({
                paymentMethodId: e.target.value ? Number(e.target.value) : undefined,
              })
            }
            className="h-8 rounded-md border border-stone-200 bg-white px-sm text-xs text-stone-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent max-w-[160px]"
            aria-label={t("transaction.filter.paymentMethod")}
          >
            <option value="">{t("transaction.filter.paymentMethod")}</option>
            {paymentMethods.map((pm) => (
              <option key={pm.id} value={pm.id}>
                {pm.name}
              </option>
            ))}
          </select>
        )}

        {/* isPaid toggle */}
        <label className="flex items-center gap-xs cursor-pointer select-none">
          <input
            type="checkbox"
            checked={filters.isPaid === true}
            onChange={(e) =>
              set({ isPaid: e.target.checked ? true : undefined })
            }
            className="w-4 h-4 rounded border-stone-300 text-primary-600 focus:ring-primary-500"
          />
          <span className="text-xs text-stone-600">
            {t("transaction.filter.isPaid")}
          </span>
        </label>

        {/* Result count + clear */}
        <div className="ml-auto flex items-center gap-sm">
          {totalCount !== undefined && (
            <span className="text-xs text-stone-400">
              {t("transaction.filter.results", { count: totalCount })}
            </span>
          )}
          {active && (
            <button
              type="button"
              onClick={clear}
              className="flex items-center gap-xs text-xs text-stone-500 hover:text-stone-800 transition-colors"
              aria-label={t("transaction.filter.clearAll")}
            >
              <X className="w-3 h-3" />
              {t("transaction.filter.clearAll")}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
