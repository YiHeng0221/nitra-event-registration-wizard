import { reactive, watch } from 'vue'
import type { RegistrationState } from 'src/types/registration'

/** localStorage key the registration is persisted under. */
export const REGISTRATION_STORAGE_KEY = 'nitra-registration'

/** A fresh, empty registration. Factory so `reset()` can deep-replace cleanly. */
function createInitialState(): RegistrationState {
  return {
    currentStep: 1,
    attendee: {
      fullName: '',
      email: '',
      phone: '',
      company: '',
      jobTitle: '',
      shippingAddress: '',
    },
    ticketId: null,
    selectedSessionIds: [],
    selectedWorkshopIds: [],
    selectedMealIds: [],
    merchandise: {},
  }
}

/** Hydrate persisted state from localStorage, falling back to a fresh state. */
function loadInitialState(): RegistrationState {
  const fresh = createInitialState()
  try {
    const raw = localStorage.getItem(REGISTRATION_STORAGE_KEY)
    if (!raw) return fresh
    const parsed = JSON.parse(raw) as Partial<RegistrationState>
    return {
      ...fresh,
      ...parsed,
      attendee: { ...fresh.attendee, ...(parsed.attendee ?? {}) },
    }
  } catch {
    // Corrupt or unavailable storage — start fresh.
    return fresh
  }
}

// Module-level reactive single source of truth, shared across all steps
// (ADR-0001: a composable, not Pinia).
const state = reactive<RegistrationState>(loadInitialState())

// Persist on any change. Persistence is a side effect, so `watch` (not computed)
// is the right tool here.
watch(
  state,
  (value) => {
    try {
      localStorage.setItem(REGISTRATION_STORAGE_KEY, JSON.stringify(value))
    } catch {
      // Storage full or unavailable — non-fatal, skip persisting.
    }
  },
  { deep: true },
)

/** Reset the registration to a fresh state and clear persistence. */
function reset(): void {
  Object.assign(state, createInitialState())
  try {
    localStorage.removeItem(REGISTRATION_STORAGE_KEY)
  } catch {
    // Ignore storage errors.
  }
}

/** Access the single source of truth for the registration. */
export function useRegistration(): { state: RegistrationState; reset: () => void } {
  return { state, reset }
}
