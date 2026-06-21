<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRegistration } from 'src/composables/useRegistration'
import { useValidation } from 'src/composables/useValidation'
import { loadTicketTypes } from 'src/data/tickets'
import SelectableCard from 'src/components/SelectableCard/SelectableCard.vue'
import AppInput from 'src/components/AppInput/AppInput.vue'
import Text from 'src/components/Text/Text.vue'

const { t } = useI18n()
const { state } = useRegistration()
const { errorFor } = useValidation()
const tickets = loadTicketTypes()

// Shipping address is only required once merchandise is in the order.
const merchSelected = computed(() => Object.keys(state.merchandise).length > 0)
</script>

<template>
  <div class="flex flex-col gap-8">
    <section>
      <Text
        as="h2"
        variant="subtitle1"
        color="neutral"
        class="mb-3"
      >
        {{ t('step1.selectTicket') }}
      </Text>
      <Text
        v-if="errorFor('ticketId')"
        variant="body-md"
        color="danger"
        class="mb-2"
      >
        {{ errorFor('ticketId') }}
      </Text>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SelectableCard
          v-for="ticket in tickets"
          :key="ticket.id"
          :selected="state.ticketId === ticket.id"
          :gap="3"
          class="h-[288px]"
          @select="state.ticketId = ticket.id"
        >
          <div class="flex items-start justify-between">
            <Text
              variant="subtitle1"
              color="neutral"
              as="span"
            >
              {{ ticket.name }}
            </Text>
            <Text
              variant="subtitle1"
              color="neutral"
              as="span"
            >
              ${{ ticket.price }}
            </Text>
          </div>
          <Text
            variant="body"
            color="muted"
          >
            {{ ticket.description }}
          </Text>
          <div class="flex flex-col gap-1.5">
            <Text
              v-for="perk in ticket.perks"
              :key="perk"
              variant="body"
              color="neutral"
              class="flex items-center gap-2"
            >
              <q-icon
                name="check_circle"
                size="16px"
                class="text-neutral"
              />
              {{ perk }}
            </Text>
          </div>
          <span
            v-if="state.ticketId === ticket.id"
            class="bg-success-bold-rest inline-flex items-center gap-1 self-start rounded-full px-2 py-0.5"
          >
            <q-icon
              name="check"
              size="14px"
              class="text-inverse"
            />
            <Text
              variant="body-xs-medium"
              color="inverse"
              as="span"
            >{{ t('step1.selected') }}</Text>
          </span>
        </SelectableCard>
      </div>
    </section>

    <section>
      <Text
        as="h2"
        variant="h4"
        color="neutral"
        class="mb-4"
      >
        {{ t('step1.attendeeInfo') }}
      </Text>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AppInput
          v-model="state.attendee.fullName"
          :label="t('step1.fullName')"
          :placeholder="t('step1.fullNamePlaceholder')"
          :error="errorFor('fullName')"
        />
        <AppInput
          v-model="state.attendee.email"
          type="email"
          :label="t('step1.email')"
          :placeholder="t('step1.emailPlaceholder')"
          :error="errorFor('email')"
        />
        <AppInput
          v-model="state.attendee.phone"
          type="tel"
          :label="t('step1.phone')"
          :placeholder="t('step1.phonePlaceholder')"
          :error="errorFor('phone')"
        />
        <AppInput
          v-model="state.attendee.company"
          :label="t('step1.company')"
          :placeholder="t('step1.companyPlaceholder')"
          :error="errorFor('company')"
        />
      </div>
      <div class="mt-4 flex flex-col gap-4">
        <AppInput
          v-model="state.attendee.jobTitle"
          :label="t('step1.jobTitle')"
          :placeholder="t('step1.jobTitlePlaceholder')"
          :error="errorFor('jobTitle')"
        />
        <AppInput
          v-model="state.attendee.shippingAddress"
          :label="merchSelected ? t('step1.shipping') : t('step1.shippingOptional')"
          :required="merchSelected"
          :placeholder="t('step1.shippingPlaceholder')"
          :help-text="merchSelected ? t('step1.shippingHint') : ''"
          :error="errorFor('shippingAddress')"
        />
      </div>
    </section>
  </div>
</template>
