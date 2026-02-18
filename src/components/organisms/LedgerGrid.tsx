import { PlusCircle } from "lucide-react";
import { LedgerCard } from "../molecules/LedgerCard";
import { Button } from "../atoms/Button";
import type { LedgerDashboardResponseDto } from "../../types";

interface LedgerGridProps {
  ledgers: LedgerDashboardResponseDto[];
}

export const LedgerGrid = ({ ledgers }: LedgerGridProps) => {
  return (
    <section>
      <div className="flex items-center justify-between mb-md">
        <div>
          <h2 className="section-title">My Ledgers</h2>
          <p className="text-sm text-slate-500">
            {ledgers.length} {ledgers.length === 1 ? "ledger" : "ledgers"} in your account
          </p>
        </div>
        <Button variant="default" size="sm">
          <PlusCircle className="w-4 h-4" />
          New Ledger
        </Button>
      </div>

      {ledgers.length === 0 ? (
        <div className="card flex flex-col items-center justify-center py-3xl text-center">
          <PlusCircle className="w-10 h-10 text-slate-300 mb-md" />
          <p className="section-title mb-xs">No ledgers yet</p>
          <p className="text-sm text-slate-500 mb-lg">
            Create your first ledger to start tracking your finances.
          </p>
          <Button variant="default">Create Ledger</Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-md">
          {ledgers.map((ledger) => (
            <LedgerCard key={ledger.id} ledger={ledger} />
          ))}
        </div>
      )}
    </section>
  );
}
