import { useTranslation } from "react-i18next";
import { Button } from "../atoms/Button";
import { TransactionRow } from "../molecules/TransactionRow";
import type { Transaction } from "../../types";

interface TransactionListProps {
  transactions: Transaction[];
}

export const TransactionList = ({ transactions }: TransactionListProps) => {
  const { t } = useTranslation("common");

  return (
    <div className="lg:col-span-2 card">
      <div className="flex items-center justify-between mb-md">
        <h2 className="section-title">{t("recentTransactions.title")}</h2>
        <Button variant="ghost" size="sm">{t("recentTransactions.viewAll")}</Button>
      </div>
      <div className="space-y-sm">
        {transactions.map((tx, i) => (
          <TransactionRow key={i} {...tx} />
        ))}
      </div>
    </div>
  );
};
