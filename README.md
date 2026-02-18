# Budget Lens — Frontend

> **Clarity, focus, and insight** into your personal finances.

Budget Lens is a personal finance management application that helps users track ledgers, transactions, categories, budgets, and collaborators — with support for inflation-adjusted reporting via CPI indexing.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Framework | React 19 + TypeScript |
| Build tool | Vite |
| Routing | React Router v7 |
| Server state | TanStack React Query v5 |
| Client state | Zustand v5 |
| Forms | React Hook Form v7 + Zod v4 |
| Styling | Tailwind CSS (custom design system) |
| UI primitives | CVA (class-variance-authority) |
| Icons | Lucide React |
| Date utilities | date-fns v4 |

---

## Getting Started

### Prerequisites

- Node.js 20+
- npm 10+

### Install dependencies

```bash
npm install
```

### Development server

```bash
npm run dev
```

### Production build

```bash
npm run build
```

### Preview production build

```bash
npm run preview
```

### Lint

```bash
npm run lint
```

---

## Project Structure

```
src/
├── components/
│   ├── atoms/          # Primitive UI: Badge, Button
│   ├── molecules/      # Composed atoms: StatCard, LedgerCard, TransactionRow, tables
│   └── organisms/      # Full UI sections: Sidebar, AppHeader, TransactionTable, LedgerDetailHeader
├── helpers/
│   └── mocks/          # Development mock data matching backend DTOs
├── pages/              # Route-level components: LandingPage, DashboardPage, LedgerDetailPage
├── types/
│   ├── index.ts        # Barrel — always import from here
│   ├── prisma-enums.ts # Union types mirroring Prisma enums
│   ├── dtos.ts         # Backend response DTOs
│   └── ui-only.ts      # Frontend-only types
├── utils/
│   └── cn.ts           # clsx + tailwind-merge helper
├── App.tsx             # Top-level routes + layout shells
└── main.tsx            # Entry point
```

---

## Routes

| Path | Layout | Description |
|---|---|---|
| `/` | None | Landing / marketing page |
| `/dashboard` | `AppShell` | User's ledger grid |
| `/ledgers/:id` | `AppShell` | Ledger detail with tabs (transactions, categories, payment methods, groups, collaborators) |

---

## Design System

The UI follows a **clean, data-focused** aesthetic — generous whitespace, tabular numbers for financial data, and a trustworthy blue primary palette.

### Color tokens

| Token | Value | Purpose |
|---|---|---|
| `primary` | `#3B82F6` | Brand, CTAs, active nav |
| `accent` | `#6366F1` | Secondary CTAs, charts |
| `income` | `#10B981` | Positive values, income |
| `expense` | `#F43F5E` | Negative values, expenses |
| `warning` | `#F59E0B` | Budget thresholds |
| `slate-*` | Tailwind built-in | All grays: text, borders, backgrounds |

### Key utility classes

| Class | Purpose |
|---|---|
| `.card` | White card surface with border, shadow, padding |
| `.financial-amount` | Tabular nums + semibold + tight tracking |
| `.amount-positive` | `text-income-600` |
| `.amount-negative` | `text-expense-600` |
| `.section-title` | `text-lg font-semibold text-slate-900` |
| `.label-muted` | `text-sm font-medium text-slate-500` |

---

## Architecture Notes

### Component levels (Atomic Design)

- **Atoms** — no dependencies on other components; primitive UI only
- **Molecules** — compose atoms; single responsibility
- **Organisms** — compose molecules/atoms; own a full UI section
- **Pages** — compose organisms; own route-level state and data wiring

### Type conventions

- All type imports go through the barrel `src/types/index.ts` — never import directly from sub-files.
- Runtime constants and config arrays live co-located with their consumer, not in `src/types/`.

### CPI inflation adjustment

Each ledger stores a `baseCpiIndex` (base = 100 at Jan 2024). Transactions carry a `cpiIndex` value, which is used to compute `realMonthlyAmount` — the inflation-adjusted monthly cost.

---

## Environment Variables

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Base URL for the backend REST API |

Create a `.env.local` file at the project root:

```
VITE_API_BASE_URL=http://localhost:3000
```

---

## Roadmap

- [ ] React Query + API service layer (replace mocks with real `useQuery` hooks)
- [ ] Zustand auth/user session store
- [ ] `LedgerDetailPage` — fetch `GET /ledgers/:id` via `useParams`
- [ ] Sidebar nav — wire items to routes with active state
- [ ] Transactions — filter by status, entry type, period; installment grouping
- [ ] Budgets — category spend vs budget with `BudgetProgressItem`
- [ ] Analytics — inflation-adjusted amounts chart
- [ ] Auth flow — protect `/dashboard` and `/ledgers/:id`; redirect unauthenticated users to `/`

---

## Related

- [Budget Lens Backend](../budget-lens-backend) — NestJS + Prisma REST API
