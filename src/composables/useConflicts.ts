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

// --- Static (derived from the immutable catalog, computed once at module load) ---
const { sessions, sessionById, workshops } = useCatalog()

/** Sessions at capacity. Capacity is static mock data, so this never changes. */
const fullSessionIds = new Set(
  sessions
    .filter((session) => session.registered >= session.capacity)
    .map((session) => session.id),
)
/** Workshop time ranges, parsed once (workshops are static). */
const workshopRanges = workshops.map(toRange)

/**
 * Time-conflict and availability derivations. The static parts (full sessions,
 * workshop ranges) live at module scope above; below is the reactive base and
 * the live (Step 3) and submit-only (Step 4) derivations built on it.
 */
export function useConflicts(): UseConflicts {
  const { state } = useRegistration()

  // --- Reactive base (recomputes with the selection) -----------------------
  const selectedSessions = computed<Session[]>(() =>
    state.selectedSessionIds
      .map((id) => sessionById.get(id))
      .filter((session): session is Session => session !== undefined),
  )
  // Parsed once per change, reused by both derivations below.
  const selectedRanges = computed<TimeRange[]>(() => selectedSessions.value.map(toRange))

  // --- Live availability (Step 3) ------------------------------------------
  const unavailableWorkshopIds = computed<Set<string>>(() => {
    const ranges = selectedRanges.value
    const overlapping = workshopRanges.filter((workshop) =>
      ranges.some((session) => isOverlapping(workshop.start, workshop.end, session.start, session.end)),
    )
    return new Set(overlapping.map((workshop) => workshop.id))
  })

  // --- Submit-only (surfaced at Step 4) ------------------------------------
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

  return { sessionConflicts, unavailableWorkshopIds, fullSessionIds }
}
