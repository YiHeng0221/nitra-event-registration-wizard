import { boot } from 'quasar/wrappers'
import { createI18n } from 'vue-i18n'
import {
  messages,
  SUPPORTED_LOCALES,
  LOCALE_STORAGE_KEY,
  type AppLocale,
} from 'src/i18n'

/** Restore the saved locale, falling back to English. */
function initialLocale(): AppLocale {
  try {
    const saved = localStorage.getItem(LOCALE_STORAGE_KEY) as AppLocale | null
    if (saved && SUPPORTED_LOCALES.includes(saved)) return saved
  } catch {
    // Storage unavailable — use the default.
  }
  return 'en'
}

export const i18n = createI18n({
  legacy: false, // Composition API (`useI18n()` in <script setup>).
  locale: initialLocale(),
  fallbackLocale: 'en',
  messages,
})

export default boot(({ app }) => {
  app.use(i18n)
})
