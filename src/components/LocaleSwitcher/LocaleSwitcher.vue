<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { SUPPORTED_LOCALES, LOCALE_STORAGE_KEY, type AppLocale } from 'src/i18n'
import OptionGroup from '@lib/nitra-ui/OptionGroup/OptionGroup.vue'

const { locale, t } = useI18n()

const LABEL: Record<AppLocale, string> = { en: 'EN', 'zh-TW': '繁中' }
const localeOptions = computed(() =>
  SUPPORTED_LOCALES.map((value) => ({ label: LABEL[value], value })),
)

/** Switch locale and remember the choice for next visit. */
function setLocale(value: string | number | null): void {
  if (typeof value !== 'string' || !SUPPORTED_LOCALES.includes(value as AppLocale)) return
  const next = value as AppLocale
  locale.value = next
  try {
    localStorage.setItem(LOCALE_STORAGE_KEY, next)
  } catch {
    // Storage unavailable — selection still applies for this session.
  }
}
</script>

<template>
  <OptionGroup
    variant="pill"
    :options="localeOptions"
    :model-value="locale"
    :label="t('locale.label')"
    @update:model-value="setLocale"
  />
</template>
