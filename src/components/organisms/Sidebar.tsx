import type React from "react";
import { NavLink, Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import {
  LayoutDashboard,
  Wallet,
  Banknote,
  HandCoins,
  PieChart,
  TrendingUp,
  Settings,
} from "lucide-react";
import type { NavItem } from "../../types";
import { cn } from "../../utils/cn";
import { useCurrentUser } from "../../hooks/use-current-user";

const NAV_ITEM_CONFIG: { icon: React.ElementType; key: string; to: string }[] = [
  { icon: LayoutDashboard, key: "dashboard",    to: "/dashboard" },
  { icon: Wallet,          key: "transactions", to: "/transactions" },
  { icon: Banknote,        key: "cashflow",     to: "/cashflow" },
  { icon: HandCoins,       key: "debts",        to: "/debts" },
  { icon: PieChart,        key: "budgets",      to: "/budgets" },
  { icon: TrendingUp,      key: "analytics",    to: "/analytics" },
  { icon: Settings,        key: "settings",     to: "/settings" },
];

export const Sidebar = () => {
  const { t } = useTranslation("common");
  const currentUser = useCurrentUser();

  const initials = currentUser?.name
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase() ?? "?";

  const navItems: NavItem[] = NAV_ITEM_CONFIG.map((item) => ({
    icon: item.icon,
    label: t(`nav.${item.key}`),
    to: item.to,
  }));

  return (
    <aside className="w-64 bg-white border-r border-stone-100 flex flex-col h-full">
      {/* Logo */}
      <Link
        to="/"
        className="flex items-center gap-sm px-lg py-lg border-b border-stone-100 hover:bg-stone-50 transition-colors"
      >
        <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center">
          <span className="text-white text-sm font-bold">BL</span>
        </div>
        <span className="text-lg font-semibold text-stone-900">{t("app.name")}</span>
      </Link>

      {/* Nav */}
      <nav className="flex-1 px-sm py-md space-y-xs" aria-label={t("nav.sidebar")}>
        {navItems.map((item) => (
          <NavLink
            key={item.to}
            to={item.to}
            end
            className={({ isActive }) =>
              cn(
                "flex items-center gap-sm px-md py-sm rounded-lg text-sm font-medium transition-colors",
                isActive
                  ? "bg-primary-50 text-primary-700"
                  : "text-stone-600 hover:bg-stone-50 hover:text-stone-900",
              )
            }
          >
            <item.icon className="w-5 h-5" />
            {item.label}
          </NavLink>
        ))}
      </nav>

      {/* User info */}
      <div className="p-md border-t border-stone-100">
        <div className="flex items-center gap-sm">
          <div className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center">
            <span className="text-xs font-semibold text-primary-700">{initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-stone-900 truncate">
              {currentUser?.name ?? "—"}
            </p>
            <p className="text-xs text-stone-500 truncate">
              {currentUser?.email ?? ""}
            </p>
          </div>
        </div>
      </div>
    </aside>
  );
};
