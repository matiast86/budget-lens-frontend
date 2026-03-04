import { useState } from "react";
import { Routes, Route, Outlet, useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useQueryClient, useMutation } from "@tanstack/react-query";
import { Sidebar } from "./components/organisms/Sidebar";
import { AppHeader } from "./components/organisms/AppHeader";
import { BottomTabBar } from "./components/organisms/BottomTabBar";
import { CreateLedgerModal } from "./components/organisms/CreateLedgerModal";
import { RequireAuth } from "./components/organisms/RequireAuth";
import { DashboardPage } from "./pages/DashboardPage";
import { LedgerDetailPage } from "./pages/LedgerDetailPage";
import { TransactionsPage } from "./pages/TransactionsPage";
import { CashflowPage } from "./pages/CashflowPage";
import { LandingPage } from "./pages/LandingPage";
import { RegisterPage } from "./pages/RegisterPage";
import { LoginPage } from "./pages/LoginPage";
import { useAuthStore } from "./stores/auth-store";
import { useCurrentUser } from "./hooks/use-current-user";
import { createLedger } from "./services/ledger-service";
import type { CreateLedgerFormData } from "./schemas/ledger.schema";

const AppShell = () => {
  const { t } = useTranslation("ledger");
  const location = useLocation();
  const title =
    (location.state as { title?: string } | null)?.title ?? t("grid.title");

  const queryClient = useQueryClient();
  const token = useAuthStore((s) => s.token);
  const currentUser = useCurrentUser();

  const [isCreateLedgerOpen, setIsCreateLedgerOpen] = useState(false);

  const createLedgerMutation = useMutation({
    mutationFn: (data: CreateLedgerFormData) => createLedger(data, token!),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: ["ledgers"] });
      setIsCreateLedgerOpen(false);
    },
  });

  return (
    <div className="flex h-screen bg-cream">
      {/* Sidebar — desktop only */}
      <div className="hidden lg:flex">
        <Sidebar />
      </div>

      {/* Main area */}
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader
          userName={currentUser?.name ?? ""}
          title={title}
          onNewLedger={() => setIsCreateLedgerOpen(true)}
        />
        {/* Extra bottom padding on mobile so content isn't hidden under BottomTabBar */}
        <div className="flex-1 overflow-y-auto pb-20 lg:pb-0">
          <Outlet />
        </div>
      </div>

      {/* Bottom tab bar — mobile only */}
      <BottomTabBar />

      {/* Modals */}
      <CreateLedgerModal
        open={isCreateLedgerOpen}
        onClose={() => setIsCreateLedgerOpen(false)}
        onSubmit={(data) => createLedgerMutation.mutate(data)}
      />
    </div>
  );
};

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<LandingPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/login" element={<LoginPage />} />
      <Route element={<RequireAuth />}>
        <Route element={<AppShell />}>
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/transactions" element={<TransactionsPage />} />
          <Route path="/cashflow" element={<CashflowPage />} />
          <Route path="/ledgers/:id" element={<LedgerDetailPage />} />
        </Route>
      </Route>
    </Routes>
  );
};

export default App;
