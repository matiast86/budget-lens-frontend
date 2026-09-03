# Budget Lens: React TypeScript Vite Frontend

## 🎨 Design Redesign Brief — Read This First

The app has undergone a full visual redesign. **Before writing any component, style, or layout code, read and internalize this section.** Every decision below is intentional. Do not revert to the old blue/slate/Inter palette under any circumstance.

### Why it changed

The previous design (blue primary, slate grays, Inter, tabular data-first) felt like a corporate dashboard. Budget Lens is used by regular people on their phones — not finance professionals on desktops. The new design feels like a **friendly companion that helps you understand your money**, not a tool that overwhelms you with it.

### The New Design Personality

> **v3 identity (current):** indigo brand + warm paper + Bricolage Grotesque / Instrument
> Sans. Set in `tailwind.config.js` (`primary`, `cream`, `income`, `expense`, `warning`,
> `fontFamily.sans`/`display`) and `src/index.css`. The teal/Poppins bullets below are the
> superseded v2 direction — kept for context; the hexes live in **Design System** further
> down. Dark theme from the canvas is **not built yet**.

- **Calm, not loud** — indigo brand (deliberately *not* a money colour) on warm paper `#FAF7F1`
- **Colour is a signal** — green only for income, clay only for over-budget; most rows are plain ink
- **Bricolage Grotesque for money + big titles** — condensed `wdth` axis holds a wide Argentine number ($1.284.500) at size; Instrument Sans carries UI text
- ~~Warm, not cold — teal + cream instead of blue + slate~~ *(v2)*
- ~~Friendly, not corporate — Poppins (rounded) instead of Inter~~ *(v2)*
- **Approachable numbers** — large amounts with plain-language context, not raw tables
- **Mobile-native** — bottom tab bar, not sidebar; list rows, not horizontal tables; hero card, not four stat cards
- **Built for the non-numbers user** — real users said the app felt made for spreadsheet people. The app does the interpretation: a plain-language verdict ("Vas bien") comes first, the percentage second; complexity (cuotas, currency, splits) stays hidden until asked for. See **Average-User Friendliness — Structural Patterns** below.
- **Encouragement, not gamification** — a calm "you're on track" beats points and streaks; keep positive feedback in plain language and never let a score become the headline

---

## Design Philosophy

**Budget Lens** ("Lens" = clarity, focus, insight) follows these principles:
- Warm and airy — cream background, soft shadows, generous whitespace
- Numbers are never naked — always accompanied by context (label, comparison, plain-language verdict)
- Trustworthy (deep teal primary) and calm (soft rose for expenses, never aggressive red)
- Card-based layout with soft elevation
- **Mobile-first** — every view is designed for small screens first, enhanced for larger viewports with `md:` and `lg:` prefixes
- **The average user is the target, not the finance nerd** — every screen must be usable by someone who does not think in percentages: lead with a sentence, keep one primary action per screen, never show a raw figure without a label and a comparison
- **Progressive disclosure** — the fast path (log an expense: amount + category) is never buried under the complete path (cuotas, payment method, currency, split, date)
- Encouragement over gamification — users feel steady and informed, not scored; positive feedback stays in plain language

---

## Coding Conventions

These conventions are enforced across the entire codebase. All new code must follow them.

### Components — arrow functions only

```tsx
// ✅ correct
export const MyComponent = ({ label }: MyComponentProps) => {
  return <div>{label}</div>;
};

// ❌ wrong
export function MyComponent({ label }: MyComponentProps) { ... }
```

### Types — barrel import always

```typescript
// ✅ correct
import type { LedgerResponseDto, Currency } from "../../types";

// ❌ wrong
import type { LedgerResponseDto } from "../../types/dtos";
```

### Types — where things live

| What | Where |
|---|---|
| Prisma enum mirrors | `src/types/prisma-enums.ts` |
| Backend response DTOs | `src/types/dtos.ts` |
| UI-only types (no backend equivalent) | `src/types/ui-only.ts` |
| Component-local props interfaces | Inside the component file |
| Runtime constants / config arrays | Inside the component/page file |

### React import

`jsx: "react-jsx"` is set, so JSX does **not** require a React import. Only import it when the file actually references a `React.*` type, and use a named type import — never a bare `import type React`, which `noUnusedLocals` rejects when unused:

```typescript
import type { ReactNode, ElementType } from "react";
```

### Atomic design — component levels

| Level | Folder | Rule |
|---|---|---|
| Atom | `components/atoms/` | No dependencies on other components; primitive UI only |
| Molecule | `components/molecules/` | Composes atoms; single responsibility |
| Organism | `components/organisms/` | Composes molecules/atoms; owns a full UI section |
| Page | `pages/` | Composes organisms; owns route-level state |

### Responsive design — mobile-first always

```tsx
// ✅ correct — base is mobile, md: enhances for tablet/desktop
<div className="flex flex-col gap-md md:flex-row md:items-center">

// ❌ wrong — desktop-only, no mobile consideration
<div className="flex flex-row items-center gap-md">
```

**Key mobile patterns:**
- **Navigation** — bottom tab bar on mobile; sidebar revealed only at `lg:` breakpoint
- **Tables** — always wrapped in `overflow-x-auto`; prefer list rows on mobile
- **Tab bars** — `overflow-x-auto scrollbar-hide` container, `min-w-max` inner `<nav>`
- **Stacking** — `flex-col` base, `md:flex-row` or `lg:flex-row` for larger screens

### Mocks

```typescript
// src/helpers/mocks/ledger-mocks.ts  →  export const mockLedger: LedgerResponseDto
// src/helpers/mocks/user-mocks.ts   →  export const mockUser: UserDashboardViewDto
```

---

## Engineering Conventions

### Naming

| Thing | Convention | Example |
|---|---|---|
| Component files | PascalCase | `LedgerCard.tsx` |
| Hook files | kebab-case with `use-` prefix | `use-ledger.ts` |
| Utility files | kebab-case | `format-currency.ts` |
| Type files | kebab-case | `prisma-enums.ts` |
| Mock files | kebab-case with `-mocks` suffix | `ledger-mocks.ts` |
| Schema files | kebab-case with `.schema` suffix | `ledger.schema.ts` |
| Local constants | SCREAMING_SNAKE_CASE | `MAX_COLLABORATORS` |
| Custom hooks | camelCase with `use` prefix | `useLedger` |
| Environment variables | `VITE_` prefix + SCREAMING_SNAKE_CASE | `VITE_API_BASE_URL` |

### Exports — named only, never default

```typescript
// ✅ correct
export const StatCard = ({ ... }: StatCardProps) => { ... };

// ❌ wrong
export default StatCard;
```

### No `any` — ever

```typescript
// ✅ correct
const parsed: unknown = JSON.parse(raw);

// ❌ wrong
const parsed: any = JSON.parse(raw);
```

### No array-index keys

```tsx
// ✅ correct
transactions.map((tx) => <TransactionRow key={tx.id} transaction={tx} />)

// ❌ wrong
transactions.map((tx, i) => <TransactionRow key={i} transaction={tx} />)
```

### No prop drilling beyond 2 levels

### File size guideline — ~250 lines max; extract or split beyond that

