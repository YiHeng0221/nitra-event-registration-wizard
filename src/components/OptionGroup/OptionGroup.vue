<script setup lang="ts">
/** A single segmented option. */
export interface SegmentedOption {
  label: string
  value: string | number
  disabled?: boolean
}

const props = defineProps<{
  options: SegmentedOption[]
  disabled?: boolean
  label?: string
}>()

const model = defineModel<string | number | null>({ default: null })

function select(option: SegmentedOption): void {
  if (props.disabled || option.disabled) return
  model.value = option.value
}
</script>

<template>
  <div
    role="radiogroup"
    :aria-label="label"
    class="inline-flex flex-wrap gap-2"
  >
    <button
      v-for="option in options"
      :key="String(option.value)"
      type="button"
      role="radio"
      :aria-checked="model === option.value"
      :disabled="disabled || option.disabled"
      class="rounded border px-3 py-1 text-subtitle2 transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      :class="
        model === option.value
          ? 'bg-brand-emphasis-rest text-inverse border-brand-emphasis'
          : 'bg-surface-l0 text-neutral border-neutral-muted hover:bg-surface-l2'
      "
      @click="select(option)"
    >
      <slot
        name="option"
        :option="option"
      >
        {{ option.label }}
      </slot>
    </button>
  </div>
</template>
