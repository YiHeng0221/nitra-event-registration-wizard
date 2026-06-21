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
      <input
        :id="controlId"
        v-model="model"
        :type="type ?? 'text'"
        :placeholder="placeholder"
        :disabled="disabled"
        :aria-describedby="describedBy"
        :aria-invalid="invalid"
        class="bg-surface-l0 text-neutral placeholder:text-neutral-quiet w-full appearance-none rounded-md border px-3 py-2.5 text-[16px] outline-none transition-colors focus:border-[var(--bg-brand-emphasis-rest)] disabled:opacity-60"
        :class="invalid ? 'border-danger-emphasis' : 'border-neutral-muted'"
        @blur="emit('blur')"
        @focus="emit('focus')"
      >
    </template>
  </FieldShell>
</template>
