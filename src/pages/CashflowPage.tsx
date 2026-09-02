import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useQuery } from "@tanstack/react-query";
import { Banknote } from "lucide-react";
import { CashflowTable } from "../components/organisms/CashflowTable";
import { useAuthStore } from "../stores/auth-store";
import { getLedgers } from "../services/ledger-service";
import { getCashflow } from "../services/reports-service";
import { cn } from "../utils/cn";

// ---------------------------------------------------------------------------
// Period helpers
// ---------------------------------------------------------------------------

const toYYYYMM = (d: Date): string =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;

const addMonths = (d: Date, n: number): Date => {
  const r = new Date(d);
  r.setMonth(r.getMonth() + n);
  return r;
};

const now = new Date();

const DEFAULT_FROM = toYYYYMM(addMonths(now, -3));
const DEFAULT_TO = toYYYYMM(addMonths(now, 1));

const PRESETS: { labelKey: string; from: string; to: string }[] = [
  {
    labelKey: "cashflow.period.last3",
    from: toYYYYMM(addMonths(now, -3)),
    to: toYYYYMM(addMonths(now, 1)),
  },
  {
    labelKey: "cashflow.period.last6",
    from: toYYYYMM(addMonths(now, -6)),
    to: toYYYYMM(now),
  },
  {
    labelKey: "cashflow.period.thisYear",
    from: `${now.getFullYear()}-01`,
    to: `${now.getFullYear()}-12`,
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export const CashflowPage = () => {
  const { t } = useTranslation("common");
  const token = useAuthStore((s) => s.token);

  const [selectedLedgerId, setSelectedLedgerId] = useState<number | null>(null);
  const [from, setFrom] = useState(DEFAULT_FROM);
  const [to, setTo] = useState(DEFAULT_TO);

  // -------------------------------------------------------------------------
  // Queries
  // -------------------------------------------------------------------------

  const { data: ledgers = [], isLoading: ledgersLoading } = useQuery({
    queryKey: ["ledgers"],
    queryFn: () => getLedgers(token!),
    enabled: !!token,
  });

  // Effective selection: the user's explicit pick, else the first ledger once
  // loaded. Derived during render — no effect, no cascading re-render.
  const activeLedgerId = selectedLedgerId ?? ledgers[0]?.id ?? null;

  const { data: report, isLoading: reportLoading, isError } = useQuery({
    queryKey: ["cashflow", activeLedgerId, from, to],
    queryFn: () => getCashflow(activeLedgerId!, from, to, token!),
    enabled: !!token && !!activeLedgerId && !!from && !!to && from <= to,
  });

  // -------------------------------------------------------------------------
  // Render
  // -------------------------------------------------------------------------

  const selectedLedger = ledgers.find((l) => l.id === activeLedgerId);

  const applyPreset = (preset: (typeof PRESETS)[number]) => {
    setFrom(preset.from);
    setTo(preset.to);
  };

  return (
    <div className="p-md space-y-md">
      {/* Page title */}
      <div className="flex items-center gap-sm">
        <div className="icon-pill bg-primary-100">
          <Banknote className="w-5 h-5 text-primary-600" />
        </div>
        <h1 className="text-2xl font-semibold text-stone-900">{t("cashflow.title")}</h1>
      </div>

      {/* Ledger selector pills */}
      {ledgersLoading ? (
        <div className="h-9 bg-stone-100 animate-pulse rounded-full w-48" />
      ) : ledgers.length === 0 ? (
        <div className="card text-center py-xl">
          <p className="section-title mb-xs">{t("cashflow.noLedger.title")}</p>
          <p className="label-muted">{t("cashflow.noLedger.body")}</p>
        </div>
      ) : (
        <div className="flex gap-xs overflow-x-auto scrollbar-hide pb-xs">
          {ledgers.map((l) => (
            <button
              key={l.id}
              onClick={() => setSelectedLedgerId(l.id)}
              className={cn(
                "flex-shrink-0 px-md py-xs rounded-full text-sm font-medium border transition-colors whitespace-nowrap",
                l.id === activeLedgerId
                  ? "bg-primary-600 text-white border-primary-600"
                  : "bg-white text-stone-600 border-stone-200 hover:border-primary-400 hover:text-primary-600",
              )}
            >
              {l.name}
              <span className="ml-xs text-xs opacity-70">{l.currency}</span>
            </button>
          ))}
        </div>
      )}

      {/* Period controls */}
      {ledgers.length > 0 && (
        <div className="card flex flex-col gap-sm sm:flex-row sm:items-end sm:flex-wrap">
          {/* From / To inputs */}
          <div className="flex items-center gap-sm flex-wrap">
            <div className="flex flex-col gap-xs">
              <label className="text-xs font-medium text-stone-500">{t("cashflow.period.from")}</label>
              <input
                type="month"
                value={from}
                max={to}
                onChange={(e) => setFrom(e.target.value)}
                className="rounded-md border border-stone-200 px-sm py-xs text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
            <span className="text-stone-400 mt-4">→</span>
            <div className="flex flex-col gap-xs">
              <label className="text-xs font-medium text-stone-500">{t("cashflow.period.to")}</label>
              <input
                type="month"
                value={to}
                min={from}
                onChange={(e) => setTo(e.target.value)}
                className="rounded-md border border-stone-200 px-sm py-xs text-sm text-stone-800 focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Quick presets */}
          <div className="flex gap-xs flex-wrap">
            {PRESETS.map((preset) => (
              <button
                key={preset.labelKey}
                onClick={() => applyPreset(preset)}
                className={cn(
                  "px-sm py-xs rounded-full text-xs font-medium border transition-colors",
                  from === preset.from && to === preset.to
                    ? "bg-primary-600 text-white border-primary-600"
                    : "bg-stone-50 text-stone-600 border-stone-200 hover:border-primary-400 hover:text-primary-600",
                )}
              >
                {t(preset.labelKey)}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Report */}
      {activeLedgerId && (
        <>
          {reportLoading && (
            <div className="space-y-xs">
              {[1, 2, 3, 4].map((i) => (
                <div key={i} className="h-10 bg-stone-100 animate-pulse rounded-lg" />
              ))}
            </div>
          )}

          {isError && (
            <div
              className="rounded-xl bg-expense-50 border border-expense-100 px-md py-sm text-sm text-expense-600"
              role="alert"
            >
              {t("cashflow.noData")}
            </div>
          )}

          {report && !reportLoading && (
            <CashflowTable report={report} currency={selectedLedger?.currency ?? "ARS"} />
          )}
        </>
      )}
    </div>
  );
};
