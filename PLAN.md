# PLAN.md — Development Journal

Event Registration Wizard for *WebDev Summit 2028* (Vue 3.5.17 + Quasar 2.18.5 + UnoCSS +
TypeScript). This is the development journal the brief asks for: how I planned, the decisions I
made and why, the dependencies I added, how I worked with AI tools, the challenges I hit, and what
I'd do with more time.

Architecture decisions are recorded as ADRs in [`doc/`](doc/) and referenced throughout.

---

## 1. How I planned and broke down the task

I read the brief and the repo `README.md` first and split the work into **foundation → vertical
slices → fidelity → polish**, so that every step was demoable on its own:

1. **Foundation** — tooling and contracts before features: an `ESLint` setup, a husky pre-push
   lint gate, a `CLAUDE.md` project contract, and a `doc/` folder of ADRs for the decisions I
   knew would be contentious (state management, validation strategy). I wrote the shared
   primitives (typography, layout, cards, inputs) before the steps so the steps could compose
   them.
2. **The four steps as vertical slices** — Attendee → Sessions → Add-ons → Review, each reading
   from and writing to one shared store, plus the success screen.
3. **Business logic as pure, testable composables** — `usePricing` (VIP discount), `useConflicts`
   (overlap/capacity), `useValidation` (submit-time), kept out of components.
4. **Design fidelity** — pulling exact values from Figma (not eyeballing) and verifying each
   screen against the design with a screenshot loop.
5. **Polish & nice-to-haves** — responsive layout, i18n (EN + 繁中), and a small extraction of the
   shared UI into a `lib/nitra-ui` kit.

I tracked the larger pieces as GitHub issues/epics and kept commits **atomic and
Conventional-Commit-formatted**, since the brief evaluates commit history as a code-quality signal.

## 2. Key decisions and why

These are summarized here and argued in full in the ADRs:

- **State: one `reactive()` composable, not Pinia** ([ADR-0001](doc/0001-state-management-composable.md)).
  The wizard has a single cross-step object; a module-level `reactive` store behind a
  `useRegistration()` composable is the smallest thing that satisfies "data preserved across
  steps", persists to `localStorage`, and stays unit-testable. Pinia would add a dependency and
  ceremony for one store.
- **Validation: zod, deferred to submit** ([ADR-0002](doc/0002-validation-with-zod.md),
  [ADR-0003](doc/0003-deferred-unified-validation.md)). The brief is explicit that navigation is
  never blocked and validation is unified at submit. I separated **availability** (capacity-full
  and workshop-overlap are live `computed` that disable controls) from **validation** (one
  `validateAll()` at submit). After the first submit, errors re-evaluate **live** so a hint clears
  the instant the user fixes it — without a second submit.
- **Overlapping sessions: red border + hint, not disabled.** The Figma frame shows overlapping
  sessions disabled, but the spec says sessions stay freely selectable and conflicts surface at
  submit (only *workshops* disable on overlap). I followed the spec and documented the divergence
  in ADR-0003 — see §5.
- **Typography through a `<Text>` component** with style-guide variants, never raw `px`, so the
  type scale stays consistent and tokenized.
- **TypeScript with JSDoc kept for intent** ([ADR-0006](doc/0006-typescript-with-jsdoc.md));
  **ESLint over oxlint** ([ADR-0004](doc/0004-eslint-over-oxlint.md)); **pre-push lint gate**
  ([ADR-0005](doc/0005-pre-push-lint-hook.md)).
- **A shared UI library, `lib/nitra-ui`** ([ADR-0007](doc/0007-shared-ui-library.md)). Late in the
  project I split the app-agnostic primitives out of `src/components` into a flat, barrel-free kit
  imported via an `@lib` alias, added a `Button`, and made `OptionGroup` the single segmented
  control used by the day toggle, the category tabs, and the language switcher.

## 3. Dependencies I added (and the alternatives)

The starter ships Vue, Quasar, and UnoCSS preconfigured. I added exactly two runtime dependencies:

- **`zod`** — schema validation. *Problem:* a unified, declarative, type-inferring validation pass
  at submit with good error messages. *Alternatives:* `yup` (heavier, weaker TS inference),
  `valibot` (lighter but less familiar), or hand-rolled validators (more code, no inferred types).
  zod gives `z.infer` types for free, composes per-step schemas into one, and supports the
  conditional "shipping required when merchandise selected" rule via `superRefine`.
- **`vue-i18n`** (v11) — for the *nice-to-have* internationalization. *Problem:* EN + Traditional
  Chinese with a runtime language switch. *Alternatives:* a hand-rolled `t()` over a dictionary
  (fine for chrome, but I also wanted interpolation, pluralization-ready keys, and to localize zod
  messages), or `@intlify` lower-level APIs. vue-i18n is the de-facto Vue solution and integrates
  cleanly as a Quasar boot file.

Dev-only: ESLint + `eslint-plugin-vue` + `typescript-eslint`, husky. Date/number formatting uses
the platform `Intl` API (no dependency).

## 4. How I used AI tools

I used **Claude Code** (Claude Opus) as the primary pair, driven mostly from the terminal with the
**Figma MCP** and **Playwright** wired in. This was deliberate, reviewed collaboration — not
blind acceptance. The most useful patterns, and the places the AI fell short, were:

**What worked well**

