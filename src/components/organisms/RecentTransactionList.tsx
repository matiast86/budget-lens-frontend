import type React from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../atoms/Button";
import { TransactionListRow } from "../molecules/TransactionListRow";
import type { TransactionResponseDto } from "../../types";

interface RecentTransactionListProps {
  transactions: TransactionResponseDto[];
}

export const RecentTransactionList = ({ transactions }: RecentTransactionListProps) => {
  const { t, i18n } = useTranslation("common");
  const recent = transactions.slice(0, 5);

  if (recent.length === 0) {
    return null;
  }

  return (
    <section className="card">
      <div className="flex items-center justify-between mb-sm">
        <h2 className="section-title">{t("recentTransactions.title")}</h2>
        <Button variant="ghost" size="sm">{t("recentTransactions.viewAll")}</Button>
      </div>
      <div className="divide-y divide-stone-50">
        {recent.map((tx) => (
          <TransactionListRow key={tx.id} transaction={tx} locale={i18n.language} />
        ))}
      </div>
    </section>
  );
};
