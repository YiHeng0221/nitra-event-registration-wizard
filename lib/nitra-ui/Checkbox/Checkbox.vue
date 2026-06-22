<script setup lang="ts">
import Icon from '@lib/nitra-ui/Icon/Icon.vue'

// Presentational checkbox indicator (the parent owns the toggle — e.g. a
// SelectableCard). Colour it with a fallthrough text-* class.
withDefaults(
  defineProps<{
    checked?: boolean
    size?: string
  }>(),
  { checked: false, size: '18px' },
)
</script>

<template>
  <Icon
    :name="checked ? 'check_box' : 'check_box_outline_blank'"
    :size="size"
    aria-hidden="true"
  />
</template>
