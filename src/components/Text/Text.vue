<script setup lang="ts">
import { computed } from 'vue'

/** Typography variants — values mirror the Figma type tokens (Inter). */
export type TextVariant =
  | 'h1'
  | 'h2'
  | 'h3'
  | 'h4'
  | 'subtitle1'
  | 'subtitle2'
  | 'body-lg'
  | 'body'
  | 'body-medium'
  | 'body-xs'
  | 'body-xs-medium'

/** Semantic text colours (Figma text/* tokens). */
export type TextColor =
  | 'neutral'
  | 'muted'
  | 'quiet'
  | 'disabled'
  | 'inverse'
  | 'brand'
  | 'brand-emphasis'
  | 'danger'
  | 'success'
  | 'warning'
  | 'info'

const props = withDefaults(
  defineProps<{
    variant?: TextVariant
    color?: TextColor
    /** Override the rendered tag (defaults per variant). */
    as?: string
    align?: 'left' | 'center' | 'right'
    nowrap?: boolean
  }>(),
  { variant: 'body', color: 'neutral' },
)

interface VariantSpec {
  size: number
  weight: number
  lineHeight: number
  tag: string
}

const VARIANTS: Record<TextVariant, VariantSpec> = {
  h1: { size: 32, weight: 700, lineHeight: 40, tag: 'h1' },
  h2: { size: 28, weight: 680, lineHeight: 32, tag: 'h2' },
  h3: { size: 24, weight: 680, lineHeight: 28, tag: 'h3' },
  h4: { size: 20, weight: 680, lineHeight: 24, tag: 'h4' },
  subtitle1: { size: 16, weight: 600, lineHeight: 20, tag: 'p' },
  subtitle2: { size: 14, weight: 600, lineHeight: 20, tag: 'p' },
  'body-lg': { size: 16, weight: 485, lineHeight: 24, tag: 'p' },
  body: { size: 12, weight: 485, lineHeight: 16, tag: 'p' },
  'body-medium': { size: 12, weight: 550, lineHeight: 16, tag: 'p' },
  'body-xs': { size: 11, weight: 485, lineHeight: 14, tag: 'p' },
  'body-xs-medium': { size: 11, weight: 570, lineHeight: 14, tag: 'p' },
}

const COLOR_CLASS: Record<TextColor, string> = {
  neutral: 'text-neutral',
  muted: 'text-neutral-muted',
  quiet: 'text-neutral-quiet',
  disabled: 'text-neutral-disabled',
  inverse: 'text-inverse',
  brand: 'text-brand',
  'brand-emphasis': 'text-[var(--bg-brand-emphasis-rest)]',
  danger: 'text-danger',
  success: 'text-success',
  warning: 'text-warning',
  info: 'text-info',
}

const spec = computed(() => VARIANTS[props.variant])
const tag = computed(() => props.as ?? spec.value.tag)
const style = computed(() => ({
  fontFamily: 'Inter, sans-serif',
  fontSize: `${spec.value.size}px`,
  fontWeight: spec.value.weight,
  lineHeight: `${spec.value.lineHeight}px`,
  textAlign: props.align,
  whiteSpace: props.nowrap ? ('nowrap' as const) : undefined,
}))
</script>

<template>
  <component
    :is="tag"
    class="m-0 p-0"
    :class="COLOR_CLASS[color]"
    :style="style"
  >
    <slot />
  </component>
</template>
