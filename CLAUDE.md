# Budget Lens: React TypeScript Vite Frontend

## Design Philosophy

**Budget Lens** ("Lens" = clarity, focus, insight) follows these principles:
- Clean and airy — generous whitespace, let the numbers speak
- Data-focused with clear visual hierarchy
- Trustworthy (blue primary) and calming (rose for expenses, not aggressive red)
- Card-based dashboard layout
- Tabular numbers for financial data alignment

---

## Coding Conventions

These conventions are enforced across the entire codebase. All new code must follow them.

### Components — arrow functions only

All React components use `const` arrow functions. Never use the `function` keyword for components.

```tsx
// ✅ correct
export const MyComponent = ({ label }: MyComponentProps) => {
  return <div>{label}</div>;
};

// ❌ wrong
export function MyComponent({ label }: MyComponentProps) { ... }
```

### Types — barrel import always

All type imports go through the barrel `src/types/index.ts`. Never import directly from sub-files.

```typescript
// ✅ correct
import type { LedgerResponseDto, Currency } from "../../types";

// ❌ wrong
import type { LedgerResponseDto } from "../../types/dtos";
import type { Currency } from "../../types/prisma-enums";
```

### Types — where things live

| What | Where |
|---|---|
| Prisma enum mirrors | `src/types/prisma-enums.ts` |
| Backend response DTOs | `src/types/dtos.ts` |
| UI-only types (no backend equivalent) | `src/types/ui-only.ts` |
| Component-local props interfaces | Inside the component file — **not** in `types/` |
| Runtime constants / config arrays | Inside the component/page file — **not** in `types/` |

Only **types** (type aliases, interfaces) belong in `src/types/`. Runtime values (arrays, objects with functions) stay co-located with their single consumer.

```typescript
// ✅ type → goes in ui-only.ts
export type LedgerDetailTab = "transactions" | "categories" | ...;

// ✅ runtime constant → stays in LedgerDetailPage.tsx
const TABS: { id: LedgerDetailTab; label: string; count: ... }[] = [...];
```

### React import

When `React` namespace types are needed (e.g. `React.ElementType`, `React.ReactNode`), use:

```typescript
import type React from "react";  // always first in the file
```

### Atomic design — component levels

| Level | Folder | Rule |
|---|---|---|
| Atom | `components/atoms/` | No dependencies on other components; primitive UI only |
| Molecule | `components/molecules/` | Composes atoms; single responsibility; no organisms |
| Organism | `components/organisms/` | Composes molecules/atoms; owns a full UI section |
| Page | `pages/` | Composes organisms; owns route-level state and mock/data wiring |

Never define a reusable component inline inside a page or organism. Extract it to the appropriate level.

### Mocks

Development mocks live in `src/helpers/mocks/`. Each file exports one mock object matching a backend DTO. Always import the mock from there — never define inline mock data in a page.

```typescript
// src/helpers/mocks/ledger-mocks.ts  →  export const mockLedger: LedgerResponseDto
// src/helpers/mocks/user-mocks.ts   →  export const mockUser: UserDashboardViewDto
```

---

## Engineering Conventions

These rules apply to every file generated or modified. They are not optional.

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
| Custom hooks | camelCase with `use` prefix | `useLedger`, `useTransactionFilter` |
| Environment variables | `VITE_` prefix + SCREAMING_SNAKE_CASE | `VITE_API_BASE_URL` |

### Exports — named only, never default

All exports are named. Never use `export default` except where a framework strictly requires it (none currently do in this project).

```typescript
// ✅ correct
export const StatCard = ({ ... }: StatCardProps) => { ... };

// ❌ wrong — untraceable across refactors
export default StatCard;
```

### No `any` — ever

`any` is forbidden. Use `unknown` for truly untyped external data and narrow it explicitly.

```typescript
// ✅ correct
const parsed: unknown = JSON.parse(raw);

// ❌ wrong
const parsed: any = JSON.parse(raw);
```

