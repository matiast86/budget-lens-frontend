import type React from "react";
import { useState, Fragment } from "react";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";
import { formatCurrency } from "../../utils/format-currency";
import type {
  CashflowReportDto,
  CashflowPeriodAmountDto,
  CashflowEntryTypeDto,
  Currency,
} from "../../types";

interface CashflowTableProps {
  report: CashflowReportDto;
  currency: Currency;
}

const fmtPeriod = (period: string, locale: string): string => {
  const [y, m] = period.split("-").map(Number);
  return new Intl.DateTimeFormat(locale, { month: "short", year: "2-digit" }).format(
    new Date(y, m - 1, 1),
  );
};

const getAmt = (amounts: CashflowPeriodAmountDto[], period: string) =>
  amounts.find((a) => a.period === period) ?? { planned: 0, balance: 0 };

// ---------------------------------------------------------------------------
// Period amount cell — planned (small/muted) + balance (bold/colored) stacked
// ---------------------------------------------------------------------------

interface PeriodCellProps {
  amounts: CashflowPeriodAmountDto[];
  period: string;
  currency: Currency;
  locale: string;
  balanceClass: string;
  bgClass?: string;
}

const PeriodCell = ({ amounts, period, currency, locale, balanceClass, bgClass }: PeriodCellProps) => {
  const { planned, balance } = getAmt(amounts, period);
  return (
    <td
      className={cn(
        "text-right px-3 py-2 min-w-[110px] align-top border-l border-stone-100",
        bgClass,
      )}
    >
      <div className="text-[11px] text-stone-400 tabular-nums leading-snug">
        {formatCurrency(planned, currency, locale)}
      </div>
      <div className={cn("text-sm font-semibold tabular-nums", balanceClass)}>
        {formatCurrency(balance, currency, locale)}
      </div>
    </td>
  );
};

// ---------------------------------------------------------------------------
// Main table
// ---------------------------------------------------------------------------

