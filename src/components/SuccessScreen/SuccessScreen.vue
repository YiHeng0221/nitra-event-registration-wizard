<script setup lang="ts">
import { computed } from 'vue'
import { useRegistration } from 'src/composables/useRegistration'
import { loadTicketTypes } from 'src/data/tickets'
import AppHeader from 'src/components/AppHeader/AppHeader.vue'
import Text from 'src/components/Text/Text.vue'

const emit = defineEmits<{ home: [] }>()

const { state } = useRegistration()
const tickets = loadTicketTypes()
const ticketName = computed(() => tickets.find((t) => t.id === state.ticketId)?.name ?? 'General')

// A demo confirmation reference, generated once per mount.
const confirmation = `#WDS2028-${String(Math.floor(Math.random() * 90000) + 10000)}`
</script>

<template>
  <div class="bg-surface-l0 flex h-screen flex-col">
    <AppHeader class="shrink-0" />
    <div class="bg-[var(--border-neutral-muted)] h-px shrink-0" />

    <div class="flex flex-1 flex-col items-center justify-center gap-4 px-6 py-15 text-center">
      <div class="bg-success-emphasis-rest flex h-20 w-20 items-center justify-center rounded-full">
        <q-icon
          name="check"
          size="40px"
          class="text-inverse"
        />
      </div>

      <Text
        as="h1"
        variant="h2"
        color="success"
      >
        Registration Complete!
      </Text>

      <Text
        variant="body-lg"
        color="neutral"
      >
        Confirmation {{ confirmation }}
      </Text>

      <div>
        <Text
          variant="body"
          color="muted"
        >
          Thank you, {{ state.attendee.fullName || 'there' }}! Your {{ ticketName }} registration for
          WebDev Summit 2028 is confirmed.
        </Text>
        <Text
          variant="body"
          color="muted"
        >
          You will receive a confirmation email at
          {{ state.attendee.email || 'your email address' }}.
        </Text>
      </div>

      <button
        type="button"
        class="bg-accent-emphasis-rest hover:bg-accent-emphasis-hover mt-2 cursor-pointer rounded-[10px] border-0 px-4 py-2.5"
        @click="emit('home')"
      >
        <Text
          as="span"
          variant="subtitle2"
          color="inverse"
        >
          Back to Home
        </Text>
      </button>
    </div>
  </div>
</template>
