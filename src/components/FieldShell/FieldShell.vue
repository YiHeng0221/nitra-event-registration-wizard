<script setup lang="ts">
import { computed, useId } from 'vue'

const props = defineProps<{
  label?: string
  required?: boolean
  helpText?: string
  /** When set, the field is in an error state and this message replaces help text. */
  error?: string
  /** Override the generated control id (e.g. to match an external label). */
  controlId?: string
}>()

const generatedId = useId()
const controlId = computed(() => props.controlId ?? `field-${generatedId}`)
const describedById = computed(() => `${controlId.value}-desc`)
const invalid = computed(() => Boolean(props.error))
const describedBy = computed(() =>
  props.error || props.helpText ? describedById.value : undefined,
)
</script>

<template>
  <div class="flex flex-col gap-1">
    <label
      v-if="label || $slots.label"
      :for="controlId"
      class="text-subtitle2 text-neutral"
    >
      <slot name="label">{{ label }}</slot>
      <span
        v-if="required"
        class="text-danger"
        aria-hidden="true"
      >&nbsp;*</span>
    </label>

    <slot
      :control-id="controlId"
      :described-by="describedBy"
      :invalid="invalid"
    />

    <p
      v-if="invalid"
      :id="describedById"
      class="text-danger text-sm"
      role="alert"
    >
      {{ error }}
    </p>
    <p
      v-else-if="helpText"
      :id="describedById"
      class="text-neutral-muted text-sm"
    >
      {{ helpText }}
    </p>
  </div>
</template>
