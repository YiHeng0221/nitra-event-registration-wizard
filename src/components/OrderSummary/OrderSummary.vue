<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRegistration } from 'src/composables/useRegistration'
import { usePricing } from 'src/composables/usePricing'
import { loadTicketTypes } from 'src/data/tickets'
import { loadAddons } from 'src/data/addons'
import Paper from 'src/components/Paper/Paper.vue'
import Text from 'src/components/Text/Text.vue'

const props = defineProps<{
  /** Heading override; falls back to the localized "Order Summary". */
  title?: string
  /** Total-row label override; falls back to the localized "Total". */
  totalLabel?: string
}>()

const { t } = useI18n()
const { state } = useRegistration()
const { discount, total, formatCurrency } = usePricing()
const tickets = loadTicketTypes()
const addonById = new Map(loadAddons().map((addon) => [addon.id, addon]))

const displayTitle = computed(() => props.title ?? t('orderSummary.title'))
const displayTotalLabel = computed(() => props.totalLabel ?? t('orderSummary.total'))

interface SummaryLine {
  label: string
  amount: number
}

const lines = computed<SummaryLine[]>(() => {
  const out: SummaryLine[] = []
  const ticket = tickets.find((entry) => entry.id === state.ticketId)
  if (ticket) out.push({ label: t('orderSummary.ticket', { name: ticket.name }), amount: ticket.price })

  for (const id of [...state.selectedWorkshopIds, ...state.selectedMealIds]) {
    const addon = addonById.get(id)
    if (addon) out.push({ label: addon.name, amount: addon.price })
  }
  for (const [id, selection] of Object.entries(state.merchandise)) {
    const addon = addonById.get(id)
    if (addon) {
      out.push({
        label: t('orderSummary.qtyLine', { name: addon.name, qty: selection.quantity }),
        amount: addon.price * selection.quantity,
      })
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
      {{ displayTitle }}
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
          {{ t('orderSummary.workshopDiscount') }}
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
        {{ displayTotalLabel }}
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
