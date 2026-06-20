<script setup lang="ts">
defineProps<{
  label?: string
  disabled?: boolean
}>()

const model = defineModel<boolean>({ default: false })
</script>

<template>
  <q-checkbox
    v-model="model"
    :label="$slots.default ? undefined : label"
    :disable="disabled"
    color="primary"
  >
    <slot />
  </q-checkbox>
</template>
