# ADR-0005 — Pre-push lint gate via husky

- **Date**: 2026-06-20
- **Status**: Accepted
- **Deciders**: project owner
- **Related**: ADR-0004, `.husky/pre-push`, `.github/workflows/ci.yml`

## Context

CI already lints and builds on every PR, and a PR-time auto-review runs as well. The auto-review
consumes a metered token on every run. A push that fails lint therefore wastes a full CI + auto-review
cycle before the failure is even visible. We wanted a cheap local backstop, especially for edits made
by hand (outside the editor's per-file lint hook).

## Decision

Add **husky** and a `pre-push` git hook that runs **`yarn lint` only**. The hook blocks a push when
lint fails. Build is deliberately **not** run on pre-push — it stays in CI.

## Options considered

### Option A — husky pre-push running `yarn lint` (chosen)

- Pros: fast (seconds); blocks red pushes before they waste a CI + auto-review cycle; reproducible
  because the hook is committed and `prepare: husky` reinstalls it on `yarn install`.
- Cons: one dev dependency; a fourth verification layer on top of three existing ones.

### Option B — pre-push running lint **and** build

- Pros: strongest local gate.
- Cons: a production build takes tens of seconds; running it on every push is disruptive and
  duplicates CI for little gain.

### Option C — no pre-push hook (rely on CI)

- Pros: one fewer dependency and layer to maintain.
- Cons: a trivially lint-failing push still burns a CI run and a metered auto-review token.

## Why we picked A

- The decisive value is avoiding a wasted auto-review token spend on an obviously-broken push; a
  seconds-long lint gate buys that cheaply.
- Keeping the hook lint-only avoids the disruption that makes build-on-push not worth it (Option B).
- husky makes the hook reproducible across clones, unlike an un-versioned native `.git/hooks` script.

## Consequences

- Positive: red-on-lint pushes are stopped locally; no wasted CI/auto-review cycles from them.
- Negative: one more dev dependency and a small amount of hook indirection.
- Neutral: build correctness is still gated — just in CI, where its latency is acceptable.

## Revisit when

- The hook becomes a friction point (e.g. lint grows slow), or
- CI/auto-review cost stops mattering, making the local backstop redundant.
