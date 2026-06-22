<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { SUPPORTED_LOCALES, LOCALE_STORAGE_KEY, type AppLocale } from 'src/i18n'
import Text from '@lib/nitra-ui/Text/Text.vue'

const { locale, t } = useI18n()

const LABEL: Record<AppLocale, string> = { en: 'EN', 'zh-TW': '繁中' }

/** Switch locale and remember the choice for next visit. */
function setLocale(value: AppLocale): void {
  locale.value = value
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, value)
  } catch {
    // Storage unavailable — selection still applies for this session.
  }
}
</script>

<template>
  <div
    role="group"
    :aria-label="t('locale.label')"
    class="bg-surface-l2 flex gap-0.5 rounded-lg p-0.5"
  >
    <button
      v-for="value in SUPPORTED_LOCALES"
      :key="value"
      type="button"
      :aria-pressed="locale === value"
      class="cursor-pointer rounded-md border-0 px-2.5 py-1 transition-colors"
      :class="locale === value ? 'bg-surface-l0 shadow-sm' : 'bg-transparent'"
      @click="setLocale(value)"
    >
      <Text
        as="span"
        variant="body-medium"
        :class="locale === value ? 'text-neutral' : 'text-neutral-muted'"
      >
        {{ LABEL[value] }}
      </Text>
    </button>
  </div>
</template>
