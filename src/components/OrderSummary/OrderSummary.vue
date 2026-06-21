<script setup lang="ts">
import { computed } from 'vue'
import { useRegistration } from 'src/composables/useRegistration'
import { usePricing } from 'src/composables/usePricing'
import { loadTicketTypes } from 'src/data/tickets'
import { loadAddons } from 'src/data/addons'
import Paper from 'src/components/Paper/Paper.vue'
import Text from 'src/components/Text/Text.vue'

withDefaults(
  defineProps<{
    title?: string
    totalLabel?: string
  }>(),
  { title: 'Order Summary', totalLabel: 'Total' },
)

const { state } = useRegistration()
const { discount, total, formatCurrency } = usePricing()
const tickets = loadTicketTypes()
const addonById = new Map(loadAddons().map((addon) => [addon.id, addon]))

interface SummaryLine {
  label: string
  amount: number
}

const lines = computed<SummaryLine[]>(() => {
  const out: SummaryLine[] = []
  const ticket = tickets.find((entry) => entry.id === state.ticketId)
  if (ticket) out.push({ label: `${ticket.name} Ticket`, amount: ticket.price })

  for (const id of [...state.selectedWorkshopIds, ...state.selectedMealIds]) {
    const addon = addonById.get(id)
    if (addon) out.push({ label: addon.name, amount: addon.price })
  }
  for (const [id, selection] of Object.entries(state.merchandise)) {
    const addon = addonById.get(id)
    if (addon) {
      out.push({ label: `${addon.name} × ${selection.quantity}`, amount: addon.price * selection.quantity })
    }
  }
  return out
})
</script>

<template>
  <Paper
    :level="1"
    padding="md"
  >
    <Text
      as="h3"
      variant="subtitle1"
      color="neutral"
      class="mb-3"
    >
      {{ title }}
    </Text>

    <div class="flex flex-col gap-2">
      <div
        v-for="(line, index) in lines"
        :key="index"
        class="flex items-center justify-between"
      >
        <Text
          variant="body"
          color="muted"
        >
          {{ line.label }}
        </Text>
        <Text
          variant="body"
          color="neutral"
        >
          {{ formatCurrency(line.amount) }}
        </Text>
      </div>

      <div
        v-if="discount > 0"
        class="flex items-center justify-between"
      >
        <Text
          variant="body"
          color="brand"
        >
          Workshop discount (VIP 10%)
        </Text>
        <Text
          variant="body"
          color="brand"
        >
          -{{ formatCurrency(discount) }}
        </Text>
      </div>
    </div>

    <div class="border-neutral-muted mt-3 flex items-center justify-between border-t pt-3">
      <Text
        variant="subtitle2"
        color="neutral"
      >
        {{ totalLabel }}
      </Text>
      <Text
        variant="subtitle1"
        color="neutral"
      >
        {{ formatCurrency(total) }}
      </Text>
    </div>
  </Paper>
</template>
