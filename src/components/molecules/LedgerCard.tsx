import { useTranslation } from "react-i18next";
import { ArrowRight, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../atoms/Button";
import { formatTransactionDate } from "../../utils/format-date";
import type { LedgerDashboardResponseDto } from "../../types";

interface LedgerCardProps {
  ledger: LedgerDashboardResponseDto;
}

export const LedgerCard = ({ ledger }: LedgerCardProps) => {
  const { t, i18n } = useTranslation("ledger");
  const navigate = useNavigate();
  const createdAt = formatTransactionDate(ledger.createdAt, i18n.language);
  const currencyLabel = t(`card.currency.${ledger.currency}`, { defaultValue: ledger.currency });

  return (
    <div className="card flex flex-col gap-md">
      {/* Header row */}
      <div className="flex items-start justify-between gap-sm">
        <h3 className="text-base font-semibold text-slate-900 leading-tight">
          {ledger.name}
        </h3>
        <span className="shrink-0 inline-flex items-center px-sm py-xs rounded-sm bg-primary-50 text-primary-700 text-xs font-semibold tabular-nums">
          {ledger.currency}
        </span>
      </div>

      {/* Description */}
      {ledger.description ? (
        <p className="text-sm text-slate-500 leading-relaxed line-clamp-2">
          {ledger.description}
        </p>
      ) : (
        <p className="text-sm text-slate-400 italic">{t("card.noDescription")}</p>
      )}

      {/* CPI index */}
      <div className="flex items-center gap-xs text-sm text-slate-500 bg-slate-50 rounded-md px-sm py-xs">
        <TrendingUp className="w-4 h-4 text-slate-400 shrink-0" />
        <span className="label-muted">{t("card.baseCpi")}</span>
        <span className="ml-auto tabular-nums font-medium text-slate-700">
          {ledger.baseCpiIndex.toLocaleString(i18n.language, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
          })}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-sm border-t border-slate-100">
        <div>
          <p className="label-muted">{currencyLabel}</p>
          <p className="text-xs text-slate-400">{t("card.created", { date: createdAt })}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            navigate(`/ledgers/${ledger.id}`, { state: { title: ledger.name } })
          }
        >
          {t("card.open")} <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
};
