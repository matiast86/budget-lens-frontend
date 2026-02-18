import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import LanguageDetector from "i18next-browser-languagedetector";
import enCommon from "./locales/en/common.json";
import enLedger from "./locales/en/ledger.json";
import esCommon from "./locales/es/common.json";
import esLedger from "./locales/es/ledger.json";

void i18n
  .use(LanguageDetector)
  .use(initReactI18next)
  .init({
    resources: {
      en: { common: enCommon, ledger: enLedger },
      es: { common: esCommon, ledger: esLedger },
    },
    supportedLngs: ["en", "es"],
    fallbackLng: "en",
    defaultNS: "common",
    ns: ["common", "ledger"],
    detection: {
      order: ["localStorage", "navigator"],
      caches: ["localStorage"],
    },
    interpolation: {
      escapeValue: false,
    },
  });

export default i18n;
