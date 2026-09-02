# Component Library

> **Design conventions live in `CLAUDE.md`.** Every component follows the redesign brief
> (teal / Poppins / cream / stone) and the **Average-User Friendliness — Structural
> Patterns** section: progressive disclosure (fast path = amount + category), plain-language
> pace-based verdicts before percentages, redundant encoding (colour + glyph + word), and
> an icon-pill with a monogram fallback for categories. Colour names below that still read
> "blue" / "indigo" / "slate" are stale — the live variants use `teal` / `stone`.

Budget Lens follows Atomic Design. Components are organized into three levels — atoms, molecules, and organisms — each with a strict dependency rule.

```
components/
├── atoms/          # Primitive UI — no dependencies on other components
├── molecules/      # Compose atoms — single responsibility
└── organisms/      # Compose molecules/atoms — own a full UI section
```

---

## Atoms

### Badge — `src/components/atoms/Badge.tsx`

Small inline label. Variants cover all domain states.

**Props**

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | see below | `"default"` | Color and semantic meaning |
| `size` | `"sm"` \| `"md"` | `"sm"` | Visual size |
| `className` | `string` | — | Extra Tailwind classes |
| `children` | `ReactNode` | — | Badge content |

**Variants**

| Variant | Color | Use case |
|---|---|---|
| `default` | stone | Generic tag |
| `primary` | teal | Currency, active state |
| `income` | emerald | Income entries |
| `expense` | rose | Expense entries |
| `warning` | amber | Over-budget, thresholds |
| `current` | teal | Current period ledger |
| `closed` | stone | Closed ledger |
| `future` | purple | Future ledger |

**Usage**

```tsx
<Badge variant="income">Income</Badge>
<Badge variant="expense" size="md">Expense</Badge>
<Badge variant="current">Current</Badge>
<Badge variant="primary">ARS</Badge>
```

---

### Button — `src/components/atoms/Button.tsx`

Primary interactive element. All variants include `hover:`, `active:`, `focus-visible:`, and `disabled:` states.

**Props**

| Prop | Type | Default | Description |
|---|---|---|---|
| `variant` | see below | `"default"` | Visual style |
| `size` | `"sm"` \| `"default"` \| `"lg"` | `"default"` | Button size |
| `className` | `string` | — | Extra Tailwind classes |
| `disabled` | `boolean` | `false` | Disabled state |
| All native `<button>` props | — | — | Forwarded |

**Variants**

| Variant | Style | Use case |
|---|---|---|
| `default` | Solid teal | Primary CTA |
| `secondary` | Solid teal-dark | Accent action |
| `outline` | Bordered | Secondary action |
| `ghost` | Transparent | Subtle / nav actions |
| `income` | Solid emerald | Record income |
| `expense` | Solid rose | Record expense |
| `link` | Underlined text | Inline navigation |

**Usage**

```tsx
<Button variant="default" onClick={handleSave}>Save</Button>
<Button variant="outline" size="sm">Cancel</Button>
<Button variant="income">+ Income</Button>
<Button variant="expense">+ Expense</Button>
<Button variant="ghost" size="lg">View all</Button>
```

---

## Molecules

### StatCard — `src/components/molecules/StatCard.tsx`

Summary metric card showing a label, value, and optional trend indicator.

**Data shape** (`StatCardData` from `src/types/ui-only.ts`)

```typescript
{
  label: string;
  value: string;
  change?: string;
  trend?: "up" | "down";
}
```

**Usage**

```tsx
<StatCard data={{ label: "Total Income", value: "$12,400", change: "+8%", trend: "up" }} />
```

---

### LedgerCard — `src/components/molecules/LedgerCard.tsx`

Card representing a single ledger in the dashboard grid. Navigates to `/ledgers/:id` on "Open" and passes `state: { title: ledger.name }` to the router for the header title.

**Props**

| Prop | Type | Description |
|---|---|---|
| `ledger` | `LedgerDashboardResponseDto` | Ledger data |

**Usage**

```tsx
<LedgerCard ledger={mockLedger} />
```

---

### CategoriesTable — `src/components/molecules/CategoriesTable.tsx`

Table of categories belonging to a ledger.

**Props**

| Prop | Type | Description |
|---|---|---|
| `categories` | `CategoryResponseDto[]` | Category list |

---

