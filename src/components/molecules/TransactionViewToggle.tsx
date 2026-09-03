import { useTranslation } from "react-i18next";
import { Table, CalendarDays } from "lucide-react";
import { cn } from "../../utils/cn";

export type TransactionView = "table" | "weekly";

interface TransactionViewToggleProps {
  view: TransactionView;
  onChange: (view: TransactionView) => void;
}

const OPTIONS: { id: TransactionView; labelKey: string; icon: typeof Table }[] = [
  { id: "table", labelKey: "transaction.view.table", icon: Table },
  { id: "weekly", labelKey: "transaction.view.weekly", icon: CalendarDays },
];

export const TransactionViewToggle = ({ view, onChange }: TransactionViewToggleProps) => {
  const { t } = useTranslation("ledger");

  return (
    <div className="flex items-center gap-xs">
      {OPTIONS.map((opt) => {
        const active = view === opt.id;
        const Icon = opt.icon;
        return (
          <button
            key={opt.id}
            type="button"
            onClick={() => onChange(opt.id)}
            aria-pressed={active}
            className={cn(
              "flex items-center gap-xs px-md py-xs rounded-full text-sm font-medium border transition-colors",
              active
                ? "bg-primary-600 text-white border-primary-600"
                : "bg-white text-stone-600 border-stone-200 hover:border-primary-400 hover:text-primary-600",
            )}
          >
            <Icon className="w-4 h-4" />
            {t(opt.labelKey)}
          </button>
        );
      })}
    </div>
  );
};
