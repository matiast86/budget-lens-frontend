import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LayoutDashboard } from "lucide-react";
import { CategoriesTable } from "../components/molecules/CategoriesTable";
import { CollaboratorsTable } from "../components/molecules/CollaboratorsTable";
import { GroupsTable } from "../components/molecules/GroupsTable";
import { PaymentMethodsTable } from "../components/molecules/PaymentMethodsTable";
import { LedgerDetailHeader } from "../components/organisms/LedgerDetailHeader";
import { TransactionTable } from "../components/organisms/TransactionTable";
import { mockLedger } from "../helpers/mocks/ledger-mocks";
import { mockUser } from "../helpers/mocks/user-mocks";
import { cn } from "../utils/cn";
import type { LedgerDetailTab, LedgerResponseDto } from "../types";

// ---------------------------------------------------------------------------
// Tab config keys (non-translatable structural data stays at module level)
// ---------------------------------------------------------------------------

const TAB_CONFIG: {
  id: LedgerDetailTab;
  labelKey: string;
  count: (l: LedgerResponseDto) => number;
}[] = [
  { id: "transactions", labelKey: "detail.tab.transactions", count: (l) => l.transactions.length },
  { id: "categories", labelKey: "detail.tab.categories", count: (l) => l.categories.length },
  { id: "paymentMethods", labelKey: "detail.tab.paymentMethods", count: (l) => l.paymentMethods.length },
  { id: "groups", labelKey: "detail.tab.groups", count: (l) => l.groups.length },
  { id: "collaborators", labelKey: "detail.tab.collaborators", count: (l) => l.collaborations.length },
];

// ---------------------------------------------------------------------------
// Page
// ---------------------------------------------------------------------------

export const LedgerDetailPage = () => {
  const { t } = useTranslation("ledger");
  const { id } = useParams<{ id: string }>();
  const [activeTab, setActiveTab] = useState<LedgerDetailTab>("transactions");

  // Check if the id matches any ledger in the user's dashboard
  const ledgerSummary = mockUser.ledgers.find((l) => String(l.id) === id);

  // Full detail mock is only available for ledger id "1"
  // TODO: replace with useQuery fetching GET /ledgers/:id
  const ledger = String(mockLedger.id) === id ? mockLedger : null;

  // Unknown ledger — not in the user's list at all
  if (!ledgerSummary) {
    return (
      <main className="flex-1 overflow-y-auto p-lg">
        <div className="flex flex-col items-center justify-center h-full gap-md text-center">
          <p className="text-4xl">🔍</p>
          <h2 className="text-xl font-semibold text-stone-900">{t("detail.notFound.title")}</h2>
          <p className="text-sm text-stone-500 max-w-xs">
            {t("detail.notFound.body", { id })}
          </p>
          <Link
            to="/dashboard"
            className="flex items-center gap-xs text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <LayoutDashboard className="w-4 h-4" />
            {t("detail.notFound.back")}
          </Link>
        </div>
      </main>
    );
  }

  // Ledger exists in the dashboard but has no detail mock yet
  if (!ledger) {
    return (
      <main className="flex-1 overflow-y-auto p-lg">
        <div className="flex flex-col items-center justify-center h-full gap-md text-center">
          <p className="text-4xl">🚧</p>
          <h2 className="text-xl font-semibold text-stone-900">{ledgerSummary.name}</h2>
          <p className="text-sm text-stone-500 max-w-xs">
            {t("detail.unavailable.body")}
          </p>
          <Link
            to="/dashboard"
            className="flex items-center gap-xs text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            <LayoutDashboard className="w-4 h-4" />
            {t("detail.unavailable.back")}
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <LedgerDetailHeader ledger={ledger} />

      {/* Tab bar */}
      <div className="bg-white border-b border-stone-200 px-lg overflow-x-auto scrollbar-hide">
        <nav className="flex gap-xs -mb-px min-w-max">
          {TAB_CONFIG.map((tab) => {
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  "flex items-center gap-xs px-md py-sm text-sm font-medium border-b-2 transition-colors",
                  isActive
                    ? "border-primary-500 text-primary-700"
                    : "border-transparent text-stone-500 hover:text-stone-800 hover:border-stone-300",
                )}
              >
                {t(tab.labelKey)}
                <span
                  className={cn(
                    "inline-flex items-center justify-center rounded-full text-xs font-semibold w-5 h-5",
                    isActive
                      ? "bg-primary-100 text-primary-700"
                      : "bg-stone-100 text-stone-500",
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
