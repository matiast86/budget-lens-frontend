import { useNavigate } from "react-router-dom";
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

const FEATURES = [
  {
    icon: Layers,
    title: "Multi-Ledger Management",
    description:
      "Create separate ledgers for personal, family, or business budgets. Keep every context organized and clearly separated.",
    colorBg: "bg-primary-100",
    colorText: "text-primary-600",
  },
  {
    icon: PieChart,
    title: "Category Budgets",
    description:
      "Set spending limits per category and track progress visually. Know exactly when you're close to overspending.",
    colorBg: "bg-income-100",
    colorText: "text-income-600",
  },
  {
    icon: TrendingUp,
    title: "Inflation-Adjusted Insights",
    description:
      "See your real purchasing power over time. Budget Lens adjusts amounts with CPI indexes so you know the true cost.",
    colorBg: "bg-accent-100",
    colorText: "text-accent-600",
  },
  {
    icon: Users,
    title: "Collaborative Budgeting",
    description:
      "Invite family members or teammates to shared ledgers. Everyone stays aligned with full visibility.",
    colorBg: "bg-warning-100",
    colorText: "text-warning-600",
  },
  {
    icon: Globe,
    title: "Multi-Currency Support",
    description:
      "Manage budgets in ARS and USD simultaneously. Built for mixed-currency economies and cross-border finances.",
    colorBg: "bg-expense-100",
    colorText: "text-expense-600",
  },
  {
    icon: CreditCard,
    title: "Payment Method Tracking",
    description:
      "Track cash, bank transfers, wallets, and credit cards separately for a truly complete spending picture.",
    colorBg: "bg-primary-100",
    colorText: "text-primary-600",
  },
];

const STEPS = [
  {
    number: "01",
    title: "Create a Ledger",
    description:
      "Set up a budget ledger for any context — personal finances, household, a project, or your team.",
  },
  {
    number: "02",
    title: "Add Transactions",
    description:
      "Log income and expenses with categories, payment methods, and installment support built in.",
  },
  {
    number: "03",
    title: "Gain Clarity",
    description:
      "See where your money goes with clear summaries, budget progress, and inflation-adjusted real amounts.",
  },
];

const MOCK_LEDGERS = [
  { name: "Personal 2025", currency: "ARS", income: "$1,240", expense: "$890" },
  { name: "Household", currency: "ARS", income: "$3,600", expense: "$2,100" },
  { name: "Side Project", currency: "USD", income: "$500", expense: "$200" },
];

const MOCK_TRANSACTIONS = [
  { label: "Supermarket", amount: "-$142.00", type: "expense" },
  { label: "Freelance", amount: "+$850.00", type: "income" },
  { label: "Utilities", amount: "-$68.50", type: "expense" },
];

