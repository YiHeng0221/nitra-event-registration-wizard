<script setup lang="ts">
import type { ErrorListItem } from 'src/composables/useValidation'
import Text from 'src/components/Text/Text.vue'
import VStack from 'src/components/Stack/VStack.vue'

defineProps<{ items: ErrorListItem[] }>()
</script>

<template>
  <div class="bg-danger-muted-rest border-danger-muted text-danger flex flex-col gap-2 rounded-md border p-4">
    <Text variant="body-medium">
      Please fix the following errors before submitting
    </Text>
    <VStack :gap="2">
      <Text
        v-for="(item, index) in items"
        :key="index"
        variant="body"
      >
        • Step {{ item.step }}: {{ item.message }}
      </Text>
    </VStack>
  </div>
</template>
