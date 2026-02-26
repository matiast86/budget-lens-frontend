import { useTranslation } from "react-i18next";
import { format } from "date-fns";
import type { Locale } from "date-fns";
import { enUS, es } from "date-fns/locale";
import { useQuery } from "@tanstack/react-query";
import { DashboardHeroCard } from "../components/organisms/DashboardHeroCard";
import { LedgerGrid } from "../components/organisms/LedgerGrid";
import { RecentTransactionList } from "../components/organisms/RecentTransactionList";
import { useAuthStore } from "../stores/auth-store";
import { getLedgers, getLedger } from "../services/ledger-service";
import type { Currency } from "../types";

const DATE_FNS_LOCALES: Record<string, Locale> = { en: enUS, es };

export const DashboardPage = () => {
  const { i18n } = useTranslation("common");
  const token = useAuthStore((s) => s.token);

  const { data: ledgers = [] } = useQuery({
    queryKey: ["ledgers"],
    queryFn: () => getLedgers(token!),
    enabled: !!token,
  });

  const firstLedgerId = ledgers[0]?.id;

  const { data: ledgerDetail } = useQuery({
    queryKey: ["ledger", firstLedgerId],
    queryFn: () => getLedger(String(firstLedgerId), token!),
    enabled: !!firstLedgerId && !!token,
  });

  // Derive hero card numbers from the first ledger's CURRENT transactions
  const currentTxs = (ledgerDetail?.transactions ?? []).filter(
    (tx) => tx.status === "CURRENT",
  );
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
        currency={(ledgerDetail?.currency ?? "ARS") as Currency}
        periodLabel={periodLabel}
      />

      {/* Ledger carousel */}
      <LedgerGrid ledgers={ledgers} />

      {/* Recent transactions */}
      <RecentTransactionList transactions={ledgerDetail?.transactions ?? []} />
    </main>
  );
};