If you find yourself reaching for `any`, stop and use a proper type, `unknown`, or a discriminated union instead.

### No array-index keys in lists

Never use the array index as a React `key`. Always use a stable, unique ID from the data.

```tsx
// ✅ correct
transactions.map((tx) => <TransactionRow key={tx.id} transaction={tx} />)

// ❌ wrong — breaks reconciliation on reorder/filter
transactions.map((tx, i) => <TransactionRow key={i} transaction={tx} />)
```

### No prop drilling beyond 2 levels

If a prop passes through more than 2 components without being consumed, extract a custom hook, use React Context, or wire it through Zustand. Drilling through 3+ levels is a structure smell.

### File size guideline

A file exceeding ~250 lines is a signal to split — either extract a subcomponent to the appropriate atomic level, or extract logic into a custom hook. There is no hard line, but long files should be flagged in review.

### `src/utils/` — what belongs here

`src/utils/` is for pure, stateless helper functions only. No React, no hooks, no side effects.

| File | Responsibility |
|---|---|
| `cn.ts` | Class merging (already exists) |
| `format-currency.ts` | `formatCurrency(amount, currency, locale)` via `Intl.NumberFormat` |
| `format-date.ts` | `formatTransactionDate(date, locale)`, `formatPaymentMonth(date, locale)` via `date-fns` |
| `format-percent.ts` | `formatPercent(ratio)` for budget progress display |

### Number and currency formatting — raw values never in JSX

Every numeric amount displayed to the user must go through a formatter in `src/utils/`. Raw numbers in JSX are forbidden.

```tsx
// ✅ correct — locale-aware, uses i18n.language from useTranslation
<span className="financial-amount amount-negative">
  {formatCurrency(transaction.totalAmount, transaction.currency, i18n.language)}
</span>

// ❌ wrong — raw number, locale-unaware, untestable
<span>{transaction.totalAmount}</span>
```

All currency formatting uses `Intl.NumberFormat` internally — never manual string concatenation or `.toFixed()` alone. Always pass `i18n.language` (from `useTranslation`) as the locale — never hardcode `"es-AR"` or any locale string.

```typescript
// src/utils/format-currency.ts
export const formatCurrency = (
  amount: number,
  currency: Currency,
  locale: string,
): string =>
  new Intl.NumberFormat(locale, {
    style: "currency",
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
```

### `src/hooks/` — custom hook conventions

Any non-trivial stateful logic that is used by more than one component, or that makes a component file exceed the size guideline, must be extracted to `src/hooks/`.

```
src/hooks/
  use-ledger.ts                 # will wrap React Query for GET /ledgers/:id
  use-user-dashboard.ts         # will wrap React Query for GET /users/me/dashboard
  use-transaction-filter.ts     # local filter/sort state for TransactionTable
  use-currency-formatter.ts     # locale-aware formatter bound to user's ledger currency
```

A hook file exports exactly one hook. If you need two hooks, make two files.

### State — what lives where

| Data kind | Location | Reason |
|---|---|---|
| Server data (ledgers, transactions) | React Query | Cache, refetch, stale-while-revalidate |
| Auth / user session | Zustand `auth` slice | Persists across components, survives navigation |
| Cross-component UI state (sidebar open, toasts) | Zustand `ui` slice | Shared but not server-derived |
| Local ephemeral UI state (tab selection, modal open) | `useState` in component | No sharing needed |

Never put server data in Zustand. Never use React Query for UI-only state.

### Zustand — slice pattern

When the Zustand store is introduced, it follows a slices pattern:

```
src/store/
  auth.slice.ts     # { user, token, setToken, logout }
  ui.slice.ts       # { sidebarOpen, toasts, addToast }
  store.ts          # combines slices into one store
```

Each slice is defined in isolation and combined in `store.ts`. Import the store hook only from `store.ts`.

### React Query — key factory pattern (for when API layer is wired)

Query keys are never hardcoded inline at call sites. Each resource has a key factory in its service file.

