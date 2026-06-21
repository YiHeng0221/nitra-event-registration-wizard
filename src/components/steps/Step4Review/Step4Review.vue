<script setup lang="ts">
import { computed } from 'vue'
import { useRegistration } from 'src/composables/useRegistration'
import { usePricing } from 'src/composables/usePricing'
import { useValidation } from 'src/composables/useValidation'
import { loadTicketTypes } from 'src/data/tickets'
import { loadSessions } from 'src/data/sessions'
import { loadAddons } from 'src/data/addons'
import { formatDateTime } from 'src/utils/datetime'
import type { Session } from 'src/types/session'
import Paper from 'src/components/Paper/Paper.vue'
import OrderSummary from 'src/components/OrderSummary/OrderSummary.vue'
import ErrorBanner from 'src/components/ErrorBanner/ErrorBanner.vue'
import Text from 'src/components/Text/Text.vue'

const { state } = useRegistration()
const { formatCurrency } = usePricing()
const { errorList } = useValidation()
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

/** Red border on a review section when its step has unmet required fields. */
function sectionErrorClass(step: number): string {
  return errorList.value.some((item) => item.step === step)
    ? 'border-2 border-solid border-[color:var(--border-danger-emphasis)]'
    : ''
}
</script>

<template>
  <div class="flex flex-col gap-6">
    <Text
      as="h2"
      variant="h4"
      color="neutral"
    >
      Review Your Registration
    </Text>

    <ErrorBanner
      v-if="errorList.length > 0"
      :items="errorList"
    />

    <Paper
      :level="1"
      :class="sectionErrorClass(1)"
    >
      <div class="mb-3 flex items-center justify-between">
        <Text
          as="h3"
          variant="subtitle1"
          color="neutral"
        >
          Attendee Information
        </Text>
        <button
          type="button"
          class="text-brand cursor-pointer border-0 bg-transparent underline-offset-2 hover:underline"
          @click="editStep(1)"
        >
          Edit → Step 1
        </button>
      </div>
      <dl class="flex flex-col gap-2">
        <div
          v-for="row in attendeeRows"
          :key="row.label"
          class="flex items-center justify-between"
        >
          <Text
            as="dt"
            variant="body"
            color="muted"
          >
            {{ row.label }}
          </Text>
          <Text
            as="dd"
            variant="body"
            color="neutral"
          >
            {{ row.value || '—' }}
          </Text>
        </div>
      </dl>
    </Paper>

    <Paper
      :level="1"
      :class="sectionErrorClass(2)"
    >
      <div class="mb-3 flex items-center justify-between">
        <Text
          as="h3"
          variant="subtitle1"
          color="neutral"
        >
          Selected Sessions
        </Text>
        <button
          type="button"
          class="text-brand cursor-pointer border-0 bg-transparent underline-offset-2 hover:underline"
          @click="editStep(2)"
        >
          Edit → Step 2
        </button>
      </div>
      <Text
        v-if="selectedSessions.length === 0"
        variant="body"
        color="muted"
      >
        No sessions selected.
      </Text>
      <div
        v-for="session in selectedSessions"
        :key="session.id"
        class="flex items-center justify-between gap-4"
      >
        <Text
          as="span"
          variant="body"
          color="muted"
          nowrap
        >
          {{ formatDateTime(session.date) }}
        </Text>
        <Text
          as="span"
          variant="body"
          color="neutral"
          class="text-right"
        >
          {{ session.title }}
        </Text>
      </div>
    </Paper>

    <Paper
      :level="1"
      :class="sectionErrorClass(3)"
    >
      <div class="mb-3 flex items-center justify-between">
        <Text
          as="h3"
          variant="subtitle1"
          color="neutral"
        >
          Add-ons
        </Text>
        <button
          type="button"
          class="text-brand cursor-pointer border-0 bg-transparent underline-offset-2 hover:underline"
          @click="editStep(3)"
        >
          Edit → Step 3
        </button>
      </div>
      <Text
        v-if="addonRows.length === 0"
        variant="body"
        color="muted"
      >
        No add-ons selected.
      </Text>
      <div
        v-for="(row, index) in addonRows"
        :key="index"
        class="flex items-center justify-between gap-4"
      >
        <Text
          as="span"
          variant="body"
          color="muted"
        >
          {{ row.type }}
        </Text>
        <Text
          as="span"
          variant="body"
          color="neutral"
          class="text-right"
        >
          {{ row.label }}
        </Text>
      </div>
    </Paper>

    <OrderSummary
      title="Pricing Summary"
      total-label="Grand Total"
    />
  </div>
</template>
