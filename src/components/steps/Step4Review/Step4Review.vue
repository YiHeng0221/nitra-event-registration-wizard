<script setup lang="ts">
import { computed } from 'vue'
import { useRegistration } from 'src/composables/useRegistration'
import { usePricing } from 'src/composables/usePricing'
import { loadTicketTypes } from 'src/data/tickets'
import { loadSessions } from 'src/data/sessions'
import { loadAddons } from 'src/data/addons'
import { formatDateTime } from 'src/utils/datetime'
import type { Session } from 'src/types/session'
import Paper from 'src/components/Paper/Paper.vue'
import OrderSummary from 'src/components/OrderSummary/OrderSummary.vue'

const { state } = useRegistration()
const { formatCurrency } = usePricing()
const tickets = loadTicketTypes()
const sessionById = new Map(loadSessions().map((session) => [session.id, session]))
const addonById = new Map(loadAddons().map((addon) => [addon.id, addon]))

const ticket = computed(() => tickets.find((entry) => entry.id === state.ticketId) ?? null)

const attendeeRows = computed(() => [
  { label: 'Name', value: state.attendee.fullName },
  { label: 'Email', value: state.attendee.email },
  { label: 'Phone', value: state.attendee.phone },
  { label: 'Company', value: state.attendee.company },
  { label: 'Job Title', value: state.attendee.jobTitle },
  {
    label: 'Ticket Type',
    value: ticket.value ? `${ticket.value.name} (${formatCurrency(ticket.value.price)})` : '—',
  },
])

const selectedSessions = computed<Session[]>(() =>
  state.selectedSessionIds
    .map((id) => sessionById.get(id))
    .filter((session): session is Session => session !== undefined),
)

interface AddonRow {
  type: string
  label: string
}
const addonRows = computed<AddonRow[]>(() => {
  const rows: AddonRow[] = []
  for (const id of state.selectedWorkshopIds) {
    const addon = addonById.get(id)
    if (addon) rows.push({ type: 'Workshop', label: `${addon.name} (${formatCurrency(addon.price)})` })
  }
  for (const id of state.selectedMealIds) {
    const addon = addonById.get(id)
    if (addon) rows.push({ type: 'Meal', label: `${addon.name} (${formatCurrency(addon.price)})` })
  }
  for (const [id, selection] of Object.entries(state.merchandise)) {
    const addon = addonById.get(id)
    if (addon) {
      rows.push({ type: 'Merchandise', label: `${addon.name} × ${selection.quantity}` })
    }
  }
  return rows
})

function editStep(step: number): void {
  state.currentStep = step
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <h2 class="text-h6 text-neutral font-bold">
      Review Your Registration
    </h2>

    <Paper :level="1">
      <div class="mb-3 flex items-center justify-between">
        <h3 class="text-subtitle1 text-neutral font-semibold">
          Attendee Information
        </h3>
        <button
          type="button"
          class="text-brand cursor-pointer border-0 bg-transparent text-sm font-medium underline-offset-2 hover:underline"
          @click="editStep(1)"
        >
          Edit → Step 1
        </button>
      </div>
      <dl class="flex flex-col gap-2">
        <div
          v-for="row in attendeeRows"
          :key="row.label"
          class="flex items-center justify-between text-sm"
        >
          <dt class="text-neutral-muted">
            {{ row.label }}
          </dt>
          <dd class="text-neutral">
            {{ row.value || '—' }}
          </dd>
        </div>
      </dl>
    </Paper>

    <Paper :level="1">
      <div class="mb-3 flex items-center justify-between">
        <h3 class="text-subtitle1 text-neutral font-semibold">
          Selected Sessions
        </h3>
        <button
          type="button"
          class="text-brand cursor-pointer border-0 bg-transparent text-sm font-medium underline-offset-2 hover:underline"
          @click="editStep(2)"
        >
          Edit → Step 2
        </button>
      </div>
      <p
        v-if="selectedSessions.length === 0"
        class="text-neutral-muted text-sm"
      >
        No sessions selected.
      </p>
      <div
        v-for="session in selectedSessions"
        :key="session.id"
        class="flex items-center justify-between gap-4 text-sm"
      >
        <span class="text-neutral-muted whitespace-nowrap">{{ formatDateTime(session.date) }}</span>
        <span class="text-neutral text-right">{{ session.title }}</span>
      </div>
    </Paper>

    <Paper :level="1">
      <div class="mb-3 flex items-center justify-between">
        <h3 class="text-subtitle1 text-neutral font-semibold">
          Add-ons
        </h3>
        <button
          type="button"
          class="text-brand cursor-pointer border-0 bg-transparent text-sm font-medium underline-offset-2 hover:underline"
          @click="editStep(3)"
        >
          Edit → Step 3
        </button>
      </div>
      <p
        v-if="addonRows.length === 0"
        class="text-neutral-muted text-sm"
      >
        No add-ons selected.
      </p>
      <div
        v-for="(row, index) in addonRows"
        :key="index"
        class="flex items-center justify-between gap-4 text-sm"
      >
        <span class="text-neutral-muted">{{ row.type }}</span>
        <span class="text-neutral text-right">{{ row.label }}</span>
      </div>
    </Paper>

    <OrderSummary
      title="Pricing Summary"
      total-label="Grand Total"
    />
  </div>
</template>
