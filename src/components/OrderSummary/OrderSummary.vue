<script setup lang="ts">
import { computed } from 'vue'
import { useRegistration } from 'src/composables/useRegistration'
import { usePricing } from 'src/composables/usePricing'
import { loadTicketTypes } from 'src/data/tickets'
import { loadAddons } from 'src/data/addons'
import Paper from 'src/components/Paper/Paper.vue'

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
    <h3 class="text-subtitle1 text-neutral mb-3 font-semibold">
      Order Summary
    </h3>

    <div class="flex flex-col gap-2">
      <div
        v-for="(line, index) in lines"
        :key="index"
        class="flex items-center justify-between text-sm"
      >
        <span class="text-neutral-muted">{{ line.label }}</span>
        <span class="text-neutral">{{ formatCurrency(line.amount) }}</span>
      </div>

      <div
        v-if="discount > 0"
        class="flex items-center justify-between text-sm"
      >
        <span class="text-brand">Workshop discount (VIP 10%)</span>
        <span class="text-brand">-{{ formatCurrency(discount) }}</span>
      </div>
    </div>

    <div class="border-neutral-muted mt-3 flex items-center justify-between border-t pt-3">
      <span class="text-subtitle2 text-neutral font-semibold">Total</span>
      <span class="text-subtitle1 text-neutral font-bold">{{ formatCurrency(total) }}</span>
    </div>
  </Paper>
</template>
