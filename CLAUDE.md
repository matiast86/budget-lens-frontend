# Budget Lens: React TypeScript Vite Project Setup

## Design Philosophy

**Budget Lens** ("Lens" = clarity, focus, insight) follows these principles:
- Clean and airy — generous whitespace, let the numbers speak
- Data-focused with clear visual hierarchy
- Trustworthy (blue primary) and calming (rose for expenses, not aggressive red)
- Card-based dashboard layout
- Tabular numbers for financial data alignment

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
Income amount:     text-income-600
Expense amount:    text-expense-600
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
| `xs` | 4px |
| `sm` | 8px |
| `md` | 16px |
| `lg` | 24px |
| `xl` | 32px |
| `2xl` | 48px |
| `3xl` | 64px |

### CSS Utility Classes

Defined in `@layer components` / `@layer utilities` in `index.css`:

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

The app uses a **sidebar + header + scrollable content** shell:

```
┌─────────────┬─────────────────────────────────────┐
│   Sidebar   │            AppHeader                │
│  (w-64,     ├─────────────────────────────────────┤
│  hidden     │                                     │
│  on mobile) │     Page (overflow-y-auto, p-lg)    │
│             │                                     │
└─────────────┴─────────────────────────────────────┘
```

- Sidebar is `hidden lg:flex` — hidden on mobile
- `AppHeader` receives `userName` and optional `title` as props
- Content area uses `p-lg` padding and an 8px grid

---

## Project Structure

```
budget-lens-frontend/
├── src/
│   ├── assets/
│   ├── components/
│   │   ├── atoms/
│   │   │   └── Button.tsx
│   │   ├── molecules/
│   │   │   ├── LedgerCard.tsx        # Single ledger from LedgerDashboardResponseDto
│   │   │   ├── StatCard.tsx          # Stat summary card (value + trend)
│   │   │   ├── TransactionRow.tsx    # Single transaction row
│   │   │   └── BudgetProgressItem.tsx# Budget category progress bar
│   │   └── organisms/
│   │       ├── Sidebar.tsx           # Nav + logo + user footer
│   │       ├── AppHeader.tsx         # Search + notifications + CTA
│   │       ├── LedgerGrid.tsx        # Grid of LedgerCards + empty state
│   │       ├── TransactionList.tsx   # Card wrapping TransactionRows
│   │       └── BudgetOverview.tsx    # Card wrapping BudgetProgressItems
│   ├── contexts/
│   ├── hooks/
│   ├── pages/
│   │   └── DashboardPage.tsx         # Composes LedgerGrid; owns mock UserDashboardViewDto
│   ├── services/
│   ├── types/
│   │   └── index.ts                  # All types: backend DTOs, enums, UI-only interfaces
│   ├── utils/
│   │   └── cn.ts
│   ├── App.tsx                       # Shell: Sidebar + AppHeader + page
│   └── main.tsx
├── index.html
├── tailwind.config.js
├── vite.config.ts
└── package.json
```

---

## Types (`src/types/index.ts`)

### Backend Enums — mirror Prisma exactly

```typescript
Currency      "ARS" | "USD"
Gender        "MALE" | "FEMALE"
Role          "USER" | "ADMIN"
EntryType     "INCOME" | "EXPENSE"
Status        "CLOSED" | "CURRENT" | "FUTURE"
TransactionType "FIXED" | "VARIABLE"
PaymentType   "CASH" | "BANK" | "WALLET" | "CREDIT_CARD" | "OTHER"
CreditBrand   "VISA" | "AMEX" | "MASTER" | "OTHER"
DebtDirection "OWED_TO_ME" | "OWED_BY_ME"
CategoryScope "GLOBAL"
```

### Backend DTOs

```typescript
// GET /users/me/dashboard  →  UserDashboardViewDto
interface UserDashboardViewDto {
  id: string;           // UUID
  name: string;
  email: string;
  birthDate: string;    // ISO date string
  gender: Gender;
  role: Role;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  ledgers: LedgerDashboardResponseDto[];
}

// Nested in UserDashboardViewDto
interface LedgerDashboardResponseDto {
  id: number;
  name: string;
  description?: string;
  currency: Currency;
  baseCpiIndex: number; // CPI at ledger creation — base for inflation-adjusted amounts
  createdAt: string;
  updatedAt: string;
}
```

### UI-only types (not from backend)

```typescript
interface NavItem       // Sidebar nav item with icon component
interface StatCardData  // label, value, change, trend — for future ledger detail pages
interface Transaction   // UI transaction row shape (to be replaced by backend DTO)
interface BudgetItem    // UI budget progress item (to be replaced by backend DTO)
```

---

## Component Reference

### Button (`src/components/atoms/Button.tsx`)

```tsx
import { Button } from '@/components/atoms/Button'

// Variants
<Button variant="default">Primary action</Button>
<Button variant="secondary">Accent/indigo</Button>
<Button variant="outline">Bordered</Button>
<Button variant="ghost">Subtle / nav actions</Button>
<Button variant="income">Record income</Button>
<Button variant="expense">Record expense</Button>
<Button variant="link">Inline link style</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="default">Default</Button>
<Button size="lg">Large</Button>
```

All variants include `hover:`, `active:`, `focus-visible:`, and `disabled:` states.

### LedgerCard (`src/components/molecules/LedgerCard.tsx`)

```tsx
import { LedgerCard } from '@/components/molecules/LedgerCard'

<LedgerCard ledger={ledgerDashboardResponseDto} />
```

Displays: name, currency badge, description, Base CPI row, currency label + creation date, "Open" button.

### LedgerGrid (`src/components/organisms/LedgerGrid.tsx`)

```tsx
import { LedgerGrid } from '@/components/organisms/LedgerGrid'

<LedgerGrid ledgers={user.ledgers} />
```

Renders a responsive grid of `LedgerCard`s with a "New Ledger" CTA and a proper empty state.

### AppHeader (`src/components/organisms/AppHeader.tsx`)

```tsx
import { AppHeader } from '@/components/organisms/AppHeader'

<AppHeader userName="Jane Doe" title="Dashboard" />
```

### cn utility (`src/utils/cn.ts`)

```typescript
import { cn } from '@/utils/cn'

cn('px-4 py-2', isActive && 'bg-primary-500', className)
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

1. Set up React Router — wire `DashboardPage` and future pages to routes
2. Set up React Query + API service layer — replace mock data with real API calls
3. Implement Zustand store for auth/user session
4. Build **Ledger Detail** page (transactions list, categories, payment methods)
5. Build **Transactions** page — filter by status, entryType, period; support installments
6. Build **Budgets** page — category spend vs budget with progress bars
7. Build **Analytics** page — inflation-adjusted amounts using `baseCpiIndex` and `InflationIndex`

## Accessibility Considerations

- `focus-visible` rings use `outline-primary-500` (not `focus:` to avoid mouse clicks showing ring)
- Use semantic HTML (`<nav>`, `<main>`, `<header>`, `<aside>`)
- `::selection` color matches brand palette
- Color contrast: `slate-900` on `white` = 21:1, `income-600` on `white` = 4.6:1

## Deployment

- Vercel or Netlify (zero-config for Vite)
- Configure `VITE_*` environment variables for API base URLs