### Number and currency formatting — never raw in JSX

```tsx
// ✅ correct
{formatCurrency(transaction.totalAmount, transaction.currency, i18n.language)}

// ❌ wrong
{transaction.totalAmount}
```

### Forms — react-hook-form + Zod (never Formik)

The project uses `react-hook-form ^7` + `@hookform/resolvers/zod` + `zod ^4`. Formik is not installed and must not be added.

**Schema convention:**
```typescript
// src/schemas/feature.schema.ts
// Zod error messages are i18n key strings — never raw English
export const createLedgerSchema = z.object({
  name: z.string().min(1, "create.error.nameRequired"),
});
export type CreateLedgerFormData = z.infer<typeof createLedgerSchema>;
```

**Component convention:**
```tsx
const { register, handleSubmit, formState: { errors } } = useForm<FormData>({
  resolver: zodResolver(schema),
});
// Translate error: t(errors.field?.message ?? "")
```

**Resolver cast** — when a schema uses `z.preprocess` or `.default()`, zod's *input* type diverges from its *output* type (`z.infer`). This causes a TypeScript error on the `resolver` prop. Fix with:
```tsx
// eslint-disable-next-line @typescript-eslint/no-explicit-any
resolver: zodResolver(schema) as any,
```
Runtime behaviour is unaffected — zod still validates and coerces correctly. Applied in `CreateTransactionModal` and `EditTransactionModal`.

**Type coercion rules:**
- Optional text → undefined: `z.preprocess((v) => (v === "" ? undefined : v), z.string().optional())`
- Required number input: `register("field", { valueAsNumber: true })` + `z.number()`
- Required select → number: `z.coerce.number().positive()`
- Optional select → number: `z.preprocess((v) => (v === "" || v === "0" ? undefined : Number(v)), z.number().positive().optional())`
- Password confirm: `.refine((d) => d.password === d.confirmPassword, { path: ["confirmPassword"] })`

**Modal pattern** (`open` / `onClose` / `onSubmit` props):
- `useEffect([open])` resets form to fresh defaults when opened
- Escape key + overlay click both close
- `autoFocus` on first field
- Mobile: bottom sheet (`items-end`); sm+: centered card (`sm:items-center`)
- Form layout: `flex flex-col` wrapper; `overflow-y-auto flex-1` body; `shrink-0` footer

**Auth page pattern** (register, login):
- Standalone page — no `AppShell`, no `BottomTabBar`
- `min-h-screen bg-cream`, centered `max-w-sm` card
- Route outside the `<AppShell>` outlet in `App.tsx`

---

## Design System

### ⚠️ Full Palette Replacement

The old `blue` primary and `slate` gray scale are **completely replaced**. Do not use `blue-*`, `slate-*`, or `neutral-*` anywhere in the codebase.

### Color Tokens — v3 indigo / paper

Live values in `tailwind.config.js`. Semantic keys are unchanged (`primary`, `income`,
`expense`, `warning`, `cream`, `bg-app`) so every `bg-primary-*` / `text-income-*` usage
flipped automatically — only raw palette literals (`teal-*`, `emerald-*`) needed hand edits.

| Token | Hex | Purpose |
|---|---|---|
| `primary` (`-600`/DEFAULT) | `#4B47A8` | Brand: CTAs, active nav, links, focus ring. **Not** a money colour. |
| `primary-800` / `primary` dark | `#332F8C` | Hero gradient end, link hover |
| `primary-50` / `primary` light | `#EEEDFA` | Selected backgrounds, indigo-tint chips |
| `cream` / `bg-app` | `#FAF7F1` | App background — warm paper |
| `white` | `#FFFFFF` | Card surfaces |
| `income` (`-600`/DEFAULT) | `#1B7A5A` | **Income only.** `income-50 #E4F1EB` tint, `income-700 #14543F` text |
| `expense` (`-600`/DEFAULT) | `#A8492F` | **Over-budget only** (clay). `expense-50 #F7E9E3` tint, `expense-700 #7C3521` text |
| `warning` (`-500`/DEFAULT) | `#B07715` | "Cutting it close". `warning-50 #FBF1DD` |
| `stone-900` | `#1C1917` | Ink — headlines, amounts, **plain expense rows** |
| `stone-500` | `#78716C` | Muted captions |
| `stone-200` | `#E7E5E0` | Hairline borders |

Grays stay `stone-*` (already warm, close to the canvas ink/muted/hairline). Do not use
`blue-*`, `slate-*`, `neutral-*`, or (now) `teal-*`/`emerald-*`/`rose-*` as brand/finance colours.

### Typography — Bricolage Grotesque + Instrument Sans

**Instrument Sans** carries all UI text (`font-sans`). **Bricolage Grotesque** (`font-display`)
is for money figures and big titles — its `wdth` axis lets a wide Argentine number hold its
size. Loaded in `index.html`:

```html
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wdth,wght@12..96,75..100,400..800&family=Instrument+Sans:wght@400;500;600;700&display=swap" rel="stylesheet">
```

```js
// tailwind.config.js
fontFamily: {
  sans:    ['Instrument Sans', 'system-ui', 'sans-serif'],
  display: ['Bricolage Grotesque', 'Instrument Sans', 'system-ui', 'sans-serif'],
}
```

| Role | Face | Class |
|---|---|---|
| Money / financial amounts | Bricolage (`wdth` 85) | `.financial-amount` (already sets `font-display` + variation settings) |
| Page / section big titles (`h1`,`h2`) | Bricolage | global in `index.css` |
| Card titles, row titles, body, labels | Instrument Sans | `font-sans` (default) |

**Critical rule for financial amounts:** always render money through `.financial-amount`
(never a bare `text-2xl font-bold`) so it picks up the display face. Amounts stay large —
a spend in `text-3xl` reads clearly; the same number in `text-sm tabular-nums` reads like a
spreadsheet.

### Shadows

| Class | Definition | Use case |
|---|---|---|
| `shadow-card` | `0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)` | Default card |
| `shadow-card-hover` | `0 4px 12px rgba(0,0,0,0.08), 0 2px 4px rgba(0,0,0,0.04)` | Card on hover |
| `shadow-dropdown` | `0 8px 24px rgba(0,0,0,0.10)` | Popovers, dropdowns |

### Border Radius — rounded and friendly

| Class | Size | Use case |
|---|---|---|
| `rounded-sm` | 4px | Tiny badges |
| `rounded-md` | 8px | Buttons, inputs |
| `rounded-lg` | 12px | Cards |
| `rounded-xl` | 16px | Large cards, modals |
| `rounded-2xl` | 24px | Hero card, hero sections |
| `rounded-full` | 9999px | Avatar circles, FAB, icon backgrounds |

### Spacing (semantic names — unchanged)

| Class | Size |
|---|---|
| `p-xs` / `gap-xs` | 4px |
| `p-sm` / `gap-sm` | 8px |
| `p-md` / `gap-md` | 16px |
| `p-lg` / `gap-lg` | 24px |
| `p-xl` / `gap-xl` | 32px |
| `p-2xl` / `gap-2xl` | 48px |
| `p-3xl` / `gap-3xl` | 64px |

