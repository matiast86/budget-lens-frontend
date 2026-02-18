import { useTranslation } from "react-i18next";
import { Button } from "../atoms/Button";
import { BudgetProgressItem } from "../molecules/BudgetProgressItem";
import type { BudgetItem } from "../../types";

interface BudgetOverviewProps {
  items: BudgetItem[];
}

export const BudgetOverview = ({ items }: BudgetOverviewProps) => {
  const { t } = useTranslation("common");

  return (
    <div className="card">
      <div className="flex items-center justify-between mb-md">
        <h2 className="section-title">{t("budget.overview")}</h2>
        <Button variant="ghost" size="sm">{t("budget.edit")}</Button>
      </div>
      <div className="space-y-md">
        {items.map((item, i) => (
          <BudgetProgressItem key={i} {...item} />
        ))}
      </div>
    </div>
  );
};
