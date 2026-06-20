---
name: fe-implement-spec
description: Plan a feature before coding — survey the repo, then write a structured frontend implementation spec (.md). Use on "implementation spec", "plan this feature", "how should I build X".
---

# Frontend Implementation Spec

Turn a requirement into a structured plan **before** writing code: decompose the problem, reuse what
exists, name the risks. Output is a markdown document, not implementation code.

## Default stack (assume it — do not re-ask)

| Aspect | Choice |
|--------|--------|
| Framework | Vue 3.5.17, `<script setup>`, Composition API |
| UI kit | Quasar 2.18.5 |
| Styling | UnoCSS semantic tokens (`src/unocss/semantic.js`) |
| State | `reactive()` composable (ADR-0001) — not Pinia |
| Validation | zod, per-step + global schema (ADR-0002/0003) |
| Language | TypeScript + JSDoc for intent (ADR-0006); zod types via `z.infer` |

If the user states a different choice in conversation, theirs wins.

## Flow: Recon → Collect → Generate

### 1. Recon (silent, then report)

Read before asking. Understand the requirement and the current code:

- Re-read the relevant part of `README.md` (step spec) and the mock shapes in `src/mocks/`.
- Survey existing structure to follow, not reinvent:
  ```bash
  ls src/components src/composables src/schemas src/data 2>/dev/null
  ```
  Note the folder layering, naming conventions (PascalCase components in own folders, `use*`
  composables, `*.schema.ts`), and any reusable component or composable that already exists.
- Check `CLAUDE.md` and `doc/` so the plan respects existing decisions.

Then report back briefly: "Here's my understanding, the reusable pieces I found, the scope I expect,
and the risks I see" — so the user can correct course before detailed Q&A.

### 2. Collect (section-by-section Q&A)

Confirm one section at a time. Propose a draft from the recon rather than asking from scratch.

1. **Goal & scope** — what this slice delivers, in engineering terms, split into add / update / remove.
2. **Component breakdown** — files to add/update, following the own-folder + no-barrel convention; mark
   each new vs updated; give each a one-line responsibility.
3. **State & data flow** — what the slice reads/writes on the registration store; which derived values
   are `computed`; whether any new composable is needed.
4. **Validation** — which fields/rules belong to this slice's zod schema; any conditional/cross-field
   rule; how errors map back to the step.
5. **Reusable pieces** — table of existing vs new components/composables/utilities.
6. **Risks & open questions** — edge cases, design states not covered (loading/empty/error), business
   rules that need confirmation. Mark anything uncertain as "to confirm".
7. **Branch / commit plan** — how this slice splits into atomic commits, and which branch it lands on.

### 3. Generate

Assemble the confirmed sections into one `.md`:

- Metadata block at the top (feature, author, date, related ADRs).
- Tree format for folder structure; markdown tables for breakdowns; `mermaid` for non-trivial data flow.
- **No implementation code** — interfaces, schema field lists, and structure only.
- Save under `doc/specs/` (create it if missing) or where the user asks.

## Notes

- Prose may be English or the user's language; identifiers stay English (PascalCase components,
  camelCase functions/variables).
- Reuse before building. If a component or composable already covers it, say so instead of planning a
  new one.
- Keep the plan honest about uncertainty — flag "to confirm" rather than inventing behaviour.
