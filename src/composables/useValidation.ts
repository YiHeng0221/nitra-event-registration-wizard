import { computed, ref, type ComputedRef } from 'vue'
import { registrationSchema } from 'src/schemas/registration'
import { useRegistration } from 'src/composables/useRegistration'
import { useConflicts } from 'src/composables/useConflicts'

// Shared across the app so step components can show field-level hints after submit.
const lastResult = ref<ValidationResult | null>(null)

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
  /** Field name → error messages from the last submit (reactive). */
  fieldErrors: ComputedRef<Record<string, string[]>>
  /** First error message for a field, or undefined. */
  errorFor: (field: string) => string | undefined
  /** Flat list of errors (with owning step) for the review summary banner. */
  errorList: ComputedRef<ErrorListItem[]>
}

/** Unified, submit-time validation aggregating zod and time conflicts. */
export function useValidation(): UseValidation {
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
        // Use the leaf path segment as the field key (e.g. attendee.fullName -> fullName).
        const field = issue.path[issue.path.length - 1]
        addError(String(field ?? 'form'), issue.message)
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
    const result2: ValidationResult = {
      valid: Object.keys(errors).length === 0,
      errors,
      stepHasError,
      jumpTo: erroredSteps.length > 0 ? Math.min(...erroredSteps) : null,
    }
    lastResult.value = result2
    return result2
  }

  const fieldErrors = computed(() => lastResult.value?.errors ?? {})
  function errorFor(field: string): string | undefined {
    return fieldErrors.value[field]?.[0]
  }

  const errorList = computed<ErrorListItem[]>(() => {
    const items: ErrorListItem[] = []
    for (const [field, messages] of Object.entries(fieldErrors.value)) {
      for (const message of messages) items.push({ step: FIELD_STEP[field] ?? 4, message })
    }
    return items.sort((a, b) => a.step - b.step)
  })

  return { validateAll, fieldErrors, errorFor, errorList }
}
