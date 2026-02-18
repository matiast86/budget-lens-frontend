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

The app uses a **sidebar + header + scrollable content** shell defined in `App.tsx`:

```
┌─────────────┬─────────────────────────────────────┐
│   Sidebar   │            AppHeader                │
│  (w-64,     ├─────────────────────────────────────┤
│  hidden     │                                     │
│  on mobile) │     <Routes> / Page content         │
│             │     (overflow-y-auto, p-lg)          │
└─────────────┴─────────────────────────────────────┘
```

- `BrowserRouter` wraps `<App>` in `main.tsx`
- `App.tsx` reads `location.state.title` (set on navigation) to pass the page title to `AppHeader`
- Sidebar is `hidden lg:flex` — hidden on mobile
- `AppHeader` receives `userName: string` and `title?: string` (defaults to `"Dashboard"`)

### Routing

| Path | Component | Notes |
|---|---|---|
| `/` | `DashboardPage` | Shows `LedgerGrid` from `UserDashboardViewDto` |
| `/ledgers/:id` | `LedgerDetailPage` | Shows full `LedgerResponseDto` with tabs |

Navigation from `LedgerCard` uses `useNavigate` and passes `state: { title: ledger.name }` so the header updates automatically.

---

## Project Structure

```
budget-lens-frontend/
├── src/
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
│   ├── pages/
│   │   ├── DashboardPage.tsx          # Route "/": LedgerGrid from mockUser
│   │   └── LedgerDetailPage.tsx       # Route "/ledgers/:id": tabs + LedgerDetailHeader
│   ├── types/
│   │   ├── index.ts                   # Barrel — re-exports everything; always import from here
│   │   ├── prisma-enums.ts            # Union types mirroring Prisma enums exactly
│   │   ├── dtos.ts                    # Backend response DTOs (imports from prisma-enums)
│   │   └── ui-only.ts                 # Frontend-only types (NavItem, StatCardData, LedgerDetailTab, etc.)
│   ├── utils/
│   │   └── cn.ts                      # clsx + tailwind-merge helper
│   ├── App.tsx                        # Shell: Sidebar + AppHeader + Routes
│   └── main.tsx                       # createRoot + BrowserRouter
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

---

## Accessibility

- `focus-visible` rings use `outline-primary-500` (keyboard only — not on mouse click)
- Semantic HTML: `<nav>`, `<main>`, `<header>`, `<aside>`
- `::selection` color matches brand palette
- Color contrast: `slate-900` on `white` = 21:1, `income-600` on `white` ≥ 4.5:1

## Deployment

- Vercel or Netlify (zero-config for Vite)
- Configure `VITE_*` environment variables for API base URLs
