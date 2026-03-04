import type React from "react";
import { NavLink } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { LayoutDashboard, Wallet, Plus, Banknote, User } from "lucide-react";
import type { BottomTabItem } from "../../types";
import { cn } from "../../utils/cn";

const BOTTOM_TAB_CONFIG: { icon: React.ElementType; labelKey: string; path: string; isFab?: boolean }[] = [
  { icon: LayoutDashboard, labelKey: "nav.dashboard",    path: "/dashboard" },
  { icon: Wallet,          labelKey: "nav.transactions", path: "/transactions" },
  { icon: Plus,            labelKey: "nav.add",          path: "/add", isFab: true },
  { icon: Banknote,        labelKey: "nav.cashflow",     path: "/cashflow" },
  { icon: User,            labelKey: "nav.profile",      path: "/profile" },
];

export const BottomTabBar = () => {
  const { t } = useTranslation("common");

  const tabs: (BottomTabItem & { isFab?: boolean })[] = BOTTOM_TAB_CONFIG.map((cfg) => ({
    icon: cfg.icon,
    label: t(cfg.labelKey),
    path: cfg.path,
    isFab: cfg.isFab,
  }));

  return (
    <nav
      aria-label={t("nav.bottomBar")}
      className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-stone-100 flex items-center lg:hidden"
    >
      {tabs.map((tab) => {
        const Icon = tab.icon;

        if (tab.isFab) {
          return (
            <NavLink
              key={tab.path}
              to={tab.path}
              aria-label={tab.label}
              className="flex flex-col items-center justify-center flex-1 py-sm"
            >
              <div className="w-12 h-12 rounded-full bg-primary-600 flex items-center justify-center shadow-md -mt-4">
                <Icon className="w-5 h-5 text-white" />
              </div>
            </NavLink>
          );
        }

        return (
          <NavLink
            key={tab.path}
            to={tab.path}
            aria-label={tab.label}
            aria-current={undefined}
            className={({ isActive }) =>
              cn("tab-bar-item transition-colors", isActive && "active")
            }
          >
            {({ isActive }) => (
              <>
                <Icon className="w-5 h-5" />
                <span className={cn("text-xs font-medium", isActive ? "text-primary-600" : "text-stone-400")}>
                  {tab.label}
                </span>
              </>
            )}
          </NavLink>
        );
      })}
    </nav>
  );
};
