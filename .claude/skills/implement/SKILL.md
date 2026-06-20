---
name: implement
description: Build one wizard slice end-to-end on its own branch with atomic commits. Use on "implement X", "build this step", "code up the spec". Side-effecting (branches + commits) — invoke explicitly.
disable-model-invocation: true
---

# Implement a Slice

Build one self-contained slice (a step, a composable, a shared piece) end-to-end. Optimize for clean,
atomic commit history and adherence to the project's Vue patterns — both are graded.

## Before you write code

1. **Know the slice.** Read the relevant `README.md` step spec, the `src/mocks/` shapes it touches,
   `CLAUDE.md`, and any `doc/` ADR it must follow. If an implementation spec exists, follow it.
2. **Branch.** Never commit to `main`.
   ```bash
   git checkout main && git pull
   git checkout -b feat/<slice-name>
   ```
   Shared utilities (e.g. `cn`, currency/date helpers, the registration store) land on their **own**
   branch and merge first, so feature slices can build on them.

## While building — follow the conventions

- **Composition first.** Logic goes in `use*` composables; components render. Keep one composable per
  file.
- **`defineModel()`** for two-way bound fields; **`computed`** for derived state; reserve **`watch`**
  for real side effects (persistence).
- **One source of truth.** Read/write the registration store; do not thread form data between steps
  via props.
- **Components live in their own folder, no `index.ts` barrel.** Import via the `src/` alias, repeating
  the name in the path.
- **TypeScript** (`<script setup lang="ts">`, `.ts` composables/schemas). Let zod schemas infer types
  with `z.infer`; keep JSDoc for intent, not for restating types.
- **No hardcoded hex** — use the semantic UnoCSS shortcuts. Handle hover / active / disabled / error /
  full states the design calls for.
- **Read prices/perks from `src/mocks/event.js`**; honor the business rules in `CLAUDE.md` (VIP
  discount on workshops only, conditional shipping address, capacity/overlap availability, deferred
  submit-time validation).
- **JSDoc** every non-trivial function (params, return, the rule it implements). Cover edge cases in
  pure functions.

## Commit discipline

- One logical change per commit; do not bundle unrelated edits.
- Conventional Commits: `feat(step2): add session card with capacity full state`,
  `fix(pricing): apply VIP discount to workshops only`, `refactor`, `chore`, `docs`, `test`.
- Commit as you complete each coherent piece, not in one giant dump at the end — the history is part of
  the grade.

## Before handing off

1. **Self-review** with the `code-review` skill; fix what it flags.
2. **Verify it runs:**
   ```bash
   yarn lint       # ESLint clean
   yarn typecheck  # vue-tsc --noEmit clean
   yarn dev        # loads clean, the slice works in the browser
   yarn build      # passes
   ```
3. Report what changed, how you verified it, and anything left to confirm. Then the `create-pr` skill
   opens the PR.

## Never

- Commit to `main`, or force-push shared history.
- Leave hardcoded colors, abbreviated names, or undocumented non-trivial functions.
- Gate forward navigation on validation (validation is submit-only — ADR-0003).
- Claim it works without actually running it.
