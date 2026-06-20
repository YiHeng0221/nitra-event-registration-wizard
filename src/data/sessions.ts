import { sessions as rawSessions } from 'src/mocks/sessions.js'
import type { Session } from 'src/types/session'

/** Load all sessions from the mock, typed to the domain shape (mock is source of truth). */
export function loadSessions(): Session[] {
  return rawSessions as Session[]
}

/**
 * Group sessions by calendar day (`YYYY-MM-DD`), preserving input order within
 * each day. Keys are the ISO date portion, e.g. `2028-11-15` / `2028-11-16`.
 */
export function groupSessionsByDate(sessions: Session[]): Record<string, Session[]> {
  const groups: Record<string, Session[]> = {}
  for (const session of sessions) {
    const day = session.date.slice(0, 10)
    ;(groups[day] ??= []).push(session)
  }
  return groups
}
