<script setup lang="ts">
import { computed } from 'vue'
import Paper from 'src/components/Paper/Paper.vue'

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
  <Paper
    :level="level"
    :bordered="false"
    padding="md"
    role="button"
    :aria-pressed="selected"
    :aria-disabled="disabled || full"
    :tabindex="selectable ? 0 : -1"
    class="block shadow-[0px_4px_16px_0px_rgba(0,0,0,0.08),0px_1px_3px_0px_rgba(0,0,0,0.04)] transition-colors"
    :class="[
      selected
        ? 'border-brand-emphasis bg-brand-subtle-rest border-2'
        : 'border-neutral-muted border',
      !selected && (disabled || full) ? 'bg-surface-l2' : '',
      selectable ? 'cursor-pointer hover:bg-surface-l1' : 'cursor-not-allowed opacity-70',
    ]"
    @click="activate"
    @keydown="onKeydown"
  >
    <slot />
  </Paper>
</template>
