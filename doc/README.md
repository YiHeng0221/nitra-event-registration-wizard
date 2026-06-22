# Architecture Decision Records

These ADRs capture *why* we made each non-obvious technical choice for the registration wizard.
They are dated, numbered, and ordered chronologically as the decisions were made. Each records the
context, the options weighed, and the reasoning — so the choices can be audited and revisited later.

## Index

| # | Title | Status | Date |
|---|-------|--------|------|
| 0001 | [Cross-step state with a composable, not Pinia](0001-state-management-composable.md) | Accepted | 2026-06-19 |
| 0002 | [Adopt zod for form validation](0002-validation-with-zod.md) | Accepted | 2026-06-19 |
| 0003 | [Deferred unified validation over a single source of truth](0003-deferred-unified-validation.md) | Accepted | 2026-06-19 |
| 0004 | [ESLint + eslint-plugin-vue over oxlint](0004-eslint-over-oxlint.md) | Accepted | 2026-06-20 |
| 0005 | [Pre-push lint gate via husky](0005-pre-push-lint-hook.md) | Accepted | 2026-06-20 |
| 0006 | [TypeScript, with JSDoc kept for intent](0006-typescript-with-jsdoc.md) | Accepted | 2026-06-20 |
| 0007 | [Shared UI library in lib/nitra-ui](0007-shared-ui-library.md) | Accepted | 2026-06-22 |

## When to write an ADR

Write one when a choice has two or more reasonable alternatives and getting it wrong is costly:
state management, adding a dependency, a validation strategy, a cross-cutting data-flow pattern.

Skip ADRs for everyday choices (file naming, commit format, where a helper lives).

## Conventions

- Filename: `0NNN-<kebab-case-slug>.md` (3-digit, zero-padded).
- Status lifecycle: **Proposed** → **Accepted** → **Superseded by ADR-NNNN** / **Deprecated**.
- Once Accepted, an ADR is immutable; revise by superseding it with a new entry.
