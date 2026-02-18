# API Integration

This document describes how the frontend connects to the Budget Lens backend REST API — DTO shapes, React Query patterns, and the service layer convention.

> **Current status:** the app uses development mocks from `src/helpers/mocks/`. This document defines the target patterns to follow when replacing mocks with real API calls.

---

## Base URL

Configured via environment variable:

```
VITE_API_BASE_URL=http://localhost:3000
```

Access in code:

```typescript
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
```

---

## Endpoints Reference

| Method | Path | Response DTO | Used in |
|---|---|---|---|
| `GET` | `/users/me/dashboard` | `UserDashboardViewDto` | `DashboardPage` |
| `GET` | `/ledgers/:id` | `LedgerResponseDto` | `LedgerDetailPage` |

More endpoints will be added as features are implemented (transactions CRUD, categories, auth, etc.).

---

## DTO Shapes

All types are defined in `src/types/dtos.ts` and re-exported from `src/types/index.ts`. Always import from the barrel.

```typescript
import type { LedgerResponseDto, UserDashboardViewDto } from "../types";
```

### `UserDashboardViewDto`

Returned by `GET /users/me/dashboard`.

```typescript
{
  id: string;
  name: string;
  email: string;
  gender: Gender;
  role: Role;
  isActive: boolean;
  ledgers: LedgerDashboardResponseDto[];
}
```

### `LedgerDashboardResponseDto`

Nested in `UserDashboardViewDto`. Used in `DashboardPage` and `LedgerCard`.

```typescript
{
  id: string;
  name: string;
  description?: string;
  currency: Currency;
  baseCpiIndex: number;
  createdAt: string;
  updatedAt: string;
}
```

### `LedgerResponseDto`

Returned by `GET /ledgers/:id`. Full ledger with all related data.

```typescript
{
  id: string;
  name: string;
  currency: Currency;
  baseCpiIndex: number;
  ownerId: string;
  categories: CategoryResponseDto[];
  groups: GroupResponseDto[];
  transactions: TransactionResponseDto[];
  paymentMethods: PaymentMethodResponseDto[];
  collaborations: CollaborationResponseDto[];
  createdAt: string;
  updatedAt: string;
}
```

### `TransactionResponseDto`

```typescript
{
  id: string;
  entryType: EntryType;           // "INCOME" | "EXPENSE"
  status: Status;                 // "CLOSED" | "CURRENT" | "FUTURE"
  transactionDate: string;
  paymentMonth: string;
  currency: Currency;
  totalAmount: number;
  monthlyAmount: number;
  installments: number;
  installment: number;
  isPaid: boolean;
  impactsCashflow: boolean;
  cpiIndex?: number;
  realMonthlyAmount?: number;     // inflation-adjusted via CPI
  category: CategoryResponseDto;
  group?: GroupResponseDto;
  paymentMethod: PaymentMethodResponseDto;
  comment?: string;
  transactionsBreakDown?: TransactionResponseDto[];
  debtOwners?: DebtOwnerResponseDto[];
}
```

### `CategoryResponseDto`

```typescript
{
  id: string;
  name: string;
  description?: string;
  ledgerId: string;
  templateId?: string;
}
```

### `PaymentMethodResponseDto`

```typescript
{
  id: string;
  name: string;
  type: PaymentType;     // "CASH" | "BANK" | "WALLET" | "CREDIT_CARD" | "OTHER"
  brand?: CreditBrand;
  color?: string;
  icon?: string;
  currency?: Currency;
  isActive: boolean;
  userId: string;
}
```

---

## CPI Inflation Adjustment

Each ledger stores `baseCpiIndex` — the CPI index value at ledger creation (base = 100 at January 2024).

Transactions carry a `cpiIndex` value representing the CPI at the transaction's payment month. The backend computes `realMonthlyAmount`:

```
realMonthlyAmount = monthlyAmount × (baseCpiIndex / cpiIndex)
```

This gives the inflation-adjusted cost in base-period terms. Use `realMonthlyAmount` in analytics views; use `monthlyAmount` for cash-flow views.

---

## Service Layer Convention

API calls are centralized in `src/services/` (to be created). Each service file maps to a backend resource.

```typescript
// src/services/ledger.service.ts
const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const getLedger = async (id: string): Promise<LedgerResponseDto> => {
  const res = await fetch(`${BASE_URL}/ledgers/${id}`);
  if (!res.ok) throw new Error(`Failed to fetch ledger ${id}`);
  return res.json() as Promise<LedgerResponseDto>;
};

export const getUserDashboard = async (): Promise<UserDashboardViewDto> => {
  const res = await fetch(`${BASE_URL}/users/me/dashboard`);
  if (!res.ok) throw new Error("Failed to fetch dashboard");
  return res.json() as Promise<UserDashboardViewDto>;
};
```

---

## React Query Hook Convention

Query hooks live in `src/hooks/` (to be created), one file per resource. They wrap service calls and expose standard React Query state.

```typescript
// src/hooks/useLedger.ts
import { useQuery } from "@tanstack/react-query";
import { getLedger } from "../services/ledger.service";
import type { LedgerResponseDto } from "../types";

export const useLedger = (id: string) => {
  return useQuery<LedgerResponseDto>({
    queryKey: ["ledger", id],
    queryFn: () => getLedger(id),
    enabled: !!id,
  });
};
```

```typescript
// src/hooks/useUserDashboard.ts
import { useQuery } from "@tanstack/react-query";
import { getUserDashboard } from "../services/user.service";
import type { UserDashboardViewDto } from "../types";

export const useUserDashboard = () => {
  return useQuery<UserDashboardViewDto>({
    queryKey: ["userDashboard"],
    queryFn: getUserDashboard,
  });
};
```

### Consuming a hook in a page

```tsx
// LedgerDetailPage.tsx
const { id } = useParams<{ id: string }>();
const { data: ledger, isLoading, isError } = useLedger(id!);

if (isLoading) return <LoadingSpinner />;
if (isError || !ledger) return <ErrorState />;
```

---

## Query Keys Convention

Query keys follow a `[resource, ...identifiers]` tuple pattern for cache granularity:

| Key | Scope |
|---|---|
| `["userDashboard"]` | Current user's dashboard |
| `["ledger", id]` | Single ledger by ID |
| `["ledger", id, "transactions"]` | Transactions for a ledger |

---

## Replacing Mocks

When wiring a page to real data:

1. Remove the mock import from the page.
2. Add the corresponding `useQuery` hook.
3. Handle `isLoading` and `isError` states.
4. Keep the mock file in `src/helpers/mocks/` — it remains useful for tests and Storybook.
