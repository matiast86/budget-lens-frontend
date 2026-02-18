import { NavLink, Link } from "react-router-dom";
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  PieChart,
  Settings,
  ChevronDown,
} from "lucide-react";
import type { NavItem } from "../../types";

const navItems: NavItem[] = [
  { icon: LayoutDashboard, label: "Dashboard", to: "/dashboard" },
  { icon: Wallet, label: "Transactions", to: "/transactions" },
  { icon: PieChart, label: "Budgets", to: "/budgets" },
  { icon: TrendingUp, label: "Analytics", to: "/analytics" },
  { icon: Settings, label: "Settings", to: "/settings" },
];

export const Sidebar = () => {
  return (
    <aside className="hidden lg:flex lg:flex-col w-64 bg-white border-r border-slate-200">
      <Link
        to="/"
        className="flex items-center gap-sm px-lg py-lg border-b border-slate-100 hover:bg-slate-50 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
          <span className="text-white text-sm font-bold">BL</span>
        </div>
        <span className="text-lg font-semibold text-slate-900">Budget Lens</span>
      </Link>

      <nav className="flex-1 px-sm py-md space-y-xs">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.to}
            end
            className={({ isActive }) =>
              `flex items-center gap-sm px-md py-sm rounded-md text-sm font-medium transition-colors ${
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      <div className="p-md border-t border-slate-100">
        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center">
            <span className="text-xs font-medium text-slate-600">JD</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-slate-900 truncate">Jane Doe</p>
            <p className="text-xs text-slate-500 truncate">jane@email.com</p>
          </div>
          <ChevronDown className="w-4 h-4 text-slate-400" />
        </div>
      </div>
    </aside>
  );
};
