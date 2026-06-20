/** Conference track a session belongs to (drives the track badge). */
export type SessionTrack = 'main' | 'frontend' | 'backend' | 'devops'

/**
 * A single conference session. Shape mirrors `src/mocks/sessions.js` — the
 * mock is the source of truth, so this type must stay aligned with it.
 */
export interface Session {
  id: string
  title: string
  speaker: string
  speakerTitle: string
  track: SessionTrack
  /** ISO 8601 start timestamp. */
  date: string
  /** ISO 8601 end timestamp. */
  endDate: string
  capacity: number
  registered: number
  description: string
}