```typescript
// src/services/ledger.service.ts
export const ledgerKeys = {
  all: ["ledgers"] as const,
  detail: (id: string) => ["ledgers", id] as const,
};
```

### Service layer structure (for when API layer is wired)

API calls live in `src/services/`. Each file maps to one backend resource and exports a key factory plus fetch functions. Hooks in `src/hooks/` wrap service functions with `useQuery` / `useMutation`.

```
src/services/
  api-client.ts          # base fetch wrapper: auth headers, base URL, error shape
  ledger.service.ts      # ledgerKeys + getById(), getAll()
  user.service.ts        # userKeys + getDashboard()
```

No component or hook calls `fetch` directly — always through a service function.

---

## Internationalization (i18n)

The app uses `i18next` + `react-i18next` with browser language detection. The setup lives in `src/i18n/index.ts` and is initialized in `main.tsx` before the React root mounts.

### Namespaces

| Namespace | File | Contents |
|---|---|---|
| `common` | `src/i18n/locales/{lang}/common.json` | App name, nav labels, header, stat cards, budget overview, recent transactions, entire landing page |
| `ledger` | `src/i18n/locales/{lang}/ledger.json` | Ledger grid/card/detail, transactions table, categories/groups/payment methods/collaborators tables |

Supported languages: `"en"` (default), `"es"`. Detection order: `localStorage` → `navigator`. The active language key in localStorage is `i18nextLng`.

### Usage in components

```typescript
// Single namespace
const { t } = useTranslation("ledger");

// With locale for formatters
const { t, i18n } = useTranslation("ledger");
formatCurrency(tx.monthlyAmount, tx.currency, i18n.language)
formatTransactionDate(tx.transactionDate, i18n.language)
```

### Rules

- **Never hardcode user-visible strings** in JSX — always use `t("key")`.
- **Never hardcode a locale string** (e.g. `"es-AR"`) — always use `i18n.language`.
- **Pluralization** uses the `_one` / `_other` key suffix convention: `t("grid.count", { count: n })`.
- **Interpolation** uses double-brace variables: `t("card.created", { date: createdAt })`.
- **Static config arrays** that contain translatable labels (FEATURES, STEPS, etc.) must store a `key` field at module level — never the translated string. Call `t(\`namespace.${item.key}.title\`)` in JSX.
- **Helper functions** that receive `t` (non-hook context) must be typed with `TFunction` from `"i18next"`.

```typescript
// ✅ static config at module level — key only, no t() calls
const FEATURE_CONFIG = [
  { key: "multiLedger", icon: LayoutGrid, ... },
];

// ✅ translation in JSX
{FEATURE_CONFIG.map((f) => (
  <h3>{t(`landing.features.${f.key}.title`)}</h3>
))}

// ✅ helper function accepting TFunction
import type { TFunction } from "i18next";
const statusBadge = (status: Status, t: TFunction) => (
  <Badge>{t(`transaction.status.${status.toLowerCase()}`)}</Badge>
);
```

### Adding new strings

1. Add the key + English string to `src/i18n/locales/en/common.json` or `en/ledger.json`.
2. Add the Spanish translation to the corresponding `es/` file.
3. Use `t("your.new.key")` in the component.

---

## Deferred Conventions

The following conventions are intentionally **not yet implemented**. They are documented here so the first implementation follows a deliberate pattern rather than becoming an accidental standard.

### Deferred until auth is wired

- **Token storage** — JWT will be stored in memory only (Zustand `auth` slice). Never `localStorage` or `sessionStorage`.
- **Route protection** — A `<RequireAuth>` guard component will wrap all `AppShell` child routes. It reads the token from the auth slice and redirects to `/` if absent.
- **`VITE_API_BASE_URL`** — Must exist in `.env.local` (gitignored). A `.env.example` with empty values is committed so the shape is documented.

### Deferred until the API layer exists

