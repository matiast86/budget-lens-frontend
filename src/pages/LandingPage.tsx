import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import type React from "react";
import {
  BarChart3,
  Users,
  TrendingUp,
  CreditCard,
  Layers,
  ArrowRight,
  Check,
  PieChart,
  Globe,
  ShieldCheck,
} from "lucide-react";
import { Button } from "../components/atoms/Button";
import { LanguageSwitcher } from "../components/atoms/LanguageSwitcher";

// Static (non-translatable) structural data stays at module level

const FEATURE_CONFIG: {
  key: string;
  icon: React.ElementType;
  colorBg: string;
  colorText: string;
}[] = [
  { key: "multiLedger",    icon: Layers,    colorBg: "bg-primary-100", colorText: "text-primary-600" },
  { key: "categoryBudgets",icon: PieChart,  colorBg: "bg-income-100",  colorText: "text-income-600" },
  { key: "inflation",      icon: TrendingUp,colorBg: "bg-purple-100",  colorText: "text-purple-600" },
  { key: "collaborative",  icon: Users,     colorBg: "bg-warning-100", colorText: "text-warning-600" },
  { key: "multiCurrency",  icon: Globe,     colorBg: "bg-expense-100", colorText: "text-expense-600" },
  { key: "paymentMethod",  icon: CreditCard,colorBg: "bg-primary-100", colorText: "text-primary-600" },
];

const STEP_CONFIG: { key: string; number: string }[] = [
  { key: "create", number: "01" },
  { key: "add",    number: "02" },
  { key: "gain",   number: "03" },
];

const TRUST_CONFIG: {
  key: string;
  icon: React.ElementType;
  color: string;
  bg: string;
}[] = [
  { key: "secure",   icon: ShieldCheck, color: "text-income-600",  bg: "bg-income-50" },
  { key: "inflation",icon: TrendingUp,  color: "text-primary-600", bg: "bg-primary-50" },
  { key: "teams",    icon: Users,       color: "text-primary-600", bg: "bg-primary-50" },
];

// The mockup shows the product's Level 1 view — one big "what's left" number
// with a plain-language pace verdict — not a feature grid.
const MOCK_TRANSACTIONS: { key: string; amount: string; type: "income" | "expense" }[] = [
  { key: "txSuper",  amount: "$47.320",    type: "expense" },
  { key: "txIncome", amount: "$1.850.000", type: "income" },
];

