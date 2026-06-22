<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    level?: 0 | 1 | 2 | 3
    bordered?: boolean
    padding?: 'none' | 'sm' | 'md' | 'lg'
    elevation?: boolean | 'sm' | 'md'
  }>(),
  { level: 1, padding: 'md' },
)

// Static maps so UnoCSS sees every class literally (dynamic names get purged).
const SURFACE = {
  0: 'bg-surface-l0',
  1: 'bg-surface-l1',
  2: 'bg-surface-l2',
  3: 'bg-surface-l3',
} as const
const PADDING = { none: '', sm: 'p-2', md: 'p-4', lg: 'p-6' } as const

const elevationClass = computed(() => {
  if (!props.elevation) return ''
  return props.elevation === 'md' ? 'shadow-md' : 'shadow'
})
</script>

<template>
  <div
    class="rounded-md"
    :class="[
      SURFACE[level],
      PADDING[padding],
      elevationClass,
      bordered ? 'border border-neutral-muted' : '',
    ]"
  >
    <slot />
  </div>
</template>
