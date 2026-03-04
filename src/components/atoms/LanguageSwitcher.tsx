import type React from "react";
import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";

export const LanguageSwitcher = () => {
  const { i18n, t } = useTranslation("common");
  const current = i18n.language.startsWith("es") ? "es" : "en";

  return (
    <div
      className="flex items-center rounded-full border border-stone-200 overflow-hidden text-xs font-semibold"
      role="group"
      aria-label={t("lang.selector")}
    >
      <button
        onClick={() => i18n.changeLanguage("en")}
        className={cn(
          "px-sm py-xs transition-colors leading-none",
          current === "en"
            ? "bg-primary-600 text-white"
            : "text-stone-500 hover:bg-stone-100 hover:text-stone-700",
        )}
        aria-pressed={current === "en"}
        aria-label={t("lang.en")}
      >
        EN
      </button>
      <button
        onClick={() => i18n.changeLanguage("es")}
        className={cn(
          "px-sm py-xs transition-colors leading-none",
          current === "es"
            ? "bg-primary-600 text-white"
            : "text-stone-500 hover:bg-stone-100 hover:text-stone-700",
        )}
        aria-pressed={current === "es"}
        aria-label={t("lang.es")}
      >
        ES
      </button>
    </div>
  );
};
