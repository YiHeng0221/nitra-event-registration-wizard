<script setup lang="ts">
import FieldShell from '@lib/nitra-ui/FieldShell/FieldShell.vue'

/** A single select option in a UI-kit-neutral shape. */
export interface SelectOption {
  label: string
  value: string | number
  disabled?: boolean
}

withDefaults(
  defineProps<{
    label?: string
    required?: boolean
    helpText?: string
    error?: string
    options: SelectOption[]
    placeholder?: string
    disabled?: boolean
    /** Compact, label-less control (no FieldShell) — e.g. inline next to a "Size:" label. */
    inline?: boolean
  }>(),
  {},
)

const model = defineModel<string | number | null>({ default: null })

/** Native <select> emits strings; map back to the original option value (keeps numbers). */
function onChange(event: Event, options: SelectOption[]): void {
  const raw = (event.target as HTMLSelectElement).value
  const match = options.find((option) => String(option.value) === raw)
  model.value = match ? match.value : raw === '' ? null : raw
}

const BASE =
  'bg-surface-l0 text-neutral appearance-none rounded-md border border-solid px-3 py-1.5 outline-none transition-colors focus:border-[color:var(--bg-brand-emphasis-rest)] disabled:opacity-60'
</script>

<template>
  <!-- Inline: just the control. -->
  <select
    v-if="inline"
    :value="model ?? ''"
    :disabled="disabled"
    class="border-[color:var(--border-neutral-muted)]"
    :class="BASE"
    @change="onChange($event, options)"
  >
    <option
      v-if="placeholder"
      value=""
      disabled
    >
      {{ placeholder }}
    </option>
    <option
      v-for="option in options"
      :key="option.value"
      :value="option.value"
      :disabled="option.disabled"
    >
      {{ option.label }}
    </option>
  </select>

  <!-- Field: label / help / error around a full-width control. -->
  <FieldShell
    v-else
    :label="label"
    :required="required"
    :help-text="helpText"
    :error="error"
  >
    <template #default="{ controlId, describedBy, invalid }">
      <select
        :id="controlId"
        :value="model ?? ''"
        :disabled="disabled"
        :aria-describedby="describedBy"
        :aria-invalid="invalid"
        class="w-full"
        :class="[BASE, invalid ? 'border-[color:var(--border-danger-emphasis)]' : 'border-[color:var(--border-neutral-muted)]']"
        @change="onChange($event, options)"
      >
        <option
          v-if="placeholder"
          value=""
          disabled
        >
          {{ placeholder }}
        </option>
        <option
          v-for="option in options"
          :key="option.value"
          :value="option.value"
          :disabled="option.disabled"
        >
          {{ option.label }}
        </option>
      </select>
    </template>
  </FieldShell>
</template>
