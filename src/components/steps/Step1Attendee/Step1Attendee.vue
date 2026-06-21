<script setup lang="ts">
import { useRegistration } from 'src/composables/useRegistration'
import { loadTicketTypes } from 'src/data/tickets'
import SelectableCard from 'src/components/SelectableCard/SelectableCard.vue'
import AppInput from 'src/components/AppInput/AppInput.vue'

const { state } = useRegistration()
const tickets = loadTicketTypes()
</script>

<template>
  <div class="flex flex-col gap-8">
    <section>
      <h2 class="text-subtitle1 text-neutral mb-3">
        Select Ticket Type
      </h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-3">
        <SelectableCard
          v-for="ticket in tickets"
          :key="ticket.id"
          :selected="state.ticketId === ticket.id"
          @select="state.ticketId = ticket.id"
        >
          <div class="flex items-start justify-between">
            <span class="text-subtitle1 text-neutral font-semibold">{{ ticket.name }}</span>
            <span class="text-subtitle1 text-neutral font-bold">${{ ticket.price }}</span>
          </div>
          <p class="text-neutral-muted mt-1 text-sm">
            {{ ticket.description }}
          </p>
          <ul class="mt-3 flex flex-col gap-1.5">
            <li
              v-for="perk in ticket.perks"
              :key="perk"
              class="text-neutral flex items-center gap-2 text-sm"
            >
              <q-icon
                name="check_circle"
                size="16px"
                class="text-neutral"
              />
              {{ perk }}
            </li>
          </ul>
          <span
            v-if="state.ticketId === ticket.id"
            class="bg-success-bold-rest text-inverse mt-3 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium"
          >
            <q-icon
              name="check"
              size="14px"
            />
            Selected
          </span>
        </SelectableCard>
      </div>
    </section>

    <section>
      <h2 class="text-h6 text-neutral mb-4 font-bold">
        Attendee Information
      </h2>
      <div class="grid grid-cols-1 gap-4 md:grid-cols-2">
        <AppInput
          v-model="state.attendee.fullName"
          label="Full Name"
          placeholder="Enter your full name"
        />
        <AppInput
          v-model="state.attendee.email"
          type="email"
          label="Email"
          placeholder="Enter your email address"
        />
        <AppInput
          v-model="state.attendee.phone"
          type="tel"
          label="Phone"
          placeholder="Enter your phone number"
        />
        <AppInput
          v-model="state.attendee.company"
          label="Company"
          placeholder="Enter your company name"
        />
      </div>
      <div class="mt-4 flex flex-col gap-4">
        <AppInput
          v-model="state.attendee.jobTitle"
          label="Job Title"
          placeholder="Enter your job title"
        />
        <AppInput
          v-model="state.attendee.shippingAddress"
          label="Shipping Address (Optional)"
          placeholder="Enter your shipping address"
        />
      </div>
    </section>
  </div>
</template>
