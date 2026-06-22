<script setup lang="ts">
withDefaults(
  defineProps<{
    /** Preset tone, or 'custom' to colour via a fallthrough class (e.g. track palettes). */
    tone?: 'neutral' | 'success' | 'danger' | 'custom'
  }>(),
  { tone: 'neutral' },
)

const TONE: Record<'neutral' | 'success' | 'danger' | 'custom', string> = {
  neutral: 'bg-surface-l2 text-neutral',
  success: 'bg-success-bold-rest text-inverse',
  danger: 'bg-danger-emphasis-rest text-inverse',
  custom: '',
}
</script>

<template>
  <!-- A pill container; callers provide their own Text/icon content. -->
  <span
    class="inline-flex items-center gap-1 rounded-full px-2 py-0.5"
    :class="TONE[tone]"
  >
    <slot />
  </span>
</template>
