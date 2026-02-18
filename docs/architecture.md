# Frontend Architecture

This document covers the frontend-specific architectural decisions: routing, layout shells, component hierarchy, state management, and data flow.

For product-level architecture (domain model, backend services, database), see the backend `docs/architecture.md`.

---

## Technology Choices

| Concern | Solution | Rationale |
|---|---|---|
| UI | React 19 | Concurrent features, improved performance |
| Language | TypeScript | Type-safety across DTO boundaries |
| Build | Vite | Fast HMR, lean production bundles |
| Routing | React Router v7 | Layout routes, nested outlets |
| Server state | TanStack React Query v5 | Cache, background refetch, loading/error states |
| Client state | Zustand v5 | Minimal boilerplate for auth/session |
| Forms | React Hook Form + Zod | Performant forms with schema validation |
| Styling | Tailwind CSS | Utility-first with custom design token layer |

---

## Application Layout

`App.tsx` declares two distinct layout shells using React Router's layout route pattern.

### Landing shell

Full-width, no sidebar or header. Used only for `/`.

```
┌─────────────────────────────────────────────────────┐
│                   LandingPage                       │
│           (sticky nav + sections + footer)          │
└─────────────────────────────────────────────────────┘
```

### App shell (`AppShell`)

Persistent sidebar + header + scrollable content area. Used for all authenticated routes.

```
┌─────────────┬─────────────────────────────────────┐
│             │            AppHeader                │
│   Sidebar   ├─────────────────────────────────────┤
│   (w-64,    │                                     │
│   hidden    │     <Outlet />                      │
│   on mobile)│     (overflow-y-auto, p-lg)          │
│             │                                     │
└─────────────┴─────────────────────────────────────┘
```

- Sidebar is `hidden lg:flex` — collapsed on mobile.
- `AppHeader` receives `title` from `location.state.title` injected by the navigating component, falling back to `"My Ledgers"`.
- `<Outlet />` renders the matched child route.

---

## Routing

| Path | Layout | Component | Notes |
|---|---|---|---|
| `/` | None | `LandingPage` | Marketing page — no AppShell |
| `/dashboard` | `AppShell` | `DashboardPage` | Ledger grid from `UserDashboardViewDto` |
| `/ledgers/:id` | `AppShell` | `LedgerDetailPage` | Full ledger detail with tabs |

### Navigation with title state

`LedgerCard` uses `useNavigate` and passes state so the header title updates without a separate fetch:

```typescript
navigate(`/ledgers/${ledger.id}`, { state: { title: ledger.name } });
```

`AppShell` reads:

```typescript
const location = useLocation();
const title = location.state?.title ?? "My Ledgers";
```

---

## Component Hierarchy

The codebase follows Atomic Design with strict upward-only composition:

```
Pages
  └── Organisms       (full UI sections)
        └── Molecules (composed atoms, single responsibility)
              └── Atoms (primitive UI, no component dependencies)
```

See [component-library.md](component-library.md) for the full component reference.

---

## State Management

### Server state — React Query

All data fetched from the API is managed by TanStack React Query. Each entity has a dedicated query hook in `src/hooks/`:

```typescript
// Pattern (to be implemented)
const { data: ledger, isLoading } = useQuery({
  queryKey: ["ledger", id],
  queryFn: () => api.getLedger(id),
});
```

React Query handles caching, background refetching, loading and error states. Do not replicate this in Zustand.

### Client state — Zustand

Zustand is reserved for state that is not server-derived:

- Auth session (user identity, token)
- UI preferences (sidebar collapsed state, active filters)

```typescript
// Pattern (to be implemented)
const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  token: null,
  setSession: (user, token) => set({ user, token }),
  clearSession: () => set({ user: null, token: null }),
}));
```

### Local state — useState / useReducer

Form state, toggle state, and ephemeral UI state live in component-local `useState`. Do not hoist to Zustand unless shared across unrelated components.

---

## Data Flow

```
API (backend)
    │
    ▼
React Query (useQuery / useMutation)
    │
    ▼
Page component   ◄──  Zustand (auth, UI prefs)
    │
    ▼
Organisms → Molecules → Atoms
    │
    ▼
User interaction → React Hook Form + Zod
    │
    ▼
useMutation → API (backend)
```

---

## Type Safety at Boundaries

Backend response shapes are mirrored in `src/types/dtos.ts`. The API service layer (to be implemented) must cast responses to these types at the fetch boundary — no `any` inside components.

```typescript
// src/services/ledger.service.ts  (pattern)
export const getLedger = async (id: string): Promise<LedgerResponseDto> => {
  const res = await fetch(`${BASE_URL}/ledgers/${id}`);
  return res.json() as Promise<LedgerResponseDto>;
};
```

---

## Environment Configuration

| Variable | Description |
|---|---|
| `VITE_API_BASE_URL` | Backend REST API base URL |

All `VITE_*` variables are statically replaced at build time. Access them via `import.meta.env.VITE_API_BASE_URL`.

---

## Deployment

- Zero-config deploys on **Vercel** or **Netlify** for Vite.
- Set `VITE_API_BASE_URL` in the platform's environment variable dashboard.
- The `dist/` output is a fully static SPA — configure the host to serve `index.html` for all routes (SPA fallback).
