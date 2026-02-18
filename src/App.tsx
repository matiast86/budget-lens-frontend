import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sidebar } from "./components/organisms/Sidebar";
import { AppHeader } from "./components/organisms/AppHeader";
import { DashboardPage } from "./pages/DashboardPage";
import { LedgerDetailPage } from "./pages/LedgerDetailPage";
import { LandingPage } from "./pages/LandingPage";
import { mockUser } from "./helpers/mocks/user-mocks";

const AppShell = () => {
  const { t } = useTranslation("ledger");
  const location = useLocation();
  const title =
    (location.state as { title?: string } | null)?.title ?? t("grid.title");

  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader userName={mockUser.name} title={title} />
        <Outlet />
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route element={<AppShell />}>
        <Route path="/dashboard" element={<DashboardPage />} />
        <Route path="/ledgers/:id" element={<LedgerDetailPage />} />
      </Route>
    </Routes>
  );
};

export default App;
