// Intl formatters are cached per (locale + kind) — constructing them is costly.
const cache = new Map<string, Intl.DateTimeFormat>()

function formatter(locale: string, kind: 'time' | 'day' | 'dateTime'): Intl.DateTimeFormat {
  const key = `${locale}:${kind}`
  let fmt = cache.get(key)
  if (!fmt) {
    const opts: Intl.DateTimeFormatOptions =
      kind === 'time'
        ? { hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }
        : kind === 'day'
          ? { month: 'short', day: 'numeric', timeZone: 'UTC' }
          : { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit', timeZone: 'UTC' }
    fmt = new Intl.DateTimeFormat(locale, opts)
    cache.set(key, fmt)
  }
  return fmt
}

/** Format an ISO timestamp as e.g. `Nov 15, 9:00 AM` (locale-aware). */
export function formatDateTime(iso: string, locale = 'en-US'): string {
  return formatter(locale, 'dateTime').format(new Date(iso))
}

/** Format an ISO time range as e.g. `9:00 AM – 10:00 AM` (locale-aware). */
export function formatTimeRange(startISO: string, endISO: string, locale = 'en-US'): string {
  const time = formatter(locale, 'time')
  return `${time.format(new Date(startISO))} – ${time.format(new Date(endISO))}`
}

/** Format an ISO date (or `YYYY-MM-DD`) as e.g. `Nov 15` (locale-aware). */
export function formatDayLabel(isoDate: string, locale = 'en-US'): string {
  return formatter(locale, 'day').format(new Date(`${isoDate.slice(0, 10)}T00:00:00Z`))
}