- **Exact design values over eyeballing.** Early fidelity passes had the AI "matching" screenshots
  by eye and getting paddings, weights, and border colors subtly wrong. The fix was to stop
  eyeballing and pull exact values from Figma via the MCP (`get_design_context` /
  `get_variable_defs`) — real hex, sizes, and the React/Tailwind reference — then translate them to
  our UnoCSS semantic tokens. Fidelity jumped immediately. *Prompt that worked:* "pull the exact
  spec for node X with get_design_context and get_variable_defs, don't eyeball the screenshot."
- **A self-checking visual loop.** I had the AI drive the running app with Playwright, screenshot
  each step at desktop and mobile widths, and compare against the Figma frame — so "looks done"
  became "here's the screenshot vs the design." This caught regressions a human glance would miss.
- **An AI code-review GitHub Action that reviews every PR** and, notably, **caught real bugs in my
  own changes** — e.g. it flagged that the review workflow appended a new comment on every push
  (comment spam), that a `Stepper` had coupled the library to `vue-i18n` against its own ADR, and
  an unguarded type cast in the locale switcher. I fixed each and re-ran the review — a genuine
  "AI reviews AI, human arbitrates" loop.
- **ADRs and this journal** were drafted with AI and then edited for accuracy — fast to produce,
  honest once reviewed.

**Where AI fell short (and how I corrected it)**

- **Tooling quirks it didn't know.** UnoCSS `border-[var(--x)]` is parsed as the `border`
  shorthand and silently resets width/style (selected cards lost their 2px border); Quasar's
  `.flex` utility forces `flex-wrap: wrap` (segmented controls wrapped on mobile); Quasar's
  `.hidden` is `!important` (so `md:block` couldn't override it). The AI produced plausible code
  that was subtly wrong; I diagnosed each by inspecting computed styles in the browser and pinned
  the fix (`border-[color:var(...)] border-solid`, `flex-nowrap`, `max-md:hidden`).
- **The review workflow "passed" while posting nothing.** This took several rounds. The root cause
  was an expired `CLAUDE_CODE_OAUTH_TOKEN` (the action errored on turn 1 — `is_error: true`,
  `num_turns: 1` — but the job still exited 0). A second, AI-introduced regression: path-scoping
  the agent's `Write` tool (`Write(review-output.md)`) is **not** honored by the action and denied
  *all* writes. The lesson I took: don't trust a green check — verify the actual artifact, and make
  the *workflow* (not the model) responsible for the deterministic step (posting the comment).
- **Over-claiming.** At one point the AI told me unit tests were a requirement, citing our own
  `CLAUDE.md` "definition of done" rather than the actual brief (which lists test coverage under
  *Not Evaluated*). I caught it by re-reading the spec. Worth stating plainly: AI output needs the
  same "where's the source?" scrutiny as anything else.

Net: AI massively accelerated the boring and the broad (scaffolding, token translation, repetitive
i18n extraction, screenshot QA), but every non-trivial decision and every "it works" claim was
verified — `yarn lint && yarn typecheck && yarn build` plus a screenshot on every meaningful change.

## 5. Challenges and how I solved them

- **Design fidelity** — solved by switching from eyeballing to exact Figma MCP values + a
  Playwright screenshot-vs-design loop (§4).
- **Validation UX** — "free navigation + unified submit validation" *and* "errors clear as you
  fix them" seem to conflict. Resolved by separating availability (live `computed`) from validation
  (submit-time), then making the error state a `computed` that only surfaces after the first submit
  and re-evaluates live thereafter. Never gates navigation. ([ADR-0003](doc/0003-deferred-unified-validation.md))
- **Spec vs. Figma for overlapping sessions** — the design disables them; the spec keeps them
  selectable with conflicts at submit. I followed the spec and surfaced conflicts as a red
  border + inline hint (plus the step badge and review banner), documenting the divergence so the
  next reader isn't surprised.
- **i18n of provided mock data** — `src/mocks/**` are provided files I must not edit, so ticket /
  session / add-on copy can't live with translations. I mirrored their text into id-keyed
  `content.{en,zh-TW}.ts` catalogs resolved by a `useLocale()` composable, made dates format in the
  active locale via `Intl`, and turned zod messages into i18n keys translated at display time — so
  switching language also translates validation hints.
- **Toolchain collisions** — the UnoCSS/Quasar gotchas in §4.
- **A trustworthy AI review pipeline** — re-architected so a workflow step captures the diff, the
  agent only *writes* the review to a file, and a final step *always* posts it (sticky, edited in
  place), with the review itself in Traditional Chinese.

## 6. What I'd improve with more time

- **Unit tests.** Test coverage is explicitly *not evaluated*, so I prioritized features — but the
  pure logic (`isOverlapping`, `usePricing`, `useConflicts`, `validateAll`) is exactly what I'd
  cover first with Vitest for regression safety.
- **Accessibility depth** — arrow-key roving focus for the segmented `OptionGroup` (ARIA radio
  pattern), and a fuller focus-management pass on step transitions.
- **Wire the remaining primitive** — `Select` is in `lib/nitra-ui` but the merchandise size uses an
  inline `<select>`; I'd add an inline/un-labelled variant so the component fits that usage.
- **Animation polish** — richer step transitions and micro-interactions on selection.
- **Real submit** — replace the mock submit with an API call, with loading/error states and
  optimistic UI.

---

### Running it

```bash
yarn          # Node 22.17.0
yarn dev      # http://localhost:9001
yarn lint && yarn typecheck && yarn build   # all green
```
