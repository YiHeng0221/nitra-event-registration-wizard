<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRegistration } from 'src/composables/useRegistration'
import { useLocale } from 'src/composables/useLocale'
import AppHeader from 'src/components/AppHeader/AppHeader.vue'
import Text from 'src/components/Text/Text.vue'

const emit = defineEmits<{ home: [] }>()

const { t } = useI18n()
const { ticketName } = useLocale()
const { state } = useRegistration()
const ticketLabel = computed(() => (state.ticketId ? ticketName(state.ticketId) : ''))

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
        {{ t('success.title') }}
      </Text>

      <Text
        variant="body-lg"
        color="neutral"
      >
        {{ t('success.confirmation', { ref: confirmation }) }}
      </Text>

      <div>
        <Text
          variant="body"
          color="muted"
        >
          {{ t('success.thanks', { name: state.attendee.fullName || t('success.thanksName'), ticket: ticketLabel }) }}
        </Text>
        <Text
          variant="body"
          color="muted"
        >
          {{ t('success.emailLine', { email: state.attendee.email || t('success.emailFallback') }) }}
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
          {{ t('success.backHome') }}
        </Text>
      </button>
    </div>
  </div>
</template>
