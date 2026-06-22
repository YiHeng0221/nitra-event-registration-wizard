<script setup lang="ts">
import { computed, useId } from 'vue'
import Text from '@lib/nitra-ui/Text/Text.vue'

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
  <div class="flex flex-col gap-1.5">
    <label
      v-if="label || $slots.label"
      :for="controlId"
    >
      <Text
        as="span"
        variant="body-medium"
        :class="invalid ? 'text-danger' : 'text-neutral'"
      >
        <slot name="label">{{ label }}</slot>
        <span
          v-if="required"
          aria-hidden="true"
        >&nbsp;*</span>
      </Text>
    </label>

    <slot
      :control-id="controlId"
      :described-by="describedBy"
      :invalid="invalid"
    />

    <Text
      v-if="invalid"
      :id="describedById"
      variant="body-xs"
      color="danger"
      role="alert"
    >
      {{ error }}
    </Text>
    <Text
      v-else-if="helpText"
      :id="describedById"
      variant="body-xs"
      color="muted"
    >
      {{ helpText }}
    </Text>
  </div>
</template>
