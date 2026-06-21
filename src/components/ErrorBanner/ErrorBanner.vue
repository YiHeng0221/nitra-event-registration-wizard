<script setup lang="ts">
import type { ErrorListItem } from 'src/composables/useValidation'

defineProps<{ items: ErrorListItem[] }>()
</script>

<template>
  <div class="bg-danger-muted-rest border-danger-muted text-danger flex flex-col gap-2 rounded-md border p-4">
    <p class="text-[12px] font-medium">
      Please fix the following errors before submitting
    </p>
    <p
      v-for="(item, index) in items"
      :key="index"
      class="text-[12px]"
    >
      • Step {{ item.step }}: {{ item.message }}
    </p>
  </div>
</template>
