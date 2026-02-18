import { LedgerGrid } from "../components/organisms/LedgerGrid";
import { mockUser } from "../helpers/mocks/user-mocks";

export const DashboardPage = () => {
  return (
    <main className="flex-1 overflow-y-auto p-lg">
      <LedgerGrid ledgers={mockUser.ledgers} />
    </main>
  );
};
