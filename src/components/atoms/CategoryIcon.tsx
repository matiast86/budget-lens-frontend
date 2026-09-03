import type { ElementType } from "react";
import {
  ShoppingCart,
  Car,
  Home,
  Zap,
  HeartPulse,
  Plane,
  PiggyBank,
  TrendingUp,
  CreditCard,
} from "lucide-react";
import { cn } from "../../utils/cn";

// A category maps to a real icon when we recognise it; anything a user made up
// falls back to a monogram in a tinted disc — a recognisable cart / house / bus
// scans faster than a letter, so the icon wins whenever the name matches.

interface IconStyle {
  bg: string;
  fg: string;
  Icon: ElementType;
}

const KNOWN: { test: RegExp; style: IconStyle }[] = [
  { test: /food|dining|restaurant|grocer|market|super|comida|s[uú]per|almac[eé]n/i,
    style: { bg: "bg-amber-50", fg: "text-amber-500", Icon: ShoppingCart } },
  { test: /transport|fuel|transit|bus|train|car|sube|nafta|combustible|transporte/i,
    style: { bg: "bg-sky-50", fg: "text-sky-500", Icon: Car } },
  { test: /home|household|rent|mortgage|alquiler|hogar|casa|expensas/i,
    style: { bg: "bg-teal-50", fg: "text-teal-600", Icon: Home } },
  { test: /utilit|electric|water|gas|internet|phone|luz|agua|servicios/i,
    style: { bg: "bg-rose-50", fg: "text-rose-500", Icon: Zap } },
  { test: /health|medic|pharma|doctor|dental|salud|farmac|m[eé]dico/i,
    style: { bg: "bg-pink-50", fg: "text-pink-500", Icon: HeartPulse } },
  { test: /leisure|travel|trip|holiday|vacation|entertain|viaje|salidas|ocio/i,
    style: { bg: "bg-purple-50", fg: "text-purple-500", Icon: Plane } },
  { test: /saving|invest|ahorro|inversi[oó]n/i,
    style: { bg: "bg-emerald-50", fg: "text-emerald-600", Icon: PiggyBank } },
  { test: /income|salary|payroll|sueldo|ingreso|honorarios/i,
    style: { bg: "bg-emerald-50", fg: "text-emerald-600", Icon: TrendingUp } },
  { test: /card|credit|loan|tarjeta|pr[eé]stamo|cuota/i,
    style: { bg: "bg-indigo-50", fg: "text-indigo-500", Icon: CreditCard } },
];

const MONOGRAM_TINTS = [
  { bg: "bg-amber-50", fg: "text-amber-600" },
  { bg: "bg-sky-50", fg: "text-sky-600" },
  { bg: "bg-teal-50", fg: "text-teal-700" },
  { bg: "bg-purple-50", fg: "text-purple-600" },
  { bg: "bg-rose-50", fg: "text-rose-600" },
  { bg: "bg-emerald-50", fg: "text-emerald-700" },
];

const monogramOf = (name: string) => {
  const words = name.trim().split(/\s+/).filter(Boolean);
  if (words.length === 0) return "?";
  const letters = words.length === 1 ? words[0].slice(0, 2) : words[0][0] + words[1][0];
  return letters.toUpperCase();
};

const tintFor = (name: string) => {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash * 31 + name.charCodeAt(i)) >>> 0;
  return MONOGRAM_TINTS[hash % MONOGRAM_TINTS.length];
};

interface CategoryIconProps {
  name: string;
  /** Extra classes for the pill (e.g. sizing overrides). */
  className?: string;
}

export const CategoryIcon = ({ name, className }: CategoryIconProps) => {
  const known = KNOWN.find((k) => k.test.test(name));

  if (known) {
    const { bg, fg, Icon } = known.style;
    return (
      <span className={cn("icon-pill", bg, className)} aria-hidden="true">
        <Icon className={cn("w-5 h-5", fg)} />
      </span>
    );
  }

  const tint = tintFor(name);
  return (
    <span className={cn("icon-pill", tint.bg, className)} aria-hidden="true">
      <span className={cn("text-xs font-bold leading-none", tint.fg)}>{monogramOf(name)}</span>
    </span>
  );
};