### CSS Utility Classes (`src/index.css`)

Update `@layer components` with these new definitions:

```css
@layer components {
  /* Card — warm surface, soft shadow */
  .card {
    @apply bg-white rounded-xl shadow-card border border-stone-100 p-md;
  }

  /* Hero card — teal gradient, full bleed on mobile */
  .card-hero {
    @apply bg-gradient-to-br from-primary-800 to-primary-600 rounded-2xl p-lg text-white;
  }

  /* Icon pill — colored background for category icons */
  .icon-pill {
    @apply w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0;
  }

  /* Section title */
  .section-title {
    @apply text-lg font-semibold text-stone-900;
  }

  /* Muted label */
  .label-muted {
    @apply text-sm font-medium text-stone-500;
  }

  /* Financial amounts */
  .financial-amount {
    @apply font-bold tracking-tight;
  }
  .amount-positive {
    @apply text-income-600;
  }
  .amount-negative {
    @apply text-expense-600;
  }

  /* Budget signal — emoji + label row */
  .budget-signal {
    @apply text-xs font-medium flex items-center gap-xs;
  }

  /* Bottom tab bar item */
  .tab-bar-item {
    @apply flex flex-col items-center justify-center gap-xs flex-1 py-sm text-stone-400;
  }
  .tab-bar-item.active {
    @apply text-primary;
  }
}

@layer utilities {
  .scrollbar-hide {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
  .scrollbar-hide::-webkit-scrollbar {
    display: none;
  }
}
```

---

## App Layout Pattern — Mobile-First Overhaul

### Mobile layout (default — `< lg`)

```
┌──────────────────────────────────┐
│           AppHeader              │  ← slim top bar: app name + avatar
├──────────────────────────────────┤
│                                  │
│         <Outlet /> content       │  ← scrollable, bg-cream
│                                  │
├──────────────────────────────────┤
│         BottomTabBar             │  ← fixed bottom: Home | Ledgers | + | Profile
└──────────────────────────────────┘
```

### Desktop layout (`lg:` and above)

```
┌─────────────┬────────────────────────────────┐
│   Sidebar   │          AppHeader             │
│  (w-64,     ├────────────────────────────────┤
│  static)    │                                │
│             │      <Outlet /> content        │
│             │      (overflow-y-auto, p-lg)   │
└─────────────┴────────────────────────────────┘
```

### Key layout rules

- **`AppShell`** renders `<BottomTabBar>` on mobile and `<Sidebar>` on `lg:`. Never show both simultaneously.
- **App background** is always `bg-cream` (`#FAFAF7`), never `bg-white` or `bg-slate-50`.
- **`AppHeader`** on mobile is slim — just the logo/title and the user avatar. No search bar on mobile (move search to a dedicated screen or modal).
- **`BottomTabBar`** is a new organism. It is `fixed bottom-0 left-0 right-0`, `bg-white border-t border-stone-100`, `safe-area` aware (`pb-safe`). Four items: Home, Ledgers, Add (+), Profile. The Add item is the teal FAB-style center button.

---

## Component Changes

### Dashboard — replace stat card grid with hero card

**Old pattern (do not use):**
```tsx
<div className="grid grid-cols-2 gap-md">
  <StatCard label="Income" value={...} />
  <StatCard label="Expenses" value={...} />
  <StatCard label="Balance" value={...} />
  <StatCard label="Savings" value={...} />
</div>
```

**New pattern:**
```tsx
{/* Full-bleed teal hero card — single glance summary */}
<div className="card-hero mx-[-1rem] rounded-none sm:mx-0 sm:rounded-2xl">
  <p className="label-muted text-teal-200">February 2026</p>
  <p className="text-4xl font-bold mt-xs">{formatCurrency(balance, currency, i18n.language)}</p>
  <p className="text-teal-200 text-sm mt-xs">Current balance</p>
  <div className="flex gap-lg mt-lg">
    <div>
      <p className="text-teal-200 text-xs">Income</p>
      <p className="text-xl font-semibold">{formatCurrency(income, currency, i18n.language)}</p>
    </div>
    <div>
      <p className="text-teal-200 text-xs">Expenses</p>
      <p className="text-xl font-semibold">{formatCurrency(expenses, currency, i18n.language)}</p>
    </div>
  </div>
</div>

{/* Progress arc or horizontal progress bar for monthly budget */}
<BudgetOverview ... />

{/* Recent transactions as list rows, not a table */}
<RecentTransactionList ... />
```

### Transaction display — list rows replace tables on mobile

Tables require horizontal scrolling on mobile, which feels broken. Use a **list row pattern** on all screen sizes below `lg:`. At `lg:` and above, the full `TransactionTable` can be shown inside `overflow-x-auto`.

**`TransactionListRow` molecule:**
```tsx
<div className="flex items-center gap-md py-sm">
  {/* Icon pill with category color */}
  <div className="icon-pill bg-amber-50">
    <UtensilsIcon className="w-5 h-5 text-amber-500" />
  </div>
  {/* Name + category */}
  <div className="flex-1 min-w-0">
    <p className="text-sm font-semibold text-stone-900 truncate">{transaction.comment}</p>
    <p className="text-xs text-stone-500">{transaction.category.name}</p>
  </div>
  {/* Amount — right aligned, colored */}
  <p className={cn("financial-amount text-base", transaction.entryType === "EXPENSE" ? "amount-negative" : "amount-positive")}>
    {transaction.entryType === "EXPENSE" ? "−" : "+"}{formatCurrency(transaction.monthlyAmount, transaction.currency, i18n.language)}
  </p>
</div>
```

### Budget progress — pace-based signal replaces a bare progress bar

The verdict is driven by **pace** — how much of the budget is spent versus how much of the
month has elapsed — not by the raw `spent / budget` ratio. "80% spent" is fine on day 27 and
alarming on day 10; the signal must say which.

**`BudgetProgressItem` update:**
```tsx
const spentShare   = spent / budget;
const elapsedShare = dayOfMonth / daysInMonth;
const overBy       = spent - budget;

const signal =
  spentShare > 1 || spentShare > elapsedShare + 0.15
    ? { glyph: "▲", label: t("budget.signal.over"),  bar: "bg-expense" }
  : spentShare > elapsedShare + 0.05
    ? { glyph: "■", label: t("budget.signal.close"), bar: "bg-warning" }
    : { glyph: "●", label: t("budget.signal.good"),  bar: "bg-income"  };
```

- The **glyph** (`● ■ ▲`) carries the signal without colour — see *Redundant encoding*.
- When over budget, always render the sentence, not just the red bar:
  `t("budget.over_by", { amount: formatCurrency(overBy, currency, i18n.language) })`
  → "Te pasaste por $14.000" / "Over by $14,000".
- The percentage and day count are secondary text under the verdict, never the headline.

### Ledger cards — horizontal carousel on mobile

```tsx
{/* Horizontal scroll carousel — no grid on mobile */}
<div className="flex gap-md overflow-x-auto scrollbar-hide pb-sm lg:grid lg:grid-cols-2 lg:overflow-visible">
  {ledgers.map((ledger) => (
    <LedgerCard key={ledger.id} ledger={ledger} />
  ))}
</div>
```

