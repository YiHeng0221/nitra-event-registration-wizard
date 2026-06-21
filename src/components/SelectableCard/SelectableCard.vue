<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    selected?: boolean
    disabled?: boolean
    /** Sold out — non-selectable and dimmed. */
    full?: boolean
    /** Surface level when unselected (tickets use 1, sessions use 0). */
    level?: 0 | 1 | 2 | 3
  }>(),
  { level: 1 },
)

const emit = defineEmits<{ select: [] }>()

const selectable = computed(() => !props.disabled && !props.full)

// Static so UnoCSS keeps every class.
const SURFACE = {
  0: 'bg-surface-l0',
  1: 'bg-surface-l1',
  2: 'bg-surface-l2',
  3: 'bg-surface-l3',
} as const

const cardClass = computed(() => {
  if (props.selected) return 'bg-brand-subtle-rest border-2 border-brand-emphasis'
  if (props.disabled || props.full) return 'bg-surface-l2 border border-neutral-muted'
  return `${SURFACE[props.level]} border border-neutral-muted`
})

function activate(): void {
  if (selectable.value) emit('select')
}
function onKeydown(event: KeyboardEvent): void {
  if ((event.key === 'Enter' || event.key === ' ') && selectable.value) {
    event.preventDefault()
    emit('select')
  }
}
</script>

<template>
  <div
    role="button"
    :aria-pressed="selected"
    :aria-disabled="disabled || full"
    :tabindex="selectable ? 0 : -1"
    class="block rounded-md p-4 shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08),0px_1px_3px_0px_rgba(0,0,0,0.04)] transition-colors"
    :class="[cardClass, selectable ? 'cursor-pointer' : 'cursor-not-allowed opacity-70']"
    @click="activate"
    @keydown="onKeydown"
  >
    <slot />
  </div>
</template>