### CollaboratorsTable — `src/components/molecules/CollaboratorsTable.tsx`

Table of ledger collaborators with an empty state when none exist.

**Props**

| Prop | Type | Description |
|---|---|---|
| `collaborations` | `CollaborationResponseDto[]` | Collaboration list |

---

### GroupsTable — `src/components/molecules/GroupsTable.tsx`

Table of transaction groups within a ledger.

**Props**

| Prop | Type | Description |
|---|---|---|
| `groups` | `GroupResponseDto[]` | Group list |

---

### PaymentMethodsTable — `src/components/molecules/PaymentMethodsTable.tsx`

Table of payment methods with color dot indicators.

**Props**

| Prop | Type | Description |
|---|---|---|
| `paymentMethods` | `PaymentMethodResponseDto[]` | Payment method list |

---

### BudgetProgressItem — `src/components/molecules/BudgetProgressItem.tsx`

Single category budget row: progress bar + a **pace-based verdict**. The verdict compares
spent-share (`spent / budget`) against month-elapsed-share (`dayOfMonth / daysInMonth`) —
not the raw ratio — and renders a glyph + word (`●` "Vas bien" / `■` "Vas justo" / `▲`
"Te pasaste"). Over budget also renders the sentence `t("budget.over_by", { amount })`, not
just a red bar. Bar colour (`bg-income` / `bg-warning` / `bg-expense`) follows the verdict.
See `CLAUDE.md § Budget progress — pace-based signal`.

**Data shape** (`BudgetItem` from `src/types/ui-only.ts`)

```typescript
{
  category: string;
  spent: number;
  budget: number;
  color: string;
  // pace inputs — default to today when omitted
  dayOfMonth?: number;
  daysInMonth?: number;
}
```

---

### TransactionRow — `src/components/molecules/TransactionRow.tsx`

> **Deprecated** — uses the legacy `Transaction` UI type. Replace with `TransactionTable` rows once API is wired.

---

## Organisms

### Sidebar — `src/components/organisms/Sidebar.tsx`

App-wide navigation. Hidden on mobile (`hidden lg:flex`). Contains logo, nav items, and user footer.

**Props**

| Prop | Type | Description |
|---|---|---|
| `navItems` | `NavItem[]` | Navigation items with icon, label, active flag |

---

### AppHeader — `src/components/organisms/AppHeader.tsx`

Top bar with page title, search, notifications, and CTA.

**Props**

| Prop | Type | Default | Description |
|---|---|---|---|
| `userName` | `string` | — | Displayed user name |
| `title` | `string` | `"My Ledgers"` | Page title — overridden by `location.state.title` from router |

---

### LedgerGrid — `src/components/organisms/LedgerGrid.tsx`

Responsive grid of `LedgerCard` components. Renders an empty state when the list is empty.

**Props**

| Prop | Type | Description |
|---|---|---|
| `ledgers` | `LedgerDashboardResponseDto[]` | Ledgers to display |

---

### LedgerDetailHeader — `src/components/organisms/LedgerDetailHeader.tsx`

Full header for the ledger detail page: ledger name, metadata strip (currency, dates), and transaction summary strip.

**Props**

| Prop | Type | Description |
|---|---|---|
| `ledger` | `LedgerResponseDto` | Full ledger data |

---

### TransactionTable — `src/components/organisms/TransactionTable.tsx`

Full-featured table for `TransactionResponseDto[]` with all columns: date, category, group, type, status, payment method, amount.

**Props**

| Prop | Type | Description |
|---|---|---|
| `transactions` | `TransactionResponseDto[]` | Transaction list |

---

### BudgetOverview — `src/components/organisms/BudgetOverview.tsx`

Card wrapping a list of `BudgetProgressItem` components.

**Props**

| Prop | Type | Description |
|---|---|---|
| `items` | `BudgetItem[]` | Budget category data |

---

### TransactionList — `src/components/organisms/TransactionList.tsx`

> **Deprecated** — wraps `TransactionRow` (legacy UI type). Replace with `TransactionTable` once API is wired.

---

## Utility

### cn — `src/utils/cn.ts`

Combines `clsx` and `tailwind-merge` to safely compose Tailwind class strings.

```typescript
import { cn } from "../../utils/cn";

cn("px-4 py-2", isActive && "bg-primary-500", className)
// → merges classes, resolves Tailwind conflicts
```
