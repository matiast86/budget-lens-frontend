import { useTranslation } from "react-i18next";
import { ArrowUpRight, ArrowDownRight } from "lucide-react";
import type { StatCardData } from "../../types";

export const StatCard = ({ label, value, change, trend }: StatCardData) => {
  const { t } = useTranslation("common");

  return (
    <div className="card">
      <p className="label-muted mb-xs">{label}</p>
      <p className="text-3xl financial-amount text-slate-900">{value}</p>
      <div className="flex items-center gap-xs mt-sm">
        {trend === "up" ? (
          <ArrowUpRight className="w-4 h-4 text-income-500" />
        ) : (
          <ArrowDownRight className="w-4 h-4 text-expense-500" />
        )}
        <span
          className={`text-sm font-medium tabular-nums ${
            trend === "up" ? "text-income-600" : "text-expense-600"
          }`}
        >
          {change}
        </span>
        <span className="text-xs text-slate-400">{t("stat.vsLastMonth")}</span>
      </div>
    </div>
  );
};
