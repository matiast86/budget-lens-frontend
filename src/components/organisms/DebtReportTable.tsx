import { useState, Fragment } from "react";
import { ChevronRight } from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";
import { formatCurrency } from "../../utils/format-currency";
import { formatMonthShort } from "../../utils/format-period";
import type {
  DebtReportDto,
  DebtPeriodAmountDto,
  Currency,
} from "../../types";

interface DebtReportTableProps {
  report: DebtReportDto;
  currency: Currency;
}

const amtFor = (amounts: DebtPeriodAmountDto[], period: string): number =>
  amounts.find((a) => a.period === period)?.amount ?? 0;

// A signed net cell: positive (owed to me) reads income, negative (owed by me) reads clay.
// The +/− sign carries the meaning without relying on colour.
const NetCell = ({
  amounts,
  period,
  currency,
  locale,
  strong,
}: {
  amounts: DebtPeriodAmountDto[];
  period: string;
  currency: Currency;
  locale: string;
  strong?: boolean;
}) => {
  const value = amtFor(amounts, period);
  return (
    <td className="text-right px-3 py-2 min-w-[104px] border-l border-stone-100 tabular-nums">
      {Math.round(value) === 0 ? (
        <span className="text-stone-300">—</span>
      ) : (
        <span
          className={cn(
            strong ? "text-sm font-bold" : "text-sm font-semibold",
            value > 0 ? "text-income-600" : "text-expense-600",
          )}
        >
          {value > 0 ? "+" : "−"}
          {formatCurrency(Math.abs(value), currency, locale)}
        </span>
      )}
    </td>
  );
};

export const DebtReportTable = ({ report, currency }: DebtReportTableProps) => {
  const { t, i18n } = useTranslation("ledger");
  const locale = i18n.language;
  const { periods } = report.meta;

  const [expanded, setExpanded] = useState<Set<number>>(new Set());
  const toggle = (id: number) =>
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });

  if (report.owners.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-2xl text-center">
        <p className="section-title mb-xs">{t("debt.list.empty.title")}</p>
        <p className="text-sm text-stone-500">{t("debt.report.empty")}</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto rounded-xl border border-stone-200 shadow-card">
      <table className="w-full border-collapse text-sm">
        <thead>
          <tr className="bg-stone-50 border-b-2 border-stone-200">
            <th className="text-left px-4 py-2 sticky left-0 z-20 bg-stone-50 min-w-[180px]">
              <span className="text-xs font-medium text-stone-400">
                {t("debt.report.legend")}
              </span>
            </th>
            {periods.map((p) => (
              <th
                key={p}
                className="text-right px-3 py-2 border-l border-stone-200 whitespace-nowrap text-xs font-semibold text-stone-700"
              >
                {formatMonthShort(p, locale)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {report.owners.map((owner) => {
            const isOpen = expanded.has(owner.id);
            return (
              <Fragment key={owner.id}>
                <tr
                  className="bg-white hover:bg-stone-50 cursor-pointer transition-colors border-b border-stone-100"
                  onClick={() => toggle(owner.id)}
                >
                  <td className="py-2 px-4 sticky left-0 z-10 bg-white">
                    <div className="flex items-center gap-1">
                      <ChevronRight
                        className={cn(
                          "w-3.5 h-3.5 text-stone-400 transition-transform shrink-0",
                          isOpen && "rotate-90",
                          owner.debts.length === 0 && "opacity-0",
                        )}
                      />
                      <span className="text-sm font-medium text-stone-800 truncate">
                        {owner.name}
                      </span>
                    </div>
                  </td>
                  {periods.map((p) => (
                    <NetCell
                      key={p}
                      amounts={owner.total}
                      period={p}
                      currency={currency}
                      locale={locale}
                    />
                  ))}
                </tr>

                {isOpen &&
                  owner.debts.map((debt, i) => (
                    <tr
                      key={`${owner.id}-${i}`}
                      className="bg-stone-50 border-b border-stone-50"
                    >
                      <td className="py-1.5 px-4 sticky left-0 z-10 bg-stone-50">
                        <span className="text-xs text-stone-500 pl-6 block truncate">
                          {debt.description || t("debt.report.noDescription")}
                        </span>
                      </td>
                      {periods.map((p) => (
                        <NetCell
                          key={p}
                          amounts={debt.amounts}
                          period={p}
                          currency={currency}
                          locale={locale}
                        />
                      ))}
                    </tr>
                  ))}
              </Fragment>
            );
          })}

          {/* Grand total */}
          <tr className="bg-primary-50 border-t-2 border-stone-300">
            <td className="py-2 px-4 text-sm font-bold text-primary-700 sticky left-0 z-10 bg-primary-50">
              {t("debt.report.grandTotal")}
            </td>
            {periods.map((p) => (
              <NetCell
                key={p}
                amounts={report.grandTotal}
                period={p}
                currency={currency}
                locale={locale}
                strong
              />
            ))}
          </tr>
        </tbody>
      </table>
    </div>
  );
};
