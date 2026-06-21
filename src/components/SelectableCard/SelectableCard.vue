<script setup lang="ts">
import { computed } from 'vue'
import Paper from 'src/components/Paper/Paper.vue'

const props = defineProps<{
  selected?: boolean
  disabled?: boolean
  /** Sold out — rendered non-selectable and dimmed (often paired with a FULL chip). */
  full?: boolean
}>()

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
    :level="0"
    bordered
    padding="md"
    role="button"
    :aria-pressed="selected"
    :aria-disabled="disabled || full"
    :tabindex="selectable ? 0 : -1"
    class="block transition-colors"
    :class="[
      selected
        ? 'border-brand-emphasis bg-brand-subtle-rest shadow-[0_0_0_1px_var(--border-brand-emphasis)]'
        : '',
      selectable ? 'cursor-pointer hover:bg-surface-l1' : 'cursor-not-allowed opacity-60',
    ]"
    @click="activate"
    @keydown="onKeydown"
  >
    <slot />
  </Paper>
</template>
