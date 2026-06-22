<script setup lang="ts">
import { computed } from 'vue'
import VStack from '@lib/nitra-ui/Stack/VStack.vue'

const props = withDefaults(
  defineProps<{
    selected?: boolean
    disabled?: boolean
    /** Sold out — non-selectable and dimmed. */
    full?: boolean
    /** Surface level when unselected (tickets use 1, sessions use 0). */
    level?: 0 | 1 | 2 | 3
    /** Inner content gap in 4px units (default 2 → 8px; tickets use 3 → 12px). */
    gap?: number
    /** Validation error — red border overriding the normal/selected border. */
    error?: boolean
  }>(),
  { level: 1, gap: 2 },
)

const emit = defineEmits<{ select: [] }>()

const selectable = computed(() => !props.disabled && !props.full)

const SURFACE = {
  0: 'bg-surface-l0',
  1: 'bg-surface-l1',
  2: 'bg-surface-l2',
  3: 'bg-surface-l3',
} as const

const cardClass = computed(() => {
  // `border-[color:var(...)]` forces colour interpretation so border-width sticks.
  if (props.error) {
    // A conflicting selection: red border, keep the selected/surface background.
    const bg = props.selected ? 'bg-brand-subtle-rest' : SURFACE[props.level]
    return `${bg} border-2 border-solid border-[color:var(--border-danger-emphasis)]`
  }
  if (props.selected) {
    return 'bg-brand-subtle-rest border-2 border-solid border-[color:var(--border-brand-emphasis)]'
  }
  const bg = props.disabled || props.full ? 'bg-surface-l2' : SURFACE[props.level]
  return `${bg} border border-solid border-[color:var(--border-neutral-muted)]`
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
    <VStack :gap="gap">
      <slot />
    </VStack>
  </div>
</template>
