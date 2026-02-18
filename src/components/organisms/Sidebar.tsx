import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Wallet,
  TrendingUp,
  PieChart,
  Settings,
  ChevronDown,
} from "lucide-react";
import type React from "react";
import type { NavItem } from "../../types";
import { cn } from "../../utils/cn";

const NAV_ITEM_CONFIG: { icon: React.ElementType; key: keyof { dashboard: string; transactions: string; budgets: string; analytics: string; settings: string }; to: string }[] = [
  { icon: LayoutDashboard, key: "dashboard", to: "/dashboard" },
  { icon: Wallet, key: "transactions", to: "/transactions" },
  { icon: PieChart, key: "budgets", to: "/budgets" },
  { icon: TrendingUp, key: "analytics", to: "/analytics" },
  { icon: Settings, key: "settings", to: "/settings" },
];

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

export const Sidebar = ({ isOpen, onClose }: SidebarProps) => {
  const { t } = useTranslation("common");

  const navItems: NavItem[] = NAV_ITEM_CONFIG.map((item) => ({
    icon: item.icon,
    label: t(`nav.${item.key}`),
    to: item.to,
  }));

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-20 lg:hidden"
          onClick={onClose}
        />
      )}

      <aside
        className={cn(
          "w-64 bg-white border-r border-slate-200 flex flex-col",
          "fixed inset-y-0 left-0 z-30 transition-transform duration-300 ease-in-out",
          isOpen ? "translate-x-0" : "-translate-x-full",
          "lg:static lg:translate-x-0 lg:z-auto",
        )}
      >
        <Link
          to="/"
          className="flex items-center gap-sm px-lg py-lg border-b border-slate-100 hover:bg-slate-50 transition-colors"
        >
          <div className="w-8 h-8 rounded-lg bg-primary-500 flex items-center justify-center">
            <span className="text-white text-sm font-bold">BL</span>
          </div>
          <span className="text-lg font-semibold text-slate-900">{t("app.name")}</span>
        </Link>

        <nav className="flex-1 px-sm py-md space-y-xs">
          {navItems.map((item) => (
            <NavLink
              key={item.to}
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
    </>
  );
};
