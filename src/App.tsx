import { Sidebar } from "./components/organisms/Sidebar";
import { AppHeader } from "./components/organisms/AppHeader";
import { DashboardPage } from "./pages/DashboardPage";

function App() {
  return (
    <div className="flex h-screen bg-slate-50">
      <Sidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AppHeader userName="Jane Doe" />
        <DashboardPage />
      </div>
    </div>
  );
}

export default App;
