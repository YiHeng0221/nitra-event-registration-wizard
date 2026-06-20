# ADR-0002 — Adopt zod for form validation

- **Date**: 2026-06-19
- **Status**: Accepted
- **Deciders**: project owner
- **Related**: ADR-0003, `schemas/`

## Context

Submission validates every field across all four steps at once, and must report which step each error
belongs to so the user can jump back. Several rules are non-trivial: a valid email and phone format, a
ticket selection, and a conditional rule where the shipping address becomes required only when
merchandise is selected. We want one declarative place to express these rules, reused between the
per-step checks and the final submit check, rather than scattering imperative `if` statements.

## Decision

Add **zod** as a runtime dependency. Define one schema per step plus a composed registration schema.
Validation calls `safeParse`; zod's structured `issues` (each with a `path` and `message`) are mapped
to a flat field-error record and to the owning step for error navigation. The conditional
shipping-address rule is expressed with `superRefine` on the composed schema.

## Options considered

### Option A — zod (chosen)

- Pros: declarative schemas; one schema serves both per-step and global validation; `safeParse`
  returns a structured error tree that maps cleanly to fields and steps; `superRefine` handles
  cross-field conditional rules; well-typed messages.
- Cons: one added dependency (~small, tree-shakeable, pure).

### Option B — Hand-written validation functions

- Pros: no dependency.
- Cons: imperative rule code is verbose and easy to drift out of sync between the per-step and the
  final submit pass; mapping errors back to fields/steps becomes bespoke plumbing; conditional rules
  read poorly.

### Option C — Quasar's built-in field `rules`

- Pros: no dependency; integrates with `QInput`.
- Cons: rules are per-field and tied to component instances, which fights the requirement to validate
  the *whole* form at submit time independently of which steps have been mounted; no single composed
  schema for the global pass.

## Why we picked A

- The spec's shape — per-step schemas that also compose into one global submit check, plus a
  conditional cross-field rule and error-to-step mapping — is exactly what a schema library expresses
  cleanly. The structured error output is the deciding factor: it turns "which step is wrong" into a
  trivial lookup instead of bespoke code.
- The dependency cost is low and is documented here and in `PLAN.md` as required.

## Consequences

- Positive: a single declarative source for validation, reused across per-step and submit passes.
- Positive: error navigation falls out of the schema's `path` metadata.
- Negative: one new dependency to justify and keep current.
- Neutral: pure time-conflict detection stays outside zod (plain functions) — see ADR-0003 — because
  it is data-driven business logic, not field shape validation.

## Revisit when

- Validation needs collapse to a couple of trivial required-field checks (then hand-written is fine), or
- We adopt a form library whose validation integration would subsume zod.
