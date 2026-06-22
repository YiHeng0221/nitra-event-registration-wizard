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
    // Each session pairs only with the ones after it — slice(i + 1) avoids
    // duplicate/self pairs, preserving the original (i, j>i) iteration order.
    return picked.flatMap((a, i) =>
      picked
        .slice(i + 1)
        .filter((b) =>
          isOverlapping(new Date(a.date), new Date(a.endDate), new Date(b.date), new Date(b.endDate)),
        )
        .map((b): [string, string] => [a.id, b.id]),
    )
  })

  const unavailableWorkshopIds = computed<Set<string>>(() => {
    const picked = selectedSessions.value
    const overlapping = workshops.filter((workshop) => {
      const workshopStart = new Date(workshop.date)
      const workshopEnd = new Date(workshop.endDate)
      return picked.some((session) =>
        isOverlapping(workshopStart, workshopEnd, new Date(session.date), new Date(session.endDate)),
      )
    })
    return new Set(overlapping.map((workshop) => workshop.id))
  })

  const fullSessionIds = computed<Set<string>>(
    () =>
      new Set(
        sessions
          .filter((session) => session.registered >= session.capacity)
          .map((session) => session.id),
      ),
  )

  return { sessionConflicts, unavailableWorkshopIds, fullSessionIds }
}
