<script setup lang="ts">
// Thin wrapper over Quasar's q-icon so icon usage has a single library entry
// point (colour via a fallthrough text-* class, e.g. class="text-inverse").
withDefaults(
  defineProps<{
    name: string
    size?: string
  }>(),
  { size: '20px' },
)
</script>

<template>
  <q-icon
    :name="name"
    :size="size"
  />
</template>
