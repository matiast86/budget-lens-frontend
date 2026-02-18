# Design System

Budget Lens uses a custom Tailwind CSS design system built on top of the default configuration. All tokens are defined in `tailwind.config.js`.

---

## Design Philosophy

- **Clean and airy** — generous whitespace; let the numbers speak
- **Data-focused** — clear visual hierarchy optimized for financial data
- **Trustworthy** — blue primary, calm rose for expenses (not aggressive red)
- **Tabular** — digit alignment for all financial amounts

---

## Color Tokens

All semantic colors have a full **50–950 scale**. All grays use Tailwind's built-in `slate-*` palette — there is no custom `neutral` key.

| Token | Default | Purpose |
|---|---|---|
| `primary` | `#3B82F6` | Brand, primary CTAs, active nav |
| `accent` | `#6366F1` | Secondary CTAs, chart variety |
| `income` | `#10B981` | Positive values, income, growth |
| `expense` | `#F43F5E` | Negative values, expenses (rose, not red) |
| `warning` | `#F59E0B` | Budget limits, thresholds |
| `slate-*` | built-in | All grays: text, borders, backgrounds |

### Usage patterns

```
Page background:   bg-slate-50
Card surface:      bg-white
Primary text:      text-slate-900
Secondary text:    text-slate-500
Borders:           border-slate-200
Income amount:     text-income-600
Expense amount:    text-expense-600
Over-budget bar:   bg-expense-500
Active nav item:   bg-primary-50  text-primary-700
```

---

## Typography

Font: **Inter** (variable font, weights 100–900 in a single file, loaded via `index.html`).

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

---

## Spacing

Custom semantic spacing aliases mapped to fixed pixel values.

| Class | Size |
|---|---|
| `p-xs` / `gap-xs` | 4px |
| `p-sm` / `gap-sm` | 8px |
| `p-md` / `gap-md` | 16px |
| `p-lg` / `gap-lg` | 24px |
| `p-xl` / `gap-xl` | 32px |
| `p-2xl` / `gap-2xl` | 48px |
| `p-3xl` / `gap-3xl` | 64px |

---

## Shadows

Semantic shadow names instead of Tailwind's default `shadow-sm / shadow-md` scale.

| Class | Use case |
|---|---|
| `shadow-card` | Default card elevation |
| `shadow-card-hover` | Card on hover |
| `shadow-dropdown` | Popovers, dropdowns |
| `shadow-inner-light` | Inset inputs |

---

## Border Radius

| Class | Size | Use case |
|---|---|---|
| `rounded-sm` | 4px | Badges, small tags |
| `rounded` / `rounded-md` | 8px | Buttons, inputs |
| `rounded-lg` | 12px | Cards |
| `rounded-xl` | 16px | Large cards, modals |
| `rounded-2xl` | 24px | Hero sections |

---

## CSS Utility Classes

Defined in `@layer components` and `@layer utilities` in `src/index.css`.

### Components

| Class | Definition | Use case |
|---|---|---|
| `.card` | `bg-white rounded-lg border border-slate-200/60 shadow-card p-md` | Standard card surface |
| `.section-title` | `text-lg font-semibold text-slate-900` | Card and section headings |
| `.label-muted` | `text-sm font-medium text-slate-500` | Secondary labels |

### Utilities

| Class | Definition | Use case |
|---|---|---|
| `.tabular-nums` | `font-variant-numeric: tabular-nums` | Digit alignment in columns |
| `.slashed-zero` | Tabular nums + slashed zero | 0 vs O distinction in IDs |
| `.financial-amount` | `tabular-nums + font-semibold + tracking-tight` | All monetary values |
| `.amount-positive` | `text-income-600` | Income / positive delta |
| `.amount-negative` | `text-expense-600` | Expense / negative delta |
| `.scrollbar-hide` | Hides scrollbar, keeps scroll behavior | Horizontal scroll containers |

---

## Animations

| Class | Duration | Use case |
|---|---|---|
| `animate-fade-in` | 200ms | Modals, toasts appearing |
| `animate-slide-up` | 300ms | Dropdowns, drawers |
| `animate-slide-down` | 300ms | Collapsibles |

---

## Accessibility

- `focus-visible` rings use `outline-primary-500` — keyboard only, not triggered on mouse click.
- Semantic HTML elements: `<nav>`, `<main>`, `<header>`, `<aside>`.
- `::selection` color matches brand palette.
- Contrast ratios: `slate-900` on `white` = 21:1 · `income-600` on `white` ≥ 4.5:1.
