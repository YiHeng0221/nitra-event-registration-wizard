import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { formatDateTime, formatTimeRange, formatDayLabel } from 'src/utils/datetime'

/** App locale → Intl/BCP-47 locale for date formatting. */
const INTL_LOCALE: Record<string, string> = { en: 'en-US', 'zh-TW': 'zh-TW' }

/** Mock perk strings → i18n keys (perks are shared English strings in the mock). */
const PERK_KEY: Record<string, string> = {
  'All sessions': 'allSessions',
  'Keynote access': 'keynoteAccess',
  'Lunch included': 'lunchIncluded',
  'VIP lounge': 'vipLounge',
  'Speaker meet & greet': 'speakerMeetGreet',
  '10% off workshops': 'workshopDiscount',
}

/**
 * Localized formatting + content resolution. Mock data (provided, not editable)
 * is mirrored into the i18n `content` catalogs and resolved here by id, and
 * dates are formatted in the active locale. Everything is reactive to the locale.
 */
export function useLocale() {
  const { t, locale } = useI18n()
  const intl = computed(() => INTL_LOCALE[locale.value] ?? 'en-US')

  return {
    // Dates — re-evaluate when the locale changes.
    dateTime: (iso: string) => formatDateTime(iso, intl.value),
    timeRange: (start: string, end: string) => formatTimeRange(start, end, intl.value),
    dayLabel: (isoDate: string) => formatDayLabel(isoDate, intl.value),
    // Mock-data content, by entity id.
    ticketName: (id: string) => t(`content.tickets.${id}.name`),
    ticketDesc: (id: string) => t(`content.tickets.${id}.description`),
    perkLabel: (perk: string) => (PERK_KEY[perk] ? t(`content.perks.${PERK_KEY[perk]}`) : perk),
    trackLabel: (track: string) => t(`content.tracks.${track}`),
    sessionTitle: (id: string) => t(`content.sessions.${id}.title`),
    sessionSpeakerTitle: (id: string) => t(`content.sessions.${id}.speakerTitle`),
    addonName: (id: string) => t(`content.addons.${id}.name`),
    addonDesc: (id: string) => t(`content.addons.${id}.description`),
  }
}
