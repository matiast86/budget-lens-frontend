import { format } from "date-fns";
import { ArrowRight, TrendingUp } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Button } from "../atoms/Button";
import type { LedgerDashboardResponseDto } from "../../types";

const CURRENCY_LABELS: Record<string, string> = {
  ARS: "Argentine Peso",
  USD: "US Dollar",
  EUR: "Euro",
  BRL: "Brazilian Real",
  CLP: "Chilean Peso",
  UYU: "Uruguayan Peso",
  PYG: "Paraguayan Guaraní",
  BOB: "Bolivian Boliviano",
};

interface LedgerCardProps {
  ledger: LedgerDashboardResponseDto;
}

export const LedgerCard = ({ ledger }: LedgerCardProps) => {
  const navigate = useNavigate();
  const createdAt = format(new Date(ledger.createdAt), "MMM d, yyyy");
  const currencyLabel = CURRENCY_LABELS[ledger.currency] ?? ledger.currency;

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
        <p className="text-sm text-slate-400 italic">No description provided.</p>
      )}

      {/* CPI index */}
      <div className="flex items-center gap-xs text-sm text-slate-500 bg-slate-50 rounded-md px-sm py-xs">
        <TrendingUp className="w-4 h-4 text-slate-400 shrink-0" />
        <span className="label-muted">Base CPI</span>
        <span className="ml-auto tabular-nums font-medium text-slate-700">
          {ledger.baseCpiIndex.toLocaleString(undefined, {
            minimumFractionDigits: 2,
            maximumFractionDigits: 4,
          })}
        </span>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between mt-auto pt-sm border-t border-slate-100">
        <div>
          <p className="label-muted">{currencyLabel}</p>
          <p className="text-xs text-slate-400">Created {createdAt}</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            navigate(`/ledgers/${ledger.id}`, { state: { title: ledger.name } })
          }
        >
          Open <ArrowRight className="w-3.5 h-3.5" />
        </Button>
      </div>
    </div>
  );
}
