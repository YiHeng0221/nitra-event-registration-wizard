<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import type { ErrorListItem } from 'src/composables/useValidation'
import Text from '@lib/nitra-ui/Text/Text.vue'
import VStack from '@lib/nitra-ui/Stack/VStack.vue'

defineProps<{ items: ErrorListItem[] }>()

const { t } = useI18n()
</script>

<template>
  <div class="bg-danger-muted-rest border-danger-muted text-danger flex flex-col gap-2 rounded-md border p-4">
    <Text variant="body-medium">
      {{ t('errors.title') }}
    </Text>
    <VStack :gap="2">
      <Text
        v-for="(item, index) in items"
        :key="index"
        variant="body"
      >
        • {{ t('errors.stepLine', { step: item.step, message: item.message }) }}
      </Text>
    </VStack>
  </div>
</template>
