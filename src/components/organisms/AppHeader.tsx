import { useTranslation } from "react-i18next";
import { Bell, Search } from "lucide-react";
import { Button } from "../atoms/Button";
import { LanguageSwitcher } from "../atoms/LanguageSwitcher";

interface AppHeaderProps {
  userName: string;
  title?: string;
  onNewLedger?: () => void;
}

export const AppHeader = ({ userName, title, onNewLedger }: AppHeaderProps) => {
  const { t } = useTranslation("common");
  const firstName = userName.split(" ")[0];
  const initials = userName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  return (
    <header className="flex items-center justify-between px-lg py-sm bg-white border-b border-stone-100">
      {/* Mobile: app logo / Desktop: page title */}
      <div className="flex items-center gap-sm">
        {/* Logo — mobile only */}
        <div className="lg:hidden flex items-center gap-xs">
          <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
            <span className="text-white text-xs font-bold">BL</span>
          </div>
          <span className="text-base font-semibold text-stone-900">{t("app.name")}</span>
        </div>

        {/* Page title — desktop only */}
        <div className="hidden lg:block">
          <h1 className="text-2xl font-semibold text-stone-900">{title}</h1>
          <p className="text-sm text-stone-500">
            {t("header.welcomeBack", { name: firstName })}
          </p>
        </div>
      </div>

      <div className="flex items-center gap-sm md:gap-md">
        {/* Search — desktop only */}
        <div className="hidden md:flex items-center gap-sm bg-stone-100 rounded-md px-sm py-xs">
          <Search className="w-4 h-4 text-stone-400" />
          <input
            type="text"
            placeholder={t("header.searchPlaceholder")}
            className="bg-transparent text-sm text-stone-700 placeholder:text-stone-400 outline-none w-48"
          />
        </div>

        {/* Bell — desktop only */}
        <button
          className="hidden md:block relative p-xs rounded-md hover:bg-stone-100 transition-colors"
          aria-label={t("header.notifications")}
        >
          <Bell className="w-5 h-5 text-stone-600" />
          <span className="absolute top-0 right-0 w-2 h-2 bg-expense-400 rounded-full" />
        </button>

        {/* New Ledger — desktop only */}
        <div className="hidden md:block">
          <Button variant="default" size="sm" onClick={onNewLedger}>{t("header.newLedger")}</Button>
        </div>

        {/* Language switcher — always visible */}
        <LanguageSwitcher />

        {/* Avatar — always visible */}
        <button
          className="w-8 h-8 rounded-full bg-primary-100 flex items-center justify-center hover:bg-primary-200 transition-colors"
          aria-label={t("header.profileMenu")}
        >
          <span className="text-xs font-semibold text-primary-700">{initials}</span>
        </button>
      </div>
    </header>
  );
};
