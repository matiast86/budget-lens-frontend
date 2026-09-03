import { useTranslation } from "react-i18next";
import { formatCurrency } from "../../utils/format-currency";
import type { Currency } from "../../types";

interface DashboardHeroCardProps {
  balance: number;
  income: number;
  expenses: number;
  currency: Currency;
  periodLabel: string;
}

export const DashboardHeroCard = ({
  balance,
  income,
  expenses,
  currency,
  periodLabel,
}: DashboardHeroCardProps) => {
  const { t, i18n } = useTranslation("common");

  return (
    <div className="card-hero mx-[-1rem] rounded-none sm:mx-0 sm:rounded-2xl">
      <p className="text-sm font-medium text-primary-200">{periodLabel}</p>
      <p className="financial-amount text-4xl mt-xs">
        {formatCurrency(balance, currency, i18n.language)}
      </p>
      <p className="text-primary-200 text-sm mt-xs">{t("dashboard.balance_label")}</p>

      <div className="flex gap-lg mt-lg">
        <div>
          <p className="text-primary-200 text-xs font-medium">{t("recentTransactions.income")}</p>
          <p className="financial-amount text-xl mt-xs">
            {formatCurrency(income, currency, i18n.language)}
          </p>
        </div>
        <div className="w-px bg-primary-700 self-stretch" />
        <div>
          <p className="text-primary-200 text-xs font-medium">{t("recentTransactions.expenses")}</p>
          <p className="financial-amount text-xl mt-xs">
            {formatCurrency(expenses, currency, i18n.language)}
          </p>
        </div>
      </div>
    </div>
  );
};
