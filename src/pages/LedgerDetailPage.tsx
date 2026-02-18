import { useState } from "react";
import { CategoriesTable } from "../components/molecules/CategoriesTable";
import { CollaboratorsTable } from "../components/molecules/CollaboratorsTable";
import { GroupsTable } from "../components/molecules/GroupsTable";
import { PaymentMethodsTable } from "../components/molecules/PaymentMethodsTable";
import { LedgerDetailHeader } from "../components/organisms/LedgerDetailHeader";
import { TransactionTable } from "../components/organisms/TransactionTable";
import { mockLedger } from "../helpers/mocks/ledger-mocks";
import { cn } from "../utils/cn";
import type { LedgerDetailTab, LedgerResponseDto } from "../types";

// ---------------------------------------------------------------------------
// Tab config
// ---------------------------------------------------------------------------

const TABS: {
  id: LedgerDetailTab;
  label: string;
  count: (l: LedgerResponseDto) => number;
}[] = [
  {
    id: "transactions",
    label: "Transactions",
    count: (l) => l.transactions.length,
  },
  { id: "categories", label: "Categories", count: (l) => l.categories.length },
  {
    id: "paymentMethods",
    label: "Payment Methods",
    count: (l) => l.paymentMethods.length,
  },
  { id: "groups", label: "Groups", count: (l) => l.groups.length },
  {
    id: "collaborators",
    label: "Collaborators",
    count: (l) => l.collaborations.length,
  },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export const LedgerDetailPage = () => {
  // TODO: replace mockLedger with useQuery fetching GET /ledgers/:id
  const [activeTab, setActiveTab] = useState<LedgerDetailTab>("transactions");
  const ledger = mockLedger;

  return (
    <main className="flex-1 overflow-y-auto">
      <LedgerDetailHeader ledger={ledger} />

      {/* Tab bar */}
      <div className="bg-white border-b border-slate-200 px-lg">
        <nav className="flex gap-xs -mb-px">
          {TABS.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-xs px-md py-sm text-sm font-medium border-b-2 transition-colors",
                  isActive
                    ? "border-primary-500 text-primary-700"
                    : "border-transparent text-slate-500 hover:text-slate-800 hover:border-slate-300",
                )}
              >
                {tab.label}
                <span
                  className={cn(
                    "inline-flex items-center justify-center rounded-full text-xs font-semibold w-5 h-5",
                    isActive
                      ? "bg-primary-100 text-primary-700"
                      : "bg-slate-100 text-slate-500",
                  )}
                >
                  {tab.count(ledger)}
                </span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab content */}
      <div className="p-lg">
        {activeTab === "transactions" && (
          <TransactionTable transactions={ledger.transactions} />
        )}
        {activeTab === "categories" && (
          <CategoriesTable categories={ledger.categories} />
        )}
        {activeTab === "paymentMethods" && (
          <PaymentMethodsTable methods={ledger.paymentMethods} />
        )}
        {activeTab === "groups" && <GroupsTable groups={ledger.groups} />}
        {activeTab === "collaborators" && (
          <CollaboratorsTable collaborations={ledger.collaborations} />
        )}
      </div>
    </main>
  );
};
