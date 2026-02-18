# Coding Conventions

These conventions are enforced across the entire codebase. All new code must follow them.

---

## React Components — Arrow Functions Only

All components use `const` arrow functions. Never use the `function` keyword for components.

```tsx
// ✅ correct
export const MyComponent = ({ label }: MyComponentProps) => {
  return <div>{label}</div>;
};

// ❌ wrong
export function MyComponent({ label }: MyComponentProps) { ... }
```

---

## Type Imports — Barrel Only

All type imports go through `src/types/index.ts`. Never import directly from sub-files.

```typescript
// ✅ correct
import type { LedgerResponseDto, Currency } from "../../types";

// ❌ wrong
import type { LedgerResponseDto } from "../../types/dtos";
import type { Currency } from "../../types/prisma-enums";
```

---

## Where Types Live

| What | Where |
|---|---|
| Prisma enum mirrors | `src/types/prisma-enums.ts` |
| Backend response DTOs | `src/types/dtos.ts` |
| UI-only types (no backend equivalent) | `src/types/ui-only.ts` |
| Component-local props interfaces | Inside the component file — **not** in `types/` |
| Runtime constants / config arrays | Inside the component/page file — **not** in `types/` |

Only **types** (type aliases, interfaces) belong in `src/types/`. Runtime values (arrays, objects, functions) stay co-located with their single consumer.

```typescript
// ✅ type → goes in ui-only.ts
export type LedgerDetailTab = "transactions" | "categories" | "paymentMethods" | "groups" | "collaborators";

// ✅ runtime constant → stays in LedgerDetailPage.tsx
const TABS: { id: LedgerDetailTab; label: string }[] = [
  { id: "transactions", label: "Transactions" },
  // ...
];
```

---

## React Namespace Imports

When React namespace types are needed (`React.ElementType`, `React.ReactNode`, etc.), use a type-only import and place it first in the file:

```typescript
import type React from "react";  // always first
```

---

## Atomic Design — Component Levels

| Level | Folder | Rule |
|---|---|---|
| Atom | `components/atoms/` | No dependencies on other components; primitive UI only |
| Molecule | `components/molecules/` | Composes atoms; single responsibility; no organisms |
| Organism | `components/organisms/` | Composes molecules/atoms; owns a full UI section |
| Page | `pages/` | Composes organisms; owns route-level state and data wiring |

Never define a reusable component inline inside a page or organism. Extract it to the appropriate level.

```tsx
// ❌ wrong — reusable UI defined inline inside a page
const DashboardPage = () => {
  const StatusTag = ({ status }: { status: string }) => <span>{status}</span>;
  return <StatusTag status="active" />;
};

// ✅ correct — extracted to atoms/
import { StatusTag } from "../components/atoms/StatusTag";
```

---

## Mock Data

Development mocks live in `src/helpers/mocks/`. Each file exports one mock object matching a backend DTO. Always import the mock from there — never define inline mock data in a page.

```typescript
// src/helpers/mocks/ledger-mocks.ts  →  export const mockLedger: LedgerResponseDto
// src/helpers/mocks/user-mocks.ts   →  export const mockUser: UserDashboardViewDto
```

```tsx
// ✅ correct
import { mockLedger } from "../helpers/mocks/ledger-mocks";

// ❌ wrong
const mockLedger = { id: "1", name: "My Ledger", ... };  // inline inside page
```

---

## File Naming

| Artifact | Convention | Example |
|---|---|---|
| Components | PascalCase `.tsx` | `LedgerCard.tsx` |
| Pages | PascalCase + `Page` suffix | `DashboardPage.tsx` |
| Hooks | camelCase + `use` prefix | `useLedger.ts` |
| Utilities | kebab-case `.ts` | `cn.ts` |
| Mock files | kebab-case + `-mocks` suffix | `ledger-mocks.ts` |
| Type files | kebab-case | `prisma-enums.ts`, `dtos.ts` |

---

## CSS / Tailwind

- Prefer design system utility classes (`.card`, `.financial-amount`, `.amount-positive`) over raw Tailwind where they exist.
- Use `cn()` from `src/utils/cn.ts` whenever combining conditional classes.
- Never use inline `style={{}}` for anything covered by Tailwind or the design system tokens.
- All monetary values must use `.financial-amount` (or at minimum `.tabular-nums`) for digit alignment.

---

## Imports Order

Maintain this order within files:

```typescript
// 1. React (type import first if needed)
import type React from "react";
import { useState, useEffect } from "react";

// 2. Third-party libraries
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";

// 3. Internal types (always from barrel)
import type { LedgerResponseDto } from "../../types";

// 4. Internal components (atoms → molecules → organisms)
import { Badge } from "../atoms/Badge";
import { StatCard } from "../molecules/StatCard";

// 5. Utilities and helpers
import { cn } from "../../utils/cn";
import { mockLedger } from "../../helpers/mocks/ledger-mocks";
```
