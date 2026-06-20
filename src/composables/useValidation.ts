import { registrationSchema } from 'src/schemas/registration'
import { useRegistration } from 'src/composables/useRegistration'
import { useConflicts } from 'src/composables/useConflicts'

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

/** Unified, submit-time validation aggregating zod and time conflicts. */
export function useValidation(): { validateAll: () => ValidationResult } {
  const { state } = useRegistration()
  const { sessionConflicts } = useConflicts()

  /**
   * Validate the entire registration at once. Called only on submit — it never
   * gates forward navigation (ADR-0003).
   */
  function validateAll(): ValidationResult {
    const errors: Record<string, string[]> = {}
    const addError = (field: string, message: string): void => {
      ;(errors[field] ??= []).push(message)
    }

    const result = registrationSchema.safeParse(state)
    if (!result.success) {
      for (const issue of result.error.issues) {
        addError(String(issue.path[0] ?? 'form'), issue.message)
      }
    }

    // Session↔session conflicts are deferred to submit (not a live block).
    const conflicts = sessionConflicts.value
    if (conflicts.length > 0) {
      addError(
        'selectedSessionIds',
        `You have ${conflicts.length} overlapping session selection(s) to resolve`,
      )
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

  return { validateAll }
}
