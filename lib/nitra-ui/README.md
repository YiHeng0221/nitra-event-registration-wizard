# nitra-ui

The shared, app-agnostic UI library (see [ADR-0007](../../doc/0007-shared-ui-library.md)).
Flat, one folder per component, **no barrels** — import directly:

```ts
import Text from '@lib/nitra-ui/Text/Text.vue'
import Button from '@lib/nitra-ui/Button/Button.vue'
```

`@lib` is wired in `quasar.config.js` (`build.alias`) and propagated to TypeScript by
`quasar prepare`.

## Components

| Component | Purpose |
|-----------|---------|
| `Text` | Typography — style-guide variants (`h1…`, `subtitle*`, `body*`), no raw px |
| `Stack/VStack`, `Stack/HStack` | Flex layout, `gap` in 4px units |
| `Card` | Surface container (levels + padding) |
| `SelectableCard` | Clickable/selectable card (selected, full, disabled, error) |
| `Button` | `primary` / `secondary` / `ghost` |
| `Input` | Text field (in a `FieldShell`) |
| `Select` | Native `<select>` field; `inline` variant drops the `FieldShell` (used for merch size) |
| `NumericInput` | Quantity stepper with min/max |
| `Checkbox` | Presentational `check_box` indicator (parent owns the toggle) — used by Step 2 cards |
| `Chip` | Pill/badge — `neutral` / `success` / `danger` / `custom` |
| `OptionGroup` | Segmented control — `tab` / `pill`, `block` for full-width mobile |
| `FieldShell` | Label / required / help / error wrapper for form controls |
| `Banner` | Info / warning banner |
| `Stepper` | Numbered step indicator |
| `Icon` | Thin wrapper over `q-icon` |

## Tokens & icons

- **Tokens** are *consumed*, not redefined here: the library styles with the project's UnoCSS
  semantic shortcuts (`bg-surface-l0`, `text-neutral`, `border-neutral-muted`, …), which resolve
  to the provided design tokens in `src/unocss/**` and `src/css/colors.scss` (provided files —
  not edited). Never hardcode hex in the library.
- **Icons** go through `Icon` (a `q-icon` wrapper); colour them with a `text-*` class.

## Conventions

- One component per folder, `PascalCase`, `<script setup lang="ts">`, no `index.ts` re-exports.
- Components render and emit only; cross-step state and business logic live in app composables.
- Anything that knows about *this wizard* (header, shell, steps, order summary, success, the
  locale switcher) stays in `src/components`, not here.