- **Zod schema validation** — Every API response will be parsed through a Zod schema at the service layer boundary before touching any hook or component. Types in `dtos.ts` will be replaced by `z.infer<typeof schema>` derived types. Schemas live in `src/schemas/`.
- **`AppError` type** — A typed error union (`{ kind: "unauthorized" } | { kind: "not_found" } | ...`) will be defined and thrown by `api-client.ts`. Components and hooks never receive raw `Response` objects.
- **React Query key factories** — Introduced alongside the first real `useQuery` call.

### Deferred until a second developer joins or tests are added

- **Git commit convention** — Conventional Commits (`feat(ledger): ...`, `fix(auth): ...`).
- **Pre-commit hooks** — lint-staged + Husky running `eslint --fix` and `prettier --write` on staged files.
- **Testing strategy** — Vitest + Testing Library for components; MSW for service-layer integration tests. Every formatter util and Zod schema gets a unit test.

---

## Design System

### Color Tokens

All semantic colors have a full 50–950 scale. **All grays use Tailwind's built-in `slate-*` palette** — there is no custom `neutral` key.

| Token | Default | Purpose |
|---|---|---|
| `primary` | `#3B82F6` | Brand, primary CTAs, active nav |
| `accent` | `#6366F1` | Secondary CTAs, chart variety |
| `income` | `#10B981` | Positive values, income, growth |
| `expense` | `#F43F5E` | Negative values, expenses (rose, not red) |
| `warning` | `#F59E0B` | Budget limits, thresholds |
| `slate-*` | built-in | All grays: text, borders, backgrounds |

**Common usage patterns:**
```
Page background:   bg-slate-50
Card surface:      bg-white
Primary text:      text-slate-900
Secondary text:    text-slate-500
Borders:           border-slate-200
Income amount:     text-income-600  (+ class .amount-positive)
Expense amount:    text-expense-600 (+ class .amount-negative)
Over-budget bar:   bg-expense-500
```

### Typography

Font: **Inter** (variable font, all weights 100–900 in a single file)

| Class | Size | Use case |
|---|---|---|
| `text-xs` | 12px | Labels, captions |
| `text-sm` | 14px | Body, table rows |
| `text-base` | 16px | Default body |
| `text-lg` | 18px | Card titles, section headers |
| `text-xl` | 20px | Page subtitles |
| `text-2xl` | 24px | Page titles |
| `text-3xl` | 30px | Stat card amounts |
| `text-4xl` | 36px | Dashboard hero numbers |
| `text-5xl` | 48px | Large display numbers |

### Shadows (semantic names)

| Class | Use case |
|---|---|
| `shadow-card` | Default card elevation |
| `shadow-card-hover` | Card on hover |
| `shadow-dropdown` | Popovers, dropdowns |
| `shadow-inner-light` | Inset inputs |

### Border Radius

| Class | Size | Use case |
|---|---|---|
| `rounded-sm` | 4px | Badges, small tags |
| `rounded` / `rounded-md` | 8px | Buttons, inputs |
| `rounded-lg` | 12px | Cards |
| `rounded-xl` | 16px | Large cards, modals |
| `rounded-2xl` | 24px | Hero sections |

### Spacing (semantic names)

| Class | Size |
|---|---|
| `p-xs` / `gap-xs` | 4px |
| `p-sm` / `gap-sm` | 8px |
| `p-md` / `gap-md` | 16px |
| `p-lg` / `gap-lg` | 24px |
| `p-xl` / `gap-xl` | 32px |
| `p-2xl` / `gap-2xl` | 48px |
| `p-3xl` / `gap-3xl` | 64px |

### CSS Utility Classes

Defined in `@layer components` / `@layer utilities` in `src/index.css`:

| Class | Purpose |
|---|---|
| `.card` | White card with `shadow-card`, `rounded-lg`, `border-slate-200/60`, `p-md` |
| `.section-title` | `text-lg font-semibold text-slate-900` |
| `.label-muted` | `text-sm font-medium text-slate-500` |
| `.tabular-nums` | `font-variant-numeric: tabular-nums` — digit alignment in columns |
| `.slashed-zero` | Tabular nums + slashed zero (0 vs O distinction) |
| `.financial-amount` | `tabular-nums + font-semibold tracking-tight` |
| `.amount-positive` | `text-income-600` |
| `.amount-negative` | `text-expense-600` |
| `.scrollbar-hide` | Hides scrollbar, keeps scrolling |

