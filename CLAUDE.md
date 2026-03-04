# Budget Lens: React TypeScript Vite Frontend

## 🎨 Design Redesign Brief — Read This First

The app has undergone a full visual redesign. **Before writing any component, style, or layout code, read and internalize this section.** Every decision below is intentional. Do not revert to the old blue/slate/Inter palette under any circumstance.

### Why it changed

The previous design (blue primary, slate grays, Inter, tabular data-first) felt like a corporate dashboard. Budget Lens is used by regular people on their phones — not finance professionals on desktops. The new design feels like a **friendly companion that helps you understand your money**, not a tool that overwhelms you with it.

### The New Design Personality

- **Warm, not cold** — teal + cream instead of blue + slate
- **Friendly, not corporate** — Poppins (rounded) instead of Inter
- **Approachable numbers** — large, bold amounts with plain-language context, not raw tables
- **Mobile-native** — bottom tab bar, not sidebar; list rows, not horizontal tables; hero card, not four stat cards
- **Playful progress** — emoji signals, progress arcs, streaks; numbers always have context around them

---

## Design Philosophy

**Budget Lens** ("Lens" = clarity, focus, insight) follows these principles:
- Warm and airy — cream background, soft shadows, generous whitespace
- Numbers are never naked — always accompanied by context (label, trend, emoji signal)
- Trustworthy (deep teal primary) and calm (soft rose for expenses, never aggressive red)
- Card-based layout with soft elevation
- **Mobile-first** — every view is designed for small screens first, enhanced for larger viewports with `md:` and `lg:` prefixes
- Progress and gamification — users feel momentum, not anxiety

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

```typescript
import type React from "react";  // always first in the file
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

### Color Tokens

| Token | Hex | Tailwind key | Purpose |
|---|---|---|---|
| `primary` | `#0D9488` | `teal-600` | CTAs, active nav, progress fills, links |
| `primary-dark` | `#115E59` | `teal-800` | Hero backgrounds, header gradient |
| `primary-light` | `#F0FDFA` | `teal-50` | Selected state backgrounds, highlights |
| `background` | `#FAFAF7` | custom `cream` | App background — **not** pure white |
| `surface` | `#FFFFFF` | `white` | Card surfaces |
| `income` | `#10B981` | `emerald-500` | Positive amounts, income |
| `expense` | `#FB7185` | `rose-400` | Negative amounts, expenses (soft, not aggressive) |
| `warning` | `#FBBF24` | `amber-400` | Budget thresholds, over-limit |
| `text-primary` | `#1C1917` | `stone-900` | Headlines, amounts, primary labels |
| `text-secondary` | `#78716C` | `stone-500` | Captions, secondary labels |
| `border` | `#E7E5E0` | `stone-200` | Card borders, dividers |

**All grays now use `stone-*`** (warm undertone), not `slate-*` (cold undertone). This single change shifts the entire emotional temperature of the app.

Configure these in `tailwind.config.js`:

```js
theme: {
  extend: {
    colors: {
      primary: {
        DEFAULT: '#0D9488',
        dark: '#115E59',
        light: '#F0FDFA',
        50: '#F0FDFA',
        100: '#CCFBF1',
        200: '#99F6E4',
        500: '#14B8A6',
        600: '#0D9488',
        700: '#0F766E',
        800: '#115E59',
        900: '#134E4A',
      },
      cream: '#FAFAF7',
      income: {
        DEFAULT: '#10B981',
        50: '#ECFDF5',
        100: '#D1FAE5',
        600: '#059669',
      },
      expense: {
        DEFAULT: '#FB7185',
        50: '#FFF1F2',
        100: '#FFE4E6',
        600: '#E11D48',
      },
      warning: {
        DEFAULT: '#FBBF24',
        50: '#FFFBEB',
        600: '#D97706',
      },
    },
    backgroundColor: {
      app: '#FAFAF7',
    },
  }
}
```

### Typography — Poppins replaces Inter

**Font: Poppins** (import via Google Fonts in `index.html`)

```html
<link href="https://fonts.googleapis.com/css2?family=Poppins:wght@400;500;600;700&display=swap" rel="stylesheet">
```

```js
// tailwind.config.js
fontFamily: {
  sans: ['Poppins', 'system-ui', 'sans-serif'],
}
```

| Role | Weight | Size | Class |
|---|---|---|---|
| App name / hero | 700 Bold | 28–32px | `text-3xl font-bold` |
| Page titles | 600 SemiBold | 22px | `text-2xl font-semibold` |
| Card titles | 600 SemiBold | 16px | `text-lg font-semibold` |
| Body / labels | 400 Regular | 14px | `text-sm` |
| **Financial amounts** | **700 Bold** | **20–32px** | `text-2xl font-bold` |
| Captions / hints | 400 Regular | 12px | `text-xs` |

**Critical rule for financial amounts:** amounts must be **large and bold**, never shrunk. A user's monthly spend shown in `text-3xl font-bold` feels clear and legible. The same number in `text-sm tabular-nums` feels like a spreadsheet and creates anxiety.

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

### Budget progress — emoji signals replace bare progress bars

**`BudgetProgressItem` update:**
```tsx
// Determine signal based on ratio
const ratio = spent / budget;
const signal = ratio < 0.6 ? { emoji: "🟢", label: t("budget.signal.good") }
             : ratio < 0.85 ? { emoji: "🟡", label: t("budget.signal.heads_up") }
             : { emoji: "🔴", label: t("budget.signal.close") };

// Progress bar color follows signal
const barColor = ratio < 0.6 ? "bg-income" : ratio < 0.85 ? "bg-warning" : "bg-expense";
```

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

### Icon treatment — icon pills, not raw icons

