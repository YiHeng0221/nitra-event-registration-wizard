<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRegistration } from 'src/composables/useRegistration'
import { usePricing } from 'src/composables/usePricing'
import { useValidation } from 'src/composables/useValidation'
import { useLocale } from 'src/composables/useLocale'
import { loadTicketTypes } from 'src/data/tickets'
import { loadSessions } from 'src/data/sessions'
import { loadAddons } from 'src/data/addons'
import type { Session } from 'src/types/session'
import Card from '@lib/nitra-ui/Card/Card.vue'
import OrderSummary from 'src/components/OrderSummary/OrderSummary.vue'
import ErrorBanner from 'src/components/ErrorBanner/ErrorBanner.vue'
import Text from '@lib/nitra-ui/Text/Text.vue'
import VStack from '@lib/nitra-ui/Stack/VStack.vue'
import Button from '@lib/nitra-ui/Button/Button.vue'

const { t } = useI18n()
const { dateTime, sessionTitle, ticketName, addonName } = useLocale()
const { state } = useRegistration()
const { formatCurrency } = usePricing()
const { errorList } = useValidation()
const tickets = loadTicketTypes()
const sessionById = new Map(loadSessions().map((session) => [session.id, session]))
const addonById = new Map(loadAddons().map((addon) => [addon.id, addon]))

const ticket = computed(() => tickets.find((entry) => entry.id === state.ticketId) ?? null)

// Shipping is required only once merchandise is in the order (mirrors registrationSchema).
const merchSelected = computed(() => Object.keys(state.merchandise).length > 0)

interface AttendeeRow {
  label: string
  value: string
  required: boolean
  /** Placeholder shown when required and empty. */
  missingText?: string
}
const attendeeRows = computed<AttendeeRow[]>(() => [
  { label: t('step4.name'), value: state.attendee.fullName, required: true },
  { label: t('step4.email'), value: state.attendee.email, required: true },
  { label: t('step4.phone'), value: state.attendee.phone, required: true },
  { label: t('step4.company'), value: state.attendee.company, required: true },
  { label: t('step4.jobTitle'), value: state.attendee.jobTitle, required: true },
  {
    label: t('step4.ticketType'),
    value: ticket.value ? `${ticketName(ticket.value.id)} (${formatCurrency(ticket.value.price)})` : '',
    required: true,
  },
  {
    label: t('step4.shipping'),
    value: state.attendee.shippingAddress,
    required: merchSelected.value,
    missingText: t('step4.requiredMerch'),
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
    if (addon) rows.push({ type: t('step4.workshop'), label: `${addonName(id)} (${formatCurrency(addon.price)})` })
  }
  for (const id of state.selectedMealIds) {
    const addon = addonById.get(id)
    if (addon) rows.push({ type: t('step4.meal'), label: `${addonName(id)} (${formatCurrency(addon.price)})` })
  }
  for (const [id, selection] of Object.entries(state.merchandise)) {
    const addon = addonById.get(id)
    if (addon) {
      rows.push({ type: t('step4.merchandise'), label: `${addonName(id)} × ${selection.quantity}` })
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
      {{ t('step4.title') }}
    </Text>

    <ErrorBanner
      v-if="errorList.length > 0"
      :items="errorList"
    />

    <Card
      :level="1"
      :class="sectionErrorClass(1)"
    >
      <div class="mb-3 flex items-center justify-between">
        <Text
          as="h3"
          variant="subtitle1"
          color="neutral"
        >
          {{ t('step4.attendeeInfo') }}
        </Text>
        <Button
          variant="ghost"
          @click="editStep(1)"
        >
          {{ t('step4.editStep', { n: 1 }) }}
        </Button>
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
            :class="row.required && !row.value ? 'text-danger' : 'text-neutral'"
          >
            {{ row.required && !row.value ? (row.missingText ?? t('step4.required')) : row.value || t('common.dash') }}
          </Text>
        </div>
      </dl>
    </Card>

    <Card
      :level="1"
      :class="sectionErrorClass(2)"
    >
      <div class="mb-3 flex items-center justify-between">
        <Text
          as="h3"
          variant="subtitle1"
          color="neutral"
        >
          {{ t('step4.selectedSessions') }}
        </Text>
        <Button
          variant="ghost"
          @click="editStep(2)"
        >
          {{ t('step4.editStep', { n: 2 }) }}
        </Button>
      </div>
      <VStack :gap="2">
        <Text
          v-if="selectedSessions.length === 0"
          variant="body"
          color="muted"
        >
          {{ t('step4.noSessions') }}
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
            {{ dateTime(session.date) }}
          </Text>
          <Text
            as="span"
            variant="body"
            color="neutral"
            class="text-right"
          >
            {{ sessionTitle(session.id) }}
          </Text>
        </div>
      </VStack>
    </Card>

    <Card
      :level="1"
      :class="sectionErrorClass(3)"
    >
      <div class="mb-3 flex items-center justify-between">
        <Text
          as="h3"
          variant="subtitle1"
          color="neutral"
        >
          {{ t('step4.addons') }}
        </Text>
        <Button
          variant="ghost"
          @click="editStep(3)"
        >
          {{ t('step4.editStep', { n: 3 }) }}
        </Button>
      </div>
      <VStack :gap="2">
        <Text
          v-if="addonRows.length === 0"
          variant="body"
          color="muted"
        >
          {{ t('step4.noAddons') }}
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
      </VStack>
    </Card>

    <OrderSummary
      :title="t('orderSummary.pricingTitle')"
      :total-label="t('orderSummary.grandTotal')"
    />
  </div>
</template>