`LedgerCard` itself should have `min-w-[280px]` on mobile so cards don't collapse in the carousel.

### Icon treatment — icon pill, with a monogram fallback

Every category, transaction type, and payment method uses an **icon pill**: a `rounded-full` container with a soft pastel background color matched to the category, and a `lucide-react` icon inside. This gives the emoji-style colorful feel with consistent cross-platform rendering.

**Category → color mapping (define in a util or constant):**
```typescript
// src/utils/category-colors.ts
export const CATEGORY_COLORS: Record<string, { bg: string; icon: string }> = {
  food:       { bg: "bg-amber-50",   icon: "text-amber-500" },
  transport:  { bg: "bg-blue-50",    icon: "text-blue-500" },
  home:       { bg: "bg-teal-50",    icon: "text-teal-600" },
  health:     { bg: "bg-rose-50",    icon: "text-rose-500" },
  leisure:    { bg: "bg-purple-50",  icon: "text-purple-500" },
  savings:    { bg: "bg-emerald-50", icon: "text-emerald-600" },
  default:    { bg: "bg-stone-100",  icon: "text-stone-500" },
};
```

**Fallback for user-created categories.** A category that maps to no known icon renders a
**monogram** — the first 1–2 letters of its name, uppercased, in the same tinted disc —
rather than the generic `default` icon. Prefer a real icon whenever the name maps to one: a
recognisable cart / house / bus scans faster than a letter, and monograms collide easily
("Súper", "Salidas", "Sueldo" all start with S).

---

## Average-User Friendliness — Structural Patterns

Real users told us the app felt built for "numbers people" — too many fields, too many
percentages, too much left for the user to interpret. These patterns are the fix. They are
**structural, not cosmetic**: they change what is on screen and when, not the palette or the
font. Apply them to every new screen. The visual identity (teal, Poppins, cream, stone) is
unchanged.

### 1. Progressive disclosure — the add / edit transaction sheet

The fast path and the complete path are the same form; the complete path is collapsed.

| Level | Fields | Purpose |
|---|---|---|
| **Level 1 — always visible** | amount, category, income/expense toggle | Enough to save |
| **Level 2 — behind one "Agregar detalle" / "Add detail" toggle** | note, payment method, date, cuotas / installments, split / breakdown, currency | Optional, one tap away |

- Saving is allowed from Level 1 alone — **never require a Level 2 field**.
- The expander is a single control, not a multi-step wizard.
- `CreateTransactionModal` / `EditTransactionModal`: keep Level 2 fields **mounted** (so RHF
  state and the `zodResolver(...) as any` cast are unchanged) but hidden inside a
  collapsible region toggled by one button.
- Level 2 gets silent defaults: date = today, payment method = last used, currency = ledger
  currency, installments = 1.

### 2. Health signal — a sentence first, a number second

The headline a user reads is a plain-language verdict, not a percentage. Logic lives in
*Budget progress — pace-based signal* above (pace = `spentShare` vs `elapsedShare`).

- Verdicts: **"Vas bien" / "On track"**, **"Vas justo" / "Cutting it close"**,
  **"Te pasaste" / "Over"**.
- Percentage and day count are secondary text under the verdict, never the headline.
- Reinforced with a shape (`● ■ ▲`), not colour alone.

### 3. Money is framed as an answerable question

The hero number always answers "how am I doing?", never just "here is a figure".

- Label above ("Te queda este mes" / "Left this month"), the amount, then a denominator and
  a timeframe below ("de $1.850.000 · quedan 7 días").
- No naked numbers anywhere — every amount in JSX goes through `formatCurrency` **and**
  carries a label or comparison.

### 4. Over-budget always carries a sentence

A red bar on its own is not an explanation. Render `t("budget.over_by", { amount })` next to
the bar → "Te pasaste por $14.000" / "Over by $14,000".

### 5. Onboarding removes decisions

- **Sign up: two fields.** Email + password only. Name, birth date and gender are not asked
  at sign-up — profile collects them later, and no screen blocks on them.
- **First budget: two fields.** Name + currency. Categories, payment methods, CPI base index
  and cash-flow settings are seeded silently and edited later in budget settings.
- **Empty dashboard teaches one action.** A greyed `$0` hero shows the shape of the real
  screen; one card asks a question anyone can answer ("¿Qué fue lo último que pagaste?" /
  "What did you last pay for?") with a single button.
- **Navigation is present from screen one.** The five tabs never change — no progressive nav
  reveal — so the map of the app is learned once.

### 6. Redundant encoding — colour is never the only signal

Every state pairs colour with a glyph or a word. Accessibility requirement (≈8% of men have
colour-vision deficiency) and it makes the UI readable at a glance.

| State | Colour | Glyph | Word |
|---|---|---|---|
| Income | `income-600` | `+` / `↑` | "Ingreso" |
| Expense | plain `text-stone-900`, **not tinted** | `−` / `↓` | category name |
| On track | `income` | `●` | "Vas bien" |
| Close | `warning` | `■` | "Vas justo" |
| Over | `expense` | `▲` | "Te pasaste" |
| Form error | `expense` border | `▲` | error sentence |

**Do not tint every row.** Most rows are expenses; if 90% of the list is coloured, colour
stops meaning anything. Saturated colour is spent on income and over-budget only; the amount
sign (`+` / `−`) is the always-on non-colour cue. This refines the earlier
`.amount-negative` habit — keep the class for deltas and summaries, but a plain expense row
in a list stays ink-coloured.

### 7. Category icons — real icon with a monogram fallback

See *Icon treatment* above: `lucide-react` icon for known categories, first 1–2 letters of
the name for user-created ones, generic default icon avoided.

---

## Gamification Patterns

These UI patterns reduce financial anxiety by making progress visible. Keep them **quiet**:
per *Encouragement over gamification*, a plain-language "vas bien" is the goal — a streak
banner is a nice-to-have, never the headline, and points/leaderboards are out of scope.

### Budget emoji signals

Already defined in the `BudgetProgressItem` section above. Three states: 🟢 good, 🟡 heads up, 🔴 getting close. Always shown next to the progress bar with a plain-language label.

### Monthly streak banner

A subtle banner shown at the top of the dashboard when the user has been under budget for 2+ consecutive months:

```tsx
{streakMonths >= 2 && (
  <div className="flex items-center gap-sm bg-income-50 border border-income-100 rounded-xl p-sm">
    <span className="text-xl">🎉</span>
    <p className="text-sm font-medium text-income-600">
      {t("dashboard.streak", { count: streakMonths })}
    </p>
  </div>
)}
```

### Progress arc (optional — for savings goals)

A circular SVG progress arc on the dashboard hero or savings card. Use a thin `stroke-width` ring with the teal primary color. Keep it simple — no third-party chart library needed for a single arc.

---

## Internationalization (i18n)

No changes to the i18n architecture. New strings needed for redesign features:

