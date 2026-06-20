---
name: code-review
description: Review the current diff before push — three lenses (correctness / Vue patterns & design / architecture), severity-tagged findings, read-only. Use on "review this", "self-review", before opening a PR.
---

# Code Review

Review a change before it ships. You read and report — you don't rewrite the code (that's the author's
or the `implement` skill's job). Assume a fresh-session perspective: check for missing context.

## Scope the diff

```bash
git fetch origin main
git diff origin/main...HEAD          # full change under review
git diff --name-only origin/main...HEAD
```

## The three lenses (apply in order)

### 1. Correctness & business logic

- Edge cases in pure functions: empty selection, single item, boundary times, exact `registered == capacity`.
- Time-conflict math: overlap is `startA < endB && startB < endA`; touching edges (`end == start`) do **not** conflict. Verify both session↔session and workshop↔session.
- Pricing: ticket from `event.js`, VIP 10% off **workshops only**, currency formatted `$X,XXX.XX`, totals recompute reactively.
- Validation: runs at submit (not gating nav), aggregates all steps, conditional shipping-required-when-merch, maps errors to the correct step.
- Null safety: optional fields (sizes, maxQuantity, address), missing selections, defensive defaults.

### 2. Vue patterns & design fidelity (the graded lenses)

- Logic lives in composables, not stuffed in components.
- `defineModel()` for bound fields; `computed` for derived state; `watch` only for real side effects — flag `watch` that should be `computed`.
- One source of truth: no form data threaded between steps via props; steps read/write the store.
- Components in their own folder, imported by repeated name via `src/` alias — no `index.ts` barrel.
- **No hardcoded hex** — semantic UnoCSS shortcuts only. Flag any raw color.
- Interactive states present: hover / active / disabled / error / full / unavailable.

### 3. Architecture & quality

- Naming matches the domain (ticket, session, workshop, addon, registration); fully spelled out.
- Types come from zod via `z.infer` — flag hand-written types that duplicate a schema; `yarn typecheck` must be green; no stray `any`.
- JSDoc documents intent on non-trivial functions (not restating TS types).
- No premature abstraction (a 3-line helper is fine); no duplicated logic that should be shared.
- Shared shape changes: all references updated together.
- Follows the relevant ADR in `doc/`; flag drift.

## Severity tagging

- 🔴 **Important** — blocks merge: wrong behaviour, broken business rule, hardcoded color, navigation gated by validation, broken `yarn build`.
- 🟡 **Nit** — improvement, non-blocking: naming, micro-perf, style. **Cap 5 per review**; beyond that write "plus N similar".
- 🟣 **Pre-existing** — out of scope of this diff.

Every finding includes four fields:

1. **Severity** — 🔴 / 🟡 / 🟣
2. **Location** — `file_path:line_number`
3. **Problem** — one line.
4. **Why** — one line: the impact, rule violated, or likely bug.

Example:
```
🔴 Important
- Location: src/composables/usePricing.ts:24
- Problem: VIP discount is applied to the full add-on subtotal
- Why: spec says VIP 10% off workshops only — meals/merch must not be discounted; total will be wrong
```

## Verdict

End with a summary:

```
## Review summary

| Lens | 🔴 | 🟡 | 🟣 |
|------|----|----|----|
| Correctness        | N | N | N |
| Vue patterns/design| N | N | N |
| Architecture       | N | N | N |

Top concerns:
1. <one line>
2. <one line>

VERDICT: pass | changes-requested
```

## Never

- Rewrite the PR or suggest changes outside the diff.
- Post a finding without `file_path:line_number`.
- Use 🔴 for style preferences (those are 🟡).
- Skip the lens that bored you.
