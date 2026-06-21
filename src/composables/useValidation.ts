import { computed, ref, type ComputedRef } from 'vue'
import { useI18n } from 'vue-i18n'
import { registrationSchema } from 'src/schemas/registration'
import { useRegistration } from 'src/composables/useRegistration'
import { useConflicts } from 'src/composables/useConflicts'

// Errors stay hidden until the first submit; after that they re-evaluate live so
// hints clear the moment the user fixes the offending field/selection (ADR-0003).
const hasAttemptedSubmit = ref(false)

/** Which wizard step each top-level field belongs to (for error navigation). */
const FIELD_STEP: Record<string, number> = {
  fullName: 1,
  email: 1,
  phone: 1,
  company: 1,
  jobTitle: 1,
  shippingAddress: 1,
  ticketId: 1,
  selectedSessionIds: 2,
  selectedWorkshopIds: 3,
  selectedMealIds: 3,
  merchandise: 3,
}

export interface ValidationResult {
  valid: boolean
  /** Field name → error messages. */
  errors: Record<string, string[]>
  /** Step index → whether it carries any error (drives stepper badges). */
  stepHasError: Record<number, boolean>
  /** Earliest step with an error to jump to, or null when valid. */
  jumpTo: number | null
}

export interface ErrorListItem {
  step: number
  message: string
}

export interface UseValidation {
  validateAll: () => ValidationResult
  /** Forget the submit attempt so a fresh registration shows no errors. */
  resetValidation: () => void
  /** Field name → error messages, live once submitted (reactive). */
  fieldErrors: ComputedRef<Record<string, string[]>>
  /** First error message for a field, or undefined. */
  errorFor: (field: string) => string | undefined
  /** Flat list of errors (with owning step) for the review summary banner. */
  errorList: ComputedRef<ErrorListItem[]>
  /** Step index → whether it carries any error (drives stepper badges), live. */
  stepHasError: ComputedRef<Record<number, boolean>>
  /** Selected session ids that overlap — surfaced after submit, cleared live. */
  sessionConflictIds: ComputedRef<Set<string>>
}

/** Unified, submit-time validation aggregating zod and time conflicts. */
export function useValidation(): UseValidation {
  const { state } = useRegistration()
  const { sessionConflicts } = useConflicts()
  const { t } = useI18n()

  /** Pure derivation of the full error state from the current store + conflicts. */
  function compute(): ValidationResult {
    const errors: Record<string, string[]> = {}
    const addError = (field: string, message: string): void => {
      ;(errors[field] ??= []).push(message)
    }

    const result = registrationSchema.safeParse(state)
    if (!result.success) {
      for (const issue of result.error.issues) {
        // Use the leaf path segment as the field key (e.g. attendee.fullName -> fullName).
        const field = issue.path[issue.path.length - 1]
        addError(String(field ?? 'form'), issue.message)
      }
    }

    // Session↔session conflicts are deferred to submit (not a live block).
    // Store the i18n key; it's translated at the display exits below.
    if (sessionConflicts.value.length > 0) {
      addError('selectedSessionIds', 'validation.sessionConflicts')
    }

    const stepHasError: Record<number, boolean> = {}
    for (const field of Object.keys(errors)) {
      stepHasError[FIELD_STEP[field] ?? 4] = true
    }

    const erroredSteps = Object.keys(stepHasError).map(Number)
    return {
      valid: Object.keys(errors).length === 0,
      errors,
      stepHasError,
      jumpTo: erroredSteps.length > 0 ? Math.min(...erroredSteps) : null,
    }
  }

  /**
   * Validate the entire registration at once. Called on submit — it never gates
   * forward navigation (ADR-0003). After the first call, errors re-evaluate live.
   */
  function validateAll(): ValidationResult {
    hasAttemptedSubmit.value = true
    return compute()
  }

  function resetValidation(): void {
    hasAttemptedSubmit.value = false
  }

  // Live error state: empty until the user tries to submit, then recomputed on
  // every store change so hints clear as soon as the problem is resolved.
  const liveResult = computed<ValidationResult | null>(() =>
    hasAttemptedSubmit.value ? compute() : null,
  )

  // `errors` holds i18n keys; translate to the active locale at the exits.
  const fieldErrors = computed(() => liveResult.value?.errors ?? {})
  function errorFor(field: string): string | undefined {
    const key = fieldErrors.value[field]?.[0]
    return key === undefined ? undefined : t(key)
  }

  const errorList = computed<ErrorListItem[]>(() => {
    const items: ErrorListItem[] = []
    for (const [field, messages] of Object.entries(fieldErrors.value)) {
      for (const message of messages) items.push({ step: FIELD_STEP[field] ?? 4, message: t(message) })
    }
    return items.sort((a, b) => a.step - b.step)
  })

  const stepHasError = computed(() => liveResult.value?.stepHasError ?? {})

  const sessionConflictIds = computed<Set<string>>(() => {
    const ids = new Set<string>()
    if (!hasAttemptedSubmit.value) return ids
    for (const [a, b] of sessionConflicts.value) {
      ids.add(a)
      ids.add(b)
    }
    return ids
  })

  return {
    validateAll,
    resetValidation,
    fieldErrors,
    errorFor,
    errorList,
    stepHasError,
    sessionConflictIds,
  }
}