### Animations

| Class | Duration | Use case |
|---|---|---|
| `animate-fade-in` | 200ms | Modals, toasts appearing |
| `animate-slide-up` | 300ms | Dropdowns, drawers |
| `animate-slide-down` | 300ms | Collapsibles |

---

## App Layout Pattern

`App.tsx` uses a **layout-route pattern** with two distinct shells:

**Landing shell** — full-width, no sidebar or header:
```
┌─────────────────────────────────────────────────────┐
│                   LandingPage                       │
│           (sticky nav + sections + footer)          │
└─────────────────────────────────────────────────────┘
```

**App shell (`AppShell`)** — sidebar + header + scrollable content:
```
┌─────────────┬─────────────────────────────────────┐
│   Sidebar   │            AppHeader                │
│  (w-64,     ├─────────────────────────────────────┤
│  hidden     │                                     │
│  on mobile) │     <Outlet /> / Page content       │
│             │     (overflow-y-auto, p-lg)          │
└─────────────┴─────────────────────────────────────┘
```

- `BrowserRouter` wraps `<App>` in `main.tsx`
- `App.tsx` declares a top-level `<Routes>`: `/` → `LandingPage`, everything else → `AppShell` (layout route)
- `AppShell` reads `location.state.title` and renders `<Outlet />` for child routes
- Sidebar is `hidden lg:flex` — hidden on mobile
- `AppHeader` receives `userName: string` and `title?: string` (defaults to `"My Ledgers"`)

### Routing

| Path | Layout | Component | Notes |
|---|---|---|---|
| `/` | None | `LandingPage` | Marketing/home page — no sidebar or header |
| `/dashboard` | `AppShell` | `DashboardPage` | Shows `LedgerGrid` from `UserDashboardViewDto` |
| `/ledgers/:id` | `AppShell` | `LedgerDetailPage` | Shows full `LedgerResponseDto` with tabs |

Navigation from `LedgerCard` uses `useNavigate` and passes `state: { title: ledger.name }` so the header updates automatically. The landing page CTAs navigate to `/dashboard`.

---

## Project Structure

