import { reactive, watch } from 'vue'
import { z } from 'zod'
import type { RegistrationState } from 'src/types/registration'

/** localStorage key the registration is persisted under. */
export const REGISTRATION_STORAGE_KEY = 'nitra-registration'

/**
 * Lenient structural schema for hydrating persisted state. Each field repairs
 * to a fresh default via `.catch()`, so a single corrupt value can't desync the
 * shape or wipe an otherwise valid save. Business rules (required fields, time
 * conflicts) are intentionally NOT enforced here — those run once at submit.
 */
const persistedStateSchema: z.ZodType<RegistrationState> = z.object({
  currentStep: z.number().int().min(1).max(4).catch(1),
  attendee: z
    .object({
      fullName: z.string().catch(''),
      email: z.string().catch(''),
      phone: z.string().catch(''),
      company: z.string().catch(''),
      jobTitle: z.string().catch(''),
      shippingAddress: z.string().catch(''),
    })
    .catch({ fullName: '', email: '', phone: '', company: '', jobTitle: '', shippingAddress: '' }),
  ticketId: z.enum(['general', 'vip', 'student']).nullable().catch(null),
  selectedSessionIds: z.array(z.string()).catch([]),
  selectedWorkshopIds: z.array(z.string()).catch([]),
  selectedMealIds: z.array(z.string()).catch([]),
  merchandise: z
    .record(
      z.string(),
      z.object({
        size: z.string().nullable().catch(null),
        quantity: z.number().int().min(1).catch(1),
      }),
    )
    .catch({}),
})

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
  try {
    const raw = localStorage.getItem(REGISTRATION_STORAGE_KEY)
    if (!raw) return createInitialState()
    // Structurally validate + repair the persisted blob (never throws).
    return persistedStateSchema.parse(JSON.parse(raw))
  } catch {
    // Corrupt or unavailable storage — start fresh.
    return createInitialState()
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