export const LandingPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation("common");

  const mockSidebarItems = [
    t("landing.mockup.myLedgers"),
    t("nav.transactions"),
    t("nav.budgets"),
    t("nav.analytics"),
  ];

  const stats = [
    t("landing.stats.ledgerTypes", { returnObjects: true }) as { value: string; label: string },
    t("landing.stats.currencies",  { returnObjects: true }) as { value: string; label: string },
    t("landing.stats.inflation",   { returnObjects: true }) as { value: string; label: string },
    t("landing.stats.budget",      { returnObjects: true }) as { value: string; label: string },
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* ── NAVIGATION ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-stone-200/60">
        <div className="max-w-6xl mx-auto px-lg flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-sm">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-sm">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-stone-900 tracking-tight">
              Budget <span className="text-primary-600">Lens</span>
            </span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-xl text-sm font-medium text-stone-600">
            <a href="#features" className="hover:text-primary-600 transition-colors">
              {t("landing.nav.features")}
            </a>
            <a href="#how-it-works" className="hover:text-primary-600 transition-colors">
              {t("landing.nav.howItWorks")}
            </a>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-sm">
            <LanguageSwitcher />
            <Button variant="ghost" size="sm" onClick={() => navigate("/login")}>
              {t("landing.nav.signIn")}
            </Button>
            <Button size="sm" onClick={() => navigate("/register")}>
              {t("landing.nav.getStarted")}
            </Button>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-income-50 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-100/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-40 w-96 h-96 rounded-full bg-income-100/30 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-lg pt-3xl pb-xl text-center">
          {/* Pill tag */}
          <div className="inline-flex items-center gap-xs px-md py-xs rounded-full bg-primary-100 text-primary-700 text-xs font-semibold mb-lg border border-primary-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            {t("landing.hero.pill")}
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-extrabold text-stone-900 leading-tight tracking-tight mb-md">
            {t("landing.hero.headline1")}
            <br />
            <span className="text-primary-600">{t("landing.hero.headline2")}</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-stone-500 max-w-2xl mx-auto mb-xl leading-relaxed">
            {t("landing.hero.subheadline")}
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-sm mb-md">
            <Button size="lg" onClick={() => navigate("/register")}>
              {t("landing.hero.cta1")}
              <ArrowRight className="w-4 h-4 ml-xs" />
            </Button>
            <Button variant="outline" size="lg" onClick={() => navigate("/dashboard")}>
              {t("landing.hero.cta2")}
            </Button>
          </div>

          {/* Trust line — plain language, no jargon */}
          <p className="text-sm text-stone-400 mb-3xl">{t("landing.hero.trustLine")}</p>

          {/* App mockup */}
          <div className="relative">
            {/* Glow under mockup */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-primary-400/20 blur-2xl rounded-full" />

            <div className="rounded-2xl border border-stone-200/80 shadow-dropdown overflow-hidden bg-white relative">
              {/* Browser chrome */}
              <div className="bg-stone-100 border-b border-stone-200 px-md py-sm flex items-center gap-sm">
                <div className="flex gap-xs">
                  <span className="w-3 h-3 rounded-full bg-stone-300" />
                  <span className="w-3 h-3 rounded-full bg-stone-300" />
                  <span className="w-3 h-3 rounded-full bg-stone-300" />
                </div>
                <div className="flex-1 bg-white rounded border border-stone-200 px-md py-xs text-xs text-stone-400 text-center">
                  {t("landing.mockup.url")}
                </div>
              </div>

              {/* App chrome */}
              <div className="flex h-64 text-left">
                {/* Sidebar mock */}
                <div className="w-44 bg-white border-r border-stone-100 p-sm hidden md:flex flex-col gap-xs shrink-0">
                  <div className="flex items-center gap-xs px-sm py-sm mb-xs">
                    <div className="w-6 h-6 rounded-md bg-primary-600 flex items-center justify-center">
                      <BarChart3 className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-bold text-stone-900">
                      {t("app.name")}
                    </span>
                  </div>
                  {mockSidebarItems.map((item, i) => (
                    <div
                      key={item}
                      className={`flex items-center gap-xs px-sm py-1.5 rounded-md text-xs font-medium ${
                        i === 0 ? "bg-primary-50 text-primary-700" : "text-stone-400"
                      }`}
                    >
                      <span
                        className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-primary-500" : "bg-stone-300"}`}
                      />
                      {item}
                    </div>
                  ))}
                </div>

                {/* Main area — the product's Level 1 view */}
                <div className="flex-1 bg-cream p-md overflow-hidden">
                  {/* Hero number + plain-language pace verdict */}
                  <div className="bg-white rounded-lg border border-stone-200 p-md mb-sm">
                    <p className="text-[10px] font-medium text-stone-500">
                      {t("landing.mockup.leftThisMonth")}
                    </p>
                    <p className="financial-amount text-2xl text-stone-900 leading-none mt-0.5">
                      $565.500
                    </p>
                    <p className="text-[9px] text-stone-400 mt-xs">
                      {t("landing.mockup.leftDetail")}
                    </p>
                    <div className="inline-flex items-center gap-xs mt-sm px-sm py-0.5 rounded-full bg-income-50 border border-income-100">
                      <span className="text-income-600 text-[9px]" aria-hidden="true">●</span>
                      <span className="text-[9px] font-semibold text-income-700">
                        {t("landing.mockup.onTrack")}
                      </span>
                      <span className="text-[9px] text-income-600/80">
                        {t("landing.mockup.onTrackDetail")}
                      </span>
                    </div>
                  </div>

                  {/* Recent transactions — expenses in plain ink, income green, +/− sign */}
                  <div className="bg-white rounded-lg border border-stone-200 p-sm">
                    <p className="text-[10px] font-semibold text-stone-700 mb-xs">
                      {t("landing.mockup.recentTransactions")}
                    </p>
                    <div className="space-y-xs">
                      {MOCK_TRANSACTIONS.map((tx) => (
                        <div key={tx.key} className="flex items-center justify-between">
                          <div className="flex items-center gap-xs">
                            <span className="w-4 h-4 rounded-full bg-stone-100 flex items-center justify-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-stone-400" />
                            </span>
                            <span className="text-[9px] text-stone-600">
                              {t(`landing.mockup.${tx.key}`)}
                            </span>
                          </div>
                          <span
                            className={`text-[9px] font-semibold ${
                              tx.type === "income" ? "text-income-600" : "text-stone-900"
                            }`}
                          >
                            {tx.type === "income" ? "+" : "−"}{tx.amount}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── SOCIAL PROOF STRIP ─────────────────────────────────── */}
      <section className="border-y border-stone-200 bg-white py-xl">
        <div className="max-w-4xl mx-auto px-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-lg text-center">
            {stats.map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-stone-900 tabular-nums">
                  {stat.value}
                </p>
                <p className="text-sm text-stone-500 mt-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section id="features" className="py-3xl bg-cream">
        <div className="max-w-6xl mx-auto px-lg">
          <div className="text-center mb-2xl">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-widest mb-sm">
              {t("landing.features.sectionLabel")}
            </p>
            <h2 className="text-3xl font-bold text-stone-900 mb-md">
              {t("landing.features.heading")}
            </h2>
            <p className="text-stone-500 max-w-xl mx-auto leading-relaxed">
              {t("landing.features.subheading")}
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
            {FEATURE_CONFIG.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.key}
                  className="card hover:shadow-card-hover transition-all duration-200"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-md ${feature.colorBg}`}
                  >
                    <Icon className={`w-5 h-5 ${feature.colorText}`} />
                  </div>
                  <h3 className="text-base font-semibold text-stone-900 mb-xs">
                    {t(`landing.features.${feature.key}.title`)}
                  </h3>
                  <p className="text-sm text-stone-500 leading-relaxed">
                    {t(`landing.features.${feature.key}.desc`)}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ───────────────────────────────────────── */}
      <section id="how-it-works" className="py-3xl bg-white">
        <div className="max-w-6xl mx-auto px-lg">
          <div className="text-center mb-2xl">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-widest mb-sm">
              {t("landing.howItWorks.sectionLabel")}
            </p>
            <h2 className="text-3xl font-bold text-stone-900">
              {t("landing.howItWorks.heading")}
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-stone-200" />

            {STEP_CONFIG.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-md relative z-10 shadow-sm">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-stone-900 mb-sm">
                  {t(`landing.howItWorks.${step.key}.title`)}
                </h3>
                <p className="text-sm text-stone-500 leading-relaxed max-w-xs mx-auto">
                  {t(`landing.howItWorks.${step.key}.desc`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ────────────────────────────────────────── */}
      <section className="py-xl bg-cream border-y border-stone-200">
        <div className="max-w-4xl mx-auto px-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {TRUST_CONFIG.map((item) => {
              const Icon = item.icon;
              return (
                <div key={item.key} className="flex items-start gap-md">
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.bg}`}
                  >
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-stone-900 mb-xs">
                      {t(`landing.trust.${item.key}.title`)}
                    </p>
                    <p className="text-sm text-stone-500 leading-relaxed">
                      {t(`landing.trust.${item.key}.body`)}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ────────────────────────────────────────── */}
      <section className="py-3xl bg-gradient-to-br from-primary-800 to-primary-600">
        <div className="max-w-3xl mx-auto px-lg text-center">
          <h2 className="text-3xl font-bold text-white mb-md">
            {t("landing.cta.heading")}
          </h2>
          <p className="text-primary-200 text-lg mb-xl leading-relaxed">
            {t("landing.cta.body")}
          </p>

          <button
            onClick={() => navigate("/register")}
            className="inline-flex items-center gap-sm px-xl py-md bg-white text-primary-700 font-semibold rounded-xl shadow-card hover:bg-primary-50 active:bg-primary-100 transition-colors text-base"
          >
            {t("landing.cta.button")}
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="mt-lg flex flex-wrap items-center justify-center gap-xl text-primary-200 text-sm">
            {[
              t("landing.cta.noCreditCard"),
              t("landing.cta.freeToUse"),
              t("landing.cta.cancelAnytime"),
            ].map((item) => (
              <div key={item} className="flex items-center gap-xs">
                <Check className="w-4 h-4" />
                {item}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="bg-stone-900 py-xl">
        <div className="max-w-6xl mx-auto px-lg flex flex-col md:flex-row items-center justify-between gap-md">
          <div className="flex items-center gap-sm">
            <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">
              {t("app.name")}
            </span>
          </div>
          <p className="text-xs text-stone-500 text-center">
            {t("landing.footer.copyright")}
          </p>
          <div className="flex items-center gap-lg text-xs text-stone-500">
            <a href="#" className="hover:text-stone-300 transition-colors">
              {t("landing.footer.privacy")}
            </a>
            <a href="#" className="hover:text-stone-300 transition-colors">
              {t("landing.footer.terms")}
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
