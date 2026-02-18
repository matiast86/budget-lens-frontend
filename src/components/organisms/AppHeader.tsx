import { Bell, Search } from "lucide-react";
import { Button } from "../atoms/Button";

interface AppHeaderProps {
  userName: string;
  title?: string;
}

export function AppHeader({ userName, title = "Dashboard" }: AppHeaderProps) {
  const firstName = userName.split(" ")[0];

  return (
    <header className="flex items-center justify-between px-lg py-md bg-white border-b border-slate-200">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">{title}</h1>
        <p className="text-sm text-slate-500">
          Welcome back, {firstName}. Here are your ledgers.
        </p>
      </div>

      <div className="flex items-center gap-md">
        <div className="hidden md:flex items-center gap-sm bg-slate-100 rounded-md px-sm py-xs">
          <Search className="w-4 h-4 text-slate-400" />
          <input
            type="text"
            placeholder="Search ledgers..."
            className="bg-transparent text-sm text-slate-700 placeholder:text-slate-400 outline-none w-48"
          />
        </div>

        <button className="relative p-xs rounded-md hover:bg-slate-100 transition-colors">
          <Bell className="w-5 h-5 text-slate-600" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-expense-500 rounded-full" />
        </button>

        <Button variant="default">+ New Ledger</Button>
      </div>
    </header>
  );
}