Add to `en/common.json`:
```json
{
  "dashboard": {
    "streak": "{{count}} months under budget! Keep it up",
    "left_this_month": "Left this month",
    "left_detail": "of {{total}} · {{days}} days left",
    "empty": {
      "spent_label": "Spent in {{month}}",
      "prompt_title": "Start with your last purchase",
      "prompt_body": "What did you last pay for? Log it and you're set.",
      "prompt_cta": "Log my first expense"
    }
  },
  "budget": {
    "signal": {
      "good": "On track",
      "close": "Cutting it close",
      "over": "Over"
    },
    "over_by": "Over by {{amount}}"
  },
  "transaction": {
    "add_detail": "Add detail",
    "add_detail_hint": "optional"
  }
}
```

Add equivalent keys to `es/common.json` — e.g. `budget.signal` → "Vas bien" / "Vas justo" /
"Te pasaste", `budget.over_by` → "Te pasaste por {{amount}}", `transaction.add_detail` →
"Agregar detalle", `dashboard.left_this_month` → "Te queda este mes".

All other i18n rules remain unchanged (never hardcode strings, never hardcode locale, use `i18n.language` for formatters).

### User-facing vocabulary — no accountant words

The **type/DTO names stay** (`LedgerResponseDto`, `groupId`, `impactsCashflow`, element ids
like `ledger-name`). Only the **i18n values** speak plain language. Keep new copy consistent
with this table:

| Concept (code) | ES value | EN value | Never say |
|---|---|---|---|
| Ledger | **planilla de gastos** / *planilla* | **expense tracker** / *tracker* | libro mayor, ledger, cuenta |
| Transaction | **movimiento** | *transaction* (fine in EN) | transacción (ES) |
| Group | **etiqueta** | **tag** | grupo, group |
| Cashflow (report) | **flujo de dinero** | *cashflow* | flujo de caja |
| `impactsCashflow` flag | **cuenta para el mes** | **counts toward the month** | impacta en flujo de caja |
| `baseCpiIndex` / CPI | **inflación de referencia** / *inflación base* | **reference inflation** / *base inflation* | CPI, índice CPI |
| Status CURRENT/CLOSED/FUTURE | **Este mes / Cerrado / Próximo** | **This month / Past / Upcoming** | Corriente |
| Collaborator(s) | **compartido con** / *personas* | **shared with** / *people* | colaborador |
| `installments` column | **cuota** | **instalment** | — (EN "quota" was wrong) |
| Dashboard | **Inicio** | **Home** | Panel |

ES is voseo Argentine ("anotá", "mirá", "creá"). The landing trust line says *"Sin fórmulas"*
(not "Sin planilla" — the product now calls itself a planilla).

---

## Migration Checklist

When implementing the redesign, follow this order to avoid cascading breakage:

1. **`tailwind.config.js`** — add `primary` (teal), `cream`, `income`, `expense`, `warning` tokens; replace `slate` references with `stone`; add Poppins to `fontFamily.sans`
2. **`index.html`** — add Poppins Google Fonts `<link>`
3. **`src/index.css`** — update `.card`, `.section-title`, `.label-muted`, `.financial-amount`, `.amount-positive`, `.amount-negative`; add `.card-hero`, `.icon-pill`, `.tab-bar-item`, `.budget-signal`
4. **`AppShell`** — add `<BottomTabBar>` for mobile, keep `<Sidebar>` for `lg:`; change `bg-slate-50` → `bg-cream`
5. **`AppHeader`** — slim mobile version; full version at `md:`
6. **`DashboardPage`** — replace stat card grid with hero card + carousel ledgers + list transactions
7. **`BudgetProgressItem`** — add emoji signal logic and colored progress bar
8. **`LedgerCard`** — add `min-w-[280px]`, update colors to teal/stone
9. **`TransactionTable`** — keep for `lg:` desktop; add `TransactionListRow` for mobile
10. **`Badge`** — update color variants to use new palette (teal for primary, stone for default)
11. **`Button`** — update `default` variant to teal; update `income`/`expense` variants to new softer tones
12. **All pages** — audit for any remaining `slate-*`, `blue-*`, or `neutral-*` classes and replace

---

## What NOT to Change

- The TypeScript conventions (arrow functions, barrel imports, named exports, no `any`)
- The atomic design folder structure
- The `src/types/` architecture
- The mock data location (`src/helpers/mocks/`)
- The i18n namespace structure and translation key conventions
- The React Query / Zustand state separation rules
- The service layer pattern (deferred until API is wired)
- Accessibility requirements (ARIA labels, semantic HTML, focus rings)
- The routing structure (`/`, `/dashboard`, `/transactions`, `/cashflow`, `/debts`, `/ledgers/:id`; auth pages `/login` `/register` outside `AppShell`)

---

## Deferred Conventions (unchanged)

### ✅ Auth is wired — these are now implemented
- Token stored in Zustand `auth-store.ts` → **sessionStorage** (never localStorage)
- `<RequireAuth>` guard component at `src/components/organisms/RequireAuth.tsx`
- `VITE_API_BASE_URL` in `.env.local`, default `http://localhost:3000`
- All services use `apiFetch<T>(path, options, token)` from `api-client.ts`
- React Query in `main.tsx` (staleTime 30s, retry 1)

### Deferred until API layer expanded
- `AppError` typed union (currently using `ApiError` class directly)
- React Query key factories

### Deferred until second developer or tests added
- Conventional Commits
- Pre-commit hooks (lint-staged + Husky)
- Vitest + Testing Library + MSW

---

## Types (unchanged)

### `src/types/prisma-enums.ts`

```typescript
Currency        "ARS" | "USD"
Gender          "MALE" | "FEMALE"
Role            "USER" | "ADMIN"
EntryType       "INCOME" | "EXPENSE"
Status          "CLOSED" | "CURRENT" | "FUTURE"
TransactionType "FIXED" | "VARIABLE"
PaymentType     "CASH" | "BANK" | "WALLET" | "CREDIT_CARD" | "OTHER"
CreditBrand     "VISA" | "AMEX" | "MASTER" | "OTHER"
DebtDirection   "OWED_TO_ME" | "OWED_BY_ME"
CategoryScope   "GLOBAL"
```

### `src/types/dtos.ts`

```typescript
UserDashboardViewDto          { id, name, email, gender, role, isActive, ledgers[] }
LedgerDashboardResponseDto    { id, name, description?, currency, baseCpiIndex, createdAt, updatedAt }
LedgerResponseDto             { id, name, currency, baseCpiIndex, ownerId, categories[], groups[],
                                 transactions[], paymentMethods[], collaborations[], createdAt, updatedAt }
TransactionResponseDto        { id, entryType, status, transactionDate, paymentMonth, currency,
                                 totalAmount, monthlyAmount, installments, installment, isPaid,
                                 impactsCashflow, cpiIndex?, realMonthlyAmount?, category, group?,
                                 paymentMethod, comment?, transactionsBreakDown?, debtOwners? }
CategoryResponseDto           { id, name, description?, ledgerId, templateId? }
GroupResponseDto              { id, name, ledgerId, userId }
PaymentMethodResponseDto      { id, name, type, brand?, color?, icon?, currency?, isActive, userId }
CollaborationResponseDto      { id, name, isActive, userId, ledgerId }
DebtOwnerResponseDto          { id, name, ledgerId, transactions?: TransactionDebtOwnerResponseDto[] }
DebtReportDto                 { meta: { periods[], from, to, currency }, owners: DebtOwnerReportDto[], grandTotal: DebtPeriodAmountDto[] }
DebtOwnerReportDto            { id, name, total: DebtPeriodAmountDto[], debts: DebtDetailDto[] }
DebtPeriodAmountDto           { period, amount }   // signed: + = owed to me, − = owed by me
DebtDetailDto                 { description, amounts: DebtPeriodAmountDto[] }
```

