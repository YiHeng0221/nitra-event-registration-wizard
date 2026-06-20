<script setup lang="ts">
import { computed } from 'vue'

const props = withDefaults(
  defineProps<{
    variant?: 'info' | 'warning'
    icon?: string
  }>(),
  { variant: 'info' },
)

const VARIANT = {
  info: { box: 'bg-info-muted-rest text-info-emphasis', role: 'status' },
  warning: { box: 'bg-warning-muted-rest text-warning-emphasis', role: 'alert' },
} as const

const appearance = computed(() => VARIANT[props.variant])
</script>

<template>
  <div
    class="flex items-start gap-2 rounded-md p-3"
    :class="appearance.box"
    :role="appearance.role"
  >
    <q-icon
      v-if="icon"
      :name="icon"
      size="20px"
      class="mt-0.5"
    />
    <div class="flex-1 text-sm">
      <slot />
    </div>
    <div v-if="$slots.actions">
      <slot name="actions" />
    </div>
  </div>
</template>