```
budget-lens-frontend/
├── src/
│   ├── i18n/
│   │   ├── index.ts                   # i18next init: LanguageDetector, two namespaces, en+es
│   │   └── locales/
│   │       ├── en/
│   │       │   ├── common.json        # Nav, header, stat, landing page strings (English)
│   │       │   └── ledger.json        # Ledger, transaction, table strings (English)
│   │       └── es/
│   │           ├── common.json        # Nav, header, stat, landing page strings (Spanish)
│   │           └── ledger.json        # Ledger, transaction, table strings (Spanish)
│   ├── components/
│   │   ├── atoms/
│   │   │   ├── Badge.tsx              # CVA badge variants: default, primary, income, expense, warning, current, closed, future
│   │   │   └── Button.tsx             # CVA button variants: default, secondary, outline, ghost, income, expense, link
│   │   ├── molecules/
│   │   │   ├── CategoriesTable.tsx    # Table of CategoryResponseDto[]
│   │   │   ├── CollaboratorsTable.tsx # Table of CollaborationResponseDto[] with empty state
│   │   │   ├── GroupsTable.tsx        # Table of GroupResponseDto[]
│   │   │   ├── PaymentMethodsTable.tsx# Table of PaymentMethodResponseDto[] with color dots
│   │   │   ├── LedgerCard.tsx         # Single ledger card; navigates to /ledgers/:id on "Open"
│   │   │   ├── StatCard.tsx           # Stat summary card (value + trend arrow)
│   │   │   ├── TransactionRow.tsx     # Single transaction row (deprecated UI type)
│   │   │   └── BudgetProgressItem.tsx # Budget category progress bar
│   │   └── organisms/
│   │       ├── AppHeader.tsx          # Search + notifications + title + CTA
│   │       ├── BudgetOverview.tsx     # Card wrapping BudgetProgressItems
│   │       ├── LedgerDetailHeader.tsx # Ledger name, metadata strip, transaction summary strip
│   │       ├── LedgerGrid.tsx         # Responsive grid of LedgerCards + empty state
│   │       ├── Sidebar.tsx            # Logo + nav items + user footer
│   │       ├── TransactionList.tsx    # Card wrapping TransactionRows (deprecated UI type)
│   │       └── TransactionTable.tsx   # Full table for TransactionResponseDto[] with all columns
│   ├── helpers/
│   │   └── mocks/
│   │       ├── ledger-mocks.ts        # mockLedger: LedgerResponseDto
│   │       └── user-mocks.ts          # mockUser: UserDashboardViewDto
│   ├── hooks/                         # custom hooks — one hook per file
│   ├── pages/
│   │   ├── LandingPage.tsx            # Route "/": marketing page — no AppShell
│   │   ├── DashboardPage.tsx          # Route "/dashboard": LedgerGrid from mockUser
│   │   └── LedgerDetailPage.tsx       # Route "/ledgers/:id": tabs + LedgerDetailHeader
│   ├── services/                      # API service functions — wired when API layer begins
│   ├── types/
│   │   ├── index.ts                   # Barrel — re-exports everything; always import from here
│   │   ├── prisma-enums.ts            # Union types mirroring Prisma enums exactly
│   │   ├── dtos.ts                    # Backend response DTOs (imports from prisma-enums)
│   │   └── ui-only.ts                 # Frontend-only types (NavItem, StatCardData, LedgerDetailTab, etc.)
│   ├── utils/
│   │   ├── cn.ts                      # clsx + tailwind-merge helper
│   │   ├── format-currency.ts         # formatCurrency(amount, currency, locale) → string
│   │   ├── format-date.ts             # formatTransactionDate(date, locale), formatPaymentMonth(date, locale)
│   │   └── format-percent.ts          # formatPercent(ratio) → string
│   ├── App.tsx                        # Top-level routes: LandingPage (/) + AppShell layout route
│   └── main.tsx                       # createRoot + BrowserRouter
├── .env.example                       # committed — shape only, no values
├── .env.local                         # gitignored — real values
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## Types

### `src/types/prisma-enums.ts` — mirror Prisma schema exactly

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

### `src/types/dtos.ts` — backend response shapes

Key types and their source endpoints:

```typescript
// GET /users/me/dashboard
UserDashboardViewDto          { id, name, email, gender, role, isActive, ledgers[] }

// Nested in UserDashboardViewDto — used in DashboardPage / LedgerCard
LedgerDashboardResponseDto    { id, name, description?, currency, baseCpiIndex, createdAt, updatedAt }

// GET /ledgers/:id — used in LedgerDetailPage
LedgerResponseDto             { id, name, currency, baseCpiIndex, ownerId, categories[], groups[],
                                 transactions[], paymentMethods[], collaborations[], createdAt, updatedAt }

// Nested in LedgerResponseDto
TransactionResponseDto        { id, entryType, status, transactionDate, paymentMonth, currency,
                                 totalAmount, monthlyAmount, installments, installment, isPaid,
                                 impactsCashflow, cpiIndex?, realMonthlyAmount?, category, group?,
                                 paymentMethod, comment?, transactionsBreakDown?, debtOwners? }
CategoryResponseDto           { id, name, description?, ledgerId, templateId? }
GroupResponseDto              { id, name, ledgerId, userId }
PaymentMethodResponseDto      { id, name, type, brand?, color?, icon?, currency?, isActive, userId }
CollaborationResponseDto      { id, name, isActive, userId, ledgerId }
```

`baseCpiIndex` is the CPI index value at ledger creation (base = 100 at Jan 2024). Used with `cpiIndex` on transactions to compute `realMonthlyAmount` (inflation-adjusted).

### `src/types/ui-only.ts` — frontend-only types

```typescript
NavItem           // Sidebar nav item: { icon: React.ElementType, label, active }
StatCardData      // Stat card props: { label, value, change, trend: "up"|"down" }
LedgerDetailTab   // "transactions" | "categories" | "paymentMethods" | "groups" | "collaborators"

