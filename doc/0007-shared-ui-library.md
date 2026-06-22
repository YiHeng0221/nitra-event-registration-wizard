# ADR-0007 — Shared UI library in `lib/nitra-ui`

- **Date**: 2026-06-22
- **Status**: Accepted
- **Deciders**: project owner
- **Related**: ADR-0006 (TypeScript), and the `pets-ui` library pattern referenced by the owner

## Context

`src/components/` mixed two very different kinds of component: generic, app-agnostic
**UI primitives** (typography, layout, cards, inputs, badges, a stepper) and **feature
components** that know about this wizard (the shell, the four steps, the order summary, the
success screen). That makes the primitives hard to find, hard to reason about as a stable
contract, and impossible to reuse from a future surface without dragging wizard concerns along.

We also found that several primitives scaffolded during the shared-UI epic — `Checkbox`,
`Chip`, `OptionGroup`, `AppSelect` — had **zero imports**. Inspection showed they were not
unnecessary; the step components had each **re-implemented the same patterns inline** (the day
toggle and category tabs are segmented controls; the track/"selected" badges are chips), so the
primitives rotted as dead code while their patterns were duplicated.

We want a small, flat, framework-light UI kit that is the single home for shared components,
imported uniformly, so future UI stays consistent and the duplication is removed.

## Decision

Introduce **`lib/nitra-ui/`** — a flat, per-component UI library outside `src/`, modelled on the
`pets-ui` pattern.

- **Flat per-component folders, no barrels.** Each component is `lib/nitra-ui/<Name>/<Name>.vue`
  and is imported directly — `import Text from '@lib/nitra-ui/Text/Text.vue'`. No `index.ts`
  re-export barrels (keeps tree-shaking and IDE "go to definition" honest).
- **`@lib` path alias.** Added via `quasar.config.js` `build.alias` (`@lib → ./lib`), which
  `quasar prepare` propagates into the generated `tsconfig` paths, so both Vite and `vue-tsc`
  resolve `@lib/nitra-ui/*`.
- **What moves vs. stays.** Generic primitives move into the lib: `Text`, `Stack` (V/HStack),
  `Card`, `SelectableCard`, `Input`, `Select`, `FieldShell`, `Banner`, `NumericInput`,
  `Checkbox`, `Chip`, `OptionGroup`, `Stepper`, plus a new `Button`. Feature components stay in
  `src/components/`: `AppHeader`, `WizardShell`, `SuccessScreen`, `OrderSummary`, `ErrorBanner`,
  `LocaleSwitcher`, and `steps/*`. `ErrorBanner` depends on app validation types and
  `LocaleSwitcher` is bound to i18n, so both stay app-side and *consume* the lib.
- **Library-convention names.** Drop app-flavoured prefixes on the way in: `Paper → Card`,
  `AppInput → Input`, `AppSelect → Select`, `NumberStepper → NumericInput`.
- **`Button`** is added with `primary | secondary | ghost` variants; the wizard actions, the
  success CTA, and the review "Edit" links route through it instead of bespoke `<button>`s.
- **`OptionGroup` is the canonical segmented control** (`tab` and `pill` variants, `block` for
  full-width mobile segments). The Step 2 day toggle, Step 3 category tabs, and the
  `LocaleSwitcher` all use it — the single "segmented switch" the owner asked about already
  existed here; no new component was created.
- **`Chip`** is a tone-based pill (`neutral | success | danger | custom`) used by the Step 2
  track badges (custom palette) and the Step 1 "Selected" badge.
- **Tokens & icons.** The lib *consumes* the provided design tokens — the UnoCSS semantic layer
  (`src/unocss/**`, `src/css/colors.scss`), which are provided files we must not edit — via the
  semantic shortcuts (`bg-surface-l0`, `text-neutral`, …); it does not duplicate them. Icons use
  Quasar's `q-icon` directly today; a thin `Icon` wrapper can centralize that later.

Both formerly-unused primitives were **redesigned and wired in**:

- `Checkbox` — the app's only "checkbox" is the Step 2 card selection indicator, so `Checkbox` is
  now a *presentational* `check_box` indicator (icon-based; the parent card owns the toggle) and is
  used there.
- `Select` — rebuilt as a native `<select>` (consistent with `Input`) with an `inline` variant
  that drops the `FieldShell` label wrapper, so it fits the compact merchandise size control beside
  its "Size:" label. The merchandise size now uses it.

So every scaffolded primitive in the kit is now actually consumed.

## Options considered

### Option A — `lib/nitra-ui` flat per-component kit with `@lib` alias (chosen)

- Pros: clear primitive/feature split; uniform `@lib/nitra-ui/*` imports; no barrels; the kit is
  a reusable contract; wiring the primitives removed three inline duplications.
- Cons: a one-time large import churn; a second top-level source root to learn.

### Option B — keep everything under `src/components`, just sub-folder it (e.g. `components/ui/`)

- Pros: no alias, no move out of `src`.
- Cons: still entangled with app code under the same root; weaker signal that the kit is a
  standalone, reusable contract; doesn't match the `pets-ui` mental model the owner wanted.

### Option C — publish a real package (separate workspace / npm)

- Pros: hardest boundary; independently versionable.
- Cons: build/tooling overhead unjustified for a single-app assignment; slower iteration.

## Why we picked A

It gives the strongest in-repo boundary without package tooling: a single, discoverable home
for shared UI, a uniform import path, and a natural place for future components, icons, and
token docs. The move also forced the dead-primitive audit that removed real duplication.

## Consequences

- Positive: shared UI is one flat, barrel-free library behind `@lib/nitra-ui/*`; the wizard's
  buttons and segmented controls are no longer re-implemented per step.
- Positive: adding a new shared component is "drop a folder in `lib/nitra-ui`, import via `@lib`".
- Negative: contributors must remember the split — primitives go in the lib, anything that knows
  about the wizard stays in `src/components`.
- Positive: every kit primitive is consumed — `Checkbox` (Step 2 selection indicator) and `Select`
  (merchandise size, via its `inline` variant) were redesigned to fit real usages rather than left
  as dead code.
- Gotcha: Quasar's `.flex` utility sets `flex-wrap: wrap`; `OptionGroup` pins `flex-nowrap` so
  segments stay on one row.

## Revisit when

- A second surface (or design-system consumer) needs the kit — consider Option C (real package).
- The remaining direct `q-icon` call sites in app components are worth migrating to the `Icon`
  wrapper for full consistency.