export const CashflowTable = ({ report, currency }: CashflowTableProps) => {
  const { i18n, t } = useTranslation("common");
  const locale = i18n.language.startsWith("es") ? "es-AR" : "en-US";
  const { periods } = report.meta;

  const [expanded, setExpanded] = useState<Set<string>>(new Set());
  const toggle = (key: string) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      next.has(key) ? next.delete(key) : next.add(key);
      return next;
    });

  const renderSection = (
    label: string,
    section: CashflowEntryTypeDto,
    sectionKey: "income" | "expense",
    sectionBg: string,
    sectionText: string,
    balanceClass: string,
  ) => (
    <>
      {/* Section header */}
      <tr className={cn("border-t-2 border-stone-200", sectionBg)}>
        <td
          className={cn(
            "py-2 px-4 text-sm font-bold sticky left-0 z-10",
            sectionBg,
            sectionText,
          )}
        >
          {label}
        </td>
        {periods.map((p) => (
          <PeriodCell
            key={p}
            amounts={section.total}
            period={p}
            currency={currency}
            locale={locale}
            balanceClass={balanceClass}
            bgClass={sectionBg}
          />
        ))}
      </tr>

      {/* Payment method rows */}
      {section.paymentMethods.map((pm) => {
        const pmKey = `${sectionKey}-pm-${pm.id}`;
        const pmExpanded = expanded.has(pmKey);

        return (
          <Fragment key={pm.id}>
            <tr
              className="bg-white hover:bg-stone-50 cursor-pointer transition-colors"
              onClick={() => toggle(pmKey)}
            >
              <td className="py-1.5 px-4 sticky left-0 z-10 bg-white hover:bg-stone-50 transition-colors">
                <div className="flex items-center gap-1 pl-3">
                  <ChevronRight
                    className={cn(
                      "w-3.5 h-3.5 text-stone-400 transition-transform flex-shrink-0",
                      pmExpanded && "rotate-90",
                    )}
                  />
                  <span className="text-sm font-medium text-stone-700 truncate">{pm.name}</span>
                </div>
              </td>
              {periods.map((p) => (
                <PeriodCell
                  key={p}
                  amounts={pm.total}
                  period={p}
                  currency={currency}
                  locale={locale}
                  balanceClass={balanceClass}
                />
              ))}
            </tr>

            {/* Category rows (visible when PM expanded) */}
            {pmExpanded &&
              pm.categories.map((cat) => {
                const catKey = `${pmKey}-cat-${cat.id}`;
                const catExpanded = expanded.has(catKey);

                return (
                  <Fragment key={cat.id}>
                    <tr
                      className="bg-stone-50 hover:bg-stone-100 cursor-pointer transition-colors"
                      onClick={() => toggle(catKey)}
                    >
                      <td className="py-1.5 px-4 sticky left-0 z-10 bg-stone-50 hover:bg-stone-100 transition-colors">
                        <div className="flex items-center gap-1 pl-8">
                          <ChevronRight
                            className={cn(
                              "w-3 h-3 text-stone-400 transition-transform flex-shrink-0",
                              catExpanded && "rotate-90",
                            )}
                          />
                          <span className="text-sm text-stone-600 truncate">{cat.name}</span>
                        </div>
                      </td>
                      {periods.map((p) => (
                        <PeriodCell
                          key={p}
                          amounts={cat.total}
                          period={p}
                          currency={currency}
                          locale={locale}
                          balanceClass={cn(balanceClass, "opacity-80")}
                          bgClass="bg-stone-50"
                        />
                      ))}
                    </tr>

                    {/* Group rows (leaf — visible when category expanded) */}
                    {catExpanded &&
                      cat.groups.map((group) => (
                        <tr key={group.id} className="bg-white border-b border-stone-50">
                          <td className="py-1 px-4 sticky left-0 z-10 bg-white">
                            <span className="text-xs text-stone-500 pl-14 block truncate">
                              {group.name}
                            </span>
                          </td>
                          {periods.map((p) => (
                            <PeriodCell
                              key={p}
                              amounts={group.amounts}
                              period={p}
                              currency={currency}
                              locale={locale}
                              balanceClass={cn(balanceClass, "opacity-60 text-xs")}
                            />
                          ))}
                        </tr>
                      ))}
                  </Fragment>
                );
              })}
          </Fragment>
        );
      })}
    </>
  );

  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200 shadow-card">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-stone-50 border-b-2 border-stone-200">
            {/* Label column */}
            <th className="text-left px-4 py-2 sticky left-0 z-20 bg-stone-50 min-w-[200px]">
              <span className="text-xs font-medium text-stone-400">{t("cashflow.legend")}</span>
            </th>
            {/* One column per period */}
            {periods.map((p) => (
              <th
                key={p}
                className="text-right px-3 py-2 border-l border-stone-200 whitespace-nowrap"
              >
                <span className="text-xs font-semibold text-stone-700 block">
                  {fmtPeriod(p, locale)}
                </span>
                <span className="text-[10px] font-normal text-stone-400">
                  {t("cashflow.planned")} / {t("cashflow.balance")}
                </span>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {/* Income */}
          {renderSection(
            t("cashflow.income"),
            report.income,
            "income",
            "bg-income-50",
            "text-income-600",
            "text-income-600",
          )}

          {/* Expenses */}
          {renderSection(
            t("cashflow.expense"),
            report.expense,
            "expense",
            "bg-expense-50",
            "text-expense-600",
            "text-expense-600",
          )}

          {/* Grand total */}
          <tr className="bg-primary-50 border-t-2 border-stone-300">
            <td className="py-2 px-4 text-sm font-bold text-primary-700 sticky left-0 z-10 bg-primary-50">
              {t("cashflow.grandTotal")}
            </td>
            {periods.map((p) => {
              const { planned, balance } = getAmt(report.grandTotal, p);
              return (
                <td
                  key={p}
                  className="text-right px-3 py-2 min-w-[110px] align-top border-l border-primary-100 bg-primary-50"
                >
                  <div className="text-[11px] text-primary-400 tabular-nums leading-snug">
                    {formatCurrency(planned, currency, locale)}
                  </div>
                  <div
                    className={cn(
                      "text-sm font-bold tabular-nums",
                      balance >= 0 ? "text-income-600" : "text-expense-600",
                    )}
                  >
                    {formatCurrency(balance, currency, locale)}
                  </div>
                </td>
              );
            })}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