export const LandingPage = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-white">
      {/* ── NAVIGATION ─────────────────────────────────────────── */}
      <nav className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-slate-200/60">
        <div className="max-w-6xl mx-auto px-lg flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center gap-sm">
            <div className="w-8 h-8 rounded-lg bg-primary-600 flex items-center justify-center shadow-sm">
              <BarChart3 className="w-4 h-4 text-white" />
            </div>
            <span className="text-base font-bold text-slate-900 tracking-tight">
              Budget <span className="text-primary-600">Lens</span>
            </span>
          </div>

          {/* Links */}
          <div className="hidden md:flex items-center gap-xl text-sm font-medium text-slate-600">
            <a
              href="#features"
              className="hover:text-primary-600 transition-colors"
            >
              Features
            </a>
            <a
              href="#how-it-works"
              className="hover:text-primary-600 transition-colors"
            >
              How it works
            </a>
          </div>

          {/* CTAs */}
          <div className="flex items-center gap-sm">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/dashboard")}
            >
              Sign in
            </Button>
            <Button size="sm" onClick={() => navigate("/dashboard")}>
              Get started
            </Button>
          </div>
        </div>
      </nav>

      {/* ── HERO ───────────────────────────────────────────────── */}
      <section className="relative overflow-hidden">
        {/* Gradient backdrop */}
        <div className="absolute inset-0 bg-gradient-to-br from-primary-50 via-white to-accent-50 pointer-events-none" />
        <div className="absolute -top-40 -right-40 w-96 h-96 rounded-full bg-primary-100/40 blur-3xl pointer-events-none" />
        <div className="absolute -bottom-20 -left-40 w-96 h-96 rounded-full bg-accent-100/30 blur-3xl pointer-events-none" />

        <div className="relative max-w-6xl mx-auto px-lg pt-3xl pb-xl text-center">
          {/* Pill tag */}
          <div className="inline-flex items-center gap-xs px-md py-xs rounded-full bg-primary-100 text-primary-700 text-xs font-semibold mb-lg border border-primary-200/60">
            <span className="w-1.5 h-1.5 rounded-full bg-primary-500" />
            Track · Analyze · Collaborate
          </div>

          {/* Headline */}
          <h1 className="text-5xl font-extrabold text-slate-900 leading-tight tracking-tight mb-md">
            Your finances,
            <br />
            <span className="text-primary-600">in perfect focus.</span>
          </h1>

          {/* Subheadline */}
          <p className="text-xl text-slate-500 max-w-2xl mx-auto mb-xl leading-relaxed">
            Budget Lens brings clarity to your money. Create ledgers, track
            every transaction, set category budgets, and see the real impact of
            inflation — all in one place.
          </p>

          {/* CTA buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-sm mb-3xl">
            <Button size="lg" onClick={() => navigate("/dashboard")}>
              Get started free
              <ArrowRight className="w-4 h-4 ml-xs" />
            </Button>
            <Button
              variant="outline"
              size="lg"
              onClick={() => navigate("/dashboard")}
            >
              View demo
            </Button>
          </div>

          {/* App mockup */}
          <div className="relative">
            {/* Glow under mockup */}
            <div className="absolute -bottom-8 left-1/2 -translate-x-1/2 w-3/4 h-16 bg-primary-400/20 blur-2xl rounded-full" />

            <div className="rounded-2xl border border-slate-200/80 shadow-dropdown overflow-hidden bg-white relative">
              {/* Browser chrome */}
              <div className="bg-slate-100 border-b border-slate-200 px-md py-sm flex items-center gap-sm">
                <div className="flex gap-xs">
                  <span className="w-3 h-3 rounded-full bg-slate-300" />
                  <span className="w-3 h-3 rounded-full bg-slate-300" />
                  <span className="w-3 h-3 rounded-full bg-slate-300" />
                </div>
                <div className="flex-1 bg-white rounded border border-slate-200 px-md py-xs text-xs text-slate-400 text-center">
                  app.budgetlens.io/dashboard
                </div>
              </div>

              {/* App chrome */}
              <div className="flex h-64 text-left">
                {/* Sidebar mock */}
                <div className="w-44 bg-white border-r border-slate-100 p-sm hidden md:flex flex-col gap-xs shrink-0">
                  <div className="flex items-center gap-xs px-sm py-sm mb-xs">
                    <div className="w-6 h-6 rounded-md bg-primary-600 flex items-center justify-center">
                      <BarChart3 className="w-3 h-3 text-white" />
                    </div>
                    <span className="text-xs font-bold text-slate-900">
                      Budget Lens
                    </span>
                  </div>
                  {["My Ledgers", "Transactions", "Budgets", "Analytics"].map(
                    (item, i) => (
                      <div
                        key={item}
                        className={`flex items-center gap-xs px-sm py-1.5 rounded-md text-xs font-medium ${
                          i === 0
                            ? "bg-primary-50 text-primary-700"
                            : "text-slate-400"
                        }`}
                      >
                        <span
                          className={`w-1.5 h-1.5 rounded-full ${i === 0 ? "bg-primary-500" : "bg-slate-300"}`}
                        />
                        {item}
                      </div>
                    )
                  )}
                </div>

                {/* Main area */}
                <div className="flex-1 bg-slate-50 p-md overflow-hidden">
                  <div className="flex items-center justify-between mb-sm">
                    <p className="text-xs font-semibold text-slate-800">
                      My Ledgers
                    </p>
                    <span className="text-[10px] px-sm py-0.5 rounded-full bg-primary-100 text-primary-600 font-medium">
                      3 active
                    </span>
                  </div>

                  {/* Ledger cards row */}
                  <div className="grid grid-cols-3 gap-sm mb-md">
                    {MOCK_LEDGERS.map((l) => (
                      <div
                        key={l.name}
                        className="bg-white rounded-lg border border-slate-200 p-sm"
                      >
                        <div className="flex items-center justify-between mb-xs">
                          <p className="text-[10px] font-semibold text-slate-800 truncate leading-tight">
                            {l.name}
                          </p>
                          <span className="text-[9px] px-1 py-0.5 rounded bg-primary-100 text-primary-600 font-bold shrink-0 ml-xs">
                            {l.currency}
                          </span>
                        </div>
                        <div className="space-y-0.5">
                          <div className="flex justify-between">
                            <span className="text-[9px] text-slate-400">
                              Income
                            </span>
                            <span className="text-[9px] font-semibold text-income-600">
                              {l.income}
                            </span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-[9px] text-slate-400">
                              Expenses
                            </span>
                            <span className="text-[9px] font-semibold text-expense-600">
                              {l.expense}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recent transactions strip */}
                  <div className="bg-white rounded-lg border border-slate-200 p-sm">
                    <p className="text-[10px] font-semibold text-slate-700 mb-xs">
                      Recent transactions
                    </p>
                    <div className="space-y-xs">
                      {MOCK_TRANSACTIONS.map((t) => (
                        <div
                          key={t.label}
                          className="flex items-center justify-between"
                        >
                          <div className="flex items-center gap-xs">
                            <span className="w-4 h-4 rounded-full bg-slate-100 flex items-center justify-center">
                              <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                            </span>
                            <span className="text-[9px] text-slate-600">
                              {t.label}
                            </span>
                          </div>
                          <span
                            className={`text-[9px] font-semibold ${
                              t.type === "income"
                                ? "text-income-600"
                                : "text-expense-600"
                            }`}
                          >
                            {t.amount}
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
      <section className="border-y border-slate-200 bg-white py-xl">
        <div className="max-w-4xl mx-auto px-lg">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-lg text-center">
            {[
              { value: "10+", label: "Ledger types" },
              { value: "ARS & USD", label: "Currencies" },
              { value: "CPI-aware", label: "Inflation tracking" },
              { value: "Real-time", label: "Budget progress" },
            ].map((stat) => (
              <div key={stat.label}>
                <p className="text-2xl font-bold text-slate-900 tabular-nums">
                  {stat.value}
                </p>
                <p className="text-sm text-slate-500 mt-xs">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── FEATURES ───────────────────────────────────────────── */}
      <section id="features" className="py-3xl bg-slate-50">
        <div className="max-w-6xl mx-auto px-lg">
          <div className="text-center mb-2xl">
            <p className="text-sm font-semibold text-primary-600 uppercase tracking-widest mb-sm">
              Features
            </p>
            <h2 className="text-3xl font-bold text-slate-900 mb-md">
              Everything you need to understand your money
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto leading-relaxed">
              From simple expense tracking to inflation-adjusted analytics,
              Budget Lens gives you the full picture without the complexity.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-md">
            {FEATURES.map((feature) => {
              const Icon = feature.icon;
              return (
                <div
                  key={feature.title}
                  className="card hover:shadow-card-hover transition-all duration-200"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center mb-md ${feature.colorBg}`}
                  >
                    <Icon className={`w-5 h-5 ${feature.colorText}`} />
                  </div>
                  <h3 className="text-base font-semibold text-slate-900 mb-xs">
                    {feature.title}
                  </h3>
                  <p className="text-sm text-slate-500 leading-relaxed">
                    {feature.description}
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
              How it works
            </p>
            <h2 className="text-3xl font-bold text-slate-900">
              Up and running in minutes
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-xl relative">
            {/* Connector line */}
            <div className="hidden md:block absolute top-8 left-[calc(16.67%+2rem)] right-[calc(16.67%+2rem)] h-px bg-slate-200" />

            {STEPS.map((step) => (
              <div key={step.number} className="relative text-center">
                <div className="w-16 h-16 rounded-2xl bg-primary-600 text-white flex items-center justify-center text-xl font-bold mx-auto mb-md relative z-10 shadow-sm">
                  {step.number}
                </div>
                <h3 className="text-lg font-semibold text-slate-900 mb-sm">
                  {step.title}
                </h3>
                <p className="text-sm text-slate-500 leading-relaxed max-w-xs mx-auto">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── TRUST STRIP ────────────────────────────────────────── */}
      <section className="py-xl bg-slate-50 border-y border-slate-200">
        <div className="max-w-4xl mx-auto px-lg">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-lg">
            {[
              {
                icon: ShieldCheck,
                title: "Secure by design",
                body: "Your data stays yours. No third-party sharing, no ads, no compromises.",
                color: "text-income-600",
                bg: "bg-income-50",
              },
              {
                icon: TrendingUp,
                title: "Inflation-aware",
                body: "Built for economies where purchasing power changes. Every amount has a real value.",
                color: "text-primary-600",
                bg: "bg-primary-50",
              },
              {
                icon: Users,
                title: "Built for teams",
                body: "Whether it's just you or your entire household, Budget Lens scales to your needs.",
                color: "text-accent-600",
                bg: "bg-accent-50",
              },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="flex items-start gap-md"
                >
                  <div
                    className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${item.bg}`}
                  >
                    <Icon className={`w-5 h-5 ${item.color}`} />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-slate-900 mb-xs">
                      {item.title}
                    </p>
                    <p className="text-sm text-slate-500 leading-relaxed">
                      {item.body}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── CTA SECTION ────────────────────────────────────────── */}
      <section className="py-3xl bg-gradient-to-br from-primary-600 via-primary-700 to-accent-700">
        <div className="max-w-3xl mx-auto px-lg text-center">
          <h2 className="text-3xl font-bold text-white mb-md">
            Ready to take control of your finances?
          </h2>
          <p className="text-primary-200 text-lg mb-xl leading-relaxed">
            Join Budget Lens and start seeing your money with clarity — for
            free, today.
          </p>

          <button
            onClick={() => navigate("/dashboard")}
            className="inline-flex items-center gap-sm px-xl py-md bg-white text-primary-700 font-semibold rounded-lg shadow-card hover:bg-primary-50 active:bg-primary-100 transition-colors text-base"
          >
            Get started free
            <ArrowRight className="w-4 h-4" />
          </button>

          <div className="mt-lg flex flex-wrap items-center justify-center gap-xl text-primary-200 text-sm">
            {["No credit card required", "Free to use", "Cancel anytime"].map(
              (item) => (
                <div key={item} className="flex items-center gap-xs">
                  <Check className="w-4 h-4" />
                  {item}
                </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* ── FOOTER ─────────────────────────────────────────────── */}
      <footer className="bg-slate-900 py-xl">
        <div className="max-w-6xl mx-auto px-lg flex flex-col md:flex-row items-center justify-between gap-md">
          <div className="flex items-center gap-sm">
            <div className="w-7 h-7 rounded-lg bg-primary-600 flex items-center justify-center">
              <BarChart3 className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-sm font-bold text-white tracking-tight">
              Budget Lens
            </span>
          </div>
          <p className="text-xs text-slate-500 text-center">
            © 2025 Budget Lens. Built for financial clarity.
          </p>
          <div className="flex items-center gap-lg text-xs text-slate-500">
            <a href="#" className="hover:text-slate-300 transition-colors">
              Privacy
            </a>
            <a href="#" className="hover:text-slate-300 transition-colors">
              Terms
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
};
