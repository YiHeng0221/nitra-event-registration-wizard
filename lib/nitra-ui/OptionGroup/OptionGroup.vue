<script setup lang="ts">
import Text from '@lib/nitra-ui/Text/Text.vue'

/** A single segmented option. */
export interface SegmentedOption {
  label: string
  value: string | number
  disabled?: boolean
}

const props = withDefaults(
  defineProps<{
    options: SegmentedOption[]
    /** 'tab' = brand-emphasis selected (day/category bars); 'pill' = raised white selected (compact switch). */
    variant?: 'tab' | 'pill'
    /** Full-width equal segments on mobile (collapses to fit-content on md+). */
    block?: boolean
    disabled?: boolean
    label?: string
  }>(),
  { variant: 'tab' },
)

const model = defineModel<string | number | null>({ default: null })

function select(option: SegmentedOption): void {
  if (props.disabled || option.disabled) return
  model.value = option.value
}

function buttonClass(option: SegmentedOption): string {
  const selected = model.value === option.value
  if (props.variant === 'pill') {
    return [
      'rounded-md px-2.5 py-1',
      selected ? 'bg-surface-l0 shadow-sm' : 'bg-transparent',
    ].join(' ')
  }
  return [
    'rounded-[8px] px-3 py-2',
    props.block ? 'flex-1 md:flex-none md:px-5' : '',
    selected ? 'bg-brand-emphasis-rest' : 'hover:bg-surface-l3 bg-transparent',
  ].join(' ')
}

/** Label colour by selected state + variant (tab-selected is on a brand fill). */
function textColorClass(option: SegmentedOption): string {
  const selected = model.value === option.value
  if (!selected) return 'text-neutral-muted'
  return props.variant === 'tab' ? 'text-inverse' : 'text-neutral'
}
</script>

<template>
  <div
    role="radiogroup"
    :aria-label="label"
    class="bg-surface-l2 flex flex-nowrap gap-1"
    :class="[
      variant === 'pill' ? 'rounded-lg p-0.5' : 'rounded-[10px] p-1',
      block ? 'w-full md:inline-flex md:w-fit' : 'inline-flex w-fit',
    ]"
  >
    <button
      v-for="option in options"
      :key="String(option.value)"
      type="button"
      role="radio"
      :aria-checked="model === option.value"
      :disabled="disabled || option.disabled"
      class="cursor-pointer whitespace-nowrap border-0 text-center transition-colors disabled:cursor-not-allowed disabled:opacity-50"
      :class="buttonClass(option)"
      @click="select(option)"
    >
      <Text
        as="span"
        :variant="variant === 'pill' ? 'body-medium' : 'subtitle2'"
        :class="textColorClass(option)"
      >
        <slot
          name="option"
          :option="option"
        >
          {{ option.label }}
        </slot>
      </Text>
    </button>
  </div>
</template>