> **Important:** `DebtOwnerResponseDto` is NOT related to `CollaborationResponseDto`. Debt owners are user-defined names (e.g. "Ana", "neighbor", "other") scoped to a ledger. They are managed via `POST /debt-owners/ledgers/:id` and have a unique constraint on `(ledgerId, name)`. `GET /debt-owners/ledgers/:id` returns them with `transactions` (the nested `TransactionDebtOwner` assignments, each carrying its `debt` `{ id, period "YYYY-MM", description? }`).

### `src/types/ui-only.ts`

```typescript
NavItem           // { icon: React.ElementType, label, active }
StatCardData      // { label, value, change, trend: "up"|"down" }
LedgerDetailTab   // "transactions" | "categories" | "paymentMethods" | "groups" | "collaborators" | "debts"
BottomTabItem     // { icon: React.ElementType, label: string, path: string }
TransactionFilters // { status?, entryType?, categoryId?, groupId?, paymentMethodId?, paymentMonth?, isPaid?, skip?, take? }

// @deprecated — replace with TransactionResponseDto once API is wired
Transaction       // { name, category, amount, type: "income"|"expense" }
BudgetItem        // { category, spent, budget, color, dayOfMonth, daysInMonth } — pace inputs feed the ● ■ ▲ signal
```

---

## Project Structure (updated)

```
budget-lens-frontend/
├── src/
│   ├── i18n/
│   │   ├── index.ts
│   │   └── locales/
│   │       ├── en/
│   │       │   ├── common.json        # includes new streak + budget signal strings
│   │       │   └── ledger.json
│   │       └── es/
│   │           ├── common.json
│   │           └── ledger.json
│   ├── components/
│   │   ├── atoms/
│   │   │   ├── Badge.tsx              # updated to teal/stone palette
│   │   │   ├── Button.tsx             # updated: default → teal, softer expense/income
│   │   │   └── CategoryIcon.tsx       # lucide icon for known category names; monogram fallback
│   │   ├── molecules/
│   │   │   ├── CategoriesTable.tsx    # CRUD-enabled: onAdd/onEdit/onDelete props; inline delete confirm
│   │   │   ├── CollaboratorsTable.tsx
│   │   │   ├── GroupsTable.tsx        # CRUD-enabled: onAdd/onEdit/onDelete props; inline delete confirm
│   │   │   ├── PaymentMethodsTable.tsx # CRUD-enabled: onAdd/onEdit/onDelete props; inline delete confirm
│   │   │   ├── LedgerCard.tsx         # updated: min-w-[280px], teal/stone, icon pill
│   │   │   ├── StatCard.tsx           # kept for desktop fallback; not used in mobile hero
│   │   │   ├── TransactionFilters.tsx # NEW — month picker, entryType/status pills, relation selects, isPaid
│   │   │   ├── TransactionListRow.tsx # mobile-first list row pattern
│   │   │   ├── TransactionRow.tsx     # @deprecated — kept until API wired
│   │   │   ├── BreakdownEditor.tsx    # W1-W4 editor UI + save logic, no table markup (usable in a row OR a modal)
│   │   │   │                          # reads token/queryClient; invalidates ["transactions", String(ledgerId)] (+ optional invalidateKeys)
│   │   │   ├── TransactionBreakdownPanel.tsx # thin <tr><td colSpan> wrapper around BreakdownEditor — used by TransactionTable
│   │   │   ├── TransactionViewToggle.tsx # "Table / Weekly" segmented pills; TransactionView = "table" | "weekly"
│   │   │   ├── DebtOwnersList.tsx     # per-owner net OWED_TO_ME vs OWED_BY_ME (glyph+word+colour), expand → per-debt rows; onOpenTransaction(txId)
│   │   │   ├── WeeklyDrawdownStrip.tsx # "Balance Mes" 5-step bar (start → after W1..W4); All/Counts-toward-month toggle; nets OWED_TO_ME off start; now/past/upcoming
│   │   │   ├── UnallocatedBreakdownCard.tsx # Σ buckets ≠ monthlyAmount list; per-row "Put in W{n}" + header "Auto-split all by date"; "Split manually" → editor
│   │   │   └── BudgetProgressItem.tsx # updated: emoji signal + colored bar
│   │   └── organisms/
│   │       ├── AppHeader.tsx          # updated: slim mobile / full desktop; onNewLedger prop
│   │       ├── BottomTabBar.tsx       # mobile bottom navigation
│   │       ├── BudgetOverview.tsx     # updated: uses new BudgetProgressItem
│   │       ├── CategoryModal.tsx      # create/edit category (name + optional description); open/onClose/onSubmit/initialData?
│   │       ├── CreateLedgerModal.tsx  # modal form: name, description, currency, baseCpiIndex
│   │       ├── CreateTransactionModal.tsx # modal form: all transaction fields; colored header; no status field (backend auto-derives from paymentMonth)
│   │       │                              # QuickCreate inline sub-component: appears below each select (category/group/PM)
│   │       │                              # always visible; onCreateCategory/Group/PaymentMethod optional props
│   │       │                              # resolver cast: zodResolver(...) as any (zod input/output type mismatch with RHF)
│   │       ├── EditTransactionModal.tsx   # pre-fills from TransactionResponseDto; currency/entryType locked
│   │       │                              # resolver cast: same as above
│   │       ├── GroupModal.tsx         # create/edit group (name only); open/onClose/onSubmit/initialData?
│   │       ├── PaymentMethodModal.tsx # create/edit PM (name, type, brand conditional on CREDIT_CARD, currency, color picker)
│   │       ├── DashboardHeroCard.tsx  # teal gradient, monthly summary
│   │       ├── LedgerDetailHeader.tsx
│   │       ├── LedgerGrid.tsx         # updated: horizontal carousel on mobile
│   │       ├── RecentTransactionList.tsx # list rows, not table
│   │       ├── Sidebar.tsx            # updated: teal active state, stone neutrals; lg: only; nav incl. /debts (HandCoins)
│   │       ├── TransactionList.tsx    # @deprecated
│   │       ├── TransactionTable.tsx   # clickable isPaid/impactsCashflow toggles; edit+delete actions
│   │       │                          # Weeks column: BreakdownMiniBar sparkline (4 proportional bars, primary-400/stone-200)
│   │       │                          # click Weeks cell → toggles TransactionBreakdownPanel expansion row inline
│   │       │                          # TransactionTableRow returns React.Fragment (main <tr> + optional breakdown <tr>)
│   │       │                          # COL_COUNT = 11 (add 1 when adding columns — used for breakdown colSpan)
│   │       ├── DebtsView.tsx          # "By person / By month" toggle; owns getDebtOwners + getDebtReport queries + period picker
│   │       │                          # props: ledgerId, currency, onOpenTransaction; used by the /debts page AND the LedgerDetail "debts" tab
│   │       ├── DebtReportTable.tsx    # owner × month matrix (GET /reports/.../debts); expand owner → per-description; grand-total row
│   │       ├── WeeklyView.tsx         # own month picker + getTransactions({paymentMonth,take:500}); current-week reference pill
│   │       │                          # renders WeeklyDrawdownStrip + UnallocatedBreakdownCard + WeeklyBoard; quick-fill / auto-split mutations
│   │       │                          # breakdown edit opens BreakdownEditor in a modal; props: ledgerId, currency
│   │       └── WeeklyBoard.tsx        # 4 week columns (1-up → 4-up lg); real day ranges per month; current column ringed + THIS WEEK badge
│   ├── helpers/
│   │   └── mocks/
│   │       ├── ledger-mocks.ts
│   │       └── user-mocks.ts
│   ├── hooks/
│   ├── pages/
│   │   ├── LandingPage.tsx            # nav: Sign in → /login, Get started → /register
│   │   ├── RegisterPage.tsx           # standalone auth page at /register
│   │   ├── LoginPage.tsx              # standalone auth page at /login
│   │   ├── DashboardPage.tsx          # hero card + carousel + list rows
│   │   ├── TransactionsPage.tsx       # /transactions: ledger selector pills + summary cards + filters + full table
│   │   │                              # "Table / Weekly" toggle (TransactionViewToggle) → weekly mode renders <WeeklyView>
│   │   ├── CashflowPage.tsx           # /cashflow: ledger pills + period presets + CashflowTable
│   │   ├── DebtsPage.tsx              # /debts: ledger pills + <DebtsView>; owns EditTransactionModal for the open-a-debt's-transaction flow
│   │   └── LedgerDetailPage.tsx       # two queries (ledger + transactions) + debtOwners count query; full CRUD for transactions, categories, groups, PMs
│   │                                  # tabs incl. "debts" (<DebtsView>); transactions tab has the "Table / Weekly" toggle
│   │                                  # modals: CreateTransaction, EditTransaction, CategoryModal, GroupModal, PaymentMethodModal
│   │                                  # mutations invalidate ["ledger", id]; onCreateCategory/Group/PM passed to CreateTransactionModal for QuickCreate
│   │                                  # openDebtTransaction: getTransaction(id) → setEditTarget (debt edits route through the transaction)
│   ├── schemas/                       # Zod schemas (one file per domain)
│   │   ├── auth.schema.ts             # registerSchema + RegisterFormData
│   │   ├── ledger.schema.ts           # createLedgerSchema + CreateLedgerFormData
│   │   └── transaction.schema.ts      # createTransactionSchema (no `status` — backend derives from paymentMonth), editTransactionSchema + form data types
│   ├── services/
│   │   ├── api-client.ts              # apiFetch<T> — throws ApiError(status, message); 204→undefined as T
│   │   ├── auth-service.ts            # signIn, signUp
│   │   ├── ledger-service.ts          # getLedgers, getLedger, createLedger
│   │   ├── transaction-service.ts     # createTransaction, getTransactions, getTransaction, updateTransactionFlags, updateTransaction, deleteTransaction
│   │   │                              # updateTransactionBreakdown(txId, {amountOne?,amountTwo?,amountThree?,amountFour?}, token) → PATCH /transactions/:id/breakdown
│   │   ├── category-service.ts        # createCategory, updateCategory, deleteCategory
│   │   ├── group-service.ts           # createGroup, updateGroup, deleteGroup
│   │   ├── payment-method-service.ts  # createPaymentMethod, updatePaymentMethod, deletePaymentMethod, assignPaymentMethodToLedger (unused — backend auto-assigns)
│   │   ├── user-service.ts            # getUser (public)
│   │   ├── reports-service.ts         # getCashflow(ledgerId, from, to, token), getDebtReport(ledgerId, from, to, token)
│   │   └── debt-owner-service.ts      # getDebtOwners(ledgerId, token), findOrCreateDebtOwner, createDebtOwner, getDebtOwnerByName
│   ├── types/
│   │   ├── index.ts
│   │   ├── prisma-enums.ts
│   │   ├── dtos.ts
│   │   └── ui-only.ts                 # BottomTabItem, TransactionFilters, LedgerDetailTab, NavItem, etc.
│   ├── utils/
│   │   ├── cn.ts
│   │   ├── category-colors.ts         # icon pill color map per category
│   │   ├── format-currency.ts
│   │   ├── format-date.ts
│   │   ├── format-percent.ts
│   │   ├── format-period.ts           # formatMonthShort("YYYY-MM", locale) → "Feb 26"
│   │   └── weekly-breakdown.ts        # buildWeeklyBreakdown, sumWeeks({impactsCashflowOnly}), weekOfMonth/weekOfDate (mirrors backend cutoffs 7/14/21),
│   │                                  # weekDayRange (W4 = 22–end-of-month), currentWeekForMonth, singleWeekPayload
│   ├── App.tsx
│   └── main.tsx
├── .env.example
├── .env.local
├── index.html                         # updated: Poppins Google Fonts link
├── tailwind.config.js                 # updated: teal primary, stone grays, cream bg, Poppins
├── vite.config.ts
└── package.json
```