// @deprecated — replace with TransactionResponseDto once API is wired
Transaction       // { name, category, amount, type: "income"|"expense" }
BudgetItem        // { category, spent, budget, color }
```

---

## Component Reference

### Badge (`src/components/atoms/Badge.tsx`)

```tsx
<Badge variant="default">Tag</Badge>
<Badge variant="primary">ARS</Badge>
<Badge variant="income">Income</Badge>
<Badge variant="expense">Expense</Badge>
<Badge variant="warning">Over budget</Badge>
<Badge variant="current">Current</Badge>
<Badge variant="closed">Closed</Badge>
<Badge variant="future">Future</Badge>

<Badge size="sm">Small (default)</Badge>
<Badge size="md">Medium</Badge>
```

### Button (`src/components/atoms/Button.tsx`)

```tsx
<Button variant="default">Primary action</Button>
<Button variant="secondary">Accent/indigo</Button>
<Button variant="outline">Bordered</Button>
<Button variant="ghost">Subtle / nav</Button>
<Button variant="income">Record income</Button>
<Button variant="expense">Record expense</Button>
<Button variant="link">Inline link</Button>

<Button size="sm" />
<Button size="default" />
<Button size="lg" />
```

All variants include `hover:`, `active:`, `focus-visible:`, and `disabled:` states.

### cn utility (`src/utils/cn.ts`)

```typescript
import { cn } from "../../utils/cn";

cn("px-4 py-2", isActive && "bg-primary-500", className)
```

---

## Installed Dependencies

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

## Development Scripts

```bash
npm run dev      # Start dev server
npm run build    # TypeScript check + Vite build
npm run preview  # Preview production build
npm run lint     # ESLint
```

---

## Next Steps

1. **React Query + API service layer** — replace `mockUser` / `mockLedger` with real `useQuery` hooks
2. **Zustand store** — auth/user session management
3. **`LedgerDetailPage` routing** — read `useParams id`, fetch `GET /ledgers/:id` via React Query
4. **Sidebar navigation** — wire nav items to routes using `NavLink`, derive active state from router
5. **Transactions page** — filter by status, entryType, period; support installment grouping
6. **Budgets page** — category spend vs budget with `BudgetProgressItem` + real data
7. **Analytics page** — inflation-adjusted amounts using `baseCpiIndex` and `realMonthlyAmount`
8. **Auth flow** — protect `/dashboard` and `/ledgers/:id`; redirect unauthenticated users to `/`
9. **Language switcher UI** — a `<LanguageSwitcher>` atom (or `AppHeader` dropdown) calling `i18n.changeLanguage("es" | "en")` — the locale persists automatically in localStorage

---

## Accessibility

- `focus-visible` rings use `outline-primary-500` (keyboard only — not on mouse click)
- Semantic HTML: `<nav>`, `<main>`, `<header>`, `<aside>`
- `::selection` color matches brand palette
- Color contrast: `slate-900` on `white` = 21:1, `income-600` on `white` ≥ 4.5:1
- Icon-only interactive elements must have an `aria-label`
- Color is never the sole conveyor of meaning — income/expense is always reinforced by sign (`+`/`-`) or label
- Status messages (toasts, loading indicators) use `role="status"` or `role="alert"` with `aria-live`
- Tables use `<thead>`, `<th scope="col">`, and a `<caption>` or `aria-label` on the `<table>` element

## Deployment

- Vercel or Netlify (zero-config for Vite)
- Configure `VITE_*` environment variables for API base URLs
- `.env.example` must be kept up to date whenever a new `VITE_*` variable is introduced