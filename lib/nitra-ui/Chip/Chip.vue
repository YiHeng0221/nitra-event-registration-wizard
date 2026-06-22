<script setup lang="ts">
withDefaults(
  defineProps<{
    variant?: 'track' | 'remaining' | 'full'
    size?: 'sm' | 'md'
  }>(),
  { variant: 'track', size: 'sm' },
)

const VARIANT = {
  track: 'bg-surface-l2 text-neutral',
  remaining: 'bg-info-muted-rest text-info-emphasis',
  full: 'bg-danger-emphasis-rest text-inverse',
} as const
const SIZE = {
  sm: 'text-xs px-2 py-0.5',
  md: 'text-sm px-2.5 py-1',
} as const
</script>

<template>
  <span
    class="inline-flex items-center rounded-full font-medium"
    :class="[VARIANT[variant], SIZE[size]]"
  >
    <slot />
  </span>
</template>
