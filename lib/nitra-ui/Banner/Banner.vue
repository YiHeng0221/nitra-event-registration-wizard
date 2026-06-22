<script setup lang="ts">
import { computed } from 'vue'
import Icon from '@lib/nitra-ui/Icon/Icon.vue'

const props = withDefaults(
  defineProps<{
    variant?: 'info' | 'warning'
    icon?: string
  }>(),
  { variant: 'info' },
)

const VARIANT = {
  info: { box: 'bg-info-subtle-rest border-info-opacity', icon: 'text-info', role: 'status' },
  warning: { box: 'bg-warning-subtle-rest border-warning-opacity', icon: 'text-warning', role: 'alert' },
} as const

const appearance = computed(() => VARIANT[props.variant])
</script>

<template>
  <div
    class="text-neutral flex gap-3 rounded-lg border p-4"
    :class="appearance.box"
    :role="appearance.role"
  >
    <Icon
      v-if="icon"
      :name="icon"
      size="20px"
      class="mt-0.5 shrink-0"
      :class="appearance.icon"
    />
    <div class="flex-1">
      <slot />
    </div>
    <div v-if="$slots.actions">
      <slot name="actions" />
    </div>
  </div>
</template>
