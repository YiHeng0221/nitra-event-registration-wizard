import { computed, type ComputedRef } from 'vue'
import { useRegistration } from 'src/composables/useRegistration'
import { useCatalog } from 'src/composables/useCatalog'
import { isOverlapping } from 'src/utils/overlap'
import type { Session } from 'src/types/session'

export interface UseConflicts {
  /** Pairs of selected session ids that overlap (surfaced only at submit). */
  sessionConflicts: ComputedRef<Array<[string, string]>>
  /** Workshops overlapping any selected session (shown unavailable in Step 3). */
  unavailableWorkshopIds: ComputedRef<Set<string>>
  /** Sessions at capacity (shown FULL/disabled in Step 2). Static — capacity never changes. */
  fullSessionIds: Set<string>
}

/** An id'd time range with its endpoints parsed to `Date` for comparison. */
interface TimeRange {
  id: string
  start: Date
  end: Date
}

/** Parse a session/workshop's ISO endpoints into a comparable {@link TimeRange}. */
function toRange(item: { id: string; date: string; endDate: string }): TimeRange {
  return { id: item.id, start: new Date(item.date), end: new Date(item.endDate) }
}

/** Reactive time-conflict and availability derivations. */
export function useConflicts(): UseConflicts {
  const { state } = useRegistration()
  const { sessions, sessionById, workshops } = useCatalog()

  // Workshops are static — parse their ranges once, not per comparison.
  const workshopRanges = workshops.map(toRange)

  const selectedSessions = computed<Session[]>(() =>
    state.selectedSessionIds
      .map((id) => sessionById.get(id))
      .filter((session): session is Session => session !== undefined),
  )

  // Parse the selected sessions' ranges once per change, reused by both derivations below.
  const selectedRanges = computed<TimeRange[]>(() => selectedSessions.value.map(toRange))

  const sessionConflicts = computed<Array<[string, string]>>(() => {
    const ranges = selectedRanges.value
    // Each session pairs only with the ones after it — slice(i + 1) avoids
    // duplicate/self pairs, preserving the original (i, j>i) iteration order.
    return ranges.flatMap((a, i) =>
      ranges
        .slice(i + 1)
        .filter((b) => isOverlapping(a.start, a.end, b.start, b.end))
        .map((b): [string, string] => [a.id, b.id]),
    )
  })

  const unavailableWorkshopIds = computed<Set<string>>(() => {
    const ranges = selectedRanges.value
    const overlapping = workshopRanges.filter((workshop) =>
      ranges.some((session) => isOverlapping(workshop.start, workshop.end, session.start, session.end)),
    )
    return new Set(overlapping.map((workshop) => workshop.id))
  })

  // Capacity is static mock data, so this never changes — compute it once as a
  // plain Set rather than a (never-recomputing) computed.
  const fullSessionIds = new Set(
    sessions
      .filter((session) => session.registered >= session.capacity)
      .map((session) => session.id),
  )

  return { sessionConflicts, unavailableWorkshopIds, fullSessionIds }
}
