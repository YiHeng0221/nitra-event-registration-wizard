# ADR-0001 — Cross-step state with a composable, not Pinia

- **Date**: 2026-06-19
- **Status**: Accepted
- **Deciders**: project owner
- **Related**: `CLAUDE.md`, ADR-0003

## Context

The wizard carries one registration object across four steps. Users navigate freely forward and
backward, and no data may be lost between steps. We need a single source of truth that any step can
read and write. Quasar and vue-router are already configured; the app is a pure client-side SPA with
no SSR. The Vue Patterns criterion explicitly rewards "cross-step state management via composable or
provide/inject" and prefers `computed` derived state over manual `watch`.

## Decision

Hold the registration state in a module-level `reactive()` object exposed through a single composable
(`useRegistration`). The object is the source of truth; step components bind to it directly. Derived
values (pricing, conflicts, validity) are `computed`. Persistence to `localStorage` is the one place
we use `watch`, because it is a genuine side effect.

## Options considered

### Option A — `reactive()` composable (chosen)

- Pros: zero dependencies; a module-scope `reactive` *is* a global store with selector-style access
  via `computed`; matches the graded "composable" pattern directly; smallest surface to reason about.
- Cons: persistence and reset are hand-written (a few lines).

### Option B — Pinia

- Pros: official Vue store, devtools time-travel, a ready-made persistence plugin, formal store
  boundaries.
- Cons: overkill for one linear, self-contained wizard; adds a dependency; its main differentiators
  (multiple stores, SSR hydration, devtools debugging of complex mutations) do not apply here.

### Option C — `provide` / `inject` only

- Pros: no module-level singleton; scoped to the wizard subtree.
- Cons: more wiring than a composable for no real gain; harder to unit-test the logic in isolation.

## Why we picked A

- Vue's reactivity already delivers everything a small global store needs: state defined outside
  components, no provider boilerplate, and `computed` selectors. Wrapping that in a library would add
  weight without adding capability.
- There is no SSR and there are no multiple independent stores, so Pinia's strongest reasons to exist
  are absent here.
- It lands squarely on the behaviour the Vue Patterns criterion describes, and keeps the dependency
  list minimal.

## Consequences

- Positive: no extra dependency; the state model is small and explicit; logic is trivially testable.
- Positive: the same composable pattern extends to `usePricing`, `useConflicts`, and `useValidation`.
- Negative: we write our own `localStorage` persistence and `reset()` (minor, and fully under control).
- Neutral: if the app later needed several independent stores or SSR, revisiting this is cheap because
  the composable already isolates the state behind one module.

## Revisit when

- The app grows multiple unrelated stores, or
- Server-side rendering / hydration becomes a requirement.
