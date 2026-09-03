import { useTranslation } from "react-i18next";
import { cn } from "../../utils/cn";
import type { BudgetItem } from "../../types";

const TODAY = new Date();
const daysInCurrentMonth = () =>
  new Date(TODAY.getFullYear(), TODAY.getMonth() + 1, 0).getDate();

export const BudgetProgressItem = ({
  category,
  spent,
  budget,
  dayOfMonth = TODAY.getDate(),
  daysInMonth = daysInCurrentMonth(),
}: BudgetItem) => {
  const { t, i18n } = useTranslation("common");

  const spentShare = budget > 0 ? spent / budget : 0;
  const elapsedShare = daysInMonth > 0 ? dayOfMonth / daysInMonth : 0;
  const overBy = spent - budget;
  const barPct = Math.min(Math.max(spentShare, 0), 1) * 100;
  const isOver = overBy > 0;

  // Pace-based verdict: spend so far vs. how much of the month has elapsed —
  // not the raw spent/budget ratio. "80% spent" is fine on day 27 and alarming
  // on day 10. The glyph (● ■ ▲) carries the signal without relying on colour.
  const signal =
    spentShare > 1 || spentShare > elapsedShare + 0.15
      ? { glyph: "▲", label: t("budget.signal.over"), bar: "bg-expense", glyphTone: "text-expense-600" }
      : spentShare > elapsedShare + 0.05
        ? { glyph: "■", label: t("budget.signal.close"), bar: "bg-warning", glyphTone: "text-warning-600" }
        : { glyph: "●", label: t("budget.signal.good"), bar: "bg-income", glyphTone: "text-income-600" };

  return (
    <div>
      <div className="flex justify-between items-center mb-xs">
        <span className="text-sm font-semibold text-stone-900">{category}</span>
        <span className="budget-signal">
          <span className={signal.glyphTone} aria-hidden="true">{signal.glyph}</span>
          <span className={cn("font-medium", isOver ? "text-expense-600" : "text-stone-600")}>
            {signal.label}
          </span>
        </span>
      </div>

      <div className="flex justify-between text-xs text-stone-500 mb-xs tabular-nums">
        <span>${spent.toLocaleString(i18n.language)}</span>
        <span>${budget.toLocaleString(i18n.language)}</span>
      </div>

      <div className="h-2 bg-stone-100 rounded-full overflow-hidden">
        <div
          className={cn("h-full rounded-full transition-all duration-500", signal.bar)}
          style={{ width: `${barPct}%` }}
        />
      </div>

      {/* The verdict leads; the numbers below are secondary. Over-budget always
          carries a sentence, not just a red bar. */}
      {isOver ? (
        <p className="mt-xs text-xs font-medium text-expense-600">
          {t("budget.over_by", {
            amount: `$${Math.round(overBy).toLocaleString(i18n.language)}`,
          })}
        </p>
      ) : (
        <p className="mt-xs text-xs text-stone-500">
          {t("budget.pace", {
            spentPct: Math.round(spentShare * 100),
            day: dayOfMonth,
            days: daysInMonth,
          })}
        </p>
      )}
    </div>
  );
};
