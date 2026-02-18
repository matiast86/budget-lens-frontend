import { Routes, Route, useLocation } from "react-router-dom";
import { Sidebar } from "./components/organisms/Sidebar";
import { AppHeader } from "./components/organisms/AppHeader";
import { DashboardPage } from "./pages/DashboardPage";
import { LedgerDetailPage } from "./pages/LedgerDetailPage";
import { mockUser } from "./helpers/mocks/user-mocks";

const App = () => {
  const location = useLocation();
  const title =
    (location.state as { title?: string } | null)?.title ?? "My Ledgers";

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader userName={mockUser.name} title={title} />
        <Routes>
          <Route path="/" element={<DashboardPage />} />
          <Route path="/ledgers/:id" element={<LedgerDetailPage />} />
        </Routes>
      </div>
    </div>
  );
}

export default App;
