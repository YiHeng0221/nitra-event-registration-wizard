import { computed, type ComputedRef } from 'vue'
import { useRegistration } from 'src/composables/useRegistration'
import { loadSessions } from 'src/data/sessions'
import { loadAddons } from 'src/data/addons'
import { isOverlapping } from 'src/utils/overlap'
import type { Session } from 'src/types/session'
import type { WorkshopAddon } from 'src/types/addon'

export interface UseConflicts {
  /** Pairs of selected session ids that overlap (surfaced only at submit). */
  sessionConflicts: ComputedRef<Array<[string, string]>>
  /** Workshops overlapping any selected session (shown unavailable in Step 3). */
  unavailableWorkshopIds: ComputedRef<Set<string>>
  /** Sessions at capacity (shown FULL/disabled in Step 2). */
  fullSessionIds: ComputedRef<Set<string>>
}

/** Reactive time-conflict and availability derivations. */
export function useConflicts(): UseConflicts {
  const { state } = useRegistration()
  const sessions = loadSessions()
  const sessionById = new Map(sessions.map((session) => [session.id, session]))
  const workshops = loadAddons().filter(
    (addon): addon is WorkshopAddon => addon.category === 'workshop',
  )

  const selectedSessions = computed<Session[]>(() =>
    state.selectedSessionIds
      .map((id) => sessionById.get(id))
      .filter((session): session is Session => session !== undefined),
  )

  const sessionConflicts = computed<Array<[string, string]>>(() => {
    const picked = selectedSessions.value
    const pairs: Array<[string, string]> = []
    for (let i = 0; i < picked.length; i += 1) {
      const a = picked[i]
      if (!a) continue
      for (let j = i + 1; j < picked.length; j += 1) {
        const b = picked[j]
        if (!b) continue
        if (isOverlapping(new Date(a.date), new Date(a.endDate), new Date(b.date), new Date(b.endDate))) {
          pairs.push([a.id, b.id])
        }
      }
    }
    return pairs
  })

  const unavailableWorkshopIds = computed<Set<string>>(() => {
    const picked = selectedSessions.value
    const ids = new Set<string>()
    for (const workshop of workshops) {
      const workshopStart = new Date(workshop.date)
      const workshopEnd = new Date(workshop.endDate)
      const overlapsSelected = picked.some((session) =>
        isOverlapping(workshopStart, workshopEnd, new Date(session.date), new Date(session.endDate)),
      )
      if (overlapsSelected) ids.add(workshop.id)
    }
    return ids
  })

  const fullSessionIds = computed<Set<string>>(() => {
    const ids = new Set<string>()
    for (const session of sessions) {
      if (session.registered >= session.capacity) ids.add(session.id)
    }
    return ids
  })

  return { sessionConflicts, unavailableWorkshopIds, fullSessionIds }
}
