# Design System

Budget Lens uses a custom Tailwind CSS design system built on top of the default configuration. All tokens are defined in `tailwind.config.js`.

---

> **This file follows the redesign brief in `CLAUDE.md` (§ Design Redesign Brief / Design
> System).** If anything here disagrees with `CLAUDE.md`, `CLAUDE.md` wins. The old
> blue / Inter / slate / tabular design is retired.

## Design Philosophy

- **Warm and airy** — cream background, soft shadows, generous whitespace
- **Built for the average user, not the finance nerd** — lead with a plain-language verdict,
  keep one primary action per screen, never show a raw figure without a label and a
  comparison
- **Numbers are never naked** — every amount carries a label, a comparison, or a verdict
- **Progressive disclosure** — the fast path (amount + category) is never buried under the
  complete path (cuotas, payment method, currency, split, date)
- **Trustworthy** — deep teal primary, calm rose for expenses (never aggressive red)
- **Encouragement over gamification** — users feel steady and informed, not scored
- **Redundant encoding** — colour is never the only signal; pair it with a glyph or a word

---

## Color Tokens

Grays use the warm **`stone-*`** palette (never `slate-*` / `neutral-*` / `blue-*`). Full
token table and the `tailwind.config.js` block live in `CLAUDE.md § Design System → Color
Tokens`.

| Token | Hex | Tailwind key | Purpose |
|---|---|---|---|
| `primary` | `#0D9488` | `teal-600` | CTAs, active nav, progress fills, links |
| `primary-dark` | `#115E59` | `teal-800` | Hero backgrounds, header gradient |
| `primary-light` | `#F0FDFA` | `teal-50` | Selected backgrounds, highlights |
| `cream` | `#FAFAF7` | custom | App background — **not** pure white |
| `income` | `#10B981` | `emerald-500` | Positive amounts, income |
| `expense` | `#FB7185` | `rose-400` | Income/over-budget deltas — **not** every expense row |
| `warning` | `#FBBF24` | `amber-400` | Budget thresholds, over-limit |

### Usage patterns

```
Page background:     bg-cream
Card surface:        bg-white
Primary text:        text-stone-900
Secondary text:      text-stone-500
Borders:             border-stone-200
Income amount:       text-income-600  (+ "+" / "↑" glyph)
Expense list row:    text-stone-900   (+ "−" / "↓" glyph — plain ink, not tinted)
Over-budget bar:     bg-expense       (+ "▲" glyph + "Te pasaste por $…" sentence)
Active nav item:     text-primary
```

Colour is a signal, not decoration: saturated colour is spent on **income** and
**over-budget** only. A list that is 90% expenses stays mostly ink-coloured so the colour
that appears means something.

---

## Typography

Font: **Poppins** (weights 400/500/600/700, loaded via `index.html`).

| Class | Size | Use case |
|---|---|---|
| `text-xs` | 12px | Labels, captions |
| `text-sm` | 14px | Body, labels |
| `text-lg` | 18px | Card titles, section headers |
| `text-2xl` | 24px | Page titles |
| `text-3xl` | 30px | App name / hero |
| `text-4xl` | 36px | Dashboard hero amount |
| `text-5xl` | 48px | Large display numbers |

**Financial amounts are large and bold, never shrunk.** A monthly spend in
`text-3xl font-bold` reads as clear; the same number in `text-sm tabular-nums` reads as a
spreadsheet and creates anxiety.

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

Full `@layer components` block is in `CLAUDE.md § Design System → CSS Utility Classes`.

### Components

| Class | Definition | Use case |
|---|---|---|
| `.card` | `bg-white rounded-xl shadow-card border border-stone-100 p-md` | Standard card surface |
| `.card-hero` | teal gradient `from-primary-800 to-primary-600`, `rounded-2xl`, white text | Dashboard hero |
| `.icon-pill` | `w-10 h-10 rounded-full flex items-center justify-center` | Category icon / monogram disc |
| `.section-title` | `text-lg font-semibold text-stone-900` | Card and section headings |
| `.label-muted` | `text-sm font-medium text-stone-500` | Secondary labels |
| `.budget-signal` | `text-xs font-medium flex items-center gap-xs` | Glyph + verdict row |

### Utilities

| Class | Definition | Use case |
|---|---|---|
| `.financial-amount` | `font-bold tracking-tight` | All monetary values — large and bold, not tabular |
| `.amount-positive` | `text-income-600` | Income / positive delta |
| `.amount-negative` | `text-expense-600` | Negative **delta / summary** figures — not plain expense rows |
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

- `focus-visible` rings use `outline-primary` — keyboard only, not triggered on mouse click.
- Semantic HTML elements: `<nav>`, `<main>`, `<header>`, `<aside>`.
- `::selection` color matches brand palette.
- **Colour is never the sole conveyor of meaning** — income/expense always reinforced by a
  `+` / `−` sign or a word; budget state reinforced by a `● ■ ▲` glyph and a verdict; form
  errors by a `▲` glyph and a sentence.
- Contrast ratios: `stone-900` on `cream` ≈ 18:1 · `income-600` on `white` ≥ 4.5:1 ·
  verify `stone-500` label text meets AA at its size.