---

## Accessibility (unchanged requirements)

- `focus-visible` rings use `outline-primary` (keyboard only)
- Semantic HTML: `<nav>`, `<main>`, `<header>`, `<aside>`
- Icon-only interactive elements must have `aria-label`
- Color is never the sole conveyor of meaning — income/expense always reinforced by `+`/`−` sign or label
- Status messages use `role="status"` or `role="alert"` with `aria-live`
- Tables use `<thead>`, `<th scope="col">`, and `aria-label` on `<table>`
- Bottom tab bar items use `aria-label` and `aria-current="page"` for active item

---

## Installed Dependencies (unchanged)

```json
{
  "dependencies": {
    "react": "^19",
    "react-dom": "^19",
    "react-router-dom": "^7",
    "zustand": "^5",
    "@tanstack/react-query": "^5",
    "react-hook-form": "^7",
    "@hookform/resolvers": "^5",
    "zod": "^4",
    "i18next": "^24",
    "react-i18next": "^15",
    "i18next-browser-languagedetector": "^8",
    "lucide-react": "^0.563",
    "date-fns": "^4",
    "class-variance-authority": "^0.7",
    "clsx": "^2",
    "tailwind-merge": "^3"
  }
}
```

---

## Next Steps (updated priority order)

### ✅ Completed
1. ~~**Design system foundation**~~ — tailwind tokens, Poppins, index.css utility classes
2. ~~**`AppShell` layout**~~ — BottomTabBar mobile / Sidebar lg:, cream background
3. ~~**`DashboardPage`**~~ — DashboardHeroCard + ledger carousel + RecentTransactionList
4. ~~**`BudgetProgressItem`**~~ — emoji signal + colored progress bar
5. ~~**`LedgerCard`**~~ — carousel-ready, teal/stone palette
6. ~~**`TransactionListRow`**~~ — mobile list row with icon pill
7. ~~**Create Ledger form**~~ — `CreateLedgerModal` + `ledger.schema.ts`, wired to AppHeader
8. ~~**Create Transaction form**~~ — `CreateTransactionModal` + `transaction.schema.ts`, wired to LedgerDetailPage; debt assignments use free-text name input resolved via `findOrCreateDebtOwner`
9. ~~**Register page**~~ — `RegisterPage` + `auth.schema.ts` at `/register`; LandingPage CTAs wired to `/register` and `/login`
10. ~~**Login page**~~ — `LoginPage` + `loginSchema` at `/login`; stores token via `setToken()`, navigates to `/dashboard`
11. ~~**Auth guard + service layer**~~ — `RequireAuth`, `api-client`, all services wired; React Query in `main.tsx`
12. ~~**Transactions view — filters, edit, delete, flag toggles**~~ — per-ledger only; `TransactionFilters` molecule; `EditTransactionModal` organism; `TransactionTable` updated with clickable flags + inline delete confirm; `LedgerDetailPage` has two queries (`["ledger", id]` metadata + `["transactions", id, filters]` filterable); backend: `GET /transactions/ledgers/:id?filters`, `PATCH :id/flags`, `PATCH :id`, `DELETE :id`
13. ~~**Transactions page (`/transactions`)**~~ — dedicated full-page view at the sidebar route; ledger selector pills (auto-selects first); Income / Expenses / Balance summary cards computed from filtered results; reuses `TransactionFilters` + `TransactionTable` + both modals; i18n keys added to `common` namespace
14. ~~**CRUD for categories, groups, payment methods**~~ — `CategoryModal`, `GroupModal`, `PaymentMethodModal` organisms; tables updated with `onAdd/onEdit/onDelete` props + inline delete confirm; full mutations in `LedgerDetailPage`; `QuickCreate` inline sub-component in `CreateTransactionModal` (always visible below each select, auto-selects newly created item via `setValue`)
15. ~~**Weekly breakdown (W1-W4) in transaction table**~~ — new "Weeks" column with `BreakdownMiniBar` sparkline (4 proportional bars); click to toggle `TransactionBreakdownPanel` inline below the row; panel has 4 number inputs + live sum badge + segmented progress bar + "Distribute evenly" + Save/Cancel; `updateTransactionBreakdown` added to `transaction-service.ts`; i18n keys `transaction.breakdown.*` + `transaction.table.col.weeks` added to EN + ES
16. ~~**Debt owners view**~~ — two placements sharing one component. **Tab** in `LedgerDetailPage` ("debts", live owner count) + **dedicated `/debts` page** (`DebtsPage`, ledger-selector pills, `HandCoins` sidebar item). `DebtsView` organism owns a `By person / By month` toggle: `DebtOwnersList` molecule (per-owner net `OWED_TO_ME` vs `OWED_BY_ME`, glyph+word+colour, expand to per-debt rows) and `DebtReportTable` organism (owner × month matrix from `GET /reports/ledgers/:id/debts`, expandable to per-description, grand-total row, period picker). Clicking a debt calls `onOpenTransaction(txId)` → parent fetches `getTransaction` + opens `EditTransactionModal` (debt-split editing itself is **not** wired — routes through the transaction). New: `getDebtOwners` (debt-owner-service), `getDebtReport` (reports-service), `getTransaction` (transaction-service); `DebtReportDto` family + `DebtOwnerResponseDto.transactions?` in `dtos.ts`; `"debts"` in `LedgerDetailTab`; `formatMonthShort` util; `debt.*` in `ledger.json`, `nav.debts` + `debts.*` in `common.json` (EN+ES).
17. ~~**Weekly (W1–W4) view**~~ — `Table / Weekly` toggle (`TransactionViewToggle` molecule) on `TransactionsPage` **and** the Ledger Detail transactions tab. `WeeklyView` organism: own month picker + `getTransactions({paymentMonth, take:500})` query; a **current-week reference** (header pill "Today {date} · week {n} of 4"; only for the current month, else a muted "no current-week marker" note). Renders `WeeklyDrawdownStrip` (molecule — "Balance Mes" as 5 steps: start → remainder after W1..W4; `All / Counts-toward-month` scope toggle default *counts*; nets `OWED_TO_ME` off the start; Passed/Now/Upcoming legend), `UnallocatedBreakdownCard` (molecule — transactions where Σ buckets ≠ `monthlyAmount`; per-row "Put in W{n}" quick-fill + header "Auto-split all by date" via `singleWeekPayload`; "Split manually" opens the editor), `WeeklyBoard` (organism — 4 columns 1-up→4-up `lg`, real day ranges per month, current column ringed + THIS WEEK badge). Editor logic extracted to `BreakdownEditor` molecule (no `<tr>`); `TransactionBreakdownPanel` is now a thin row wrapper around it. Week math in `utils/weekly-breakdown.ts` mirrors backend `getWeekofMonth` (cutoffs 7/14/21; W4 = 22–end). i18n `transaction.view.*` + `transaction.weekly.*` in `ledger.json` (EN+ES).

