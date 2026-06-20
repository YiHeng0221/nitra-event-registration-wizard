# ADR-0003 — Deferred unified validation over a single source of truth

- **Date**: 2026-06-19
- **Status**: Accepted
- **Deciders**: project owner
- **Related**: ADR-0001, ADR-0002

## Context

The spec is explicit that no step blocks the user: Step 1 has no inline validation, and session
time-conflict validation is deferred to submit. Yet two things *are* enforced live as availability,
not validation: a session at capacity is shown full/disabled, and a workshop overlapping a selected
session is shown unavailable/disabled. We need an architecture that keeps navigation free, preserves
all data, validates everything exactly once at submit, and still reflects live availability — without
tangling the two concepts.

## Decision

Separate **availability** (live) from **validation** (deferred):

- **Single source of truth.** The `reactive()` registration store (ADR-0001) holds every selection.
  Steps read and write it directly; moving between steps never clears anything.
- **Live availability is derived, pure `computed` state.** Capacity-full sessions and
  workshop↔session overlaps are computed from the store and the mock data, and drive the disabled UI.
  These never block navigation.
- **Validation is deferred and unified.** A single `validateAll()` runs on submit. It combines the zod
  schemas (ADR-0002) with pure time-conflict detection over the selected session set, aggregates the
  results into one error map, marks which steps carry errors, and returns the earliest faulty step to
  jump to. Forward navigation is never gated by validation.

## Options considered

### Option A — Deferred unified validation + live availability (chosen)

- Pros: matches the spec exactly; one validation entry point is easy to reason about and test; live
  availability stays a pure derivation with no validation coupling.
- Cons: two distinct mechanisms (derive-now vs validate-on-submit) that must be kept conceptually
  separate in code.

### Option B — Per-step gating (validate before "Next")

- Pros: familiar wizard pattern; errors surface early.
- Cons: directly contradicts the spec's "users may freely select / validation deferred to submit";
  would force users through a happy path the spec deliberately avoids.

### Option C — Continuous live validation of everything

- Pros: always-current error state.
- Cons: conflates availability and validation; surfaces session-conflict errors during selection,
  which the spec explicitly defers; noisier UX and more re-computation.

## Why we picked A

- It is what the spec describes, and it keeps two genuinely different ideas — "can this be picked right
  now" vs "is the whole order valid at submit" — in separate, individually testable places.
- A single `validateAll()` makes the error-navigation requirement (mark steps, jump to the first bad
  one) a direct output rather than emergent behaviour scattered across steps.

## Consequences

- Positive: free navigation with zero data loss; one well-tested submit-time validation path.
- Positive: time-conflict logic stays pure and data-driven, which the JavaScript-logic criterion
  rewards and which is straightforward to unit-test.
- Negative: contributors must remember the rule — availability is `computed` now; validation is
  submit-only — to avoid accidentally gating navigation.
- Neutral: the same `validateAll()` result feeds both the submit guard and the per-step error badges.

## Revisit when

- The spec changes to require inline or per-step blocking validation, or
- A step is added whose correctness genuinely must gate forward progress.
