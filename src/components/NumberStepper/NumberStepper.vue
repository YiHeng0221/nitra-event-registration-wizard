<script setup lang="ts">
import { computed } from 'vue'
import FieldShell from 'src/components/FieldShell/FieldShell.vue'

const props = withDefaults(
  defineProps<{
    min?: number
    max?: number
    step?: number
    disabled?: boolean
    label?: string
    error?: string
  }>(),
  { min: 0, step: 1 },
)

const model = defineModel<number>({ default: 0 })

const atMin = computed(() => model.value <= props.min)
const atMax = computed(() => props.max !== undefined && model.value >= props.max)

/** Keep a value within [min, max]. */
function clamp(value: number): number {
  const lowerBounded = Math.max(value, props.min)
  return props.max !== undefined ? Math.min(lowerBounded, props.max) : lowerBounded
}

function decrement(): void {
  if (!props.disabled && !atMin.value) model.value = clamp(model.value - props.step)
}

function increment(): void {
  if (!props.disabled && !atMax.value) model.value = clamp(model.value + props.step)
}
</script>

<template>
  <FieldShell
    :label="label"
    :error="error"
  >
    <template #default="{ controlId, describedBy, invalid }">
      <div
        :id="controlId"
        role="group"
        class="inline-flex items-center gap-1"
        :aria-describedby="describedBy"
      >
        <button
          type="button"
          aria-label="Decrease quantity"
          class="bg-surface-l2 text-neutral flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-0 text-base leading-none disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="disabled || atMin"
          @click="decrement"
        >
          <q-icon
            name="remove"
            size="16px"
          />
        </button>
        <span
          class="min-w-7 text-center text-subtitle2"
          :class="invalid ? 'text-danger' : 'text-neutral'"
        >
          {{ model }}
        </span>
        <button
          type="button"
          aria-label="Increase quantity"
          class="bg-surface-l2 text-neutral flex h-7 w-7 cursor-pointer items-center justify-center rounded-md border-0 text-base leading-none disabled:cursor-not-allowed disabled:opacity-40"
          :disabled="disabled || atMax"
          @click="increment"
        >
          <q-icon
            name="add"
            size="16px"
          />
        </button>
      </div>
    </template>
  </FieldShell>
</template>
