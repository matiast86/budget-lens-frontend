import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import type { Locale } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { DashboardHeroCard } from "../components/organisms/DashboardHeroCard";
import { LedgerGrid } from "../components/organisms/LedgerGrid";
import { RecentTransactionList } from "../components/organisms/RecentTransactionList";
import { mockUser } from "../helpers/mocks/user-mocks";
import { mockLedger } from "../helpers/mocks/ledger-mocks";
import type { Currency } from "../types";

const DATE_FNS_LOCALES: Record<string, Locale> = { en: enUS, es };

export const DashboardPage = () => {
  const { i18n } = useTranslation("common");

  // Derive hero card numbers from the primary ledger transactions (CURRENT status)
  const currentTxs = mockLedger.transactions.filter((tx) => tx.status === "CURRENT");
  const income   = currentTxs.filter((tx) => tx.entryType === "INCOME").reduce((s, tx) => s + tx.monthlyAmount, 0);
  const expenses = currentTxs.filter((tx) => tx.entryType === "EXPENSE").reduce((s, tx) => s + tx.monthlyAmount, 0);
  const balance  = income - expenses;

  const locale = DATE_FNS_LOCALES[i18n.language] ?? enUS;
  const periodLabel = format(new Date(), "MMMM yyyy", { locale });

  return (
    <main className="flex-1 p-md md:p-lg space-y-lg">
      {/* Hero card */}
      <DashboardHeroCard
        balance={balance}
        income={income}
        expenses={expenses}
        currency={mockLedger.currency as Currency}
        periodLabel={periodLabel}
      />

      {/* Ledger carousel */}
      <LedgerGrid ledgers={mockUser.ledgers} />

      {/* Recent transactions */}
      <RecentTransactionList transactions={mockLedger.transactions} />
    </main>
  );
};
