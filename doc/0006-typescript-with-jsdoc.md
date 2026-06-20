# ADR-0006 — TypeScript, with JSDoc kept for intent

- **Date**: 2026-06-20
- **Status**: Accepted
- **Deciders**: project owner
- **Related**: ADR-0002 (zod), `tsconfig.json`, `eslint.config.js`, `CLAUDE.md`
- **Revises**: the earlier JavaScript + JSDoc language choice noted in CLAUDE.md

## Context

The starter ships in JavaScript and the rubric explicitly mentions "JSDoc annotations on key
functions", which initially pointed us at JS + JSDoc. But we had already chosen **zod** for validation
(ADR-0002), and zod's biggest payoff — `z.infer<typeof schema>` giving static types for free — is only
realised under TypeScript. In JS we would get zod's runtime validation but throw away its type
inference, duplicating every shape as a JSDoc typedef by hand. The project owner prioritised that
engineering rigour and the zod synergy over staying on the starter's default.

## Decision

Adopt **TypeScript** across the app, and **keep JSDoc for intent** (what a function does and why),
while letting TS carry the types:

- Components use `<script setup lang="ts">`; composables and schemas are `.ts`.
- zod schemas are the source of truth for data shapes; derive types with `z.infer`.
- TS config comes from Quasar's own pipeline: `quasar prepare` generates `.quasar/tsconfig.json`
  (aliases + Quasar types); the root `tsconfig.json` extends it and adds `strict`. A `postinstall:
  quasar prepare` keeps this reproducible on clone.
- Type checking: `vue-tsc --noEmit` (`yarn typecheck`), run in CI.
- ESLint moves to `typescript-eslint`, with `vue-eslint-parser` delegating `<script lang="ts">` to the
  TS parser.

JSDoc stays on non-trivial functions for **description/rationale**, not for restating types.

## Options considered

### Option A — TypeScript + JSDoc-for-intent (chosen)

- Pros: zod schemas infer types via `z.infer` (no duplicated typedefs); compile-time safety across the
  cross-step state, pricing, and conflict logic; stronger code-quality signal; JSDoc still documents
  intent for the rubric.
- Cons: a one-time setup cost (Quasar TS pipeline, tsconfig, typescript-eslint) and a `typecheck` gate
  to maintain.

### Option B — JavaScript + JSDoc (starter default)

- Pros: zero setup; matches the starter and the literal "JSDoc" rubric line.
- Cons: wastes zod's `z.infer`; every shape must be hand-written as a JSDoc typedef and kept in sync;
  no real compile-time guarantees.

### Option C — JavaScript with `checkJs` + JSDoc types

- Pros: some type checking without `.ts` files.
- Cons: JSDoc generics/utility types are clumsy; `z.infer` still awkward to surface; effectively a
  worse TypeScript. Not worth the half-measure.

## Why we picked A

- We had already committed to zod; TypeScript is what makes that choice pay for itself. Pairing zod
  with JS (Option B) keeps the cost of zod without its largest benefit.
- The setup cost is one-time and small because Quasar's `quasar prepare` does the heavy lifting; from
  then on it is just another green gate (`yarn typecheck`).
- Keeping JSDoc for intent preserves the documentation value the rubric asks for without redundantly
  re-typing what TS already expresses.

## Consequences

- Positive: end-to-end types from zod schemas through the store and derived composables; bugs caught at
  compile time; `typecheck` joins lint/build as a CI gate.
- Negative: one more toolchain (typescript, vue-tsc, typescript-eslint) and a `.quasar` prepare step
  to keep reproducible (handled via `postinstall`).
- Neutral: `.vue`/`.ts` files only; the provided `src/mocks/*.js` stay JS and are consumed with
  inferred/declared types.

## Revisit when

- The TS setup becomes a maintenance burden disproportionate to a project this size (unlikely), or
- A future constraint forces a return to plain JS.
