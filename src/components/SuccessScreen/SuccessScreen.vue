<script setup lang="ts">
import { useRegistration } from 'src/composables/useRegistration'
import { usePricing } from 'src/composables/usePricing'
import Paper from 'src/components/Paper/Paper.vue'
import Text from 'src/components/Text/Text.vue'

const { state } = useRegistration()
const { total, formatCurrency } = usePricing()
</script>

<template>
  <Paper
    :level="1"
    padding="lg"
  >
    <div class="flex flex-col items-center gap-3 text-center">
      <q-icon
        name="check_circle"
        size="64px"
        class="text-success"
      />
      <Text
        as="h2"
        variant="h3"
        color="neutral"
      >
        Registration Confirmed!
      </Text>
      <Text
        variant="body-md"
        color="muted"
      >
        Thanks {{ state.attendee.fullName || 'there' }}, your spot at WebDev Summit 2028 is booked.
      </Text>
      <Text
        variant="body-md"
        color="neutral"
        class="mt-2"
      >
        Total paid: <span>{{ formatCurrency(total) }}</span>
      </Text>
    </div>
  </Paper>
</template>
