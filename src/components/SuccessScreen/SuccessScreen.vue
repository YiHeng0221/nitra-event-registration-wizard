<script setup lang="ts">
import { useRegistration } from 'src/composables/useRegistration'
import { usePricing } from 'src/composables/usePricing'
import Paper from 'src/components/Paper/Paper.vue'

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
      <h2 class="text-h5 text-neutral font-bold">
        Registration Confirmed!
      </h2>
      <p class="text-neutral-muted">
        Thanks {{ state.attendee.fullName || 'there' }}, your spot at WebDev Summit 2028 is booked.
      </p>
      <p class="text-neutral mt-2">
        Total paid: <span class="font-bold">{{ formatCurrency(total) }}</span>
      </p>
    </div>
  </Paper>
</template>
