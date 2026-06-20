# Project Contract — Event Registration Wizard

A 4-step registration wizard (Attendee → Sessions → Add-ons → Review) on the preconfigured Quasar
starter. Pure client-side SPA. Architectural decisions live in `doc/` (ADRs).

## Build / Run

```bash
yarn          # install (Node 22.17.0, yarn 4.6.0)
yarn dev      # dev server, port 9001
yarn lint     # ESLint + typescript-eslint + eslint-plugin-vue (ADR-0004); lint:fix to autofix
yarn typecheck # vue-tsc --noEmit (ADR-0006)
yarn build    # production build — must pass before any PR
```

## Architecture boundaries

- Stack: Vue 3.5.17 (`<script setup lang="ts">`), Quasar 2.18.5, UnoCSS, vue-router 4.5, **TypeScript** (ADR-0006).
- Keep **JSDoc** describing intent on non-trivial functions; let TS carry the types (zod schemas infer types via `z.infer`).
- Cross-step state: one `reactive()` composable, the single source of truth — **not Pinia** (ADR-0001).
- Validation: zod, per-step + composed schema, run **once at submit** — never gate navigation (ADR-0002/0003).
- Logic lives in `use*` composables; components only render.

## Conventions

| Category | Rule |
|----------|------|
| Components | PascalCase `.vue` (`<script setup lang="ts">`), own folder, **no `index.ts` barrel**; import via `src/...` alias by repeated name (e.g. `import AppInput from 'src/components/AppInput/AppInput.vue'`) |
| Composables | camelCase `use*.ts`, one per file |
| Schemas | `*.schema.ts`; derive types with `z.infer<typeof schema>` |
| Bindings | `defineModel()` for fields; `computed` for derived state; `watch` only for side effects |
| Styling | semantic UnoCSS shortcuts only (`src/unocss/semantic.js`) — **never hardcode hex** |
| Names | fully spelled out; JSDoc (intent) on every non-trivial function |

## Business rules (source of truth: README + `src/mocks/`)

- Prices/perks read from `src/mocks/event.js` — never hardcode.
- VIP 10% discount applies to **workshops only**.
- Shipping address required **only** when merchandise is selected.
- `registered >= capacity` → session shown **full**; workshop overlapping a selected session → **unavailable**.
- Session↔session conflicts are allowed during selection, surfaced only at submit.
- Currency formatted `$X,XXX.XX`. Handle hover / active / disabled / error / full states.

## NEVER

- Commit to `main`, or force-push shared history.
- Modify provided files: `src/mocks/**`, `src/unocss/**`, `src/css/colors.scss`, `yarn.lock` (a hook blocks this).
- Hardcode hex colors, or gate forward navigation on validation.
- Claim something works without running `yarn dev` / `yarn build`.

## ALWAYS

- Branch before committing; keep commits atomic + Conventional Commits.
- Self-review with the `code-review` skill before pushing.
- A husky `pre-push` hook runs `yarn lint` (ADR-0005) — keep lint green so pushes aren't blocked.

## Verification — definition of done

- `yarn lint`, `yarn typecheck`, and `yarn build` pass; `yarn dev` runs the slice clean from a fresh install.
- No hardcoded hex; semantic tokens only. All interactive states handled.
- Pure functions cover edge cases (empty, boundary, overlapping ranges).
- No stray TODO unless explicitly tracked.

## Workflow skills (`.claude/skills/`)

`fe-implement-spec` (plan) → `implement` (build a slice) → `code-review` (self-review) → `create-pr` (open PR).

## Compact Instructions

When compressing context, preserve in priority order:

1. Architecture decisions and ADR rationale (NEVER summarize away).
2. Which files were modified and their key changes.
3. Current verification status (`yarn build` / `yarn dev` pass/fail).
4. Open TODOs, the current branch, and any rollback notes.
5. Tool outputs may be dropped — keep only pass/fail and the failing line.
