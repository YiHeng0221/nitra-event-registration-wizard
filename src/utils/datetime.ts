const timeFormatter = new Intl.DateTimeFormat('en-US', {
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'UTC',
})

const dayFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  timeZone: 'UTC',
})

const dateTimeFormatter = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  timeZone: 'UTC',
})

/** Format an ISO timestamp as e.g. `Nov 15, 9:00 AM`. */
export function formatDateTime(iso: string): string {
  return dateTimeFormatter.format(new Date(iso))
}

/** Format an ISO time range as e.g. `9:00 AM – 10:00 AM`. */
export function formatTimeRange(startISO: string, endISO: string): string {
  return `${timeFormatter.format(new Date(startISO))} – ${timeFormatter.format(new Date(endISO))}`
}

/** Format an ISO date (or `YYYY-MM-DD`) as e.g. `Nov 15`. */
export function formatDayLabel(isoDate: string): string {
  return dayFormatter.format(new Date(`${isoDate.slice(0, 10)}T00:00:00Z`))
}
