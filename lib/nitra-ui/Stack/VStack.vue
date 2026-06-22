<script setup lang="ts">
import { computed } from 'vue'

/** Vertical flex container with a gap. `gap` is in 4px units (gap=2 -> 8px), like pets-ui. */
const props = withDefaults(
  defineProps<{
    gap?: number
    align?: 'start' | 'center' | 'end' | 'stretch'
    justify?: 'start' | 'center' | 'end' | 'between'
  }>(),
  { gap: 0 },
)

const MAP = {
  start: 'flex-start',
  center: 'center',
  end: 'flex-end',
  stretch: 'stretch',
  between: 'space-between',
} as const

const style = computed(() => ({
  display: 'flex',
  flexDirection: 'column' as const,
  gap: `${props.gap * 4}px`,
  alignItems: props.align ? MAP[props.align] : undefined,
  justifyContent: props.justify ? MAP[props.justify] : undefined,
}))
</script>

<template>
  <div :style="style">
    <slot />
  </div>
</template>
