import { useTranslation } from "react-i18next";
import { PlusCircle } from "lucide-react";
import { LedgerCard } from "../molecules/LedgerCard";
import { Button } from "../atoms/Button";
import type { LedgerDashboardResponseDto } from "../../types";

interface LedgerGridProps {
  ledgers: LedgerDashboardResponseDto[];
}

export const LedgerGrid = ({ ledgers }: LedgerGridProps) => {
  const { t } = useTranslation("ledger");

  return (
    <section>
      <div className="flex items-center justify-between mb-md">
        <div>
          <h2 className="section-title">{t("grid.title")}</h2>
          <p className="text-sm text-stone-500">
            {t("grid.count", { count: ledgers.length })}
          </p>
        </div>
        <Button variant="default" size="sm">
          <PlusCircle className="w-4 h-4" />
          {t("grid.newLedger")}
        </Button>
      </div>

      {ledgers.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-3xl text-center">
          <PlusCircle className="w-10 h-10 text-stone-300 mb-md" />
          <p className="section-title mb-xs">{t("grid.empty.title")}</p>
          <p className="text-sm text-stone-500 mb-lg">
            {t("grid.empty.body")}
          </p>
          <Button variant="default">{t("grid.empty.action")}</Button>
        </div>
      ) : (
        <div className="flex gap-md overflow-x-auto scrollbar-hide pb-sm lg:grid lg:grid-cols-2 lg:overflow-visible xl:grid-cols-3">
          {ledgers.map((ledger) => (
            <LedgerCard key={ledger.id} ledger={ledger} />
          ))}
        </div>
      )}
    </section>
  );
};
