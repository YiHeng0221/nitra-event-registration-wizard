<script setup lang="ts">
import Text, { type TextColor } from '@lib/nitra-ui/Text/Text.vue'

withDefaults(
  defineProps<{
    variant?: 'primary' | 'secondary' | 'ghost'
    type?: 'button' | 'submit'
    disabled?: boolean
  }>(),
  { variant: 'primary', type: 'button' },
)

const emit = defineEmits<{ click: [MouseEvent] }>()

interface VariantSpec {
  btn: string
  color: TextColor
}
const VARIANT: Record<'primary' | 'secondary' | 'ghost', VariantSpec> = {
  primary: {
    btn: 'bg-accent-emphasis-rest hover:bg-accent-emphasis-hover rounded-[10px] px-5 py-2',
    color: 'inverse',
  },
  secondary: {
    btn: 'bg-surface-l2 hover:bg-surface-l3 rounded-md px-4 py-2',
    color: 'neutral',
  },
  ghost: {
    btn: 'bg-transparent px-0 py-0 underline-offset-2 hover:underline',
    color: 'brand',
  },
}
</script>

<template>
  <button
    :type="type"
    :disabled="disabled"
    class="cursor-pointer border-0 transition-colors disabled:cursor-not-allowed disabled:opacity-60"
    :class="VARIANT[variant].btn"
    @click="emit('click', $event)"
  >
    <Text
      as="span"
      variant="subtitle2"
      :color="VARIANT[variant].color"
    >
      <slot />
    </Text>
  </button>
</template>
