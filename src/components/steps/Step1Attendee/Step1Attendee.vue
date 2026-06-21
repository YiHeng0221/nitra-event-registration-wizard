<script setup lang="ts">
import { computed } from 'vue'
import { useRegistration } from 'src/composables/useRegistration'
import { useValidation } from 'src/composables/useValidation'
import { loadTicketTypes } from 'src/data/tickets'
import SelectableCard from 'src/components/SelectableCard/SelectableCard.vue'
import AppInput from 'src/components/AppInput/AppInput.vue'
import Text from 'src/components/Text/Text.vue'

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
        Select Ticket Type
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
            >Selected</Text>
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
        Attendee Information
      </Text>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AppInput
          v-model="state.attendee.fullName"
          label="Full Name"
          placeholder="Enter your full name"
          :error="errorFor('fullName')"
        />
        <AppInput
          v-model="state.attendee.email"
          type="email"
          label="Email"
          placeholder="Enter your email address"
          :error="errorFor('email')"
        />
        <AppInput
          v-model="state.attendee.phone"
          type="tel"
          label="Phone"
          placeholder="Enter your phone number"
          :error="errorFor('phone')"
        />
        <AppInput
          v-model="state.attendee.company"
          label="Company"
          placeholder="Enter your company name"
          :error="errorFor('company')"
        />
      </div>
      <div class="mt-4 flex flex-col gap-4">
        <AppInput
          v-model="state.attendee.jobTitle"
          label="Job Title"
          placeholder="Enter your job title"
          :error="errorFor('jobTitle')"
        />
        <AppInput
          v-model="state.attendee.shippingAddress"
          :label="merchSelected ? 'Shipping Address' : 'Shipping Address (Optional)'"
          :required="merchSelected"
          placeholder="Enter your shipping address"
          :help-text="merchSelected ? '(required for merchandise)' : ''"
          :error="errorFor('shippingAddress')"
        />
      </div>
    </section>
  </div>
</template>
