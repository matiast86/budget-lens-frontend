import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronRight, ArrowUpRight, ArrowDownLeft, ExternalLink } from "lucide-react";
import { formatCurrency } from "../../utils/format-currency";
import { formatMonthShort } from "../../utils/format-period";
import { cn } from "../../utils/cn";
import type {
  DebtOwnerResponseDto,
  TransactionDebtOwnerResponseDto,
  Currency,
} from "../../types";

interface DebtOwnersListProps {
  owners: DebtOwnerResponseDto[];
  currency: Currency;
  /** Open the transaction a given debt assignment belongs to. */
  onOpenTransaction: (transactionId: number) => void;
}

// Signed contribution of one assignment: owed to me is positive, owed by me negative.
const signedAmount = (tdo: TransactionDebtOwnerResponseDto): number =>
  tdo.direction === "OWED_TO_ME" ? tdo.amount : -tdo.amount;

// ---------------------------------------------------------------------------
// Net balance pill — glyph + word + amount, never colour alone
// ---------------------------------------------------------------------------

const NetBalance = ({
  net,
  currency,
  locale,
}: {
  net: number;
  currency: Currency;
  locale: string;
}) => {
  const { t } = useTranslation("ledger");

  if (Math.round(net) === 0) {
    return <span className="text-sm font-medium text-stone-500">{t("debt.list.settled")}</span>;
  }

  const owedToYou = net > 0;
  const Icon = owedToYou ? ArrowUpRight : ArrowDownLeft;
  return (
    <span
      className={cn(
        "flex items-center gap-xs text-sm font-semibold financial-amount",
        owedToYou ? "text-income-600" : "text-expense-600",
      )}
    >
      <Icon className="w-4 h-4 shrink-0" aria-hidden />
      <span className="flex flex-col items-end leading-tight">
        <span className="text-[11px] font-medium text-stone-500">
          {owedToYou ? t("debt.list.owesYou") : t("debt.list.youOwe")}
        </span>
        {formatCurrency(Math.abs(net), currency, locale)}
      </span>
    </span>
  );
};

// ---------------------------------------------------------------------------
// One owner — collapsible row + per-debt detail
// ---------------------------------------------------------------------------

const OwnerRow = ({
  owner,
  currency,
  onOpenTransaction,
}: {
  owner: DebtOwnerResponseDto;
  currency: Currency;
  onOpenTransaction: (transactionId: number) => void;
}) => {
  const { t, i18n } = useTranslation("ledger");
  const locale = i18n.language;
  const [open, setOpen] = useState(false);

  const assignments = [...(owner.transactions ?? [])].sort((a, b) =>
    b.debt.period.localeCompare(a.debt.period),
  );
  const net = assignments.reduce((sum, tdo) => sum + signedAmount(tdo), 0);

  return (
    <div className="border-b border-stone-100 last:border-b-0">
      {/* Summary row */}
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        disabled={assignments.length === 0}
        className={cn(
          "flex w-full items-center gap-md px-md py-sm text-left transition-colors",
          assignments.length > 0 ? "hover:bg-stone-50 cursor-pointer" : "cursor-default",
        )}
      >
        <ChevronRight
          className={cn(
            "w-4 h-4 shrink-0 text-stone-400 transition-transform",
            open && "rotate-90",
            assignments.length === 0 && "opacity-0",
          )}
          aria-hidden
        />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-stone-900 truncate">{owner.name}</p>
          <p className="text-xs text-stone-500">
            {t("debt.list.debtCount", { count: assignments.length })}
          </p>
        </div>
        <NetBalance net={net} currency={currency} locale={locale} />
      </button>

      {/* Per-debt detail */}
      {open && assignments.length > 0 && (
        <ul className="bg-stone-50/60 px-md pb-sm">
          {assignments.map((tdo) => {
            const owedToYou = tdo.direction === "OWED_TO_ME";
            return (
              <li key={`${tdo.transactionId}-${tdo.debtOwnerId}`}>
                <button
                  type="button"
                  onClick={() => onOpenTransaction(tdo.transactionId)}
                  className="group flex w-full items-center gap-md rounded-lg px-sm py-sm text-left hover:bg-white transition-colors"
                  title={t("debt.list.openTransaction")}
                >
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-stone-800 truncate">
                      {tdo.debt.description || t("debt.report.noDescription")}
                    </p>
                    <p className="text-xs text-stone-400 tabular-nums">
                      {formatMonthShort(tdo.debt.period, locale)} ·{" "}
                      {t(`debt.direction.${tdo.direction}`)}
                    </p>
                  </div>
                  <span
                    className={cn(
                      "text-sm financial-amount tabular-nums",
                      owedToYou ? "text-income-600" : "text-expense-600",
                    )}
                  >
                    {owedToYou ? "+" : "−"}
                    {formatCurrency(tdo.amount, currency, locale)}
                  </span>
                  <ExternalLink
                    className="w-3.5 h-3.5 shrink-0 text-stone-300 group-hover:text-primary-500 transition-colors"
                    aria-hidden
                  />
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

// ---------------------------------------------------------------------------
// List
// ---------------------------------------------------------------------------

export const DebtOwnersList = ({
  owners,
  currency,
  onOpenTransaction,
}: DebtOwnersListProps) => {
  const { t } = useTranslation("ledger");

  if (owners.length === 0) {
    return (
      <div className="card flex flex-col items-center justify-center py-2xl text-center">
        <p className="section-title mb-xs">{t("debt.list.empty.title")}</p>
        <p className="text-sm text-stone-500">{t("debt.list.empty.body")}</p>
      </div>
    );
  }

  // Owners carrying a balance first, each group alphabetical.
  const sorted = [...owners].sort((a, b) => {
    const aHas = (a.transactions ?? []).length > 0 ? 0 : 1;
    const bHas = (b.transactions ?? []).length > 0 ? 0 : 1;
    return aHas - bHas || a.name.localeCompare(b.name);
  });

  return (
    <div className="card p-0 overflow-hidden">
      {sorted.map((owner) => (
        <OwnerRow
          key={owner.id}
          owner={owner}
          currency={currency}
          onOpenTransaction={onOpenTransaction}
        />
      ))}
    </div>
  );
};
