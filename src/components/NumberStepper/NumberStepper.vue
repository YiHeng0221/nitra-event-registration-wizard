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
        class="inline-flex items-center gap-2"
        :aria-describedby="describedBy"
      >
        <q-btn
          round
          dense
          icon="remove"
          aria-label="Decrease quantity"
          :disable="disabled || atMin"
          @click="decrement"
        />
        <span
          class="min-w-8 text-center text-subtitle1"
          :class="invalid ? 'text-danger' : 'text-neutral'"
        >
          {{ model }}
        </span>
        <q-btn
          round
          dense
          icon="add"
          aria-label="Increase quantity"
          :disable="disabled || atMax"
          @click="increment"
        />
      </div>
    </template>
  </FieldShell>
</template>
