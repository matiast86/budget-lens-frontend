import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Users, CalendarRange } from "lucide-react";
import { DebtOwnersList } from "../molecules/DebtOwnersList";
import { DebtReportTable } from "./DebtReportTable";
import { useAuthStore } from "../../stores/auth-store";
import { getDebtOwners } from "../../services/debt-owner-service";
import { getDebtReport } from "../../services/reports-service";
import { cn } from "../../utils/cn";
import type { Currency } from "../../types";

interface DebtsViewProps {
  ledgerId: number;
  currency: Currency;
  /** Open the transaction a debt belongs to (mutations happen through it). */
  onOpenTransaction: (transactionId: number) => void;
}

type Mode = "list" | "report";

// --- Period helpers (YYYY-MM) ----------------------------------------------

const toYYYYMM = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

const addMonths = (d: Date, n: number): Date => {
  const r = new Date(d);
  r.setMonth(r.getMonth() + n);
  return r;
};

const NOW = new Date();
const DEFAULT_FROM = toYYYYMM(addMonths(NOW, -3));
const DEFAULT_TO = toYYYYMM(addMonths(NOW, 1));

// -------------------------------------------------------------------------

export const DebtsView = ({ ledgerId, currency, onOpenTransaction }: DebtsViewProps) => {
  const { t } = useTranslation("ledger");
  const token = useAuthStore((s) => s.token);

  const [mode, setMode] = useState<Mode>("list");
  const [from, setFrom] = useState(DEFAULT_FROM);
  const [to, setTo] = useState(DEFAULT_TO);

  const {
    data: owners = [],
    isLoading: ownersLoading,
    isError: ownersError,
  } = useQuery({
    queryKey: ["debtOwners", ledgerId],
    queryFn: () => getDebtOwners(ledgerId, token!),
    enabled: !!token && !!ledgerId,
  });

  const {
    data: report,
    isLoading: reportLoading,
    isError: reportError,
  } = useQuery({
    queryKey: ["debtReport", ledgerId, from, to],
    queryFn: () => getDebtReport(ledgerId, from, to, token!),
    enabled: !!token && !!ledgerId && mode === "report" && from <= to,
  });

  const tabs: { id: Mode; labelKey: string; icon: typeof Users }[] = [
    { id: "list", labelKey: "debt.view.list", icon: Users },
    { id: "report", labelKey: "debt.view.report", icon: CalendarRange },
  ];

  return (
    <div className="space-y-md">
      {/* Mode toggle */}
      <div className="flex items-center gap-xs">
        {tabs.map((tab) => {
          const active = mode === tab.id;
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              type="button"
              onClick={() => setMode(tab.id)}
              aria-pressed={active}
              className={cn(
                "flex items-center gap-xs px-md py-xs rounded-full text-sm font-medium border transition-colors",
                active
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-stone-600 border-stone-200 hover:border-primary-400 hover:text-primary-600",
              )}
            >
              <Icon className="w-4 h-4" />
              {t(tab.labelKey)}
            </button>
          );
        })}
      </div>

      {/* Period controls — report mode only */}
      {mode === "report" && (
        <div className="card flex flex-wrap items-end gap-sm">
          <div className="flex flex-col gap-xs">
            <label className="text-xs font-medium text-stone-500">{t("debt.period.from")}</label>
            <input
              type="month"
              value={from}
              max={to}
              onChange={(e) => setFrom(e.target.value)}
              className="rounded-md border border-stone-200 px-sm py-xs text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
          <span className="text-stone-400 pb-1.5">→</span>
          <div className="flex flex-col gap-xs">
            <label className="text-xs font-medium text-stone-500">{t("debt.period.to")}</label>
            <input
              type="month"
              value={to}
              min={from}
              onChange={(e) => setTo(e.target.value)}
              className="rounded-md border border-stone-200 px-sm py-xs text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>
      )}

      {/* Loading / error */}
      {(mode === "list" ? ownersLoading : reportLoading) && (
        <div className="space-y-xs">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-12 bg-stone-100 animate-pulse rounded-lg" />
          ))}
        </div>
      )}

      {(mode === "list" ? ownersError : reportError) && (
        <div
          className="rounded-xl bg-expense-50 border border-expense-100 px-md py-sm text-sm text-expense-600"
          role="alert"
        >
          {t("debt.loadError")}
        </div>
      )}

      {/* Content */}
      {mode === "list" && !ownersLoading && !ownersError && (
        <DebtOwnersList
          owners={owners}
          currency={currency}
          onOpenTransaction={onOpenTransaction}
        />
      )}

      {mode === "report" && report && !reportLoading && !reportError && (
        <DebtReportTable report={report} currency={currency} />
      )}
    </div>
  );
};
