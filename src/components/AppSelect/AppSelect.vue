<script setup lang="ts">
import FieldShell from 'src/components/FieldShell/FieldShell.vue'

/** A single select option in a UI-kit-neutral shape. */
export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

defineProps<{
  label?: string
  required?: boolean
  helpText?: string
  error?: string
  options: SelectOption[]
  placeholder?: string
  disabled?: boolean
}>()

const model = defineModel<string | number | null>({ default: null })
</script>

<template>
  <FieldShell
    :label="label"
    :required="required"
    :help-text="helpText"
    :error="error"
  >
    <template #default="{ controlId, describedBy, invalid }">
      <q-select
        :id="controlId"
        v-model="model"
        :options="options"
        :placeholder="placeholder"
        :disable="disabled"
        :error="invalid"
        :aria-describedby="describedBy"
        option-disable="disabled"
        emit-value
        map-options
        outlined
        dense
        hide-bottom-space
      />
    </template>
  </FieldShell>
</template>