### ✅ Average-User Friendliness — done
- **Progressive-disclosure add sheet** — `CreateTransactionModal` / `EditTransactionModal`
  collapsed to Level 1 (amount + category + type); one "Agregar detalle" toggle reveals the
  rest, kept mounted; `handleSubmit(submit, revealDetailOnError)` opens it if a hidden field
  fails validation. i18n: `transaction.moreFields.*` in `ledger.json`.
- **Pace-based budget signal** — `BudgetProgressItem` compares `spentShare` vs
  `elapsedShare`, renders `● ■ ▲` + verdict + `budget.over_by` sentence. `BudgetItem` gained
  optional `dayOfMonth?` / `daysInMonth?` (default to today). i18n: `budget.signal.{good,
  close,over}`, `budget.pace`, `budget.over_by` in `common.json`.
- **Landing hero** — mockup now shows the Level 1 view (one "left this month" figure +
  pace pill), plain-language `landing.hero.*` copy + `landing.hero.trustLine`.
- **Category icons** — `components/atoms/CategoryIcon.tsx`: known name → `lucide-react`
  icon, else monogram in a hashed tint. Used by `TransactionListRow`.
- **Redundant encoding** — expense amounts in `TransactionListRow` / `TransactionTable`
  rows render `text-stone-900` (ink) with a `−`; only income keeps `.amount-positive`.
  `.amount-negative` stays for deltas/summaries (`TransactionsPage` totals, `CashflowTable`).

### 🔜 Remaining (priority order)
1. **Budgets page** — category spend vs budget, using the pace-based signal
2. **Onboarding trim** — sign-up to email + password only; first-budget to name + currency
   with silent seeding; empty-dashboard "last purchase" prompt. See *§5*. **Backend-coupled:**
   `User.name` / `birthDate` / `gender` are non-null in `schema.prisma` — needs a migration
   to make them optional, `SignupDto` + auth service changes, and a profile screen to
   collect them later.
3. **Analytics page** — inflation-adjusted with `baseCpiIndex` and `realMonthlyAmount`
4. **Language switcher** — `i18n.changeLanguage()` in header or profile settings