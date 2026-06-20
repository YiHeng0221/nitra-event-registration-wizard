# ADR-0004 — ESLint + eslint-plugin-vue over oxlint

- **Date**: 2026-06-20
- **Status**: Accepted
- **Deciders**: project owner
- **Related**: `eslint.config.js`, `CLAUDE.md` (Verification), `.github/workflows/ci.yml`

## Context

The project needs a linter as a code-quality gate (run in CI and as an editor feedback hook).
On the larger React/TypeScript projects I usually work on, my habit is to reach for **oxlint** as a
fast first pass — on a big codebase its speed (Rust-based, near-instant) is a real workflow win.

This project is different in two ways that matter for that choice: it is a **Vue 3** codebase, and it
is **small** (a single wizard app, not a large monorepo). Linting value here comes from catching
Vue-specific mistakes, not from shaving seconds off a large lint run.

## Decision

Use **ESLint (flat config) with `eslint-plugin-vue`** as the project's linter. Lint both `<script>`
and `<template>` of `.vue` files with the plugin's `flat/recommended` ruleset, plus a few
project-specific rules (enforce `<script setup>`, `defineModel` macro order). Expose `yarn lint` /
`yarn lint:fix`, run `yarn lint` in CI, and lint each edited file via an editor hook.

Do **not** adopt oxlint for this project.

## Options considered

### Option A — ESLint + eslint-plugin-vue (chosen)

- Pros: full Vue coverage — template **and** script; the complete `vue/*` ruleset catches the
  Vue-specific bugs that actually cost quality points (`v-for` without `:key`, undefined template
  refs, `v-model` misuse); the standard choice for Quasar/Vue 3; flat-config native.
- Cons: slower than oxlint — negligible on a project this size.

### Option B — oxlint only

- Pros: extremely fast; my usual go-to on large React projects.
- Cons: oxlint lints **only the `<script>` block** of `.vue` files and does **not** implement
  `eslint-plugin-vue` rules — no template linting at all. For a Vue app that leaves the most
  Vue-specific class of bugs completely unchecked. Speed is the wrong thing to optimise for here.

### Option C — oxlint + ESLint chain (oxlint fast pass, then ESLint for Vue)

- Pros: fast feedback on plain JS plus full Vue coverage; the right call on a large codebase where
  oxlint's speed pays off.
- Cons: two linters and an extra config file (`.oxlintrc.json`) to maintain for a small project; the
  speed benefit is imperceptible at this scale — added setup for no practical gain.

## Why we picked A

- The decisive factor is Vue coverage, not speed. oxlint's `.vue` support stops at the script block,
  so on its own (Option B) it misses template-level issues entirely; ESLint + eslint-plugin-vue covers
  both.
- The oxlint speed advantage that justifies my usual React workflow (and Option C's chain) only pays
  off at scale. This project is small enough that ESLint's runtime is a non-issue, so the extra
  tooling of a chain isn't worth it.

## Consequences

- Positive: complete, idiomatic Vue linting in CI and in-editor; one toolchain, one config.
- Negative: slower than an oxlint-based setup — immaterial at this size.
- Neutral: if this codebase ever grew large, revisiting Option C (oxlint pre-pass + ESLint for Vue)
  would be the natural move.

## Revisit when

- The codebase grows large enough that ESLint runtime becomes a felt cost, **or**
- oxlint ships first-class `eslint-plugin-vue`-equivalent template rules — at which point the
  fast-pass chain becomes attractive again.
