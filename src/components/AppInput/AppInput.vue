<script setup lang="ts">
import FieldShell from 'src/components/FieldShell/FieldShell.vue'

defineProps<{
  label?: string
  required?: boolean
  helpText?: string
  error?: string
  type?: 'text' | 'email' | 'tel'
  placeholder?: string
  disabled?: boolean
}>()

const emit = defineEmits<{ blur: []; focus: [] }>()

const model = defineModel<string>({ default: '' })
</script>

<template>
  <FieldShell
    :label="label"
    :required="required"
    :help-text="helpText"
    :error="error"
  >
    <template #default="{ controlId, describedBy, invalid }">
      <q-input
        :id="controlId"
        v-model="model"
        :type="type ?? 'text'"
        :placeholder="placeholder"
        :disable="disabled"
        :error="invalid"
        :aria-describedby="describedBy"
        outlined
        dense
        hide-bottom-space
        @blur="emit('blur')"
        @focus="emit('focus')"
      />
    </template>
  </FieldShell>
</template>