Every category, transaction type, and payment method should use an **icon pill**: a `rounded-full` container with a soft pastel background color matched to the category, and a `lucide-react` icon inside. This gives the emoji-style colorful feel with consistent cross-platform rendering.

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

---

## Gamification Patterns

These are new UI patterns introduced in the redesign. They reduce financial anxiety by making progress visible and rewarding.

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
    "streak": "{{count}} months under budget! Keep it up 🎉",
    "balance_label": "Current balance"
  },
  "budget": {
    "signal": {
      "good": "Looking good!",
      "heads_up": "Heads up",
      "close": "Getting close"
    }
  }
}
```

Add equivalent keys to `es/common.json`.

All other i18n rules remain unchanged (never hardcode strings, never hardcode locale, use `i18n.language` for formatters).

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
- The routing structure (`/`, `/dashboard`, `/ledgers/:id`)

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
DebtOwnerResponseDto          { id, name, ledgerId }
```

> **Important:** `DebtOwnerResponseDto` is NOT related to `CollaborationResponseDto`. Debt owners are user-defined names (e.g. "Ana", "neighbor", "other") scoped to a ledger. They are managed via `POST /debt-owners/ledgers/:id` and have a unique constraint on `(ledgerId, name)`.

### `src/types/ui-only.ts`

```typescript
NavItem           // { icon: React.ElementType, label, active }
StatCardData      // { label, value, change, trend: "up"|"down" }
LedgerDetailTab   // "transactions" | "categories" | "paymentMethods" | "groups" | "collaborators"
BottomTabItem     // { icon: React.ElementType, label: string, path: string }
TransactionFilters // { status?, entryType?, categoryId?, groupId?, paymentMethodId?, paymentMonth?, isPaid?, skip?, take? }

// @deprecated — replace with TransactionResponseDto once API is wired
Transaction       // { name, category, amount, type: "income"|"expense" }
BudgetItem        // { category, spent, budget, color }
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
│   │   │   └── Button.tsx             # updated: default → teal, softer expense/income
│   │   ├── molecules/
│   │   │   ├── CategoriesTable.tsx
│   │   │   ├── CollaboratorsTable.tsx
│   │   │   ├── GroupsTable.tsx
│   │   │   ├── PaymentMethodsTable.tsx
│   │   │   ├── LedgerCard.tsx         # updated: min-w-[280px], teal/stone, icon pill
│   │   │   ├── StatCard.tsx           # kept for desktop fallback; not used in mobile hero
│   │   │   ├── TransactionFilters.tsx # NEW — month picker, entryType/status pills, relation selects, isPaid
│   │   │   ├── TransactionListRow.tsx # mobile-first list row pattern
│   │   │   ├── TransactionRow.tsx     # @deprecated — kept until API wired
│   │   │   └── BudgetProgressItem.tsx # updated: emoji signal + colored bar
│   │   └── organisms/
│   │       ├── AppHeader.tsx          # updated: slim mobile / full desktop; onNewLedger prop
│   │       ├── BottomTabBar.tsx       # mobile bottom navigation
│   │       ├── BudgetOverview.tsx     # updated: uses new BudgetProgressItem
│   │       ├── CreateLedgerModal.tsx  # modal form: name, description, currency, baseCpiIndex
│   │       ├── CreateTransactionModal.tsx # modal form: all transaction fields; colored header
│   │       ├── EditTransactionModal.tsx   # NEW — pre-fills from TransactionResponseDto; currency/entryType locked
│   │       ├── DashboardHeroCard.tsx  # teal gradient, monthly summary
│   │       ├── LedgerDetailHeader.tsx
│   │       ├── LedgerGrid.tsx         # updated: horizontal carousel on mobile
│   │       ├── RecentTransactionList.tsx # list rows, not table
│   │       ├── Sidebar.tsx            # updated: teal active state, stone neutrals; lg: only
│   │       ├── TransactionList.tsx    # @deprecated
│   │       └── TransactionTable.tsx   # clickable isPaid/impactsCashflow toggles; edit+delete actions
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
│   │   └── LedgerDetailPage.tsx       # two queries (ledger + transactions); CreateTransactionModal + EditTransactionModal; TransactionFilters
│   ├── schemas/                       # Zod schemas (one file per domain)
│   │   ├── auth.schema.ts             # registerSchema + RegisterFormData
│   │   ├── ledger.schema.ts           # createLedgerSchema + CreateLedgerFormData
│   │   └── transaction.schema.ts      # createTransactionSchema, editTransactionSchema + form data types
│   ├── services/
│   │   ├── api-client.ts              # apiFetch<T> — throws ApiError(status, message); 204→undefined as T
│   │   ├── auth-service.ts            # signIn, signUp
│   │   ├── ledger-service.ts          # getLedgers, getLedger, createLedger
│   │   ├── transaction-service.ts     # createTransaction, getTransactions, updateTransactionFlags, updateTransaction, deleteTransaction
│   │   ├── user-service.ts            # getUser (public)
│   │   └── debt-owner-service.ts      # findOrCreateDebtOwner, createDebtOwner, getDebtOwnerByName
│   ├── types/
│   │   ├── index.ts
│   │   ├── prisma-enums.ts
│   │   ├── dtos.ts
│   │   └── ui-only.ts                 # BottomTabItem, TransactionFilters, LedgerDetailTab, NavItem, etc.
│   ├── utils/
│   │   ├── cn.ts
│   │   ├── category-colors.ts         # NEW — icon pill color map per category
│   │   ├── format-currency.ts
│   │   ├── format-date.ts
│   │   └── format-percent.ts
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

### 🔜 Remaining (priority order)
1. **Budgets page** — category spend vs budget
2. **Analytics page** — inflation-adjusted with `baseCpiIndex` and `realMonthlyAmount`
3. **Language switcher** — `i18n.changeLanguage()` in header or profile settings